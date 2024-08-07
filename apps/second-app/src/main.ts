import { NestFactory } from '@nestjs/core';
import { SecondAppModule } from './second-app.module';
import { applySecondAppSettings } from './settings/apply-second-app-setting';

const PORT = process.env.PORT || 5001;

async function bootstrap() {
  const app = await NestFactory.create(SecondAppModule);
  console.log('NEON_URL:', process.env.NEON_URL);

  applySecondAppSettings(app);

  await app.listen(PORT);
}
bootstrap();
