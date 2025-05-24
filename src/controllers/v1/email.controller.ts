import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { ValidateEmailUsecase } from '../../usecase/validate-email.usecase';
import { EmailValidationDto } from './dto/email-validation.dto';
import { EmailStatus } from 'src/usecase/email-status';
import { v4 as uuidv4 } from 'uuid';

@Controller('/v1/email')
export class EmailController {
  constructor(private readonly validateEmailUsecase: ValidateEmailUsecase) {}

  @Post('/validate')
  async getValidateEmail(
    @Body() validateEmailDto: ValidateEmailDto,
  ): Promise<EmailValidationDto> {
    const newObid = uuidv4();
    return this.validateEmailUsecase
      .exe(validateEmailDto.email, newObid)
      .then((statusTuple) => {
        const validatedEmail = statusTuple[0].getEmail();
        const onboardingId = statusTuple[0].getOnboardingId();
        const emailStatus = statusTuple[1];
        if (EmailStatus.ALREADY_TAKEN === emailStatus) {
          throw new ConflictException('email is already taken');
        } else {
          return new EmailValidationDto(onboardingId, validatedEmail);
        }
      });
  }
}
