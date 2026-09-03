import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpenseTagTable1788272023123 implements MigrationInterface {
  name = 'CreateExpenseTagTable1788272023123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "expense_tag" (
        "expenseId" integer NOT NULL,
        "tagId" integer NOT NULL,
        CONSTRAINT "PK_ab9bbdb47f40efbad04c3fef249" PRIMARY KEY ("expenseId", "tagId")
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_bfa034e236c19b4fc646abc565" ON "expense_tag" ("expenseId")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_747c4961e396d3785cef2d92d6" ON "expense_tag" ("tagId")',
    );
    await queryRunner.query(`
      ALTER TABLE "expense_tag"
      ADD CONSTRAINT "FK_bfa034e236c19b4fc646abc565a" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "expense_tag"
      ADD CONSTRAINT "FK_747c4961e396d3785cef2d92d6a" FOREIGN KEY ("tagId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "expense_tag" DROP CONSTRAINT "FK_747c4961e396d3785cef2d92d6a"',
    );
    await queryRunner.query(
      'ALTER TABLE "expense_tag" DROP CONSTRAINT "FK_bfa034e236c19b4fc646abc565a"',
    );
    await queryRunner.query('DROP INDEX "public"."IDX_747c4961e396d3785cef2d92d6"');
    await queryRunner.query('DROP INDEX "public"."IDX_bfa034e236c19b4fc646abc565"');
    await queryRunner.query('DROP TABLE "expense_tag"');
  }
}
