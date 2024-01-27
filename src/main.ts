import { Logger, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { useContainer } from 'class-validator'
import { AppModule } from 'src/app.module'
import { appConfig, AppConfigType } from 'src/config/app.config'

import 'src/modules/database/seeds/run-seed'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true }
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  const appConfigValues = app.get<AppConfigType>(appConfig.KEY)

  app.enableShutdownHooks()
  app.setGlobalPrefix(appConfigValues.apiPrefix, {
    exclude: ['/'],
  })
  app.enableVersioning({
    type: VersioningType.URI,
  })

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription(`${appConfigValues.name} Docs`)
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('docs', app, document)

  await app.listen(appConfigValues.port)

  Logger.log(
    `\x1b[34m Running on: http://localhost:${appConfigValues.port} \x1b[34m`,
    'NestApplication'
  )
  Logger.log(
    `\x1b[34m 📚Docs running on: http://localhost:${appConfigValues.port}/docs \x1b[34m`,
    'NestApplication'
  )
}

void bootstrap()
