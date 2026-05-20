import { DataSource } from 'typeorm';

abstract class BaseDataService {
  protected abstract readonly dataSource: DataSource;

  get entityManager() {
    return this.dataSource.manager;
  }
}

export { BaseDataService };
