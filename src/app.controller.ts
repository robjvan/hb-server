import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('ping')
  ping(): HttpStatus {
    return HttpStatus.OK;
  }
}
