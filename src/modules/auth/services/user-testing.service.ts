import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { randEmail, randPassword } from '@ngneat/falso'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { User } from 'src/modules/auth/entities/user.entity'
import { TestingEntityService } from 'src/modules/testing/testing-entity.service'

@Injectable()
export class UserTestingService extends TestingEntityService {
  public createUserData() {
    return {
      email: randEmail(),
      password: randPassword(),
    }
  }

  public async createTestUser() {
    const { email, password } = this.createUserData()

    const user = await this.saveFixture(User, {
      email,
      password,
    })

    return {
      user,
      meta: {
        plainPassword: password,
      },
    }
  }

  public async createTestUsers(count: number): Promise<User[]> {
    const users: User[] = []

    await Promise.all(
      Array(count)
        .fill(0)
        .map(async () => {
          const { user } = await this.createTestUser()
          users.push(user)
        })
    )

    return users
  }

  public async createAuthenticatedUser(
    jwtService: JwtService,
    shouldNotSerialize = false
  ) {
    const { user } = await this.createTestUser()
    await user.save()

    const accessToken = jwtService.sign({ id: user.id })

    if (shouldNotSerialize) {
      return {
        user,
        accessToken,
      }
    }

    return {
      user: instanceToPlain(plainToInstance(User, user)),
      accessToken,
    }
  }
}
