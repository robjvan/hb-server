import { Controller, Get, Param, Put, Req } from '@nestjs/common';
import { HaikuService } from './haiku.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Haiku } from 'src/modules/haiku/entities/haiku.entity';
import express from 'express';

@Controller('haiku')
export class HaikuController {
  constructor(private readonly haikuService: HaikuService) {}

  @ApiOperation({
    summary: 'Creates a new Haiku record from the given input term',
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

  @ApiOperation({ summary: 'Retrieves one haiku record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Record retrieved successfully.',
    type: Haiku,
  })
  @Get('/:id')
  getHaikuById(@Param('id') id: number) {
    return this.haikuService.getHaikuById(id);
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
}
