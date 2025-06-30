import { Injectable } from '@nestjs/common';
import { MobileStatus } from 'src/domain/entity/mobile-status.enum';
import { Onboarding } from 'src/domain/entity/onboarding';
import { OnboardingRepository } from 'src/domain/repository/onboarding.repository';
import { Logger } from '@nestjs/common';
import { OnboardingStatus } from 'src/domain/entity/onboarding-status.enum';

@Injectable()
export class ValidateMobileUsecase {
  private readonly logger: Logger;

  constructor(private readonly onboardingRepository: OnboardingRepository) {
    this.logger = new Logger(ValidateMobileUsecase.name);
  }

  async exe(
    onboardingId: string,
    mobile: string,
  ): Promise<[Onboarding, MobileStatus]> {
    this.logger.log(
      `Starting to validate mobile - onboardingId ${onboardingId}, mobile ${mobile}`,
    );
    const onboardingFound = await this.onboardingRepository.findBy({
      mobile: mobile,
    });
    if (!onboardingFound) {
      this.logger.log(
        `Onboarding not found with mobile - onboardingId ${onboardingId}, mobile: ${mobile}`,
      );
      const onboardingConf = await this.onboardingRepository.findBy({
        onboardingId: onboardingId,
        status: OnboardingStatus.EMAIL_CONFIRMED,
      });
      if (!onboardingConf) {
        this.logger.error(
          `Onboarding with email confirmation not found - onboardingId: ${onboardingId}, mobile: ${mobile}`,
        );
        throw new Error(
          `Onboarding with email confirmation not found - onboardingId: ${onboardingId}, mobile: ${mobile}`,
        );
      } else {
        this.logger.log(
          `Onboarding with email confirmed - onboardingId: ${onboardingId}, mobile: ${mobile}`,
        );
        return [onboardingConf, MobileStatus.AVAILABLE];
      }
    } else {
      this.logger.log(
        `Onboarding found with mobile - onboardingId ${onboardingId}, mobile: ${mobile}`,
      );
      if (OnboardingStatus.EMAIL_CONFIRMED === onboardingFound.getStatus()) {
        this.logger.log(
          `Onboarding with email confirmed - onboardingId: ${onboardingId}, mobile: ${mobile}`,
        );
        return [onboardingFound, MobileStatus.AVAILABLE];
      } else {
        this.logger.error(`Mobile is already taken - mobile: ${mobile}`);
        throw new Error(`Mobile is already taken - mobile: ${mobile}`);
      }
    }
  }
}
