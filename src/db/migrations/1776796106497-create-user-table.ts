import { MigrationInterface, QueryRunner } from 'typeorm';

class CreateUserTable1776796106497 implements MigrationInterface {
  name = 'CreateUserTable1776796106497';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "username" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        "displayName" character varying NOT NULL,
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "user"');
  }
}

export { CreateUserTable1776796106497 };
