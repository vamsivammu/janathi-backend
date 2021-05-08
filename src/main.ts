import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin:'http://localhost:3000',credentials:true,exposedHeaders:["set-cookie"]});
  app.useGlobalPipes(new ValidationPipe({forbidNonWhitelisted:true,whitelist:true}))
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
