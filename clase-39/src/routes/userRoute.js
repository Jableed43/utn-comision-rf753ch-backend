import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/userController.js";

//Crear enrutador
//Enrutador, controla un conjunto de rutas
//Orientado a una entidad en especifico
const userRoute = express.Router();

// los endpoints se usan asi: http://localhost:3000/api/user/create
//  http://localhost:3000/api/user/get

//Endpoints
//Ruta de creacion con post
userRoute.post("/create", createUser);
userRoute.get("/get", getUsers);
//Definimos path param con ":id"
userRoute.delete("/delete/:id", deleteUser);
userRoute.put("/update/:id", updateUser);

export default userRoute;
