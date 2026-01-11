
import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn,Index } from 'typeorm';
import { EnvBruitLieu } from 'src/spatiale/env_bruit_lieu/entities/env_bruit_lieu.entity';
import { TypeElemBruit } from 'src/spatiale/type_elem_bruit/entities/type_elem_bruit.entity';

@Entity('element_bruit')
export class ElementBruit {
  @PrimaryColumn({ name: 'id_elem_bruit' })
  idElemBruit: number;

  @Column({ name: 'id_type_elem_bruit' })
  idTypeElemBruit: number;

  @Column({ type: 'char', length: 50, name: 'nom_elem_bruit', nullable: true })
  nomElemBruit: string;

  //GPS: SRID 4326,coordinates  [lng,lat]
  @Index({spatial:true})
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  geom: {
  type: 'Point';
  coordinates: [number, number];
};

  @ManyToOne(() => TypeElemBruit, (type) => type.elementsBruit, {
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_type_elem_bruit' })
  typeElemBruit: TypeElemBruit;

  @OneToMany(() => EnvBruitLieu, (envBruit) => envBruit.elementBruit)
  envBruitLieux: EnvBruitLieu[];
}
