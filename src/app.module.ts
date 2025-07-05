import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './controllers/v1/email.controller';
import { OtpController } from './controllers/v1/otp.controller';
import { MobileController } from './controllers/v1/mobile.controller';
import { ValidateEmailUsecase } from './usecase/validate-email.usecase';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OnboardingDocument,
  OnboardingSchema,
} from './domain/repository/schema/onboarding-document.schema';
import { OnboardingRepository } from './domain/repository/onboarding.repository';
import { SendOtpUsecase } from './usecase/send-otp.usecase';
import { ConfirmOtpUsecase } from './usecase/confirm-otp-usecase';
import { ValidateMobileUsecase } from './usecase/validate-mobile.usecase';
import { LoggerModule } from 'nestjs-pino';
import getPinoConfig from './config/pino/pino.config';
import { DynamoModule } from './config/dynamo/dynamo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),
    MongooseModule.forRoot(
      'mongodb://admin:admin@localhost:27017/onboarding-api-db?authSource=admin',
    ),
    MongooseModule.forFeature([
      { name: OnboardingDocument.name, schema: OnboardingSchema },
    ]),
    LoggerModule.forRootAsync({
      useFactory: async () => getPinoConfig(),
    }),
    DynamoModule.forRoot({
      region: process.env.DYNAMODB_REGION ?? '',
      endpoint: process.env.DYNAMODB_ENDPOINT ?? '',
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY ?? '',
    }),
  ],
  controllers: [EmailController, OtpController, MobileController],
  providers: [
    ValidateEmailUsecase,
    OnboardingRepository,
    SendOtpUsecase,
    ConfirmOtpUsecase,
    ValidateMobileUsecase,
  ],
})
export class AppModule {}
