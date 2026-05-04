import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  getRelationNotLoadedError(relation: keyof this) {
    return new Error(`${this.constructor.name}'s '${relation.toString()}' relation is not loaded`);
  }
}

export { BaseEntity };
