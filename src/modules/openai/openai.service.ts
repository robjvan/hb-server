import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class OpenAiService {
  constructor(private readonly loggingService: LoggingService) {}

  /** Logger instance scoped to OpenAiService for tracking and recording service-level operations and errors. */
  private logger: Logger = new Logger(OpenAiService.name);

  /** Handles common error logging and throwing for service methods. */
  private async handleError(error: string, errorMsg: string): Promise<void> {
    await this.loggingService.error(
      this.logger,
      'OpenAiService',
      error,
      errorMsg,
    );
    throw new InternalServerErrorException(error, errorMsg);
  }

  async generateHaiku(input?: string): Promise<string | undefined> {
    try {
      console.log(input);
      // TODO(RV): Add logic
      return;
    } catch (err: any) {
      await this.handleError(
        `Failed to get haiku from OpenAI API`,
        err.message,
      );
    }
  }
}
