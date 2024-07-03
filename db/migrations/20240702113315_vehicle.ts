import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('vehicle_brand', function (table) {
      table.bigIncrements('id', { primaryKey: true });
      table.string('name').notNullable().unique();
      table
        .dateTime('created_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
      table
        .dateTime('updated_at')
        .nullable()
        .defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));

      table.charset('utf8mb4');
    })
    .createTable('vehicle_type', function (table) {
      table.bigIncrements('id', { primaryKey: true });
      table.string('name').notNullable().unique();
      table
        .dateTime('created_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
      table
        .dateTime('updated_at')
        .nullable()
        .defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));

      table
        .bigInteger('brand_id')
        .unsigned()
        .notNullable()
        .references('vehicle_brand.id');

      table.charset('utf8mb4');
    })
    .createTable('vehicle_model', function (table) {
      table.bigIncrements('id', { primaryKey: true });
      table.string('name').notNullable().unique();
      table
        .dateTime('created_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
      table
        .dateTime('updated_at')
        .nullable()
        .defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));

      table
        .bigInteger('type_id')
        .unsigned()
        .notNullable()
        .references('vehicle_type.id');

      table.charset('utf8mb4');
    })
    .createTable('vehicle_year', function (table) {
      table.bigIncrements('id', { primaryKey: true });
      table.integer('year').notNullable().unique();
      table
        .dateTime('created_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
      table
        .dateTime('updated_at')
        .nullable()
        .defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));

      table.charset('utf8mb4');
    })
    .createTable('pricelist', function (table) {
      table.bigIncrements('id', { primaryKey: true });
      table.string('code').notNullable().unique();
      table.decimal('price', 12, 2);
      table
        .dateTime('created_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
      table
        .dateTime('updated_at')
        .nullable()
        .defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));

      table
        .bigInteger('year_id')
        .unsigned()
        .notNullable()
        .references('vehicle_year.id');
      table
        .bigInteger('model_id')
        .unsigned()
        .notNullable()
        .references('vehicle_model.id');

      table.charset('utf8mb4');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('pricelist')
    .dropTableIfExists('vehicle_year')
    .dropTableIfExists('vehicle_model')
    .dropTableIfExists('vehicle_type')
    .dropTableIfExists('vehicle_brand');
}
