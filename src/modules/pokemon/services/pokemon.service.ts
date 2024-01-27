import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { ListPokemonsQuery } from 'src/modules/pokemon/dto/list-pokemons-query.dto'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>
  ) {}

  async addFavorite(id: number, user?: User): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
      relations: ['evolutions'],
    })

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found')
    }

    await this.pokemonRepository
      .createQueryBuilder('pokemon')
      .relation('favoritedBy')
      .of(pokemon)
      .add(user)

    await this.pokemonRepository.save(pokemon)

    return pokemon
  }

  async removeFavorite(id: number, user?: User): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
      relations: ['evolutions'],
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
    const result = await this.pokemonRepository.findOne({
      where: { name },
      relations: ['evolutions'],
    })

    if (!result) {
      throw new NotFoundException('Pokemon not found')
    }

    return result
  }

  async findById(id: number): Promise<Pokemon> {
    const result = await this.pokemonRepository.findOne({
      where: { id },
      relations: ['evolutions'],
    })
    if (!result) {
      throw new NotFoundException('Pokemon not found')
    }

    return result
  }

  async findAllTypes(): Promise<string[]> {
    const result = await this.pokemonRepository.query(`
      SELECT DISTINCT unnest(string_to_array(types, ',')) AS type
      FROM pokemon
      ORDER BY type ASC;
    `)

    return result.map((row) => row.type)
  }

  async findAll(
    query: ListPokemonsQuery,
    user?: User
  ): Promise<{ items: Pokemon[]; count: number }> {
    const { limit, offset, search, type, isFavorite } = query

    const queryBuilder = this.pokemonRepository
      .createQueryBuilder('pokemon')
      .leftJoinAndSelect(
        'pokemon.evolutionRequirements',
        'evolutionRequirements'
      )
      .leftJoinAndSelect('pokemon.evolutions', 'evolutions')
      .leftJoinAndSelect('pokemon.attacks', 'attacks')

    if (user) {
      queryBuilder.leftJoinAndSelect(
        'pokemon.favoritedBy',
        'users',
        'users.id = :userId',
        {
          userId: user?.id,
        }
      )
    }

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
        throw new ForbiddenException(
          'Only authenticated users can filter by "isFavorite".'
        )
      }

      if (isFavorite) {
        queryBuilder.andWhere('users.id = :userId', { userId: user.id })
      } else {
        queryBuilder.andWhere('users.id IS NULL')
      }
    }

    const [result, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .orderBy('pokemon.id', 'ASC')
      .getManyAndCount()

    return { items: result, count: total }
  }
}
