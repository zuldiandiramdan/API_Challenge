import { faker } from '@faker-js/faker';
import { randomIntFromInterval } from '../helper';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('vehicle_type').del();

  // Inserts seed entries
  for (let i = 0; i < 200; i++) {
    await knex('vehicle_type')
      .insert([
        { name: faker.vehicle.type(), brand_id: randomIntFromInterval(1, 99) },
      ])
      .catch((err) =>
        console.log(
          'Unique key constraint triggered or foreign key failed while seeding. Ignoring insert data',
        ),
      );
  }
}
