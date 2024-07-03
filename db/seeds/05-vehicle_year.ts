import { randomIntFromInterval } from "../helper";
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
 // Deletes ALL existing entries
 await knex('vehicle_year').del();

 // Inserts seed entries
 for (let i = 0; i < 200; i++) {
   await knex('vehicle_year')
     .insert([{ year: randomIntFromInterval(1950, 2024) }])
     .catch(() =>
       console.log(
         'Unique key constraint triggered while seeding. Ignoring insert data',
       ),
     );
 }
};
