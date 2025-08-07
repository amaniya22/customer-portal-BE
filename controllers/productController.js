import { getAllProductsService } from "../models/productModel.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await getAllProductsService();
    handleResponse(res, 200, "Successfully Fetched all products", products);
  } catch (err) {
    next(err);
  }
};
