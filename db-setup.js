const mysql = require('mysql2/promise');
require('dotenv').config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection({
    host: DB_HOST || 'localhost',
    port: DB_PORT || 3306,
    user: DB_USER || 'your_mysql_user',
    password: DB_PASSWORD || 'your_mysql_password',
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`);
    console.log(`Database ${DB_NAME} created successfully or already exists.`);
  } catch (error) {
    console.error(`Error creating database ${DB_NAME}:`, error);
  } finally {
    await connection.end();
  }
}

createDatabaseIfNotExists();
