import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  try {
    await app.listen(port);
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error(`Error starting the server: ${error}`);
  }
}

bootstrap();
