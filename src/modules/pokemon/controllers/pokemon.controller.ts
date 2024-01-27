import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Public } from 'src/modules/auth/decorators/public.decorator'
import { GetUserPayload } from 'src/modules/auth/decorators/user.decorator'
import { User } from 'src/modules/auth/entities/user.entity'
import { OptionalAuthGuard } from "src/modules/auth/guards/optional-auth.guard";
import { ListPokemonsQuery } from 'src/modules/pokemon/dto/list-pokemons-query.dto'
import { Pokemon } from "src/modules/pokemon/dto/pokemon.dto";
import { PokemonService } from 'src/modules/pokemon/services/pokemon.service'

@ApiTags('Pokemon')
@Controller({
  path: 'pokemon',
  version: '1',
})
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Public()
  @UseGuards(OptionalAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    isArray: true,
    type: Pokemon,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  findAll(@Query() query: ListPokemonsQuery, @GetUserPayload() user: User) {
    return this.pokemonService.findAll(query, user)
  }

  @Get('types')
  @ApiOkResponse({ isArray: true, type: String })
  findAllTypes() {
    return this.pokemonService.findAllTypes()
  }

  @Get('details/:name')
  @ApiOkResponse({ type: Pokemon })
  @ApiNotFoundResponse({ description: 'Pokemon not found.' })
  findByName(@Param('name') name: string) {
    return this.pokemonService.findByName(name)
  }

  @Get(':id')
  @ApiOkResponse({ type: Pokemon })
  @ApiNotFoundResponse({ description: 'Pokemon not found.' })
  findById(@Param('id') id: number) {
    return this.pokemonService.findById(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/favorite')
  @ApiBearerAuth()
  @ApiOkResponse({ type: Pokemon })
  @ApiNotFoundResponse({ description: 'Pokemon not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  addFavorite(@Param('id') id: number, @GetUserPayload() user: User) {
    return this.pokemonService.addFavorite(id, user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/favorite')
  @ApiBearerAuth()
  @ApiOkResponse({ type: Pokemon })
  @ApiNotFoundResponse({ description: 'Pokemon not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  removeFavorite(@Param('id') id: number, @GetUserPayload() user: User) {
    return this.pokemonService.removeFavorite(id, user)
  }
}
