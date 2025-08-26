// scripts/setup.js (ESM version)
import dotenv from 'dotenv';
import fs from 'fs';
import { createDB } from './db.js';

dotenv.config();

// await initUserTable();
await createDB();

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
};

fs.writeFileSync('config/config.json', JSON.stringify(config, null, 2));
console.log('✅ config.json generated successfully.');
