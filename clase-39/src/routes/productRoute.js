import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  findProductById,
  findProductByName,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";

const productRoute = Router();

productRoute.get("/get", getProducts);
productRoute.post("/create", createProduct);
productRoute.get("/get-by-id/:id", findProductById);
productRoute.post("/get-by-name", findProductByName);
productRoute.put("/update/:id", updateProduct)
productRoute.delete("/delete/:id", deleteProduct)


export default productRoute;
