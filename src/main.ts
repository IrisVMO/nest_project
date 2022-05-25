import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './configs/all-exeptions.filter';
import { configs } from './configs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // const app = await NestFactory.create<NestExpressApplication>(
  //   AppModule,
  //   new ExpressAdapter(),
  //   { cors: true },
  // );
  // app.setGlobalPrefix('/api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('API Documentation Manager Social Network')
    .setDescription('Developed by Iris_VMO')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(configs.port, () => {
    console.log(`Server is running on http://localhost:${configs.port}`);
  });
}

bootstrap();
