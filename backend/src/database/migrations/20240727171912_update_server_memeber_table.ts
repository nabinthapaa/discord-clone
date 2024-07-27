import { Knex } from "knex";
const TABLE_NAME = "server_members";
/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table
      .enu("server_role", ["owner", "mod", "guest"], {
        useNative: true,
        enumName: "type_server_roles",
      })
      .defaultTo("guest");
  });
}

/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.dropColumn("server_role");
  });

  await knex.schema.raw(`DROP TYPE "type_server_roles"`);
}
