import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './controllers/v1/email.controller';
import { ValidateEmailUsecase } from './usecase/validate-email.usecase';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from './domain/repository/schema/email.schema';
import { EmailRepository } from './domain/repository/email.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb://admin:admin@localhost:27017/onboarding-api-db?authSource=admin',
    ),
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
  ],
  controllers: [EmailController],
  providers: [ValidateEmailUsecase, EmailRepository],
})
export class AppModule {}
