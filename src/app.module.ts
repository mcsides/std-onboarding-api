import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './controllers/v1/email.controller';
import { OtpController } from './controllers/v1/otp.controller';
import { ValidateEmailUsecase } from './usecase/validate-email.usecase';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OnboardingDocument,
  OnboardingSchema,
} from './domain/repository/schema/onboarding-document.schema';
import { OnboardingRepository } from './domain/repository/onboarding.repository';
import { SendOtpUsecase } from './usecase/send-otp.usecase';
import { ValidateOtpUsecase } from './usecase/validate-otp-usecase';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb://admin:admin@localhost:27017/onboarding-api-db?authSource=admin',
    ),
    MongooseModule.forFeature([
      { name: OnboardingDocument.name, schema: OnboardingSchema },
    ]),
  ],
  controllers: [EmailController, OtpController],
  providers: [ValidateEmailUsecase, OnboardingRepository, SendOtpUsecase, ValidateOtpUsecase],
})
export class AppModule {}
