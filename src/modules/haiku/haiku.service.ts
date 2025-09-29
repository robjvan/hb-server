import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import express from 'express';
import { Haiku } from 'src/modules/haiku/entities/haiku.entity';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class HaikuService {
  constructor(
    @InjectRepository(Haiku)
    private readonly haikuRepo: Repository<Haiku>,
    private readonly loggingService: LoggingService,
  ) {}

  /** Logger instance scoped to HaikuService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(HaikuService.name);

  /** Handles common error logging and throwing for service methods. */
  private async handleError(error: string, errorMsg: string): Promise<void> {
    await this.loggingService.error(
      this.logger,
      'HaikuService',
      error,
      errorMsg,
    );
    throw new InternalServerErrorException(error, errorMsg);
  }

  /** Creates a new Haiku record from the given input term.
   * @param {string} input - Input term used to generate new Haiku.
   * @param {express.Request} req - The original request object.
   * @returns {Promise<Haiku>} The newly created Haiku record.
   */
  async generateHaiku(
    req: express.Request,
    input: string,
  ): Promise<Haiku | undefined> {
    try {
      console.log(req, input);
      // TODO(RV): Add logic
      // Reach out to OpenAI to generate the haiku
      // Use LocationService to determine country from IP
      // Create haiku record with locationId
      return;
    } catch (err: any) {
      await this.handleError(`Failed to generate new haiku`, err.message);
    }
  }

  /** Retrieves a list of Haiku records related to the given input term.
   * @param {string} input - Search term to find Haikus releated to.
   * @returns {Promise<Haiku[]>} A promise resolving to a list of retrieved records.
   */
  async getRandomHaiku(input?: string): Promise<Haiku | undefined> {
    try {
      let records: Haiku[] = [];

      if (input) {
        records = await this.haikuRepo.find({ where: { input } });
      } else {
        records = await this.haikuRepo.find();
      }

      const randomIndex = Math.round(Math.random() * records.length);

      return records.at(randomIndex);
    } catch (err: any) {
      await this.handleError(`Failed to get random haiku`, err.message);
    }
  }

  /** Retrieves all available Haiku records.
   * @returns {Promimse<Haiku[]>} A promise resolving to a list of retrieved records.
   */
  async getAllHaikus(): Promise<Haiku[] | undefined> {
    try {
      return await this.haikuRepo.find();
    } catch (err: any) {
      await this.handleError(`Failed to get Haiku records`, err.message);
    }
  }

  /** Retrieves a single Haiku record by ID.
   * @param {number} id - ID of the Haiku record to retrieve.
   * @returns {Promise<Haiku>} A promise resolving to the found record.
   */
  async getHaikuById(id: number): Promise<Haiku | undefined> {
    try {
      const result = await this.haikuRepo.findOneBy({ id });

      if (!result) {
        throw new NotFoundException(
          `Failed to fetch Haiku record with id ${id}`,
        );
      }

      return result;
    } catch (err: any) {
      await this.handleError(
        `Failed to fetch Haiku record with id ${id}`,
        err.message,
      );
    }
  }
}
