import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply-app-setting';
import { SwaggerModule } from '@nestjs/swagger';
import { configurationSwagger } from './swagger/config';
import { createWriteStream, mkdirSync } from 'fs';
import { get } from 'http';
import { join } from 'path';

const PORT = process.env.PORT || 5000;
const serverUrl = 'http://localhost:5000';
// const swaggerStaticDir = join(__dirname, 'swagger-static');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('NEON_URL:', process.env.NEON_URL);

  applyAppSettings(app);

  const config = configurationSwagger();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(PORT);

  if (process.env.NODE_ENV === 'development') {
    // // Создаем директорию swagger-static, если она не существует
    // mkdirSync(swaggerStaticDir, { recursive: true });
    // write swagger ui files
    get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      console.log(
        `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
      );
    });

    get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      console.log(
        `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
      );
    });

    get(
      `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        console.log(
          `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
        );
      },
    );

    get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      console.log(
        `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
      );
    });
  }
}
bootstrap();
