import {
  Body,
  Headers,
  Controller,
  Post,
  BadRequestException,
  PreconditionFailedException,
  Logger,
} from '@nestjs/common';
import { SendOtpUsecase } from '../../usecase/send-otp.usecase';
import { ValidateEmailDto } from './dto/validate-email.dto';

@Controller('/v1/otp')
export class OtpController {
  private readonly logger: Logger;
  constructor(private readonly sendOtplUsecase: SendOtpUsecase) {
    this.logger = new Logger(OtpController.name);
  }

  @Post('/send')
  async sendOtp(
    @Headers('X-Onboarding-Id') onboardingId: string,
    @Body() validateEmailDto: ValidateEmailDto,
  ): Promise<void> {
    if (!onboardingId) {
      this.logger.error('Missing required header: X-Onboarding-Id');
      throw new BadRequestException('Missing required header: X-Onboarding-Id');
    }
    try {
      this.logger.log(
        `Sending OTP for email: ${validateEmailDto.email} with onboardingId: ${onboardingId}`,
      );
      await this.sendOtplUsecase.exe(validateEmailDto.email, onboardingId);
    } catch (error) {
      this.logger.error(
        `Failed to send OTP for email: ${validateEmailDto.email} with onboardingId: ${onboardingId}`,
        error,
      );
      throw new PreconditionFailedException('Failed to send OTP');
    }
  }
}
