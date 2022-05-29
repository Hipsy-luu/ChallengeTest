import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as rateLimit from 'express-rate-limit';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Se habilitan las cors para permitir solicitudes en Ionic y otras plataformas
  app.enableCors();
  //Se habilitan las solicitudes mayores arriba de 50mb
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  //Se proteje contra ataques de fuerza bruta   DESCOMENTAR PARA PRODUCCION
   /*app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 20, // limit each IP to 20 requests per windowMs
    }),
  ); */

  await app.listen(3000);
}
bootstrap();
