import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { Haiku } from 'src/modules/haiku/entities/haiku.entity';
import { LoggingService } from '../logging/logging.service';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import { CHAT_MODEL } from 'src/constants';
import { haikuTemplate } from './haiku.template';
import { LocationService } from '../location/location.service';

dotenv.config();

/** Service responsible for managing Haiku records.
 * Handles generation via OpenAI, persistence using TypeORM,
 * and retrieval of haikus by theme, randomness, or ID.
 * Centralizes error handling and logging for maintainability.
 */
@Injectable()
export class HaikuService {
  constructor(
    /** Repository for performing database operations on Haiku entities. */
    @InjectRepository(Haiku)
    private readonly haikuRepo: Repository<Haiku>,

    /** Service for writing structured logs to a centralized store. */
    private readonly loggingService: LoggingService,

    /** Service for resolving client IP addresses into country information. */
    private readonly locationService: LocationService,
  ) {}

  /** OpenAI client used to generate Haiku text completions. */
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  /** Logger instance scoped to HaikuService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(HaikuService.name);

  /** Handles standardized error logging and rethrowing.
   * Ensures all service-level exceptions are captured with context.
   * @param {string} error - A descriptive label for where the error occurred.
   * @param {string} errorMsg - The underlying error message or stack trace.
   * @throws {InternalServerErrorException} Always rethrows after logging.
   */
  private async handleError(error: string, errorMsg: string): Promise<void> {
    await this.loggingService.error(
      this.logger,
      'HaikuService',
      error,
      errorMsg,
    );
    throw new InternalServerErrorException(error, errorMsg);
  }

  /** Creates a new Haiku record by requesting OpenAI to generate one.
   * Associates the haiku with the originating request’s country.
   * @param {express.Request} req - The original request object, used for IP lookup.
   * @param {string} [theme] - Optional theme to guide the generated haiku.
   * @returns {Promise<Haiku | undefined>} The newly created Haiku record, or undefined if generation failed.
   */
  async generateHaiku(req: any, theme?: string): Promise<Haiku | undefined> {
    try {
      let content: string;

      if (theme) {
        content = `Generate an original traditionally-formatted 3-line 5-7-5 Haiku with the theme of ${theme}.  Do NOT use the template data or re-use previously generated poems as a generated poem, but ALWAYS return the poem in the given format from the template without a trailing comma.`;
      } else {
        content =
          'Generate a traditionally-formatted 3-line 5-7-5 Haiku with a pleasant zen theme.   Do NOT use the template data or re-use previously generated poems as a generated poem, but ALWAYS return the poem in the given format from the template without a trailing comma.';
      }

      // Request a haiku from OpenAI
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Only reply with the formatted haiku following this template: ${haikuTemplate}`,
          },
          {
            role: 'user',
            content,
          },
        ],
        model: CHAT_MODEL, // Defined in constants
      });

      // Parse the returned JSON into a Haiku object
      console.log(completion.choices[0].message.content);
      const rawHaikuJson = JSON.parse(completion.choices[0].message.content!);

      // Resolve the country from request IP
      const countryResult = await this.locationService.getCountryFromIp(req.ip);

      // Build a new haiku entity
      const newHaiku: Haiku = this.haikuRepo.create({
        lineOne: rawHaikuJson.lineOne,
        lineTwo: rawHaikuJson.lineTwo,
        lineThree: rawHaikuJson.lineThree,
        country: countryResult,
        theme,
      });

      // Save and return the created haiku
      return await this.haikuRepo.save(newHaiku);
    } catch (err: any) {
      await this.handleError(`Failed to generate new haiku`, err.message);
    }
  }

  /** Retrieves a random Haiku, optionally filtered by theme.
   * @param {string} [theme] - If provided, only haikus with this theme will be considered.
   * @returns {Promise<Haiku | undefined>} A randomly selected Haiku, or undefined if none exist.
   */
  async getRandomHaiku(theme?: string): Promise<Haiku | undefined> {
    try {
      let records: Haiku[] = [];

      if (theme) {
        records = await this.haikuRepo.find({ where: { theme } });
      } else {
        records = await this.haikuRepo.find();
      }

      // Randomly pick an index safely within range
      const randomIndex = Math.round(Math.random() * records.length);

      return records.at(randomIndex);
    } catch (err: any) {
      await this.handleError(`Failed to get random haiku`, err.message);
    }
  }
  /** Retrieves all available Haiku records.
   * @returns {Promise<Haiku[] | undefined>} A list of all Haiku records, or undefined if retrieval fails.
   */
  async getAllHaikus(): Promise<Haiku[] | undefined> {
    try {
      return await this.haikuRepo.find();
    } catch (err: any) {
      await this.handleError(`Failed to get Haiku records`, err.message);
    }
  }

  /** Retrieves a single Haiku record by its unique ID.
   * @param {number} id - The ID of the Haiku to retrieve.
   * @returns {Promise<Haiku | undefined>} The found Haiku record, or undefined if not found.
   * @throws {NotFoundException} If the record with the given ID does not exist.
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
