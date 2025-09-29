import { Controller } from '@nestjs/common';
import { OpenAiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenAiService) {}
}
