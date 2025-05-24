import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './controllers/v1/email.controller';
import { ValidateEmailUsecase } from './usecase/validate-email.usecase';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OnboardingDocument,
  OnboardingSchema,
} from './domain/repository/schema/onboarding-document.schema';
import { OnboardingRepository } from './domain/repository/onboarding.repository';

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
  controllers: [EmailController],
  providers: [ValidateEmailUsecase, OnboardingRepository],
})
export class AppModule {}
