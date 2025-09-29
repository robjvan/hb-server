import { Controller, Get } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Controller('logging')
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @Get()
  getAllLogs() {
    return this.loggingService.getAllLogs();
  }
}
