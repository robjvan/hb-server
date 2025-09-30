import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogRecord } from './entities/log-record.entity';
import { Repository } from 'typeorm';

/**
 * LoggingService
 *
 * Centralized service for recording structured logs. Integrates with both
 * NestJS's built-in Logger for console output and a persistent database
 * via the LogRecord entity.
 *
 * Responsibilities:
 * - Expose helper methods (`error`, etc.) for consistent logging across services
 * - Persist logs for later analysis/debugging
 * - Act as a single source of truth for error tracking
 */
@Injectable()
export class LoggingService {
  /** Logger instance scoped to LoggingService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(LoggingService.name);

  constructor(
    /** Repository for performing database operations on log records. */
    @InjectRepository(LogRecord)
    private readonly logRecordsRepo: Repository<LogRecord>,
  ) {}

  /**
   * Retrieves all log records from the database.
   * @returns {Promise<LogRecord[]>} A promise resolving to a list of log records.
   */
  async getAllLogs(): Promise<LogRecord[] | undefined> {
    try {
      return await this.logRecordsRepo.find();
    } catch (err: any) {
      this.logger.error(`Failed to retrieve log records`, err.message);
    }
  }

  /**
   * Logs an error to both console and persistent store.
   * @param {Logger} logger - Logger instance from the calling service.
   * @param {string} service - Name of the service where the error occurred.
   * @param {string} error - Short description of the error.
   * @param {string} errorMsg - Detailed error message or stack trace.
   */
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
