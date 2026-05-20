import { BaseEntity } from 'src/core/BaseEntity';
import { ExpenseCycle } from 'src/expense-cycle/entity/expense-cycle.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

type UserRelations = 'expenseCycles' | 'sharedExpenseCycles';

@Entity()
class User extends BaseEntity<User, UserRelations> {
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

  constructor(data?: { username: string; passwordHash: string; displayName: string }) {
    super();

    if (data !== undefined) {
      this.username = data.username;
      this.passwordHash = data.passwordHash;
      this.displayName = data.displayName;
    }
  }
}

export { User };
