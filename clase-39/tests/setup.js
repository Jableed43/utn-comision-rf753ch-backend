import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

/**
 * Configuración de tests - Conecta a una base de datos en memoria
 * Se ejecuta antes de todos los tests
 */
export const setupTestDB = async () => {
  try {
    // Crear servidor MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Conectar Mongoose a la base de datos en memoria
    await mongoose.connect(mongoUri);
    
    console.log("✅ Connected to in-memory MongoDB for testing");
  } catch (error) {
    console.error("❌ Error connecting to test database:", error);
    throw error;
  }
};

/**
 * Limpia la base de datos entre tests
 */
export const cleanupTestDB = async () => {
  try {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error("❌ Error cleaning test database:", error);
    throw error;
  }
};

/**
 * Cierra la conexión de la base de datos y el servidor
 * Se ejecuta después de todos los tests
 */
export const teardownTestDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    
    console.log("✅ Test database connection closed");
  } catch (error) {
    console.error("❌ Error closing test database:", error);
    throw error;
  }
};
