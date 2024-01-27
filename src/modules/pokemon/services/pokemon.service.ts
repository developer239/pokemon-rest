import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { PokemonsQueryInput } from 'src/modules/pokemon/pokemon.types'

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(EvolutionRequirement)
    private readonly evolutionRequirementRepository: Repository<EvolutionRequirement>,
  ) {}

  async addFavorite(id: number, user?: User): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
    })

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found')
    }

    await this.pokemonRepository
      .createQueryBuilder('pokemon')
      .relation('favoritedBy')
      .of(pokemon)
      .add(user)

    const result = await this.pokemonRepository.save(pokemon)

    return result
  }

  async removeFavorite(id: number, user?: User): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
    })

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found')
    }

    await this.pokemonRepository
      .createQueryBuilder('pokemon')
      .relation('favoritedBy')
      .of(pokemon)
      .remove(user)

    return pokemon
  }

  async findByName(name: string): Promise<Pokemon> {
    const result = await this.pokemonRepository.findOne({ where: { name } })

    if (!result) {
      throw new NotFoundException('Pokemon not found')
    }

    return result
  }

  async findById(id: number): Promise<Pokemon> {
    const result = await this.pokemonRepository.findOne({ where: { id } })
    if (!result) {
      throw new NotFoundException('Pokemon not found')
    }

    return result
  }

  async findAllTypes(): Promise<string[]> {
    const result = await this.pokemonRepository.query(`
      SELECT DISTINCT unnest(string_to_array(types, ',')) AS type
      FROM pokemon;
    `)

    return result.map((row) => row.type)
  }

  async findAll(
    query: PokemonsQueryInput,
    user?: User
  ): Promise<{ items: Pokemon[]; count: number }> {
    const { limit, offset, search, type, isFavorite } = query

    const queryBuilder = this.pokemonRepository.createQueryBuilder('pokemon')

    if (search) {
      queryBuilder.andWhere('pokemon.name ILIKE :search', {
        search: `%${search}%`,
      })
    }

    if (type) {
      queryBuilder.andWhere('pokemon.types ILIKE :type', { type: `%${type}%` })
    }

    if (isFavorite !== undefined) {
      if (!user) {
        throw new ForbiddenException()
      }

      if (isFavorite) {
        queryBuilder
          .innerJoin('pokemon.favoritedBy', 'users')
          .where('users.id = :userId', { userId: user.id })
      }

      if (!isFavorite) {
        queryBuilder
          .leftJoin('pokemon.favoritedBy', 'users')
          .where('users.id IS NULL')
      }
    }

    const [result, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount()

    return { items: result, count: total }
  }

  findEvolutionRequirementsByPokemonId(
    id: number
  ): Promise<EvolutionRequirement> {
    try {
      return this.evolutionRequirementRepository.findOneOrFail({
        where: { pokemon: { id } },
      })
    } catch (error) {
      throw new NotFoundException('Evolution requirements not found')
    }
  }
}
