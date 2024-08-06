import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as process from 'process';

export const options: TypeOrmModuleOptions = {
  type: 'postgres',
  // url: process.env.NEON_URL,
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'sa',
  database: 'around-the-world-typeorm',
  autoLoadEntities: true,
  synchronize: true,
  // extra: {
  //   ssl: {
  //     rejectUnauthorized: false,
  //     sslmode: 'require',
  //   },
  // },
};
