import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { GetUserPayload } from 'src/modules/auth/decorators/user.decorator'
import {
  EmailLoginRequest,
  EmailLoginResponse,
} from 'src/modules/auth/dto/email-login.dto'
import { User } from 'src/modules/auth/entities/user.entity'
import { AuthService } from 'src/modules/auth/services/auth.service'

@ApiTags('Session')
@Controller({
  path: 'session',
  version: '1',
})
export class SessionController {
  constructor(public service: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: EmailLoginResponse,
  })
  public login(@Body() _: EmailLoginRequest, @GetUserPayload() user: User) {
    return this.service.login(user)
  }
}
