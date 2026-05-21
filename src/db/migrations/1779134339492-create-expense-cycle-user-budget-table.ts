import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpenseCycleUserBudgetTable1779134339492 implements MigrationInterface {
  name = 'CreateExpenseCycleUserBudgetTable1779134339492';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "expense_cycle_user_budget" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "valueInCents" integer NOT NULL,
        "userId" integer NOT NULL,
        "expenseCycleId" integer NOT NULL,
        CONSTRAINT "PK_8857316d4e418db4e784a8453b7" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "expense_cycle_user_budget"
      ADD CONSTRAINT "FK_10f977a5772a4bf37baade7079e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "expense_cycle_user_budget"
      ADD CONSTRAINT "FK_16907657f58d701e8d3cc7e30d0" FOREIGN KEY ("expenseCycleId") REFERENCES "expense_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "expense_cycle_user_budget" DROP CONSTRAINT "FK_16907657f58d701e8d3cc7e30d0"',
    );
    await queryRunner.query(
      'ALTER TABLE "expense_cycle_user_budget" DROP CONSTRAINT "FK_10f977a5772a4bf37baade7079e"',
    );
    await queryRunner.query('DROP TABLE "expense_cycle_user_budget"');
  }
}
