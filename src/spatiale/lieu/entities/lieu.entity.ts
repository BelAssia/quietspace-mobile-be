
import { Entity, PrimaryGeneratedColumn , Column, ManyToOne, OneToMany, JoinColumn ,Index, UpdateDateColumn, CreateDateColumn} from 'typeorm';
import { Avis } from 'src/evaluation/avis/entities/avis.entity';
import { Favoris } from 'src/favoris/entities/favoris.entity';
import { TypeLieu } from 'src/spatiale/type_lieu/entities/type_lieu.entity';
import { EnvBruitLieu } from 'src/spatiale/env_bruit_lieu/entities/env_bruit_lieu.entity';
import { LieuCalmePeriode } from 'src/spatiale/lieu_calme_periode/entities/lieu_calme_periode.entity';

@Entity('lieu')
export class Lieu {
  @PrimaryGeneratedColumn ({ name: 'id_lieu' })
  idLieu: number;

  @Column({ name: 'id_type_lieu' })
  idTypeLieu: number;

  @Column({ type: 'char', length: 100, name: 'nom_lieu', nullable: true })
  nomLieu: string;

  @Column({ type: 'text', name: 'description_lieu', nullable: true })
  descriptionLieu: string;

    //GPS: SRID 4326,coordinates  [lng,lat]
    @Index({spatial:true})
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  geom:{
  type: 'Point';
  coordinates: [number, number];
};

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'score_calme', nullable: true })
  scoreCalme: number;

  @Column({ type: 'varchar', length: 30, name: 'niveau_calme', nullable: true })
  niveauCalme: string;

  @Column({ type: 'text', name: 'adresse_lieu', nullable: true })
  adresseLieu: string;

  @Column({ type: 'varchar', length: 256, name: 'image_lieu', nullable: true })
  imageLieu: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'NOW()',
  })
  createdAt: Date;

 @UpdateDateColumn({ 
  type: 'timestamp', 
  name: 'updated_at',
  default: () => 'NOW()'
})
updatedAt: Date;

  @ManyToOne(() => TypeLieu, (typeLieu) => typeLieu.lieux, {
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_type_lieu' })
  typeLieu: TypeLieu;

  @OneToMany(() => Avis, (avis) => avis.lieu)
  avis: Avis[];

  @OneToMany(() => Favoris, (favoris) => favoris.lieu)
  favoris: Favoris[];

  @OneToMany(() => EnvBruitLieu, (envBruit) => envBruit.lieu)
  envBruitLieux: EnvBruitLieu[];

  @OneToMany(() => LieuCalmePeriode, (lieuCalme) => lieuCalme.lieu)
  lieuCalmePeriodes: LieuCalmePeriode[];
}