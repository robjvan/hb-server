import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggingService } from '../logging/logging.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as lookup from 'country-code-lookup';
import { Country } from './entities/country.entity';

/**
 * Service for resolving client IP addresses into country records.
 * Provides methods for looking up country information via external APIs
 * and ensuring persistence in the database.
 */
@Injectable()
export class LocationService {
  constructor(
    /** Repository for performing database operations on Location entities. */
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,

    /** Service for writing structured logs to a centralized store. */
    private readonly loggingService: LoggingService,

    /** Service for making HTTP requests to external APIs (e.g., IP → country lookup). */
    private readonly httpService: HttpService,
  ) {}

  /** Logger instance scoped to LocationService for structured logging. */
  private logger: Logger = new Logger(LocationService.name);

  /** Handles error logging and consistent exception throwing.
   * @param {string} error - High-level description of the failure.
   * @param {string} errorMsg - Detailed error message for debugging.
   * @throws {InternalServerErrorException}
   */
  private async handleError(error: string, errorMsg: string): Promise<void> {
    await this.loggingService.error(
      this.logger,
      'LocationService',
      error,
      errorMsg,
    );
    throw new InternalServerErrorException(error, errorMsg);
  }

  /** Retrieves an existing country record by name or creates a new one.
   * @param {string} name - Full country name.
   * @param {string} abbr - ISO country code abbreviation.
   * @returns {Country} The existing or newly created Country entity.
   */
  private async getOrCreateRecord(
    name: string,
    abbr?: string,
  ): Promise<Country | undefined> {
    try {
      let result: Country | null = await this.countryRepo.findOneBy({ name });

      if (!result) {
        // Country record does not exist, create it
        const newRecord = this.countryRepo.create({ name, abbr });
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

  /** Resolves a user's IP address to a Country record.
   * - Uses `api.country.is` to resolve IP → ISO country code.
   * - Uses `country-code-lookup` to resolve ISO → country name.
   * - Persists the record in the database if missing.
   *
   * @param {string} ip - The client IP address. If `::1` (localhost), a fallback IP is used for testing.
   * @returns {Country | undefined} The resolved Country entity, or undefined if lookup fails.
   */
  async getCountryFromIp(ip: string | undefined): Promise<Country | undefined> {
    try {
      if (ip) {
        // Handle localhost requests by substituting a test IP
        if (ip === '::1') {
          ip = '174.118.179.69'; // Replace with configurable fallback if needed
        }

        // Fetch ISO country code from external API
        const res = await firstValueFrom(
          this.httpService.get<{ country: string }>(
            `https://api.country.is/${ip}`,
          ),
        );
        const countryCode = res.data.country;

        // Resolve country name from ISO code
        const countryRes = lookup.byIso(countryCode);
        if (!countryRes) {
          throw new InternalServerErrorException(
            `Invalid country code returned: ${countryCode}`,
          );
        }

        // Get or create persistent Country record
        return await this.getOrCreateRecord(countryRes.country, countryCode);
      }
    } catch (err: any) {
      await this.handleError(
        `Failed to get country from IP address "${ip}"`,
        err.message,
      );
    }
  }
}
