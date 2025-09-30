import { Controller, Get } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('logging')
@Controller('logging')
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @ApiOperation({
    // description: 'Retrieves all available log records',
    summary: 'Retrieves all available log records',
  })
  @Get()
  getAllLogs() {
    return this.loggingService.getAllLogs();
  }
}
