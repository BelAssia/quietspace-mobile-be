import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class FileService {
  // Chemin pour les images des lieux
  private readonly imagesPath = path.join(process.cwd(), 'public', 'assets', 'images', 'lieux');
  private readonly defaultImageName = 'placeholder_lieuimg.jpg';
  private readonly defaultImagePath = path.join(process.cwd(), 'public', 'assets', 'images', this.defaultImageName);

  constructor() {
    // Créer le dossier des images de lieux s'il n'existe pas
    this.ensureImagesDirectoryExists();
     
  }

  private ensureImagesDirectoryExists(): void {
    if (!fs.existsSync(this.imagesPath)) {
      fs.mkdirSync(this.imagesPath, { recursive: true });
    }
  }

  getDefaultImageName(): string {
    return this.defaultImageName;
  }

  getDefaultImageUrl(): string {
    return `/assets/images/${this.defaultImageName}`;
  }

  async saveImage(file: MulterFile): Promise<string> {
    // Validation de l'image
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Seules les images sont autorisées');
    }

    // Taille max : 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('L\'image ne doit pas dépasser 5MB');
    }

    // Extensions autorisées
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/jpg'
    ];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Type d\'image non supporté. Utilisez JPEG, PNG, GIF ou WebP');
    }

    // Générer un nom unique
    const fileExtension = this.getFileExtension(file.originalname, file.mimetype);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.imagesPath, fileName);

    try {
      // Sauvegarder le fichier
      fs.writeFileSync(filePath, file.buffer);
     
      return fileName;
    } catch (error) {
      throw new BadRequestException(`Erreur lors de l'enregistrement: ${error.message}`);
    }
  }

  private getFileExtension(originalname: string, mimetype: string): string {
    // Extraire l'extension
    let extension = path.extname(originalname).toLowerCase();
    
    // Si pas d'extension, déterminer depuis le mimetype
    if (!extension) {
      const mimeToExt: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
      };
      extension = mimeToExt[mimetype] || '.jpg';
    }
    
    return extension;
  }

  async deleteImage(imageName: string): Promise<void> {
    // Ne pas supprimer l'image par défaut
    if (!imageName || imageName === this.defaultImageName) {
      return;
    }

    try {
      const filePath = path.join(this.imagesPath, imageName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'image ${imageName}:`, error);
    }
  }

  getImagePath(imageName: string): string {
    if (!imageName || imageName === this.defaultImageName) {
      return this.defaultImagePath;
    }
    return path.join(this.imagesPath, imageName);
  }

  getImageUrl(imageName: string): string {
    if (!imageName || imageName === this.defaultImageName) {
      return this.getDefaultImageUrl();
    }
    return `/assets/images/lieux/${imageName}`;
  }
}