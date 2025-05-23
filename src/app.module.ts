import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './controllers/v1/email.controller';
import { OnboardingController } from './controllers/v1/onboarding.controller';
import { ValidateEmailUsecase } from './usecase/validate-email.usecase';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProspectDocument,
  ProspectSchema,
} from './domain/repository/schema/prospect-document.schema';
import { ProspectRepository } from './domain/repository/prospect.repository';
import { InitOnboardingUsecase } from './usecase/init-onboarding.usecase';
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
      { name: ProspectDocument.name, schema: ProspectSchema },
      { name: OnboardingDocument.name, schema: OnboardingSchema },
    ]),
  ],
  controllers: [EmailController, OnboardingController],
  providers: [
    ValidateEmailUsecase,
    InitOnboardingUsecase,
    ProspectRepository,
    OnboardingRepository,
  ],
})
export class AppModule {}
