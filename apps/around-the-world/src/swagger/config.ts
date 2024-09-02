import { DocumentBuilder } from '@nestjs/swagger';

export function configurationSwagger() {
  console.log('a');
  const config = new DocumentBuilder()
    .setTitle('API Example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('example')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Bearer token only',
        in: 'header',
      },
      'JWT-auth',
    )
    .addCookieAuth('refreshToken', {
      type: 'apiKey',
      in: 'cookie',
      name: 'refreshToken',
      description:
        'JWT refreshToken inside cookie. Must be correct, and must not expire',
    })
    .addBasicAuth({
      type: 'http',
      scheme: 'basic',
      description: 'basic',
    })
    .build();

  return config;
}
