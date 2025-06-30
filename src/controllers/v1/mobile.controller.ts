import {
  Body,
  Controller,
  Post,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ValidateMobileDto } from './dto/validate-mobile.dto';
import { ValidateMobileUsecase } from '../../usecase/validate-mobile.usecase';
import { MobileValidationDto } from './dto/mobile-validation.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

@Controller('/v1/mobile')
export class MobileController {
  private readonly logger: Logger;

  constructor(private readonly validateMobileUsecase: ValidateMobileUsecase) {
    this.logger = new Logger(MobileController.name);
  }

  @Post('/validate')
  @ApiCreatedResponse({
    description: 'The mobile has been validated.',
    type: ValidateMobileDto,
  })
  async validateEmail(
    @Headers('X-Onboarding-Id') onboardingId: string,
    @Body() validateMobileDto: ValidateMobileDto,
  ): Promise<MobileValidationDto> {
    if (!onboardingId) {
      this.logger.error('Missing required header: X-Onboarding-Id');
      throw new BadRequestException('Missing required header: X-Onboarding-Id');
    }
    const result = await this.validateMobileUsecase.exe(
      onboardingId,
      validateMobileDto.mobile,
    );
    const validatedEmail = result[0].getEmail();
    const validatedMobile = result[0].getMobile();
    const validatedOnboardingId = result[0].getOnboardingId();
    return new MobileValidationDto(
      validatedOnboardingId,
      validatedEmail,
      validatedMobile!,
    );
  }
}
