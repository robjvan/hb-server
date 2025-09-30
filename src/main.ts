import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /// Add global prefix to all endpoints
  app.setGlobalPrefix('api/v1');

  /// Handle all user input validation globally
  app.useGlobalPipes(new ValidationPipe()); // Set the config options
  app.enableCors();

  // Let Express trust proxy headers (needed when behind Coolify/NGINX/Cloudflare)
  app.getHttpAdapter().getInstance().set('trust proxy', true);

  // Set Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('HaikuBot API')
    .setDescription(
      'NestJS backend for HaikuBot, featuring OpenAI-powered haiku generation, PostgreSQL persistence, structured logging, and RESTful endpoints for generation and retrieval.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000, () =>
    console.log(
      `Swagger API available at http://localhost:${process.env.PORT ?? 3000}/api`,
    ),
  );
}
void bootstrap();
