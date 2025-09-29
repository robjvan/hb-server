import { Controller, Get, Param, Put, Req } from '@nestjs/common';
import { HaikuService } from './haiku.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Haiku } from 'src/modules/haiku/entities/haiku.entity';
import express from 'express';

@Controller('haiku')
export class HaikuController {
  constructor(private readonly haikuService: HaikuService) {}

  @ApiOperation({
    description: 'Creates a new Haiku record from the given input term.',
  })
  @ApiParam({ name: 'input', description: '', required: false })
  @ApiResponse({
    status: 201,
    description: 'New record generated and saved successfully',
    type: Haiku,
  })
  @Put('generate/:input')
  generateNewHaiku(@Req() req: express.Request, @Param() input?: string) {
    return this.haikuService.generateHaiku(req, input ?? '');
  }

  @ApiOperation({ description: 'Retrieves all available haiku records.' })
  @ApiResponse({
    status: 200,
    description: 'Records retrieved successfully.',
    type: () => [Haiku],
    isArray: true,
  })
  @Get()
  getAllHaikus() {
    return this.haikuService.getAllHaikus();
  }

  @Get('/:id')
  getHaikuById(@Param('id') id: number) {
    return this.haikuService.getHaikuById(id);
  }

  @Get('/random')
  getRandomHaiku() {
    return this.haikuService.getRandomHaiku();
  }
}
