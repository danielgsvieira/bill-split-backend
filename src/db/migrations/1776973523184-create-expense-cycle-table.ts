import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpenseCycleTable1776973523184 implements MigrationInterface {
  name = 'CreateExpenseCycleTable1776973523184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "expense_cycle" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "title" character varying NOT NULL,
        "description" character varying,
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP NOT NULL,
        "userId" integer NOT NULL,
        CONSTRAINT "PK_ef6fb724887c42466bac30470bf" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "expense_cycle"
      ADD CONSTRAINT "FK_e19a8ca30d87d7728123167f8ec" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "expense_cycle" DROP CONSTRAINT "FK_e19a8ca30d87d7728123167f8ec"',
    );
    await queryRunner.query('DROP TABLE "expense_cycle"');
  }
}
