import { Knex } from 'knex';
import { faker } from '@faker-js/faker';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('vehicle_brand').del();

  // Inserts seed entries
  for (let i = 0; i < 300; i++) {
    await knex('vehicle_brand')
      .insert([{ name: faker.vehicle.manufacturer() }])
      .catch(() =>
        console.log(
          'Unique key constraint triggered while seeding. Ignoring insert data',
        ),
      );
  }
}
