import { Logger } from '@nestjs/common';
import { OnboardingRepository } from '../domain/repository/onboarding.repository';
import { OnboardingStatus } from 'src/domain/entity/onboarding-status.enum';
import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

@Injectable()
export class ValidateOtpUsecase {
  private readonly logger: Logger;

  constructor(private readonly onboardingRepository: OnboardingRepository) {
    this.logger = new Logger(ValidateOtpUsecase.name);
  }

  async exe(
    email: string,
    otp: string,
    onboardingId: string,
  ): Promise<boolean> {
    this.logger.log(
      `Validating OTP for email: ${email} with onboardingId: ${onboardingId}`,
    );
    const onboardingFound = await this.onboardingRepository.findBy({
      email: email,
      onboardingId: onboardingId,
    });
    if (!onboardingFound) {
      this.logger.error(
        `No onboarding found for email: ${email} with onboardingId: ${onboardingId}`,
      );
      throw new Error('Onboarding not found');
    } else {
      this.logger.log(
        `Onboarding found for email: ${email} with onboardingId: ${onboardingId}`,
      );
      if (onboardingFound.getStatus() !== OnboardingStatus.INITIATED) {
        this.logger.error(
          `Onboarding not available. email: ${email}, onboardingId: ${onboardingId}, status: ${onboardingFound.getStatus()}`,
        );
        throw new Error(
          `Onboarding not available. email: ${email} onboardingId: ${onboardingId}, status: ${onboardingFound.getStatus()}`,
        );
      } else {
        this.logger.log(`Validating OTP: ${otp} for email: ${email}`);
        let isValidOtp = false;
        isValidOtp = authenticator.check(otp, onboardingId);
        this.logger.log(
          `Validating OTP: ${otp} for email: ${email}, is valid: ${isValidOtp}`,
        );
        return isValidOtp;
      }
    }
  }
}
