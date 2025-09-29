import { Module } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [LoggingModule],
  controllers: [OpenaiController],
  providers: [OpenAiService],
})
export class OpenaiModule {}
