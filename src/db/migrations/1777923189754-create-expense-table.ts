import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpenseTable1777923189754 implements MigrationInterface {
  name = 'CreateExpenseTable1777923189754';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "expense" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "description" character varying NOT NULL,
        "date" TIMESTAMP NOT NULL,
        "isProportional" boolean NOT NULL,
        "valueInCents" integer NOT NULL,
        "expenseCycleId" integer NOT NULL,
        "paidByUserId" integer NOT NULL,
        CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "expense"
      ADD CONSTRAINT "FK_d1bfe2b6211ad735b63eb26c3e0" FOREIGN KEY ("expenseCycleId") REFERENCES "expense_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "expense"
      ADD CONSTRAINT "FK_b7d8293b5cea9c510529f6dfe4f" FOREIGN KEY ("paidByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "expense" DROP CONSTRAINT "FK_b7d8293b5cea9c510529f6dfe4f"',
    );
    await queryRunner.query(
      'ALTER TABLE "expense" DROP CONSTRAINT "FK_d1bfe2b6211ad735b63eb26c3e0"',
    );
    await queryRunner.query('DROP TABLE "expense"');
  }
}
