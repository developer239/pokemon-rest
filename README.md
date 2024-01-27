# Pokemon API

![master](https://github.com/developer239/pokemon-rest/actions/workflows/api-ci.yml/badge.svg)

## Table of Contents

- [Setup](#setup)
- [Development](#development)
- [Database](#database)
- [Testing](#testing)

## Run with Docker

```bash
docker-compose up
```

**Note:** By default it uses `.env.template`.

## Setup

1. Install dependencies: `make install` (the project uses [yarn](https://github.com/yarnpkg))
2. Create local environment file: `cp .env.template .env`
3. Run infrastructure `make infra` (`.db/init/init.sql` should automatically create `api_db` database)
4. Run development server: `make develop`

## Development

- `make infra` - start postgres docker container
- `make develop` - start development server
- `make type-check` - run type checking
- `make lint-fix` - run linter
- `make format` - run prettier

## Database

- `make seed-database` - truncate all tables and seed database with initial data
- `make migration-create name=<migration-name>` - create new empty migration file
- `make migration-generate name=<migration-name>` - generate migration file based on the current schema diff
- `make migration-run` - run all pending migrations
- `make migration-revert` - revert last migration
- `make schema-drop` - drop all tables

```mermaid
classDiagram
  direction BT
  class attack {
    varchar name
    varchar type
    attack_category_enum category
    integer damage
    integer id
  }
  class evolution_requirement {
    integer amount
    varchar name
    integer pokemonId
    integer id
  }
  class pokemon {
    integer number
    varchar name
    varchar classification
    text types
    text resistant
    text weaknesses
    numrange weightRange
    numrange heightRange
    double precision fleeRate
    integer maxCP
    integer maxHP
    integer id
  }
  class pokemon_attacks_attack {
    integer pokemonId
    integer attackId
  }
  class pokemon_evolutions_pokemon {
    integer pokemonId_1
    integer pokemonId_2
  }
  class user {
    varchar email
    varchar password
    integer id
  }
  class user_favorite_pokemons_pokemon {
    integer userId
    integer pokemonId
  }

  evolution_requirement  -->  pokemon : pokemonId_id
  pokemon_attacks_attack  -->  attack : attackId_id
  pokemon_attacks_attack  -->  pokemon : pokemonId_id
  pokemon_evolutions_pokemon  -->  pokemon : pokemonId_2_id
  pokemon_evolutions_pokemon  -->  pokemon : pokemonId_1_id
  user_favorite_pokemons_pokemon  -->  pokemon : pokemonId_id
  user_favorite_pokemons_pokemon  -->  user : userId_id
```

## Testing

Most of the tests are E2E tests and require connection to the database.

- `make test` - run all tests
- `make coverage` - run test coverage
