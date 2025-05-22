import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ProspectRepository } from 'src/domain/repository/prospect.repository';
import { EmailStatus } from './email-status';

@Injectable()
export class ValidateEmailUsecase {
  private readonly logger: Logger;
  constructor(private readonly prospectRepository: ProspectRepository) {
    this.logger = new Logger(ValidateEmailUsecase.name);
  }

  async exe(email: string): Promise<[string, EmailStatus]> {
    this.logger.log(`Starting to validate the email: ${email}`);
    return this.prospectRepository.findByEmail(email).then((prospectFound) => {
      this.logger.log(prospectFound);
      if (prospectFound) {
        this.logger.error(`The email is already taken: ${email}`);
        return [email, EmailStatus.ALREADY_TAKEN];
      } else {
        return [email, EmailStatus.AVAILABLE];
      }
    });
  }
}
