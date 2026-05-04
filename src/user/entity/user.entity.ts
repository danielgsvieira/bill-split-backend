import { BaseEntity } from 'src/core/BaseEntity';
import { ExpenseCycle } from 'src/expense-cycle/entity/expense-cycle.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
class User extends BaseEntity {
  @Column()
  username!: string;

  @Column()
  passwordHash!: string;

  @Column()
  displayName!: string;

  @OneToMany(() => ExpenseCycle, (ec) => ec.userId)
  expenseCycles?: ExpenseCycle[];

  @ManyToMany(() => ExpenseCycle, (ecus) => ecus.sharedWith)
  sharedExpenseCycles?: ExpenseCycle[];
}

export { User };
