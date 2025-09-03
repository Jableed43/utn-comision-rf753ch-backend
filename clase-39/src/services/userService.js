import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Servicio para manejar la lógica de negocio de usuarios
 * Contiene todas las operaciones relacionadas con usuarios separadas del controlador
 */

/**
 * Crear un nuevo usuario
 * @param {Object} userData - Datos del usuario a crear
 * @returns {Object} - Resultado de la operación
 * @throws {Error} - Error de validación de Mongoose (email único, password, etc.)
 */
export const createUserService = async (userData) => {
  // Crear nueva instancia de usuario y guardar
  // Las validaciones (unique email, password format, etc.) son manejadas por Mongoose
  const newUser = new User(userData);
  await newUser.save();
  
  return { message: "User created" };
};

/**
 * Obtener todos los usuarios
 * @returns {Array} - Lista de usuarios
 * @throws {Error} - Error si no hay usuarios o error interno
 */
export const getUsersService = async () => {
  const users = await User.find();
  
  if (users.length === 0) {
    const error = new Error("There are no users");
    error.statusCode = 204;
    throw error;
  }
  
  return users;
};

/**
 * Eliminar un usuario por ID
 * @param {string} userId - ID del usuario a eliminar
 * @returns {Object} - Resultado de la operación
 * @throws {Error} - Error si el usuario no existe o error interno
 */
export const deleteUserService = async (userId) => {
  // Validar si existe
  const userExist = await User.findOne({ _id: userId });
  
  if (!userExist) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  await User.findByIdAndDelete(userId);
  return { message: "User deleted successfully" };
};

/**
 * Actualizar un usuario por ID
 * @param {string} userId - ID del usuario a actualizar
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} - Usuario actualizado
 * @throws {Error} - Error si el usuario no existe o error interno
 */
export const updateUserService = async (userId, updateData) => {
  const userExist = await User.findOne({ _id: userId });
  if (!userExist) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Si utilizamos new: true, nos devolverá el registro actualizado
  const updatedUser = await User.findByIdAndUpdate({ _id: userId }, updateData, {
    new: true,
  });

  return updatedUser;
};

/**
 * Validar credenciales de usuario y generar token JWT
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object} - Token JWT y mensaje de éxito
 * @throws {Error} - Error si las credenciales son incorrectas o faltan campos
 */
export const validateUserService = async (email, password) => {
  // Validar que estén ambos campos necesarios
  if (!(email && password)) {
    const error = new Error("There's a missing field");
    error.statusCode = 400;
    throw error;
  }

  const userFound = await User.findOne({ email });

  if (!userFound) {
    const error = new Error("User or password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  // Comparar la password que llega contra la guardada en la db
  if (!bcrypt.compareSync(password, userFound.password)) {
    const error = new Error("User or password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  // payload es la información que le cargamos al token
  const payload = {
    userId: userFound._id,
    userEmail: userFound.email,
  };

  // El token para tener validez debe ser firmado
  // sign necesita: 1. payload, 2. "secret", 3. duración
  const token = jwt.sign(payload, "secret", { expiresIn: "1h" });

  return { message: "Logged in", token };
};
