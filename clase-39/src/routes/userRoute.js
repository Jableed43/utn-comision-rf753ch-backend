import express from "express";
import { create, get } from "../controllers/userController.js";

//Crear enrutador
//Enrutador, controla un conjunto de rutas
//Orientado a una entidad en especifico
const userRoute = express.Router();

// los endpoints se usan asi: http://localhost:3000/api/user/create
//  http://localhost:3000/api/user/get

//Endpoints
//Ruta de creacion con post
userRoute.post("/create", create);
userRoute.get("/get", get);

export default userRoute;
