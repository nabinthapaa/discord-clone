import { Knex } from "knex";
const TABLE_NAME = "users";
/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    // UUID for each tables
    table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();

    //Add other columns
    table
      .enu("type", ["admin", "user"], {
        useNative: true,
        enumName: "user_type",
      })
      .notNullable();
    table.string("user_name").unique().notNullable();
    table.string("password").notNullable();
    table.string("email").unique().notNullable();
    table.date("date_of_birth").notNullable();
    table.string("display_name").nullable();

    // Timestamps for created and updated times
    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
    table.timestamp("updated_at").nullable();
  });
}

/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);

  await knex.schema.raw(`DROP TYPE "user_type"`);
}
