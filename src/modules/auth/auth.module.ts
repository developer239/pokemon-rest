import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { authConfig, AuthConfigType } from 'src/config/auth.config'
import { User } from 'src/modules/auth/entities/user.entity'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy'
import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy'

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
  controllers: [],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
