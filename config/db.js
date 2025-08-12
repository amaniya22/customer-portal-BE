import dotenv from 'dotenv';
import { Pool } from "pg";

dotenv.config();

const DB_USER = process.env.PG_USER;
const DB_HOST = process.env.PG_HOST;
const DB_NAME = process.env.PG_DB;
const DB_PASS = process.env.PG_PASS;
const DB_PORT = process.env.PG_PORT;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASS,
  port: DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing client", err.stack);
    }
    console.log("Connected to Database !");
  });
});


export const query = (text, params) => pool.query(text, params);

export default pool;
