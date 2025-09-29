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

  // Set Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Register Backend Server')
    .setDescription('Register backend API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'Header',
      },
      'access-token',
    )
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
