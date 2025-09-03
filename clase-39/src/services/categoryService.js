import Category from "../models/categoryModel.js";

/**
 * Servicio para manejar la lógica de negocio de categorías
 * Contiene todas las operaciones relacionadas con categorías separadas del controlador
 */

/**
 * Obtener todas las categorías
 * @returns {Array} - Lista de categorías
 * @throws {Error} - Error si no hay categorías o error interno
 */
export const getCategoriesService = async () => {
  const categories = await Category.find();
  
  if (categories.length === 0) {
    const error = new Error("There are no categories");
    error.statusCode = 204;
    throw error;
  }
  
  return categories;
};

/**
 * Crear una nueva categoría
 * @param {string} name - Nombre de la categoría a crear
 * @returns {Object} - Categoría creada
 * @throws {Error} - Error de validación de Mongoose (name único, required, etc.)
 */
export const createCategoryService = async (name) => {
  // Crear nueva instancia de categoría y guardar
  // Las validaciones (unique name, trim, lowercase) son manejadas por Mongoose
  const newCategory = new Category({ name });
  const savedCategory = await newCategory.save();
  return savedCategory;
};

/**
 * Eliminar una categoría por ID
 * @param {string} categoryId - ID de la categoría a eliminar
 * @returns {Object} - Categoría eliminada
 * @throws {Error} - Error si la categoría no existe o error interno
 */
export const deleteCategoryService = async (categoryId) => {
  const categoryExist = await Category.findOne({ _id: categoryId });
  
  if (!categoryExist) {
    const error = new Error("Category does not exist");
    error.statusCode = 400;
    throw error;
  }
  
  const deletedCategory = await Category.findByIdAndDelete(categoryId);
  return deletedCategory;
};
