import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const GLOBAL_PREFIX = 'onboarding-api';
  const SWAGGER_TITLE = 'Onboarding API Documentation';
  const SWAGGER_DOCS_PATH = 'onboarding-api/docs';
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useGlobalPipes(new ValidationPipe());
  const swaggerConfig = new DocumentBuilder().setTitle(SWAGGER_TITLE).build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(SWAGGER_DOCS_PATH, app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
