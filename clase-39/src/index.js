import express from "express";
import bodyParser from "body-parser";
import { PORT } from "./config.js";
import { connectDB } from "./db.js";
import userRoute from "./routes/userRoute.js";
import categoryRoute from "./routes/categoryRoute.js";

//Ejecucion de express
const app = express();

//Middleware

//Parsea a json las solicitudes
app.use(bodyParser.json());

//Parsea cuerpo de la solicitud para que pueda ser leida - querystring
app.use(bodyParser.urlencoded({ extended: true }));

//Conexion a la base de datos
connectDB();

//Rutas
//  http://localhost:3000/api/user
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);

//Siempre tiene que ir ultimo
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
