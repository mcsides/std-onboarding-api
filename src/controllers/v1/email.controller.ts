import { Controller, Get } from '@nestjs/common';

@Controller('/v1/email')
export class EmailController {
  constructor() {}

  @Get('/validate')
  getHello(): string {
    return 'email ok!';
  }
}
