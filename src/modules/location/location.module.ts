import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Country } from './entities/country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [TypeOrmModule.forFeature([Country]), LoggingModule],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
