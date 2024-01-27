import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { BaseEntity } from 'src/utils/base.entity'

@Entity()
export class EvolutionRequirement extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  amount: number

  @Column()
  name: string

  @OneToOne(() => Pokemon, (pokemon) => pokemon.evolutionRequirements)
  @JoinColumn()
  pokemon: Relation<Pokemon>
}
