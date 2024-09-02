import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply-app-setting';
import { SwaggerModule } from '@nestjs/swagger';
import { configurationSwagger } from './swagger/config';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('NEON_URL:', process.env.NEON_URL);

  applyAppSettings(app);

  const config = configurationSwagger();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
