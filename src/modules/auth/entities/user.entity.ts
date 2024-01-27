import * as bcrypt from 'bcrypt'
import { Exclude } from 'class-transformer'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  JoinTable,
  ManyToMany,
  Relation,
} from 'typeorm'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { BaseEntity } from 'src/utils/base.entity'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, nullable: true })
  email: string

  @Exclude()
  @Column({ nullable: true })
  password: string

  @Exclude()
  @ManyToMany(() => Pokemon, (pokemon) => pokemon.favoritedBy, {
    cascade: true,
  })
  @JoinTable()
  favoritePokemons: Relation<Pokemon>[]

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt()
      this.password = await bcrypt.hash(this.password, salt)
    }
  }
}
