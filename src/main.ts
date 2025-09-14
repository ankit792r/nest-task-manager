import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import { AllExceptionsFilter } from './lib/filters/exception.filter';
import { ResponseInterceptor } from './lib/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Task Manager')
    .setDescription('task manager API description')
    .setVersion('0.0.1')
    .addGlobalResponse({
      status: 500,
      description: 'Internal Server Error',
    })
    .addBearerAuth(
      {
        bearerFormat: 'Bearer',
        type: 'http',
        scheme: 'bearer',
        in: 'Header',
        name: 'Authorization',
      },
      'access-token',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    explorer: true,
    customSiteTitle: 'Task Manager API Docs',
    swaggerUiEnabled: true,
    ui: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap().catch((error) => console.log(error));
