import mysql from "mysql2";
import util from "util";
import dotenv from "dotenv";
//Permite el acceso a las variables de entorno
dotenv.config();

//Creamos conexion con la base de datos
export const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  port: process.env.MYSQL_PORT,
});

//Utilizamos la conexion:
//pool.query ejecuta queries en nuestra db
pool.query = util.promisify(pool.query);
