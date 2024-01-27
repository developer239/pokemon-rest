import * as fs from 'fs'
import * as path from 'path'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ISeedService } from 'src/modules/database/seeds/services/seed.types'
import {
  AttackCategory,
  Attack,
} from 'src/modules/pokemon/entities/attack.entity'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'

export interface IRawPokemon {
  'id': string
  'name': string
  'classification': string
  'types': string[]
  'resistant': string[]
  'weaknesses': string[]
  'weight': {
    minimum: string // kg
    maximum: string
  }
  'height': {
    minimum: string // m
    maximum: string
  }
  'fleeRate': number
  'evolutionRequirements': {
    amount: number
    name: string
  }
  'Previous evolution(s)'?: {
    id: string
    name: string
  }[]
  'evolutions'?: {
    id: string
    name: string
  }[]
  'maxCP': number
  'maxHP': number
  'attacks': {
    fast: {
      name: string
      type: string
      damage: number
    }[]
    special: {
      name: string
      type: string
      damage: number
    }[]
  }
}

@Injectable()
export class PokemonSeedService implements ISeedService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Attack)
    private readonly attackRepository: Repository<Attack>
  ) {}

  async run() {
    const rawPokemons = this.loadRawPokemons()

    const attacks = await this.insertAttacks(rawPokemons)
    const pokemons = await this.insertPokemons(rawPokemons)

    await this.linkEvolutions(rawPokemons, pokemons)
    await this.linkAttacks(rawPokemons, pokemons, attacks)
  }

  private loadRawPokemons() {
    const filePath = path.join(__dirname, '../../../../../pokemons.json')
    const isFileExist = fs.existsSync(filePath)

    if (!isFileExist) {
      throw new Error('File does not exist')
    }

    const rawPokemons = JSON.parse(
      fs.readFileSync(filePath).toString()
    ) as IRawPokemon[]

    return rawPokemons
  }

  private insertAttacks(rawPokemons: IRawPokemon[]) {
    const attacks = rawPokemons.reduce(
      (carry, rawPokemon) => {
        const pokemonAttacks = [
          ...rawPokemon.attacks.fast.map((attack) => ({
            name: attack.name,
            type: attack.type,
            damage: attack.damage,
            category: AttackCategory.FAST,
          })),
          ...rawPokemon.attacks.special.map((attack) => ({
            name: attack.name,
            type: attack.type,
            damage: attack.damage,
            category: AttackCategory.SPECIAL,
          })),
        ] as Attack[]

        for (const attack of pokemonAttacks) {
          const attackKey = `${attack.name}-${attack.type}-${attack.damage}-${attack.category}`
          carry[`${attackKey}`] = attack
        }

        return carry
      },
      {} as { [key: string]: Attack }
    )

    const flattenedAttacks = Object.values(attacks)

    return this.attackRepository.save(flattenedAttacks)
  }

  private async insertPokemons(rawPokemons: IRawPokemon[]) {
    const pokemons = rawPokemons.map((rawPokemon) => {
      const pokemon = new Pokemon()
      pokemon.number = parseInt(rawPokemon.id, 10)
      pokemon.name = rawPokemon.name
      pokemon.classification = rawPokemon.classification
      pokemon.types = rawPokemon.types
      pokemon.resistant = rawPokemon.resistant
      pokemon.weaknesses = rawPokemon.weaknesses
      pokemon.weightRange = {
        minimum: Math.round(parseFloat(rawPokemon.weight.minimum) * 100), // convert go g
        maximum: Math.round(parseFloat(rawPokemon.weight.maximum) * 100),
      }
      pokemon.heightRange = {
        minimum: Math.round(parseFloat(rawPokemon.height.minimum) * 100), // convert to cm
        maximum: Math.round(parseFloat(rawPokemon.height.maximum) * 100),
      }
      pokemon.fleeRate = rawPokemon.fleeRate
      pokemon.maxCP = rawPokemon.maxCP
      pokemon.maxHP = rawPokemon.maxHP
      pokemon.attacks = []

      pokemon.evolutionRequirements =
        rawPokemon.evolutionRequirements as EvolutionRequirement

      pokemon.evolutions = []

      return pokemon
    })

    const newlyInserted = await this.pokemonRepository.save(pokemons)
    const count = newlyInserted.length

    Logger.log(`Inserted ${count} pokemons`, 'PokemonSeedService')

    return newlyInserted
  }

  private async linkEvolutions(
    rawPokemons: IRawPokemon[],
    newlyInsertedPokemons: Pokemon[]
  ) {
    await Promise.all(
      newlyInsertedPokemons.map((pokemon) => {
        const rawPokemon = rawPokemons.find(
          (item) => parseInt(item.id, 10) === pokemon.number
        )

        if (!rawPokemon) {
          Logger.error(`Cannot find raw pokemon with number ${pokemon.number}`)
          return undefined
        }

        const previous =
          rawPokemon['Previous evolution(s)']?.map(
            (rawEvolution) =>
              newlyInsertedPokemons.find(
                (item) => item.number === parseInt(rawEvolution.id, 10)
              )!
          ) || []

        const next =
          rawPokemon.evolutions?.map(
            (rawEvolution) =>
              newlyInsertedPokemons.find(
                (item) => item.number === parseInt(rawEvolution.id, 10)
              )!
          ) || []

        const evolutions = [...previous, ...next]

        return this.pokemonRepository
          .createQueryBuilder('pokemon')
          .relation(Pokemon, 'evolutions')
          .of(pokemon)
          .add(evolutions)
      })
    )
  }

  private async linkAttacks(
    rawPokemons: IRawPokemon[],
    newlyInserted: Pokemon[],
    newlyInsertedAttacks: Attack[]
  ) {
    await Promise.all(
      newlyInserted.map((pokemon) => {
        const rawPokemon = rawPokemons.find(
          (item) => parseInt(item.id, 10) === pokemon.number
        )

        if (!rawPokemon) {
          Logger.error(`Cannot find raw pokemon with number ${pokemon.number}`)
          return undefined
        }

        const attacks: {
          id: number
        }[] = []

        const fastAttacks =
          rawPokemon.attacks.fast?.map((rawAttack) => {
            const rawAttackKey = `${rawAttack.name}-${rawAttack.type}-${rawAttack.damage}-${AttackCategory.FAST}`
            const attack = newlyInsertedAttacks.find(
              (item) =>
                rawAttackKey ===
                `${item.name}-${item.type}-${item.damage}-${AttackCategory.FAST}`
            )!

            return {
              id: attack.id,
            }
          }) || []
        const specialAttacks =
          rawPokemon.attacks.special?.map((rawAttack) => {
            const rawAttackKey = `${rawAttack.name}-${rawAttack.type}-${rawAttack.damage}-${AttackCategory.SPECIAL}`
            const attack = newlyInsertedAttacks.find(
              (item) =>
                rawAttackKey ===
                `${item.name}-${item.type}-${item.damage}-${AttackCategory.SPECIAL}`
            )!

            return {
              id: attack.id,
            }
          }) || []

        attacks.push(...fastAttacks, ...specialAttacks)

        return this.pokemonRepository
          .createQueryBuilder('pokemon')
          .relation(Pokemon, 'attacks')
          .of(pokemon)
          .add(attacks)
      })
    )
  }
}
