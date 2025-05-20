import { Module } from '@nestjs/common';
import { EmailController } from './controllers/v1/email.controller';
import { ValidateEmailUsecase } from './usecase/validate-email.usecase';

@Module({
  imports: [],
  controllers: [EmailController],
  providers: [ValidateEmailUsecase],
})
export class AppModule {}
