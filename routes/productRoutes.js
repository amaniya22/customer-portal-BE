import express from "express";
import { getProducts, getSelectProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:id", getSelectProduct);

export default router;