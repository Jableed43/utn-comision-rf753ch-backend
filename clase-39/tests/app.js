import express from "express";
import bodyParser from "body-parser";
import userRoute from "../src/routes/userRoute.js";
import categoryRoute from "../src/routes/categoryRoute.js";
import productRoute from "../src/routes/productRoute.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import session from "express-session";

/**
 * Aplicación Express configurada para tests
 * Similar a index.js pero sin la conexión a DB ni el puerto
 */
export const createTestApp = () => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(
    session({
      secret: "test-secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  // Rutas
  app.use("/api/user", userRoute);
  app.use("/api/category", categoryRoute);
  app.use("/api/product", productRoute);

  return app;
};
