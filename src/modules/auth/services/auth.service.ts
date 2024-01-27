import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { EmailLoginRequest } from 'src/modules/auth/dto/email-login.dto'
import { EmailRegisterRequest } from 'src/modules/auth/dto/email-register.dto'
import { User } from 'src/modules/auth/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async validateUserByEmailPassword(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email })

    if (user) {
      const isValidPassword = await bcrypt.compare(password, user?.password)
      if (isValidPassword) {
        return user
      }
    }

    return null
  }

  async validateUserById(userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }

  async login(input: EmailLoginRequest) {
    const user = await this.validateUserByEmailPassword(
      input.email,
      input.password
    )

    if (!user) {
      throw new UnauthorizedException()
    }

    return this.createLoginResponse(user)
  }

  async register(input: EmailRegisterRequest) {
    const user = this.usersRepository.create(input)
    await this.usersRepository.save(user)

    return this.createLoginResponse(user)
  }

  createLoginResponse(user: User) {
    const token = this.jwtService.sign({
      id: user.id,
    })

    return {
      accessToken: token,
      user,
    }
  }
}
