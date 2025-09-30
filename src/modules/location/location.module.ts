import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { Country } from './entities/country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingModule } from '../logging/logging.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Country]), LoggingModule, HttpModule],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
