import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Attack } from 'src/modules/pokemon/entities/attack.entity'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { PokemonService } from 'src/modules/pokemon/services/pokemon.service'

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon, Attack, EvolutionRequirement])],
  providers: [
    PokemonService,
  ],
  exports: [PokemonService],
})
export class PokemonModule {}
