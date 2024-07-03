require('dotenv').config();

module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_cars',
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};
