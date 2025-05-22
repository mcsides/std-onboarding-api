import { Body, ConflictException, Controller, Get } from '@nestjs/common';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { ValidateEmailUsecase } from '../../usecase/validate-email.usecase';
import { EmailValidationDto } from './dto/email-validation.dto';
import { EmailStatus } from 'src/usecase/email-status';

@Controller('/v1/email')
export class EmailController {
  constructor(private readonly validateEmailUsecase: ValidateEmailUsecase) {}

  @Get('/validate')
  async getValidateEmail(
    @Body() validateEmailDto: ValidateEmailDto,
  ): Promise<EmailValidationDto> {
    return this.validateEmailUsecase
      .exe(validateEmailDto.email)
      .then((statusTuple) => {
        if (EmailStatus.ALREADY_TAKEN === statusTuple[1]) {
          throw new ConflictException('email is already taken');
        } else {
          return new EmailValidationDto(validateEmailDto.email);
        }
      });
  }
}
