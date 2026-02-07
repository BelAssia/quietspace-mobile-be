import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { LieuService } from 'src/spatiale/lieu/lieu.service';

interface LocationUpdate {
  latitude: number;
  longitude: number;
  speed: number; // en m/s
  accuracy?: number;
  timestamp: number;
}

@WebSocketGateway({
  cors: {
    origin: '*', 
  },
  namespace: '/location',
})
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(LocationGateway.name);
  
  // Stocker les informations de tracking par client
  private readonly clientTracking = new Map<
  string,
  {
    lastPosition: { latitude: number; longitude: number } | null;
    updateInterval: NodeJS.Timeout | null;
    trackingRadius: number;
  }
>();


  constructor(private readonly lieuService: LieuService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connecté: ${client.id}`);
    this.clientTracking.set(client.id, {
      lastPosition: null,
      updateInterval: null,
      trackingRadius: 200, // 200 mètres par défaut
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client déconnecté: ${client.id}`);
    
    // Nettoyer l'intervalle si existe
    const tracking = this.clientTracking.get(client.id);
    if (tracking?.updateInterval) {
      clearInterval(tracking.updateInterval);
    }
    
    this.clientTracking.delete(client.id);
  }

  /**
   * Déterminer l'intervalle de mise à jour selon la vitesse
   * @param speed vitesse en m/s
   * @returns intervalle en millisecondes
   */
  private getUpdateInterval(speed: number): number {
    // Convertir m/s en km/h
    const speedKmh = speed * 3.6;
    
    if (speedKmh < 1) {
      // Stationnaire
      return 5 * 60 * 1000; // 5 minutes
    } else if (speedKmh < 5) {
      // Marche lente
      return 3 * 60 * 1000; // 3 minutes
    } else if (speedKmh < 15) {
      // Marche rapide / vélo lent
      return 2 * 60 * 1000; // 2 minutes
    } else if (speedKmh < 50) {
      // Vélo / voiture en ville
      return 1 * 60 * 1000; // 1 minute
    } else {
      // Voiture rapide
      return 30 * 1000; // 30 secondes
    }
  }
  /**
   * Vérifier si la position a significativement changé
   */
 private hasPositionChanged(
  oldPos: { latitude: number; longitude: number } | null,
  newPos: { latitude: number; longitude: number },
  threshold: number = 10,
): boolean {
  if (!oldPos) return true;

  const distance = this.calculateDistance(
    oldPos.latitude,
    oldPos.longitude,
    newPos.latitude,
    newPos.longitude,
  );

  return distance > threshold;
}


  /**
   * Calculer la distance entre 2 points (formule Haversine)
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Recevoir la position du client
   */
  @SubscribeMessage('updateLocation')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: LocationUpdate,
  ) {
    try {
      const { latitude, longitude, speed, accuracy, timestamp } = data;
      
      this.logger.log(
        `Position reçue de ${client.id}: [${latitude}, ${longitude}] @ ${speed.toFixed(2)} m/s`,
      );

      const tracking = this.clientTracking.get(client.id);
      if (!tracking) return;

      // Vérifier si la position a changé significativement
      const currentPos = { latitude, longitude };
      const hasChanged = this.hasPositionChanged(tracking.lastPosition, currentPos);

      if (!hasChanged) {
        this.logger.log(`Position inchangée pour ${client.id}, skip`);
        return;
      }

      // Mettre à jour la dernière position
      tracking.lastPosition = currentPos;

      // Récupérer les lieux proches
      const lieux = await this.lieuService.findClosest(
        longitude,
        latitude,
        20, // Limite à 20 lieux
      );

      // Filtrer les lieux dans le rayon (200m)
      const lieuxDansRayon = lieux.filter(
        (lieu) => lieu.distance <= tracking.trackingRadius,
      );

      this.logger.log(
        `${lieuxDansRayon.length} lieux trouvés dans ${tracking.trackingRadius}m`,
      );

      // Envoyer les lieux au client
      client.emit('nearbyPlaces', {
        places: lieuxDansRayon,
        userLocation: { latitude, longitude },
        radius: tracking.trackingRadius,
        timestamp: Date.now(),
      });

      // Calculer le nouvel intervalle basé sur la vitesse
      const newInterval = this.getUpdateInterval(speed);
      
      client.emit('trackingConfig', {
        updateInterval: newInterval,
        speedKmh: (speed * 3.6).toFixed(1),
        // message: this.getSpeedMessage(speed),
      });

    } catch (error) {
      this.logger.error(`Erreur lors du traitement de la position: ${error.message}`);
      client.emit('error', {
        message: 'Erreur lors de la récupération des lieux',
        error: error.message,
      });
    }
  }

  /**
   * Message selon la vitesse
   */
  // private getSpeedMessage(speed: number): string {
  //   const speedKmh = speed * 3.6;
    
  //   if (speedKmh < 1) return 'Vous êtes stationnaire';
  //   if (speedKmh < 5) return 'Vous marchez lentement';
  //   if (speedKmh < 15) return 'Vous marchez rapidement';
  //   if (speedKmh < 50) return 'Vous êtes en véhicule (ville)';
  //   return 'Vous êtes en véhicule (route)';
  // }

  /**
   * Permettre au client de changer le rayon de tracking
   */
  @SubscribeMessage('setTrackingRadius')
  handleSetRadius(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { radius: number },
  ) {
    const tracking = this.clientTracking.get(client.id);
    if (tracking) {
      tracking.trackingRadius = data.radius;
      this.logger.log(`Rayon de tracking mis à jour: ${data.radius}m pour ${client.id}`);
      
      client.emit('trackingConfig', {
        radius: data.radius,
        message: `Rayon de détection: ${data.radius}m`,
      });
    }
  }

  /**
   * Démarrer le tracking
   */
  @SubscribeMessage('startTracking')
  handleStartTracking(@ConnectedSocket() client: Socket) {
    this.logger.log(` Tracking démarré pour ${client.id}`);
    client.emit('trackingStatus', { active: true, message: 'Tracking activé' });
  }

  /**
   * Arrêter le tracking
   */
  @SubscribeMessage('stopTracking')
  handleStopTracking(@ConnectedSocket() client: Socket) {
    const tracking = this.clientTracking.get(client.id);
    if (tracking?.updateInterval) {
      clearInterval(tracking.updateInterval);
      tracking.updateInterval = null;
    }
    
    this.logger.log(` Tracking arrêté pour ${client.id}`);
    client.emit('trackingStatus', { active: false, message: 'Tracking désactivé' });
  }
}
