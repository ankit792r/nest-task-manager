import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap().catch((error) => console.log(error));
