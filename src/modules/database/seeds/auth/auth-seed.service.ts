import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { ISeedService } from 'src/modules/database/seeds/services/seed.types'

@Injectable()
export class AuthSeedService implements ISeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async run() {
    const plainPassword = 'password1234'
    const user = this.userRepository.create({
      email: 'michal@mail.com',
      password: plainPassword,
    })
    await this.userRepository.save(user)

    Logger.log(
      `\x1b[34mCreated user with email: ${user.email} and password: ${plainPassword}`,
      'AuthSeedService'
    )
  }
}
