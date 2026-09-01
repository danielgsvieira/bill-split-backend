import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTagTable1788271326906 implements MigrationInterface {
  name = 'CreateTagTable1788271326906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tag" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "description" character varying NOT NULL,
        "color" character varying NOT NULL,
        "userId" integer NOT NULL,
        CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "tag"
      ADD CONSTRAINT "FK_d0dc39ff83e384b4a097f47d3f5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "tag" DROP CONSTRAINT "FK_d0dc39ff83e384b4a097f47d3f5"');
    await queryRunner.query('DROP TABLE "tag"');
  }
}
