import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLogRecordModel1759236499521 implements MigrationInterface {
    name = 'AddLogRecordModel1759236499521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "log_record" ("id" SERIAL NOT NULL, "service" text NOT NULL, "error" text NOT NULL, "errorMsg" text NOT NULL, CONSTRAINT "PK_143b158600638071e74ffad3db8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "log_record"`);
    }

}
