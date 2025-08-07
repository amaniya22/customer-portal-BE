import pool from "../config/db.js";

export const getAllUsersService = async () => {
  const response = await pool.query('SELECT * FROM public."userTable"');

  return response.rows;
};
