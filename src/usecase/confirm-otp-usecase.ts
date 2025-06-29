import { Logger } from '@nestjs/common';
import { OnboardingRepository } from '../domain/repository/onboarding.repository';
import { OnboardingStatus } from 'src/domain/entity/onboarding-status.enum';
import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

@Injectable()
export class ConfirmOtpUsecase {
  private readonly logger: Logger;

  constructor(private readonly onboardingRepository: OnboardingRepository) {
    this.logger = new Logger(ConfirmOtpUsecase.name);
  }

  async exe(
    email: string,
    otp: string,
    onboardingId: string,
  ): Promise<boolean> {
    this.logger.log(
      `Confirm OTP - email: ${email}, onboardingId: ${onboardingId}, otp: ${otp}`,
    );
    const onboardingFound = await this.onboardingRepository.findBy({
      email: email,
      onboardingId: onboardingId,
    });
    if (!onboardingFound) {
      this.logger.error(
        `No onboarding found for email: ${email} - onboardingId: ${onboardingId}`,
      );
      throw new Error('Onboarding not found');
    } else {
      this.logger.log(
        `Onboarding found for email: ${email} - onboardingId: ${onboardingId}`,
      );
      if (onboardingFound.getStatus() !== OnboardingStatus.INITIATED) {
        this.logger.error(
          `Onboarding not available for email: ${email} - onboardingId: ${onboardingId}, status: ${onboardingFound.getStatus()}`,
        );
        throw new Error(
          `Onboarding not available for email: ${email} - onboardingId: ${onboardingId}, status: ${onboardingFound.getStatus()}`,
        );
      } else {
        let isValidOtp = false;
        if (otp === '000000') {
          this.logger.warn(
            `Using OTP fallback for email: ${email} - onboardingId: ${onboardingId}`,
          );
          isValidOtp = true; // Fallback for testing purposes
          const onboardingUpd = await this.onboardingRepository.patch(
            onboardingId,
            OnboardingStatus.EMAIL_CONFIRMED,
          );
          this.logger.log(
            `Email sucessfully confirmed - otp: ${otp}, email: ${onboardingUpd.getEmail()}`,
          );
        } else {
          isValidOtp = authenticator.check(otp, onboardingId);
          const onboardingUpd = await this.onboardingRepository.patch(
            onboardingId,
            OnboardingStatus.EMAIL_CONFIRMED,
          );
          this.logger.log(
            `Email sucessfully confirmed - otp: ${otp}, email: ${onboardingUpd.getEmail()}`,
          );
        }
        return isValidOtp;
      }
    }
  }
}
