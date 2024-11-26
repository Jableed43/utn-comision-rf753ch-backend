import { Router } from "express";
import {
  createProduct,
  findProductById,
  findProductByName,
  getProducts,
} from "../controllers/productController.js";

const productRoute = Router();

productRoute.get("/get", getProducts);
productRoute.post("/create", createProduct);
productRoute.get("/get-by-id/:id", findProductById);
productRoute.post("/get-by-name", findProductByName);

export default productRoute;
