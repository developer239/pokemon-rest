import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Relation,
  ManyToMany,
} from 'typeorm'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { BaseEntity } from 'src/utils/base.entity'

export enum AttackCategory {
  FAST = 'fast',
  SPECIAL = 'special',
}

@Entity()
export class Attack extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  type: string

  @Column({
    type: 'enum',
    enum: AttackCategory,
  })
  category: AttackCategory

  @Column()
  damage: number

  @ManyToMany(() => Pokemon, (pokemon) => pokemon.attacks)
  pokemons: Relation<Pokemon>[]
}
