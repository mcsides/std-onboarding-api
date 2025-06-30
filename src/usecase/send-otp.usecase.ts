import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { OnboardingRepository } from '../domain/repository/onboarding.repository';
import { OnboardingStatus } from 'src/domain/entity/onboarding-status.enum';
import { InjectPinoLogger } from 'nestjs-pino';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class SendOtpUsecase {
  constructor(
    @InjectPinoLogger(OnboardingRepository.name)
    private readonly logger: PinoLogger,
    private readonly onboardingRepository: OnboardingRepository,
  ) {}

  async exe(email: string, onboardingId: string): Promise<string> {
    this.logger.info(
      { onboardingId, email },
      'Start to send the otp to email.',
    );
    const onboardingFound =
      await this.onboardingRepository.findByIdAndEmailAndStatus(
        onboardingId,
        email,
        OnboardingStatus.INITIATED,
      );
    if (!onboardingFound) {
      this.logger.error(
        { onboardingId, email },
        'Cannot send OTP, the email was not found.',
      );
      throw new Error('Cannot send OTP, the email was not found.');
    } else {
      const otp = authenticator.generate(onboardingFound.getOnboardingId());
      this.logger.info({ onboardingId, email }, `OTP generated ${otp}`);
      // TODO Here you would typically send the OTP via email or SMS
      // For example, using a mail service or SMS gateway
      // await this.mailService.sendOtp(email, otp);
      // or
      // await this.smsService.sendOtp(mobile, otp);
      this.logger.info({ onboardingId, email }, 'OTP sent to email');
      return otp; // Return the OTP for further processing if needed
    }
  }
}
