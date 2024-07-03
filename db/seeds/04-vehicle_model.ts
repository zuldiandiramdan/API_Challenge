import { faker } from "@faker-js/faker";
import { randomIntFromInterval } from "../helper";
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
 // Deletes ALL existing entries
 await knex('vehicle_model').del();

 // Inserts seed entries
 for (let i = 0; i < 200; i++) {
   await knex('vehicle_model')
     .insert([{ name: faker.vehicle.model(), type_id: randomIntFromInterval(1, 99) }])
     .catch(() =>
       console.log(
         'Unique key constraint triggered or foreign key failed while seeding. Ignoring insert data',
       ),
     );
 }
};
