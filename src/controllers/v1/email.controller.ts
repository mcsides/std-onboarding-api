import { Body, Controller, Post } from '@nestjs/common';
import { ValidateEmailDto } from './dto/validate-email.dto';

@Controller('/v1/email')
export class EmailController {
  constructor() {}

  @Post('/validate')
  postValidateEmail(@Body() validateEmailDto: ValidateEmailDto): string {
    return 'email ok!';
  }
}
