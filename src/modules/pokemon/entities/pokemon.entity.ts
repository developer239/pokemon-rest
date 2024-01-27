import { Exclude } from 'class-transformer'
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { Attack } from 'src/modules/pokemon/entities/attack.entity'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { BaseEntity } from 'src/utils/base.entity'
import { RangeTransformer } from 'src/utils/transformers/range.transformer'

@Entity()
export class Pokemon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
  })
  number: number

  @Index()
  @Column()
  name: string

  @Column()
  classification: string

  @Column('simple-array')
  types: string[]

  @Column('simple-array')
  resistant: string[]

  @Column('simple-array')
  weaknesses: string[]

  @Column('numrange', {
    transformer: new RangeTransformer(),
  })
  weightRange: { minimum: number; maximum: number }

  @Column('numrange', {
    transformer: new RangeTransformer(),
  })
  heightRange: { minimum: number; maximum: number }

  @Column('float')
  fleeRate: number

  @Column()
  maxCP: number

  @Column()
  maxHP: number

  @Exclude()
  @ManyToMany(() => User, (user) => user.favoritePokemons)
  favoritedBy: Relation<User>[]

  @ManyToMany(() => Attack, (attack) => attack.pokemons, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  attacks: Relation<Attack>[]

  @OneToOne(
    () => EvolutionRequirement,
    (evolutionRequirement) => evolutionRequirement.pokemon,
    { cascade: true, eager: true }
  )
  evolutionRequirements: Relation<EvolutionRequirement>

  @ManyToMany(() => Pokemon, { cascade: true })
  @JoinTable()
  evolutions: Relation<Pokemon>[]

  // TODO: implement isFavorited virtual field (getter)
}
