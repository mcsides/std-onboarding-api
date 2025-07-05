import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  app.useLogger(app.get(Logger));

  const GLOBAL_PREFIX = 'onboarding-api';
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useGlobalPipes(new ValidationPipe());

  const SWAGGER_TITLE = 'Onboarding API Documentation';
  const SWAGGER_DOCS_PATH = 'onboarding-api/docs';
  const swaggerConfig = new DocumentBuilder().setTitle(SWAGGER_TITLE).build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(SWAGGER_DOCS_PATH, app, documentFactory);

  const port = configService.get<number>('PORT') || 'fail';
  await app.listen(port);
}

bootstrap();
