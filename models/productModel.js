import pool from "../config/db.js";

export const getAllProductsService = async () => {
  const response = await pool.query('SELECT * FROM public."productsTable"');

  return response.rows;
};
