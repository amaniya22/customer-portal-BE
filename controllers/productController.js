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
    if (!products) {
      return handleResponse(res, 400, "No product available", products.rows);
    }

    return handleResponse(
      res,
      200,
      "Successfully Fetched all products",
      products.rows
    );
  } catch (err) {
    next(err);
  }
};

export const getSelectProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productView = await query(
      `SELECT * FROM public."productsTable" WHERE product_id=$1`,
      [id]
    );
    const prodSelected = productView.rows[0];
    if (!prodSelected) {
      return handleResponse(res, 400, "Product not found");
    }

    return handleResponse(res, 200, "Product fetched successfully", prodSelected)
  } catch (err) {
    next(err);
  }
};
