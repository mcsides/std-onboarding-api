import { Injectable } from '@nestjs/common';
import { MobileStatus } from 'src/domain/entity/mobile-status.enum';
import { Onboarding } from 'src/domain/entity/onboarding';
import { OnboardingRepository } from 'src/domain/repository/onboarding.repository';
import { OnboardingStatus } from 'src/domain/entity/onboarding-status.enum';
import { InjectPinoLogger } from 'nestjs-pino';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ValidateMobileUsecase {
  constructor(
    @InjectPinoLogger(OnboardingRepository.name)
    private readonly logger: PinoLogger,
    private readonly onboardingRepository: OnboardingRepository,
  ) {}

  async exe(
    onboardingId: string,
    mobile: string,
  ): Promise<[Onboarding, MobileStatus]> {
    this.logger.info({ onboardingId, mobile }, 'Start mobile validation');
    const onboardingFound =
      await this.onboardingRepository.findByMobile(mobile);
    if (!onboardingFound) {
      this.logger.info(
        { onboardingId, mobile },
        'Onboarding not found with mobile.',
      );
      const onboardingConf = await this.onboardingRepository.findByIdAndStatus(
        onboardingId,
        OnboardingStatus.EMAIL_CONFIRMED,
      );
      if (!onboardingConf) {
        this.logger.error(
          { onboardingId, mobile },
          'Onboarding with email confirmation not found',
        );
        throw new Error('Onboarding with email confirmation not found');
      } else {
        this.logger.info(
          { onboardingId, mobile },
          'Onboarding with email confirmed',
        );
        return [onboardingConf, MobileStatus.AVAILABLE];
      }
    } else {
      this.logger.info(
        { onboardingId, mobile },
        'Onboarding found with mobile',
      );
      if (OnboardingStatus.EMAIL_CONFIRMED === onboardingFound.getStatus()) {
        this.logger.info(
          { onboardingId, mobile },
          'Onboarding with email confirmed',
        );
        return [onboardingFound, MobileStatus.AVAILABLE];
      } else {
        this.logger.error({ onboardingId, mobile }, 'Mobile is already taken');
        throw new Error('Mobile is already taken');
      }
    }
  }
}
