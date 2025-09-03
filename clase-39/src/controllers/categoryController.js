import {
  getCategoriesService,
  createCategoryService,
  deleteCategoryService
} from "../services/categoryService.js";

/**
 * Controlador de categorías refactorizado para usar servicios
 * TODO: Ver de añadir varias categorías a la vez
 */

export const getCategories = async (req, res) => {
  try {
    const categories = await getCategoriesService();
    return res.status(200).json(categories);
  } catch (error) {
    // Manejo de errores específicos del servicio
    if (error.statusCode === 204) {
      return res.status(204).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const name = req.body.name;
    const savedCategory = await createCategoryService(name);
    return res.status(201).json(savedCategory);
  } catch (error) {
    // Manejo de errores específicos de Mongoose
    if (error.code === 11000) {
      // Error de duplicado (unique constraint)
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return res.status(400).json({ 
        message: `Category with ${field}: ${value} already exists` 
      });
    }
    if (error.name === "ValidationError") {
      // Errores de validación de Mongoose
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.message 
      });
    }
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await deleteCategoryService(categoryId);
    return res.status(200).json(deletedCategory);
  } catch (error) {
    // Manejo de errores específicos del servicio
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
