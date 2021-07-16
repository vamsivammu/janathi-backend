import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bp from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:[
      'http://localhost:3000',
      'http://localhost:3002',
      'https://api.stripe.com',
      'https://checkout.stripe.com',
      'https://dashboard.stripe.com',
      'https://files.stripe.com',
      'https://js.stripe.com',
      'https://m.stripe.com',
      'https://m.stripe.network',
      'https://q.stripe.com',
      'https://verify.stripe.com',
      'https://stripe.com',
      'https://armada.stripe.com',
      'https://gator.stripe.com',
      'https://www.mandrooacademy.com',
      'https://admin.mandrooacademy.com',
      'https://mandrooacademy.com'
    ],
    credentials:true,exposedHeaders:["set-cookie"]});
  app.useGlobalPipes(new ValidationPipe({forbidNonWhitelisted:true,whitelist:true}));
  app.use(cookieParser());
  app.use('/stripe-webhook',bp.raw({type:'application/json'}));
  await app.listen(process.env.PORT as any || 3001);
}
bootstrap();
