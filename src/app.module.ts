import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './controllers/v1/email.controller';
import { ValidateEmailUsecase } from './usecase/validate-email.usecase';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProspectDocument,
  ProspectSchema,
} from './domain/repository/schema/prospect-document.schema';
import { ProspectRepository } from './domain/repository/prospect.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb://admin:admin@localhost:27017/onboarding-api-db?authSource=admin',
    ),
    MongooseModule.forFeature([
      { name: ProspectDocument.name, schema: ProspectSchema },
    ]),
  ],
  controllers: [EmailController],
  providers: [ValidateEmailUsecase, ProspectRepository],
})
export class AppModule {}
