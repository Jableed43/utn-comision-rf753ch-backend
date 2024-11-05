import express from "express";
import bodyParser from "body-parser";
import { pool } from "./db.js";
import { fileURLToPath } from "url";
import path from "path";

//Paradigma MVC

//Para poder acceder a las vistas
//Necesitamos la ubicacion de los archivos

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Crea una aplicacion express
const app = express();
const port = 3000;

//Utiliza middlewares a nivel aplicacion (global)
//Puede utilizar middlewares a nivel rutas (acceso a recursos especificos)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Rutas
app.get("/alumnos", (req, res) => {
  res.sendFile(path.join(__dirname, "vistas/formularioAlumno.html"));
});

app.get("/profesores", (req, res) => {
  res.sendFile(path.join(__dirname, "vistas/formularioProfesor.html"));
});

//Endpoints
//Este post recibe informacion del formulario por body
app.post("/crear-alumno", async (req, res) => {
  //nombre y apellido son los "name" de mis input
  //Los name del input son las claves del body
  const { nombre, apellido } = req.body;
  console.log(req.body);
  //Query
  const insertQuery = "INSERT INTO alumnos (nombre, apellido) VALUES (?, ?)";

  try {
    await pool.query(insertQuery, [nombre, apellido]);
    res.status(201).send("Alumno creado correctamente");
  } catch (error) {
    console.error("Error al crear el alumno", error);
    res.status(500).send("Error al crear alumno");
  }
});

app.post("/crear-profesor", async (req, res) => {
  //nombre y apellido son los "name" de mis input
  //Los name del input son las claves del body
  const { nombre, apellido } = req.body;
  console.log(req.body);
  //Query
  const insertQuery = "INSERT INTO profesores (nombre, apellido) VALUES (?, ?)";

  try {
    await pool.query(insertQuery, [nombre, apellido]);
    res.status(201).send("Profesor creado correctamente");
  } catch (error) {
    console.error("Error al crear el profesor", error);
    res.status(500).send("Error al crear profesor");
  }
});

//Cuando encendemos el servidor comienza a escuchar
//Lo hace en un puerto
//El callback se ejecuta cuando el servidor esta escuchando
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
