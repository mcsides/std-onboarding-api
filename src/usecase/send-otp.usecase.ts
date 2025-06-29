import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { authenticator } from 'otplib';
import { OnboardingRepository } from '../domain/repository/onboarding.repository';
import { OnboardingStatus } from 'src/domain/entity/onboarding-status.enum';

@Injectable()
export class SendOtpUsecase {
  private readonly logger: Logger;
  constructor(private readonly onboardingRepository: OnboardingRepository) {
    this.logger = new Logger(SendOtpUsecase.name);
  }

  async exe(email: string, onboardingId: string): Promise<string> {
    this.logger.log(`Starting to send the otp to: ${email}`);
    const onboardingFound = await this.onboardingRepository.findBy({
      onboardingId: onboardingId,
      email: email,
    });
    if (!onboardingFound) {
      this.logger.error(
        `Onboarding not found for email: ${email} and onboardingId: ${onboardingId}`,
      );
      throw new Error(
        `Onboarding not found for email: ${email} and onboardingId: ${onboardingId}`,
      );
    } else {
      this.logger.log(
        `Onboarding found for email: ${email} and onboardingId: ${onboardingId}`,
      );
      if (onboardingFound.getStatus() !== OnboardingStatus.INITIATED) {
        this.logger.error(
          `Onboarding not available. email: ${email}, onboardingId: ${onboardingId}, status: ${onboardingFound.getStatus()}`,
        );
        throw new Error(
          `Onboarding not available. email: ${email} onboardingId: ${onboardingId}, status: ${onboardingFound.getStatus()}`,
        );
      } else {
        this.logger.log(`Generating OTP for email: ${email}`);
        const otp = authenticator.generate(onboardingFound.getOnboardingId());
        this.logger.log(`OTP generated for email: ${email} is ${otp}`);
        // TODO Here you would typically send the OTP via email or SMS
        // For example, using a mail service or SMS gateway
        // await this.mailService.sendOtp(email, otp);
        // or
        // await this.smsService.sendOtp(mobile, otp);
        this.logger.log(`OTP sent to email: ${email}`);
        return otp; // Return the OTP for further processing if needed
      }
    }
  }
}
