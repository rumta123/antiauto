import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('Car auction').build();
 

  const BACKEND_PORT = process.env.BACKEND_PORT || 3001;

  

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({/* whitelist: true, */}));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup( 'api', app, document);

  await app.listen(BACKEND_PORT);
}
bootstrap();
