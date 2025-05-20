import { Body, Controller, Post } from '@nestjs/common';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { ValidateEmailUsecase } from '../../usecase/validate-email.usecase';
import { EmailDto } from './dto/email.dto';

@Controller('/v1/email')
export class EmailController {
  constructor(private readonly validateEmailUsecase: ValidateEmailUsecase) {}

  @Post('/validate')
  postValidateEmail(@Body() validateEmailDto: ValidateEmailDto): EmailDto {
    return this.validateEmailUsecase.exe(validateEmailDto.email);
  }
}
