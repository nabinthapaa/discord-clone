import { Knex } from "knex";
const TABLE_NAME = "servers";
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
    table.string("server_name").notNullable();
    table.string("server_picture").nullable();
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");

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
  return knex.schema.dropTable(TABLE_NAME);
}
