import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { appConfig } from 'src/config/app.config'
import { authConfig } from 'src/config/auth.config'
import { databaseConfig } from 'src/config/database.config'
import { AuthSeedModule } from 'src/modules/database/seeds/auth/auth-seed.module'
import { PokemonSeedModule } from 'src/modules/database/seeds/pokemon/pokemon-seed.module'
import { TypeOrmConfigService } from 'src/modules/database/typeorm-config.service'

@Module({
  imports: [
    PokemonSeedModule,
    AuthSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, authConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('No options provided to TypeOrmModule.forRootAsync')
        }

        return new DataSource(options).initialize()
      },
    }),
  ],
})
export class SeedModule {}
