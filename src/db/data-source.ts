import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'sa',
  database: 'around-the-world-typeorm',
  synchronize: false,
  migrations: ['src/db/migrations/*.ts'],
  entities: ['src/**/*.entity{.ts,.js}'],
});
