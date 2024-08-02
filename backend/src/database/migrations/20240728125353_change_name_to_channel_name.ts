import { Knex } from "knex";
import { EChanneType, EServerRole } from "../../enums";
const TABLE_NAME = "server_channels";
/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table.dropColumn("name");
    table.dropColumn(" type");
    table.string("channel_name").notNullable();
    table
      .enum("channel_permission", Object.values(EServerRole), {
        useNative: true,
        enumName: "type_server_role",
      })
      .notNullable()
      .defaultTo("guest");
    table
      .enum("channel_type", Object.values(EChanneType), {
        useNative: true,
        enumName: "channel_type",
        existingType: true,
      })
      .notNullable()
      .defaultTo("text");
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
    table.string("name").notNullable();
    table.dropColumn("channel_name");
    table.dropColumn("channel_permission");
    table.dropColumn("channel_type");
    table.enu("type", Object.keys(EChanneType), {
      useNative: true,
      enumName: "channel_type",
      existingType: true,
    });
  });
  await knex.raw(`DROP TYPE type_server_role`);
}
