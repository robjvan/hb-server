import { Module } from '@nestjs/common';
import { HaikuService } from './haiku.service';
import { HaikuController } from './haiku.controller';
import { Haiku } from './entities/haiku.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [TypeOrmModule.forFeature([Haiku]), LoggingModule],
  controllers: [HaikuController],
  providers: [HaikuService],
})
export class HaikuModule {}
