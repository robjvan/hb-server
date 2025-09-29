import { Module } from '@nestjs/common';
import { HaikuModule } from './modules/haiku/haiku.module';
import { LoggingModule } from './modules/logging/logging.module';
import { LocationModule } from './modules/location/location.module';
import { OpenaiModule } from './modules/openai/openai.module';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    LoggingModule,
    HaikuModule,
    LocationModule,
    OpenaiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
