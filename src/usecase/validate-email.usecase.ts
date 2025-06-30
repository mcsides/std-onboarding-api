import { Injectable } from '@nestjs/common';
import { EmailStatus } from '../domain/entity/email-status.enum';
import { OnboardingRepository } from '../domain/repository/onboarding.repository';
import { OnboardingStatus } from '../domain/entity/onboarding-status.enum';
import { Onboarding } from '../domain/entity/onboarding';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class ValidateEmailUsecase {
  constructor(
    @InjectPinoLogger(ValidateEmailUsecase.name)
    private readonly logger: PinoLogger,
    private readonly onboardingRepository: OnboardingRepository,
  ) {}

  async exe(
    email: string,
    onboardingId: string,
  ): Promise<[Onboarding, EmailStatus]> {
    this.logger.info({ onboardingId, email }, 'Start email validation');
    return this.onboardingRepository
      .findByIdAndEmail(onboardingId, email)
      .then((onboardingFound) => {
        if (!onboardingFound) {
          this.logger.info(
            { onboardingId, email },
            'Onboarding not found for email. Proceeding to create a new onboarding.',
          );
          const obToCreate = Onboarding.builder()
            .setOnboardingId(onboardingId)
            .setStatus(OnboardingStatus.INITIATED)
            .setEmail(email)
            .build();
          return this.onboardingRepository
            .createOnboarding(obToCreate)
            .then((onboardingCreated) => {
              this.logger.info('Onboarding created successfully.', {
                onboardingId,
                email,
              });
              return [onboardingCreated, EmailStatus.AVAILABLE];
            });
        } else {
          if (OnboardingStatus.INITIATED === onboardingFound.getStatus()) {
            this.logger.info(
              { onboardingId, email },
              'Onboarding found with status INITIATED. Proceeding with onboarding.',
            );
            return [onboardingFound, EmailStatus.AVAILABLE];
          } else {
            this.logger.warn(
              { onboardingId, email, status: onboardingFound.getStatus() },
              'Onboarding found with status different than INITIATED. Email already taken.',
            );
            return [onboardingFound, EmailStatus.ALREADY_TAKEN];
          }
        }
      });
  }
}
