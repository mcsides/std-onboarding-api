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
