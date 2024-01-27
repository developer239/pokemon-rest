/* eslint-disable @typescript-eslint/no-misused-promises, no-async-promise-executor */
import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DataSource } from 'typeorm'
import { SeedModule as ModuleWithDataSource } from 'src/modules/database/seeds/seeed.module'

export const AppDataSource: Promise<DataSource> = new Promise(
  async (resolve) => {
    const app = await NestFactory.create<NestFastifyApplication>(
      ModuleWithDataSource,
      new FastifyAdapter()
    )
    const dataSource = app.get(DataSource)
    await app.close()

    resolve(dataSource)
  }
)
