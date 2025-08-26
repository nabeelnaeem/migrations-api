import { Sequelize } from 'sequelize';
import pkg from 'pg';
import dotenv from 'dotenv';
const { Client } = pkg;

dotenv.config();
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;

export const createDB = async () => {
  const client = new Client({
    user: dbUser,
    password: dbPass,
    host: dbHost,
    database: process.env.DB_MAIN,
  });

  await client.connect();

  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [dbName]
  );
  if (res.rowCount === 0) {
    if (/^[a-zA-Z0-9_]+$/.test(dbName)) {
      //Why below line instead of CREATE DATABASE $1?
      //? Because PostgreSQL does NOT allow parameterized placeholders ($1) for
      //? database identifiers (like database names, table names, column names, etc.)
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database ${dbName} created`);
    } else {
      console.log(`Invalid DB NAME: ${dbName}`);
    }
  } else {
    console.log(`Database ${dbName} already exists`);
  }
  await client.end();
};

export const deleteDB = async () => {
  const client = new Client({
    user: dbUser,
    password: dbPass,
    host: dbHost,
    database: process.env.DB_MAIN,
  });

  try {
    await client.connect();

    // First, terminate any active connections to the target DB
    await client.query(
      `
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1
        AND pid <> pg_backend_pid();
    `,
      [dbName]
    );

    // Check if DB exists
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount > 0) {
      // Same note as your createDB → identifiers can’t be parameterized
      await client.query(`DROP DATABASE "${dbName}"`);
      console.log(`Database ${dbName} deleted`);
    } else {
      console.log(`Database ${dbName} does not exist`);
    }
  } catch (err) {
    console.error('Error deleting database:', err);
  } finally {
    await client.end();
  }
};

export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: process.env.DB_DIALECT,
  logging: false,
});
