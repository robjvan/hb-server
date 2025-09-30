import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedHaikuModel1759233443026 implements MigrationInterface {
    name = 'FixedHaikuModel1759233443026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "haiku" RENAME COLUMN "input" TO "theme"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "haiku" RENAME COLUMN "theme" TO "input"`);
    }

}
