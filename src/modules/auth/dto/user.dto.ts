import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class User {
  @ApiProperty()
  @IsNotEmpty()
  readonly id: number

  @ApiProperty()
  @IsNotEmpty()
  readonly email: string
}
