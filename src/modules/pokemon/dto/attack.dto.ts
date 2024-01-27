import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator'
import { AttackCategory } from 'src/modules/pokemon/entities/attack.entity'

export class Attack {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  id: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string

  @ApiProperty({ enum: AttackCategory })
  @IsEnum(AttackCategory)
  category: AttackCategory

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  damage: number
}
