/* eslint-disable max-lines-per-function, max-lines */
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest'
import { AuthModule } from 'src/modules/auth/auth.module'
import { UserTestingService } from 'src/modules/auth/services/user-testing.service'
import { PokemonModule } from 'src/modules/pokemon/pokemon.module'
import { PokemonTestingService } from 'src/modules/pokemon/services/pokemon-testing.service'
import { TestingDatabaseService } from 'src/modules/testing/testing-database.service'
import { bootstrap } from 'src/modules/testing/utilities'

describe('[users] controller', () => {
  let app: INestApplication
  let databaseService: TestingDatabaseService
  let authTestingEntityService: UserTestingService
  let pokemonTestingEntityService: PokemonTestingService

  describe('GET /pokemons/:id', () => {
    it('should return pokemon by id', async () => {
      // Arrange
      const result = await pokemonTestingEntityService.createTestPokemon()
      const pokemonId = result.pokemon.id
      const pokemonName = result.pokemon.name

      // Act
      const server = app.getHttpServer()
      const response = await request(server).get(
        `/api/v1/pokemons/${pokemonId}`
      )

      // Assert
      expect(response.body.id).toStrictEqual(pokemonId)
      expect(response.body.name).toStrictEqual(pokemonName)
      expect(response.status).toBe(200)
    })

    describe('when pokemon does not exist', () => {
      it('should return 404 status code', async () => {
        // Arrange
        const pokemonId = 999

        // Act
        const server = app.getHttpServer()
        const response = await request(server).get(
          `/api/v1/pokemons/${pokemonId}`
        )

        // Assert
        expect(response.status).toBe(404)
      })
    })
  })

  describe('GET /pokemons/names/:name', () => {
    it('should return pokemon by name', async () => {
      // Arrange
      const result = await pokemonTestingEntityService.createTestPokemon()
      const pokemonId = result.pokemon.id
      const pokemonName = result.pokemon.name

      // Act
      const server = app.getHttpServer()
      const response = await request(server).get(
        `/api/v1/pokemons/name/${pokemonName}`
      )

      // Assert
      expect(response.body.id).toStrictEqual(pokemonId)
      expect(response.body.name).toStrictEqual(pokemonName)
      expect(response.status).toBe(200)
    })

    describe('when pokemon does not exist', () => {
      it('should return 404 status code', async () => {
        // Arrange
        const pokemonName = 'some name'

        // Act
        const server = app.getHttpServer()
        const response = await request(server).get(
          `/api/v1/pokemons/name/${pokemonName}`
        )

        // Assert
        expect(response.status).toBe(404)
      })
    })
  })

  describe('GET /pokemons/types', () => {
    it('should return list of pokemon types', async () => {
      // Arrange
      const pokemons =
        await pokemonTestingEntityService.createTestPokemonCount(2)

      const expectedTypes = [
        ...new Set(pokemons.flatMap((pokemon) => pokemon.types)),
      ].sort()

      // Act
      const server = app.getHttpServer()
      const response = await request(server).get('/api/v1/pokemons/types')

      // Assert
      expect(response.body).toStrictEqual(expectedTypes)
      expect(response.status).toBe(200)
    })
  })

  //
  //
  // setup

  beforeAll(async () => {
    app = await bootstrap({
      imports: [PokemonModule, AuthModule],
      providers: [],
    })

    databaseService = app.get(TestingDatabaseService)
    authTestingEntityService = app.get(UserTestingService)
    pokemonTestingEntityService = app.get(PokemonTestingService)
  })

  beforeEach(async () => {
    await databaseService.clearDb()
  })

  afterAll(async () => {
    await databaseService.dataSource.destroy()
  })
})
