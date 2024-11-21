import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../controllers/categoryController.js";

const categoryRoute = Router();

categoryRoute.get("/get", getCategories);
categoryRoute.post("/create", createCategory);
categoryRoute.delete("/delete/:id", deleteCategory);

export default categoryRoute;
