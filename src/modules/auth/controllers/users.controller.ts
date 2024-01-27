import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { GetUserPayload } from 'src/modules/auth/decorators/user.decorator'
import { EmailLoginResponse } from 'src/modules/auth/dto/email-login.dto'
import { EmailRegisterRequest } from 'src/modules/auth/dto/email-register.dto'
import { Me } from 'src/modules/auth/dto/me.dto'
import { User } from 'src/modules/auth/entities/user.entity'
import { AuthService } from 'src/modules/auth/services/auth.service'

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(public service: AuthService) {}

  @Post()
  @ApiCreatedResponse({
    type: EmailLoginResponse,
  })
  register(@Body() createUserDto: EmailRegisterRequest) {
    return this.service.register(createUserDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Me,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  public me(@GetUserPayload() user: User) {
    return user
  }
}
