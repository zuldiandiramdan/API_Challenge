import { faker } from '@faker-js/faker';
import { randomIntFromInterval } from '../helper';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('pricelist').del();

  // Inserts seed entries
  for (let i = 0; i < 200; i++) {
    await knex('pricelist')
      .insert([
        {
          code: faker.commerce.isbn({ variant: 10, separator: '' }),
          price: parseInt(faker.commerce.price({ dec: 0 })),
          year_id: randomIntFromInterval(1, 99),
          model_id: randomIntFromInterval(1, 99),
        },
      ])
      .catch((err) =>
        console.log(
          'Unique key constraint triggered or foreign key failed. Ignoring insert data',
        ),
      );
  }
}
