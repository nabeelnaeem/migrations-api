import express from 'express';
import { sequelize } from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true, //Allow the browser to include "credentials" like cookies, authorization headers, or TLS client certificates in a cross-origin request.
  })
);
app.use(express.json());

// DB Connection & Server Start
sequelize
  .authenticate()
  .then(() => {
    console.log('DB Connected');
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' DB Connection Failed:', err);
  });
