import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogRecord } from './entities/log-record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LoggingService {
  /** Logger instance scoped to LoggingService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(LoggingService.name);

  constructor(
    @InjectRepository(LogRecord)
    private readonly logRecordsRepo: Repository<LogRecord>,
  ) {}

  async getAllLogs(): Promise<LogRecord[] | undefined> {
    try {
      return await this.logRecordsRepo.find();
    } catch (err: any) {
      this.logger.error(`Failed to retrieve log records`, err.message);
    }
  }

  async error(
    logger: Logger,
    service: string,
    error: string,
    errorMsg: string,
  ): Promise<void> {
    try {
      logger.error(error, errorMsg);
      const newRecord = this.logRecordsRepo.create({
        service,
        error,
        errorMsg,
      });
      await this.logRecordsRepo.save(newRecord);
    } catch (err: any) {
      this.logger.error(`Failed to create error record`, err.message);
    }
  }
}
