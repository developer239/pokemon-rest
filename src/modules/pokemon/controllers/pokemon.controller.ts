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
import { ApiTags } from "@nestjs/swagger";
import { Public } from 'src/modules/auth/decorators/public.decorator'
import { GetUserPayload } from 'src/modules/auth/decorators/user.decorator'
import { User } from 'src/modules/auth/entities/user.entity'
import { OptionalAuthGuard } from "src/modules/auth/guards/optional-auth.guard";
import { ListPokemonsQuery } from 'src/modules/pokemon/dto/list-pokemons-query.dto'
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
  findAll(@Query() query: ListPokemonsQuery, @GetUserPayload() user: User) {
    return this.pokemonService.findAll(query, user)
  }

  @Get('types')
  findAllTypes() {
    return this.pokemonService.findAllTypes()
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.pokemonService.findById(id)
  }

  @Get('details/:name')
  findByName(@Param('name') name: string) {
    return this.pokemonService.findByName(name)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/favorite')
  addFavorite(@Param('id') id: number, @GetUserPayload() user: User) {
    return this.pokemonService.addFavorite(id, user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/favorite')
  removeFavorite(@Param('id') id: number, @GetUserPayload() user: User) {
    return this.pokemonService.removeFavorite(id, user)
  }
}
