/* eslint-disable max-lines-per-function, max-lines */
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
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
  let userTestingEntityService: UserTestingService
  let pokemonTestingEntityService: PokemonTestingService
  let jwtService: JwtService

  describe('GET /pokemons', () => {
    it('should return list of pokemons', async () => {
      // Arrange
      const pokemons =
        await pokemonTestingEntityService.createTestPokemonCount(3)

      // Act
      const server = app.getHttpServer()
      const response = await request(server).get('/api/v1/pokemons')

      // Assert
      expect(response.body.count).toStrictEqual(pokemons.length)
      expect(response.body.items).toHaveLength(pokemons.length)
      expect(response.status).toStrictEqual(200)
    })

    describe('when limit and offset provided', () => {
      it('should return a list of pokemons with the provided limit and offset', async () => {
        // Arrange
        const totalCount = 10
        await pokemonTestingEntityService.createTestPokemonCount(totalCount)

        const limit = 5
        const offset = 5

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .get('/api/v1/pokemons')
          .query({ limit, offset })

        // Assert
        expect(response.body.count).toStrictEqual(totalCount)
        expect(response.body.items).toHaveLength(limit)
        expect(response.status).toStrictEqual(200)
      })
    })

    describe('when search query provided', () => {
      it('should return a list of pokemons that match the search query', async () => {
        // Arrange
        await pokemonTestingEntityService.createTestPokemon()
        const pokemon1 = await pokemonTestingEntityService.createTestPokemon({
          name: '123pokemon1',
        })
        await pokemonTestingEntityService.createTestPokemon()
        await pokemonTestingEntityService.createTestPokemon()

        const pokemonToSearch = pokemon1.pokemon
        const pokemonNameToSearch = '23pokemon'

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .get('/api/v1/pokemons')
          .query({ search: pokemonNameToSearch })

        // Assert
        expect(response.body.count).toStrictEqual(1)
        expect(response.body.items).toHaveLength(1)
        expect(response.body.items[0].id).toStrictEqual(pokemonToSearch.id)
        expect(response.body.items[0].name).toStrictEqual(pokemonToSearch.name)
        expect(response.status).toStrictEqual(200)
      })
    })

    describe('when type query provided', () => {
      it('should return a list of pokemons that match the type query', async () => {
        // Arrange
        const pokemon0 = await pokemonTestingEntityService.createTestPokemon({
          types: ['type0', 'type1'],
        })
        await pokemonTestingEntityService.createTestPokemon({
          types: ['type1', 'type2'],
        })
        await pokemonTestingEntityService.createTestPokemon({
          types: ['type2', 'type3'],
        })
        const pokemonToSearch = pokemon0.pokemon
        const pokemonTypeToSearch = 'type0'

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .get('/api/v1/pokemons')
          .query({ type: pokemonTypeToSearch })

        // Assert
        expect(response.body.count).toStrictEqual(1)
        expect(response.body.items).toHaveLength(1)
        expect(response.body.items[0].id).toStrictEqual(pokemonToSearch.id)
        expect(response.body.items[0].name).toStrictEqual(pokemonToSearch.name)
        expect(response.status).toStrictEqual(200)
      })
    })

    describe('when isFavorite query provided', () => {
      describe('when isFavorite is true', () => {
        it('should return a list of pokemons that are favorited by user', async () => {
          // Arrange
          const { user, accessToken } =
            await userTestingEntityService.createAuthenticatedUser(jwtService)

          // favorited pokemon
          const { pokemon } =
            await pokemonTestingEntityService.createTestPokemon(undefined, {
              favoritedBy: [user.id],
            })

          // other pokemons
          await pokemonTestingEntityService.createTestPokemonCount(3)

          // Act
          const server = app.getHttpServer()
          const response = await request(server)
            .get('/api/v1/pokemons')
            .query({ isFavorite: true })
            .set('Authorization', `Bearer ${accessToken}`)

          // Assert
          expect(response.body.count).toStrictEqual(1)
          expect(response.body.items).toHaveLength(1)
          expect(response.body.items[0].id).toStrictEqual(pokemon.id)
          expect(response.body.items[0].name).toStrictEqual(pokemon.name)
          expect(response.status).toStrictEqual(200)
        })
      })

      describe('when isFavorite is false', () => {
        it('should return a list of pokemons that are not favorited by user', async () => {
          // Arrange
          const { user, accessToken } =
            await userTestingEntityService.createAuthenticatedUser(jwtService)

          // favorited pokemon
          await pokemonTestingEntityService.createTestPokemon(undefined, {
            favoritedBy: [user.id],
          })

          // other pokemons
          await pokemonTestingEntityService.createTestPokemonCount(3)

          // Act
          const server = app.getHttpServer()
          const response = await request(server)
            .get('/api/v1/pokemons')
            .query({ isFavorite: false })
            .set('Authorization', `Bearer ${accessToken}`)

          // Assert
          expect(response.body.count).toStrictEqual(3)
          expect(response.body.items).toHaveLength(3)
          expect(response.status).toStrictEqual(200)
        })
      })
    })

    describe('when multiple params are provided', () => {
      it('should return a list of pokemons that match the params', async () => {
        // Arrange
        const pokemon0 = await pokemonTestingEntityService.createTestPokemon({
          name: '123pokemon1',
          types: ['type0', 'type1'],
        })
        await pokemonTestingEntityService.createTestPokemon({
          name: '123pokemon2',
          types: ['type1', 'type2'],
        })
        await pokemonTestingEntityService.createTestPokemon({
          name: '123pokemon3',
          types: ['type2', 'type3'],
        })
        const pokemonToSearch = pokemon0.pokemon
        const pokemonNameToSearch = '23pokemon'
        const pokemonTypeToSearch = 'type0'

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .get('/api/v1/pokemons')
          .query({ search: pokemonNameToSearch, type: pokemonTypeToSearch })

        // Assert
        expect(response.body.count).toStrictEqual(1)
        expect(response.body.items).toHaveLength(1)
        expect(response.body.items[0].id).toStrictEqual(pokemonToSearch.id)
        expect(response.body.items[0].name).toStrictEqual(pokemonToSearch.name)
        expect(response.status).toStrictEqual(200)
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
      expect(response.status).toStrictEqual(200)
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
      expect(response.status).toStrictEqual(200)
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
        expect(response.status).toStrictEqual(404)
      })
    })
  })

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
      expect(response.status).toStrictEqual(200)
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
        expect(response.status).toStrictEqual(404)
      })
    })
  })

  describe('POST /pokemons/:id/favorite', () => {
    it('should favorite pokemon', async () => {
      // Arrange
      const { pokemon } = await pokemonTestingEntityService.createTestPokemon()
      const { accessToken } =
        await userTestingEntityService.createAuthenticatedUser(jwtService)

      // Act
      const server = app.getHttpServer()
      const response = await request(server)
        .post(`/api/v1/pokemons/${pokemon.id}/favorite`)
        .set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.body.id).toStrictEqual(pokemon.id)
      expect(response.status).toStrictEqual(201)
    })

    describe('when pokemon does not exist', () => {
      it('should return 404 status code', async () => {
        // Arrange
        const pokemonId = 999
        const { accessToken } =
          await userTestingEntityService.createAuthenticatedUser(jwtService)

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .post(`/api/v1/pokemons/${pokemonId}/favorite`)
          .set('Authorization', `Bearer ${accessToken}`)

        // Assert
        expect(response.status).toStrictEqual(404)
      })
    })

    describe('when user not authorized', () => {
      it('should return 401 status code', async () => {
        // Arrange
        const { pokemon } =
          await pokemonTestingEntityService.createTestPokemon()

        // Act
        const server = app.getHttpServer()
        const response = await request(server).post(
          `/api/v1/pokemons/${pokemon.id}/favorite`
        )

        // Assert
        expect(response.status).toStrictEqual(401)
      })
    })
  })

  describe('DELETE /pokemons/:id/favorite', () => {
    it('should remove favorite pokemon', async () => {
      // Arrange
      const { pokemon } = await pokemonTestingEntityService.createTestPokemon()
      const { accessToken } =
        await userTestingEntityService.createAuthenticatedUser(jwtService)

      // Act
      const server = app.getHttpServer()
      const response = await request(server)
        .delete(`/api/v1/pokemons/${pokemon.id}/favorite`)
        .set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.body.id).toStrictEqual(pokemon.id)
      expect(response.status).toStrictEqual(200)
    })

    describe('when pokemon does not exist', () => {
      it('should return 404 status code', async () => {
        // Arrange
        const pokemonId = 999
        const { accessToken } =
          await userTestingEntityService.createAuthenticatedUser(jwtService)

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .delete(`/api/v1/pokemons/${pokemonId}/favorite`)
          .set('Authorization', `Bearer ${accessToken}`)

        // Assert
        expect(response.status).toStrictEqual(404)
      })
    })

    describe('when user not authorized', () => {
      it('should return 401 status code', async () => {
        // Arrange
        const { pokemon } =
          await pokemonTestingEntityService.createTestPokemon()

        // Act
        const server = app.getHttpServer()
        const response = await request(server).delete(
          `/api/v1/pokemons/${pokemon.id}/favorite`
        )

        // Assert
        expect(response.status).toStrictEqual(401)
      })
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
    userTestingEntityService = app.get(UserTestingService)
    pokemonTestingEntityService = app.get(PokemonTestingService)
    jwtService = app.get(JwtService)
  })

  beforeEach(async () => {
    await databaseService.clearDb()
  })

  afterAll(async () => {
    await databaseService.dataSource.destroy()
  })
})
