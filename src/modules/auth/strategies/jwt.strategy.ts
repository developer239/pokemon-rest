import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { authConfig, AuthConfigType } from 'src/config/auth.config'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { IJwtPayload } from 'src/modules/auth/strategies/jwt.strategy.types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    @Inject(authConfig.KEY)
    private readonly authConfigValues: AuthConfigType
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfigValues.secret,
    })
  }

  public async validate(payload: IJwtPayload) {
    const user = await this.authService.validateUserById(payload.id)
    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
