/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddModels1759233087309 implements MigrationInterface {
  name = 'AddModels1759233087309';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "haiku" ("id" SERIAL NOT NULL, "lineOne" text NOT NULL, "lineTwo" text NOT NULL, "lineThree" text NOT NULL, "input" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "countryId" integer, CONSTRAINT "PK_f2a996e42f5151179a247292a6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "country" ("id" SERIAL NOT NULL, "name" text NOT NULL, "abbr" text NOT NULL, CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "haiku" ADD CONSTRAINT "FK_0272f25a783eebf37bbb14f8302" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "haiku" DROP CONSTRAINT "FK_0272f25a783eebf37bbb14f8302"`,
    );
    await queryRunner.query(`DROP TABLE "country"`);
    await queryRunner.query(`DROP TABLE "haiku"`);
  }
}
