import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { HaikuService } from './haiku.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Haiku } from 'src/modules/haiku/entities/haiku.entity';

/** Controller exposing API endpoints for managing Haiku records.
 * Supports generation, retrieval of all records, random selection,
 * and fetching individual haikus by ID.
 */
@ApiTags('haiku')
@Controller('haiku')
export class HaikuController {
  constructor(private readonly haikuService: HaikuService) {}

  @ApiOperation({
    summary: 'Creates a new Haiku record with a specific theme',
    description:
      'Uses OpenAI to generate a traditionally formatted 5-7-5 haiku based on the provided theme.',
  })
  @ApiParam({
    name: 'theme',
    description: 'Theme to guide the generated haiku',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'New record generated and saved successfully',
    type: Haiku,
  })
  @Post('generate/:theme')
  generateNewHaiku(@Req() req: any, @Param('theme') theme: string) {
    return this.haikuService.generateHaiku(req, theme);
  }

  @ApiOperation({
    summary: 'Creates a random new Haiku',
    description:
      'Uses OpenAI to generate a 5-7-5 haiku with a random theme when none is provided.',
  })
  @ApiResponse({
    status: 201,
    description: 'New record generated and saved successfully',
    type: Haiku,
  })
  @Post('generate/random')
  generateRandomHaiku(@Req() req: any) {
    return this.haikuService.generateHaiku(req);
  }

  @ApiOperation({ summary: 'Retrieves all available haiku records' })
  @ApiResponse({
    status: 200,
    description: 'Records retrieved successfully.',
    type: Haiku,
    isArray: true,
  })
  @Get()
  getAllHaikus() {
    return this.haikuService.getAllHaikus();
  }

  @ApiOperation({ summary: 'Retrieves one random haiku record' })
  @ApiResponse({
    status: 200,
    description: 'Record retrieved successfully.',
    type: Haiku,
  })
  @Get('/random')
  getRandomHaiku() {
    return this.haikuService.getRandomHaiku();
  }

  @ApiOperation({ summary: 'Retrieves one random Haiku record by theme' })
  @ApiParam({
    name: 'theme',
    description: 'Theme to filter haikus by before random selection',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Random themed record retrieved successfully.',
    type: Haiku,
  })
  @Get('random/:theme')
  getRandomHaikuByTheme(@Param('theme') theme: string) {
    return this.haikuService.getRandomHaiku(theme);
  }

  @ApiOperation({ summary: 'Retrieves one haiku record by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the Haiku record to retrieve',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Record retrieved successfully.',
    type: Haiku,
  })
  @Get('/:id')
  getHaikuById(@Param('id', ParseIntPipe) id: number) {
    return this.haikuService.getHaikuById(id);
  }
}
