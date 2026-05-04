import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppDataSource, DEFAULT_DB_CONFIG } from './data-source';

const dbConfig: TypeOrmModuleOptions = {
  ...AppDataSource.options,
  migrationsRun:
    (process.env.RUN_MIGRATIONS ?? DEFAULT_DB_CONFIG.RUN_MIGRATIONS).toLocaleLowerCase() === 'true',
};

export { dbConfig };
