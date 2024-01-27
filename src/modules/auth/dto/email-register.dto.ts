import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, Validate } from 'class-validator'
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer'
import { DoesNotExist } from 'src/utils/validators/does-not-exist.validator'

export class EmailRegisterRequest {
  @ApiProperty()
  @Transform(lowerCaseTransformer)
  @Validate(DoesNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string
}
