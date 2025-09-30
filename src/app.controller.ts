import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get('ping')
  ping(): HttpStatus {
    return HttpStatus.OK;
  }
}
