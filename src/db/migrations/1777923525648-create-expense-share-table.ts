import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpenseShareTable1777923525648 implements MigrationInterface {
  name = 'CreateExpenseShareTable1777923525648';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "expense_share" (
        "expenseId" integer NOT NULL,
        "userId" integer NOT NULL,
        CONSTRAINT "PK_6e61b663d2feb615a9cb0c1f80d" PRIMARY KEY ("expenseId", "userId")
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_907e9bc3c8aaace6c7fe036d8d" ON "expense_share" ("expenseId")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_1d1245d09dd7bd828f543f620e" ON "expense_share" ("userId")',
    );
    await queryRunner.query(`
      ALTER TABLE "expense_share"
      ADD CONSTRAINT "FK_907e9bc3c8aaace6c7fe036d8d3" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "expense_share"
      ADD CONSTRAINT "FK_1d1245d09dd7bd828f543f620e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "expense_share" DROP CONSTRAINT "FK_1d1245d09dd7bd828f543f620e5"',
    );
    await queryRunner.query(
      'ALTER TABLE "expense_share" DROP CONSTRAINT "FK_907e9bc3c8aaace6c7fe036d8d3"',
    );
    await queryRunner.query('DROP INDEX "public"."IDX_1d1245d09dd7bd828f543f620e"');
    await queryRunner.query('DROP INDEX "public"."IDX_907e9bc3c8aaace6c7fe036d8d"');
    await queryRunner.query('DROP TABLE "expense_share"');
  }
}
