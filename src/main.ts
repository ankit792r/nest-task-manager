import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import { AllExceptionsFilter } from './lib/filters/exception.filter';
import { ResponseInterceptor } from './lib/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap().catch((error) => console.log(error));
