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
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { ConfirmOtpUsecase } from '../../usecase/confirm-otp-usecase';
import { ApiNoContentResponse } from '@nestjs/swagger';

@Controller('/v1/otp')
export class OtpController {
  private readonly logger: Logger;
  constructor(
    private readonly sendOtplUsecase: SendOtpUsecase,
    private readonly confirmOtpUsecase: ConfirmOtpUsecase,
  ) {
    this.logger = new Logger(OtpController.name);
  }

  @Post('/send')
  @ApiNoContentResponse({
    description: 'The otp has been sent for email confirmation.'
  })
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

  @Post('/confirm')
  @ApiNoContentResponse({
    description: 'The otp has been confirmed.'
  })
  async validateOtp(
    @Headers('X-Onboarding-Id') onboardingId: string,
    @Body() validateOtpDto: ValidateOtpDto,
  ): Promise<void> {
    if (!onboardingId) {
      this.logger.error('Missing required header: X-Onboarding-Id');
      throw new BadRequestException('Missing required header: X-Onboarding-Id');
    }
    const result = await this.confirmOtpUsecase.exe(
      validateOtpDto.email,
      validateOtpDto.otp,
      onboardingId,
    );
    if (!result) {
      this.logger.error(
        `Invalid OTP for email: ${validateOtpDto.email} with onboardingId: ${onboardingId}`,
      );
      throw new PreconditionFailedException('Invalid OTP');
    } else {
      this.logger.log(
        `OTP validated successfully for email: ${validateOtpDto.email} with onboardingId: ${onboardingId}`,
      );
    }
  }
}
