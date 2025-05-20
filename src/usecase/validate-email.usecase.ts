import { Injectable } from '@nestjs/common';
import { EmailDto } from 'src/controllers/v1/dto/email.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class ValidateEmailUsecase {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(ValidateEmailUsecase.name);
  }

  exe(email: string): EmailDto {
    this.logger.log(`email to validate: ${email}`);
    return { id: '1234123hkjh234', email: email };
  }
}
