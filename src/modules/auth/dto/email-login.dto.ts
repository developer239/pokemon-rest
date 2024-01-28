import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { User } from 'src/modules/auth/dto/user.dto'
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer'

export class EmailLoginRequest {
  @ApiProperty({
    example: 'michal@mail.com',
  })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @ApiProperty({ example: 'password1234' })
  @IsNotEmpty()
  readonly password: string
}

export class EmailLoginResponse {
  @ApiProperty()
  @IsNotEmpty()
  readonly accessToken: string

  @ApiProperty()
  readonly user: User
}
