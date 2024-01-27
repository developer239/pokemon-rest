import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'

export class ListPokemonsQuery {
  @ApiProperty({
    description: 'Offset for pagination',
    default: 0,
    required: false,
  })
  @IsOptional()
  offset?: number = 0

  @ApiProperty({
    description: 'Limit for pagination',
    default: 10,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10

  @ApiProperty({ description: 'Search Pokemons by name', required: false })
  @IsString()
  @IsOptional()
  search?: string

  @ApiProperty({ description: 'Filter by Pokemon type', required: false })
  @IsString()
  @IsOptional()
  type?: string

  @ApiProperty({ description: 'Filter by favorite status', required: false })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean
}
