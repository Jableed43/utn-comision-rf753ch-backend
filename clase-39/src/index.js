import express from "express";
import bodyParser from "body-parser";
import { PORT } from "./config.js";
import { connectDB } from "./db.js";

//Ejecucion de express
const app = express();

//Middleware

//Parsea a json las solicitudes
app.use(bodyParser.json());

//Parsea cuerpo de la solicitud para que pueda ser leida - querystring
app.use(bodyParser.urlencoded({ extended: true }));

//Conexion a la base de datos
connectDB();

//Siempre tiene que ir ultimo
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
