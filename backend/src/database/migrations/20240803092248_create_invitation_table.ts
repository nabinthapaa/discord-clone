import { Knex } from "knex";
const TABLE_NAME = "invitations";
/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();

    table
      .uuid("server_id")
      .references("id")
      .inTable("servers")
      .onDelete("CASCADE")
      .unique()
      .notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
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
