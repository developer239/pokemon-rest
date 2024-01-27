/* eslint-disable max-lines-per-function, max-lines */
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest'
import { AuthModule } from 'src/modules/auth/auth.module'
import { UserTestingService } from 'src/modules/auth/services/user-testing.service'
import { PokemonModule } from 'src/modules/pokemon/pokemon.module'
import { TestingDatabaseService } from 'src/modules/testing/testing-database.service'
import { bootstrap } from 'src/modules/testing/utilities'

describe('[session] controller', () => {
  let app: INestApplication
  let databaseService: TestingDatabaseService
  let testingEntityService: UserTestingService

  describe('POST /email', () => {
    it('should find user by credentials', async () => {
      // Arrange
      const { user, meta } = await testingEntityService.createTestUser()

      // Act
      const server = app.getHttpServer()
      const response = await request(server)
        .post('/api/v1/session/email')
        .send({
          email: user.email,
          password: meta.plainPassword,
        })

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({
        accessToken: expect.any(String),
        user: {
          id: user.id,
          email: user.email,
        },
      })
    })

    describe('when user does not exist', () => {
      it('should return 401 Unauthorized', async () => {
        // Arrange
        const user = testingEntityService.createUserData()

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .post('/api/v1/session/email')
          .send({
            email: user.email,
            password: user.password,
          })

        // Assert
        expect(response.status).toBe(401)
      })
    })

    describe('when password is incorrect', () => {
      it('should return 401 Unauthorized', async () => {
        // Arrange
        const { user } = await testingEntityService.createTestUser()

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .post('/api/v1/session/email')
          .send({
            email: user.email,
            password: 'wrong-password',
          })

        // Assert
        expect(response.status).toBe(401)
      })
    })
  })

  //
  //
  // setup

  beforeAll(async () => {
    app = await bootstrap({
      imports: [AuthModule, PokemonModule],
      providers: [],
    })

    databaseService = app.get(TestingDatabaseService)
    testingEntityService = app.get(UserTestingService)
  })

  beforeEach(async () => {
    await databaseService.clearDb()
  })

  afterAll(async () => {
    await databaseService.dataSource.destroy()
  })
})
