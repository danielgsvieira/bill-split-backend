import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpenseCycleShareTable1776973713833 implements MigrationInterface {
  name = 'CreateExpenseCycleShareTable1776973713833';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "expense_cycle_share" (
        "expenseCycleId" integer NOT NULL,
        "userId" integer NOT NULL,
        CONSTRAINT "PK_22050a50eaabd6065a542289cf4" PRIMARY KEY ("expenseCycleId", "userId")
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_fd4ea27e3e1d99e5b71595837e" ON "expense_cycle_share" ("expenseCycleId")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_4d9cff72f95243b8d83c06d04f" ON "expense_cycle_share" ("userId")',
    );
    await queryRunner.query(`
      ALTER TABLE "expense_cycle_share"
      ADD CONSTRAINT "FK_fd4ea27e3e1d99e5b71595837eb" FOREIGN KEY ("expenseCycleId") REFERENCES "expense_cycle"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "expense_cycle_share"
      ADD CONSTRAINT "FK_4d9cff72f95243b8d83c06d04f0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "expense_cycle_share" DROP CONSTRAINT "FK_4d9cff72f95243b8d83c06d04f0"',
    );
    await queryRunner.query(
      'ALTER TABLE "expense_cycle_share" DROP CONSTRAINT "FK_fd4ea27e3e1d99e5b71595837eb"',
    );
    await queryRunner.query('DROP INDEX "public"."IDX_4d9cff72f95243b8d83c06d04f"');
    await queryRunner.query('DROP INDEX "public"."IDX_fd4ea27e3e1d99e5b71595837e"');
    await queryRunner.query('DROP TABLE "expense_cycle_share"');
  }
}
