import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply-app-setting';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('NEON_URL:', process.env.NEON_URL);

  applyAppSettings(app);

  await app.listen(PORT);
}
bootstrap();
