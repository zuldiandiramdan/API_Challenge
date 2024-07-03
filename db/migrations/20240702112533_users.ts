import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTableIfNotExists('users', function (table) {
    table.bigIncrements('id', { primaryKey: true });
    table.string('name').notNullable().unique();
    table.boolean('is_admin');
    table
      .dateTime('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .dateTime('updated_at')
      .nullable()
      .defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
