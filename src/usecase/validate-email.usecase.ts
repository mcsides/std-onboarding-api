import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { EmailStatus } from '../domain/entity/email-status.enum';
import { OnboardingRepository } from '../domain/repository/onboarding.repository';
import { OnboardingStatus } from '../domain/entity/onboarding-status.enum';
import { Onboarding } from '../domain/entity/onboarding';

@Injectable()
export class ValidateEmailUsecase {
  private readonly logger: Logger;
  constructor(private readonly onboardingRepository: OnboardingRepository) {
    this.logger = new Logger(ValidateEmailUsecase.name);
  }

  async exe(
    email: string,
    onboardingId: string,
  ): Promise<[Onboarding, EmailStatus]> {
    this.logger.log(`Starting to validate the email: ${email}`);
    return this.onboardingRepository
      .findBy({'email': email})
      .then((onboardingFound) => {
        this.logger.log(`Onboarding found for email: ${email}`);
        if (onboardingFound) {
          if (OnboardingStatus.INITIATED === onboardingFound.getStatus()) {
            this.logger.log(`Onboarding is available for email: ${email}`);
            return [onboardingFound, EmailStatus.AVAILABLE];
          } else {
            this.logger.warn(`The email is already taken: ${email}`);
            return [onboardingFound, EmailStatus.ALREADY_TAKEN];
          }
        } else {
          const obToCreate = Onboarding.builder()
            .setOnboardingId(onboardingId)
            .setStatus(OnboardingStatus.INITIATED)
            .setEmail(email)
            .build();
          return this.onboardingRepository
            .createOnboarding(obToCreate)
            .then((onboardingCreated) => {
              this.logger.log(`Onboarding created for email: ${email}`);
              return [onboardingCreated, EmailStatus.AVAILABLE];
            });
        }
      });
  }
}
