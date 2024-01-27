import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { authConfig, AuthConfigType } from 'src/config/auth.config'
import { SessionController } from 'src/modules/auth/controllers/session.controller'
import { UsersController } from 'src/modules/auth/controllers/users.controller'
import { User } from 'src/modules/auth/entities/user.entity'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy'
import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy'
import { DoesNotExist } from 'src/utils/validators/does-not-exist.validator'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [authConfig.KEY],
      useFactory: (config: AuthConfigType) => ({
        secret: config.secret,
        signOptions: {
          expiresIn: config.expires,
        },
      }),
    }),
  ],
  controllers: [UsersController, SessionController],
  providers: [DoesNotExist, AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
