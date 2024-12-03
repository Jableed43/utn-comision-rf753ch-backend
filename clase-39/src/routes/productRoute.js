import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  findProductById,
  findProductByName,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";

const productRoute = Router();

productRoute.get("/get", verifyTokenMiddleware, getProducts);
productRoute.post("/create", verifyTokenMiddleware, createProduct);
productRoute.get("/get-by-id/:id", verifyTokenMiddleware, findProductById);
productRoute.post("/get-by-name", verifyTokenMiddleware, findProductByName);
productRoute.put("/update/:id", verifyTokenMiddleware, updateProduct)
productRoute.delete("/delete/:id", verifyTokenMiddleware, deleteProduct)


export default productRoute;
