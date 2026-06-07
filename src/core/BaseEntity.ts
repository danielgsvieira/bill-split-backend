import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
abstract class BaseEntity<T extends object, R extends keyof T> {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  getRelationNotLoadedError(relation: R) {
    return new Error(`${this.constructor.name}'s '${relation.toString()}' relation is not loaded`);
  }
}

export { BaseEntity };
