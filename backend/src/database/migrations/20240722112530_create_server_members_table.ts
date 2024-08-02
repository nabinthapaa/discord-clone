import { Knex } from "knex";
const TABLE_NAME = "server_members";
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
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .uuid("server_id")
      .notNullable()
      .references("id")
      .inTable("servers")
      .onDelete("CASCADE");

    table.unique(["user_id", "server_id"], {
      indexName: "idx_user_server",
      useConstraint: true,
    });

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
