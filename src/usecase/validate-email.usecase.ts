import { Injectable } from '@nestjs/common';
import { EmailDto } from 'src/controllers/v1/dto/email.dto';
import { Logger } from '@nestjs/common';
import { EmailRepository } from 'src/domain/repository/email.repository';
import e from 'express';

@Injectable()
export class ValidateEmailUsecase {
  private readonly logger: Logger;

  constructor(private readonly emailRepository: EmailRepository) {
    this.logger = new Logger(ValidateEmailUsecase.name);
  }

  exe(email: string): EmailDto {
    this.logger.log(`email to validate: ${email}`);
    this.emailRepository.findByEmail(email).then((result) => {
      this.logger.log(`the result; ${result}`);
    });
    return { id: '1234123hkjh234', email: email };
  }
}
