import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host:
    process.env.PROD == 'true'
      ? process.env.DB_HOST_PROD
      : process.env.DB_HOST_DEV,
  port: +(process.env.PROD == 'true'
    ? process.env.DB_PORT_PROD!
    : process.env.DB_PORT_DEV!),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  logging: true,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  synchronize: false, //! Never use true in prod!
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
