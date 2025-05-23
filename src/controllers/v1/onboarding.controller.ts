import { Body, Controller, Post } from '@nestjs/common';
import { InitOnboardingUsecase } from '../../usecase/init-onboarding.usecase';
import { InitOnboardingDto } from './dto/init-onboarding.dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('/v1/onboarding')
export class OnboardingController {
  constructor(private readonly initOnboardingUsecase: InitOnboardingUsecase) {}

  @Post('/initiate')
  async postOnboarding(): Promise<InitOnboardingDto> {
    const newObid = uuidv4();
    return this.initOnboardingUsecase.exe(newObid).then((obCreated) => {
      return new InitOnboardingDto(
        obCreated.getOnboardingId(),
        obCreated.getState(),
      );
    });
  }
}
