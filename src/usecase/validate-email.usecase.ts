import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { EmailStatus } from './email-status';
import { OnboardingRepository } from '../domain/repository/onboarding.repository';
import { OnboardingState } from '../domain/entity/onboarding-state.enum';
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
      .findByEmail(email)
      .then((onboardingFound) => {
        this.logger.log(onboardingFound);
        if (onboardingFound) {
          if (onboardingFound.getStatus() === OnboardingState.INITIATED) {
            return [onboardingFound, EmailStatus.AVAILABLE];
          } else {
            this.logger.error(`The email is already taken: ${email}`);
            return [onboardingFound, EmailStatus.ALREADY_TAKEN];
          }
        } else {
          const obToCreate = Onboarding.builder()
            .setOnboardingId(onboardingId)
            .setStatus(OnboardingState.INITIATED)
            .setEmail(email)
            .build();

          return this.onboardingRepository
            .createOnboarding(obToCreate)
            .then((onboardingCreated) => {
              return [onboardingCreated, EmailStatus.AVAILABLE];
            });
        }
      });
  }
}
