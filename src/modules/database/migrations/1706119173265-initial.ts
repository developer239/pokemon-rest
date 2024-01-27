import { MigrationInterface, QueryRunner } from 'typeorm'

export class Initial1706119173265 implements MigrationInterface {
  name = 'Initial1706119173265'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."attack_category_enum" AS ENUM('fast', 'special')`
    )
    await queryRunner.query(
      `CREATE TABLE "attack" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "category" "public"."attack_category_enum" NOT NULL, "damage" integer NOT NULL, CONSTRAINT "PK_b63e4c74e7b45ef2d42a82bdabc" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "evolution_requirement" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "name" character varying NOT NULL, "pokemonId" integer, CONSTRAINT "REL_eb54d6af84755df0a6cdbed921" UNIQUE ("pokemonId"), CONSTRAINT "PK_d787a478c051421cdded8ba5581" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "pokemon" ("id" SERIAL NOT NULL, "number" integer NOT NULL, "name" character varying NOT NULL, "classification" character varying NOT NULL, "types" text NOT NULL, "resistant" text NOT NULL, "weaknesses" text NOT NULL, "weightRange" numrange NOT NULL, "heightRange" numrange NOT NULL, "fleeRate" double precision NOT NULL, "maxCP" integer NOT NULL, "maxHP" integer NOT NULL, CONSTRAINT "UQ_ed13cab42a9c7f966c48588e5f0" UNIQUE ("number"), CONSTRAINT "PK_0b503db1369f46c43f8da0a6a0a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_1cb8fc72a68e5a601312c642c8" ON "pokemon" ("name") `
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying, "password" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "pokemon_attacks_attack" ("pokemonId" integer NOT NULL, "attackId" integer NOT NULL, CONSTRAINT "PK_6a50d477a3c708c84f7a1954b75" PRIMARY KEY ("pokemonId", "attackId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_19b24fa3a623b239b34ac1ff0c" ON "pokemon_attacks_attack" ("pokemonId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_811b8bebf7faf1ba136fdf446d" ON "pokemon_attacks_attack" ("attackId") `
    )
    await queryRunner.query(
      `CREATE TABLE "pokemon_evolutions_pokemon" ("pokemonId_1" integer NOT NULL, "pokemonId_2" integer NOT NULL, CONSTRAINT "PK_ee051c029dd1b3cb9276317e08e" PRIMARY KEY ("pokemonId_1", "pokemonId_2"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4aabae52d81ac07b00bbd1e57f" ON "pokemon_evolutions_pokemon" ("pokemonId_1") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4a97c942e2f6c1b7a66eb68f5f" ON "pokemon_evolutions_pokemon" ("pokemonId_2") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_favorite_pokemons_pokemon" ("userId" integer NOT NULL, "pokemonId" integer NOT NULL, CONSTRAINT "PK_9638312f7103613484e5eae8983" PRIMARY KEY ("userId", "pokemonId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_0da5d3daaef5362b4f94eb90a3" ON "user_favorite_pokemons_pokemon" ("userId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c78b49239603f2291965b5e97f" ON "user_favorite_pokemons_pokemon" ("pokemonId") `
    )
    await queryRunner.query(
      `ALTER TABLE "evolution_requirement" ADD CONSTRAINT "FK_eb54d6af84755df0a6cdbed9218" FOREIGN KEY ("pokemonId") REFERENCES "pokemon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon_attacks_attack" ADD CONSTRAINT "FK_19b24fa3a623b239b34ac1ff0c4" FOREIGN KEY ("pokemonId") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon_attacks_attack" ADD CONSTRAINT "FK_811b8bebf7faf1ba136fdf446d9" FOREIGN KEY ("attackId") REFERENCES "attack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon_evolutions_pokemon" ADD CONSTRAINT "FK_4aabae52d81ac07b00bbd1e57f2" FOREIGN KEY ("pokemonId_1") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon_evolutions_pokemon" ADD CONSTRAINT "FK_4a97c942e2f6c1b7a66eb68f5fe" FOREIGN KEY ("pokemonId_2") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_favorite_pokemons_pokemon" ADD CONSTRAINT "FK_0da5d3daaef5362b4f94eb90a3f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_favorite_pokemons_pokemon" ADD CONSTRAINT "FK_c78b49239603f2291965b5e97fe" FOREIGN KEY ("pokemonId") REFERENCES "pokemon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_favorite_pokemons_pokemon" DROP CONSTRAINT "FK_c78b49239603f2291965b5e97fe"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_favorite_pokemons_pokemon" DROP CONSTRAINT "FK_0da5d3daaef5362b4f94eb90a3f"`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon_evolutions_pokemon" DROP CONSTRAINT "FK_4a97c942e2f6c1b7a66eb68f5fe"`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon_evolutions_pokemon" DROP CONSTRAINT "FK_4aabae52d81ac07b00bbd1e57f2"`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon_attacks_attack" DROP CONSTRAINT "FK_811b8bebf7faf1ba136fdf446d9"`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon_attacks_attack" DROP CONSTRAINT "FK_19b24fa3a623b239b34ac1ff0c4"`
    )
    await queryRunner.query(
      `ALTER TABLE "evolution_requirement" DROP CONSTRAINT "FK_eb54d6af84755df0a6cdbed9218"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c78b49239603f2291965b5e97f"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0da5d3daaef5362b4f94eb90a3"`
    )
    await queryRunner.query(`DROP TABLE "user_favorite_pokemons_pokemon"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4a97c942e2f6c1b7a66eb68f5f"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4aabae52d81ac07b00bbd1e57f"`
    )
    await queryRunner.query(`DROP TABLE "pokemon_evolutions_pokemon"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_811b8bebf7faf1ba136fdf446d"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_19b24fa3a623b239b34ac1ff0c"`
    )
    await queryRunner.query(`DROP TABLE "pokemon_attacks_attack"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1cb8fc72a68e5a601312c642c8"`
    )
    await queryRunner.query(`DROP TABLE "pokemon"`)
    await queryRunner.query(`DROP TABLE "evolution_requirement"`)
    await queryRunner.query(`DROP TABLE "attack"`)
    await queryRunner.query(`DROP TYPE "public"."attack_category_enum"`)
  }
}
