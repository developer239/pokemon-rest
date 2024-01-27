import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { authConfig, AuthConfigType } from 'src/config/auth.config'
import { IJwtPayload } from 'src/modules/auth/strategies/jwt.strategy.types'
import { AuthService } from "src/modules/auth/services/auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
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
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: `unauthorized`,
        },
        HttpStatus.UNAUTHORIZED
      )
    }

    return user
  }
}
