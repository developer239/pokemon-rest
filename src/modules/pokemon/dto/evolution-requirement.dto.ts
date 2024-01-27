import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsString } from 'class-validator'

export class EvolutionRequirement {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  id: number

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  amount: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string
}
