import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggingService } from '../logging/logging.service';
import { Country } from './entities/country.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    private readonly loggingService: LoggingService,
  ) {}

  /** Logger instance scoped to LocationService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(LocationService.name);

  /** Handles common error logging and throwing for service methods. */
  private async handleError(error: string, errorMsg: string): Promise<void> {
    await this.loggingService.error(
      this.logger,
      'LocationService',
      error,
      errorMsg,
    );
    throw new InternalServerErrorException(error, errorMsg);
  }

  private async getOrCreateRecord(name: string): Promise<Country | undefined> {
    try {
      let result: Country | null = await this.countryRepo.findOneBy({ name });

      if (!result) {
        // Country record does not exist, create it
        const newRecord = this.countryRepo.create();
        result = await this.countryRepo.save(newRecord);
      }

      return result;
    } catch (err: any) {
      await this.handleError(
        `Failed to get or create country record for "${name}"`,
        err.message,
      );
    }
  }

  async getCountryFromIp(ip: string): Promise<Country | undefined> {
    try {
      console.log(ip);
      // TODO(RV): Add logic
      return;
    } catch (err: any) {
      await this.handleError(
        `Failed to get country from ip address ${ip}`,
        err.message,
      );
    }
  }
}
