import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PokemonSeedService } from 'src/modules/database/seeds/pokemon/pokemon-seed.service'
import { Attack } from 'src/modules/pokemon/entities/attack.entity'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon, Attack, EvolutionRequirement])],
  providers: [PokemonSeedService],
  exports: [PokemonSeedService],
})
export class PokemonSeedModule {}
