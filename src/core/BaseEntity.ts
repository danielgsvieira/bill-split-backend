import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
