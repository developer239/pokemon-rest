import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  SerializeOptions,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { GetUserPayload } from "src/modules/auth/decorators/user.decorator";
import { EmailLoginResponse } from "src/modules/auth/dto/email-login.dto";
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
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: EmailLoginResponse,
  })
  register(@Body() createUserDto: EmailRegisterRequest) {
    return this.service.register(createUserDto)
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Me,
  })
  public me(@GetUserPayload() user: User) {
    return user
  }
}
