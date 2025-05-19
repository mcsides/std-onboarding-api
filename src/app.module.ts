import { Module } from '@nestjs/common';
import { EmailController } from './controllers/v1/email.controller';

@Module({
  imports: [],
  controllers: [EmailController],
  providers: [],
})
export class AppModule {}
