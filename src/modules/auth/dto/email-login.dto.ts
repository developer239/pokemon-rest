import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { User } from 'src/modules/auth/dto/user.dto'
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer'

export class EmailLoginRequest {
  @ApiProperty()
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string
}

export class EmailLoginResponse {
  @ApiProperty()
  @IsNotEmpty()
  readonly accessToken: string

  @ApiProperty()
  @IsNotEmpty()
  readonly refreshToken: string

  @ApiProperty()
  readonly user: User
}
