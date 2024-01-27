/* eslint-disable @typescript-eslint/no-use-before-define */
import { Injectable } from '@nestjs/common'
import { rand, randNumber, randSuperheroName, randBinary } from '@ngneat/falso'
import { AttackCategory } from 'src/modules/pokemon/entities/attack.entity'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { randMultiple } from 'src/modules/testing/helpers'
import { TestingEntityService } from 'src/modules/testing/testing-entity.service'

@Injectable()
export class PokemonTestingService extends TestingEntityService {
  public createPokemonData(data?: Partial<IPokemonTestData>): IPokemonTestData {
    return {
      number: randNumber({ min: 1, max: 10000 }),
      name: randSuperheroName(),
      classification: rand(dummyClassification),
      types: randMultiple(dummyTypes),
      resistant: randMultiple(dummyResistant),
      weaknesses: randMultiple(dummyWeaknesses),
      weightRange: {
        minimum: randNumber({ min: 1, max: 100 }),
        maximum: randNumber({ min: 100, max: 10000 }),
      },
      heightRange: {
        minimum: randNumber({ min: 1, max: 100 }),
        maximum: randNumber({ min: 100, max: 10000 }),
      },
      fleeRate: randNumber({ min: 0, max: 1, fractionDigits: 2 }),
      maxCP: randNumber({ min: 1, max: 10000 }),
      maxHP: randNumber({ min: 1, max: 10000 }),
      isFavorite: Boolean(randBinary()),
      ...data,
    }
  }

  public createPokemonAttackData(
    data?: Partial<IPokemonAttackTestData>
  ): IPokemonAttackTestData {
    return {
      name: randSuperheroName(),
      type: rand(dummyTypes),
      category: rand(Object.values(AttackCategory)),
      damage: randNumber({ min: 1, max: 1000 }),
      ...data,
    }
  }

  public createEvolutionRequirementData(
    data?: Partial<IEvolutionRequirementTestData>
  ): IEvolutionRequirementTestData {
    return {
      amount: randNumber({ min: 1, max: 100 }),
      name: randSuperheroName(),
      ...data,
    }
  }

  public async createTestPokemon(data?: Partial<IPokemonTestData>) {
    const pokemonData = this.createPokemonData(data)

    const pokemon = await this.saveFixture(Pokemon, {
      ...pokemonData,
      attacks: [
        this.createPokemonAttackData({ category: AttackCategory.FAST }),
        this.createPokemonAttackData({ category: AttackCategory.FAST }),
        this.createPokemonAttackData({ category: AttackCategory.FAST }),
        this.createPokemonAttackData({ category: AttackCategory.SPECIAL }),
      ],
      evolutionRequirements: this.createEvolutionRequirementData(),
    })

    return {
      pokemon,
    }
  }

  public async createTestPokemonCount(count: number): Promise<Pokemon[]> {
    const pokemons: Pokemon[] = []

    await Promise.all(
      Array(count)
        .fill(0)
        .map(async () => {
          const { pokemon } = await this.createTestPokemon()
          pokemons.push(pokemon)
        })
    )

    return pokemons
  }
}

// TODO: possibly split into multiple files

const dummyClassification = [
  'Bivalve',
  'Butterfly',
  'ClassyCat',
  'Drill',
  'Fairy',
  'FireHorse',
  'Fish',
  'Flame',
  'Gas',
  'Genetic',
]

const dummyTypes = ['Electric', 'Ground', 'Poison', 'Water', 'Bug', 'Fighting']
const dummyResistant = dummyTypes
const dummyWeaknesses = dummyTypes

interface IPokemonTestData {
  number: number
  name: string
  classification: string
  types: string[]
  resistant: string[]
  weaknesses: string[]
  weightRange: { minimum: number; maximum: number }
  heightRange: { minimum: number; maximum: number }
  fleeRate: number
  maxCP: number
  maxHP: number
  isFavorite: boolean
}

interface IPokemonAttackTestData {
  name: string
  type: string
  category: AttackCategory
  damage: number
}

interface IEvolutionRequirementTestData {
  amount: number
  name: string
}
