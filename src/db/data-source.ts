import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const DEFAULT_DB_CONFIG = {
  DB_TYPE: 'postgres',
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_NAME: 'divisao-contas',
  DB_USERNAME: 'postgres',
  DB_PASSWORD: 'example',
  ENTITIES_PATH_GLOB: '**/*.entity{.js,.ts}',
  MIGRATIONS_PATH_GLOB: 'db/migrations/**/*{.js,.ts}',
  RUN_MIGRATIONS: 'true',
};

config(); // Load .env file

const entitiesPathGlob = process.env.ENTITIES_PATH_GLOB ?? DEFAULT_DB_CONFIG.ENTITIES_PATH_GLOB;
const entities = [`${__dirname}/../${entitiesPathGlob}`];

const migrationsPathGlob =
  process.env.MIGRATIONS_PATH_GLOB ?? DEFAULT_DB_CONFIG.MIGRATIONS_PATH_GLOB;
const migrations = [`${__dirname}/../${migrationsPathGlob}`];

const AppDataSource = new DataSource({
  type: process.env.DB_TYPE ?? DEFAULT_DB_CONFIG.DB_TYPE,
  host: process.env.DB_HOST ?? DEFAULT_DB_CONFIG.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? DEFAULT_DB_CONFIG.DB_PORT),
  username: process.env.DB_USERNAME ?? DEFAULT_DB_CONFIG.DB_USERNAME,
  password: process.env.DB_PASSWORD ?? DEFAULT_DB_CONFIG.DB_PASSWORD,
  database: process.env.DB_NAME ?? DEFAULT_DB_CONFIG.DB_NAME,
  entities,
  migrations,
  synchronize: false,
} as DataSourceOptions);

export { AppDataSource, DEFAULT_DB_CONFIG };
