import {
  createUserService,
  getUsersService,
  deleteUserService,
  updateUserService,
  validateUserService
} from "../services/userService.js";

/**
 * Controladores: Actúa como intermediario entre el cliente y la lógica de la aplicación. 
 * Recibe solicitudes, las procesa usando servicios y devuelve la respuesta.
 * Los controladores ahora delegan la lógica de negocio a los servicios.
 */

export const createUser = async (req, res) => {
  try {
    const result = await createUserService(req.body);
    // 201 significa que se ha creado un recurso
    res.status(201).json(result);
  } catch (error) {
    // Manejo de errores específicos de Mongoose
    if (error.code === 11000) {
      // Error de duplicado (unique constraint)
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return res.status(400).json({ 
        message: `User with ${field}: ${value} already exists` 
      });
    }
    if (error.name === "ValidationError") {
      // Errores de validación de Mongoose
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.message 
      });
    }
    // 500 es un error genérico del servidor
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await getUsersService();
    // 200 significa que la operación ha sido exitosa
    res.status(200).json(users);
  } catch (error) {
    // Manejo de errores específicos del servicio
    if (error.statusCode === 204) {
      return res.status(204).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // De esta forma obtenemos por path param el id
    // api/user/delete/id
    const userId = req.params.id;
    const result = await deleteUserService(userId);
    return res.status(200).json(result);
  } catch (error) {
    // Manejo de errores específicos del servicio
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await updateUserService(userId, req.body);
    return res.status(201).json(updatedUser);
  } catch (error) {
    // Manejo de errores específicos del servicio
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const validate = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await validateUserService(email, password);
    return res.status(200).json(result);
  } catch (error) {
    // Manejo de errores específicos del servicio
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
