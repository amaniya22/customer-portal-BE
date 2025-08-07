import { Pool } from "pg";

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'customerFeedbackPortal',
  password: '1234aMa',
  port: 5432,
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

export default pool;
