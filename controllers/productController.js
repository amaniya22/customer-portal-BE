import { query } from "../config/db.js";
const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await query(`SELECT * FROM public."productsTable"`);
    return handleResponse(res, 200, "Successfully Fetched all products", products.rows);
  } catch (err) {
    next(err);
  }
};
