import Product, { statusEnum } from "../models/productModel.js";

/**
 * Servicio para manejar la lógica de negocio de productos
 * Contiene todas las operaciones relacionadas con productos separadas del controlador
 */

/**
 * Obtener todos los productos con información de categoría
 * @returns {Array} - Lista de productos con categorías populadas
 * @throws {Error} - Error si no hay productos o error interno
 */
export const getProductsService = async () => {
  // En los productos tenemos categoria que es un esquema aparte
  // Para poder traer dichos datos debemos popular
  const products = await Product.find().populate("category");
  
  if (products.length === 0) {
    const error = new Error("There are no products");
    error.statusCode = 400;
    throw error;
  }

  return products;
};

/**
 * Crear un nuevo producto
 * @param {Object} productData - Datos del producto a crear
 * @returns {Object} - Producto creado
 * @throws {Error} - Error de validación de Mongoose (name único, price, etc.)
 */
export const createProductService = async (productData) => {
  // Crear nueva instancia de producto y guardar
  // Las validaciones (unique name, required fields, etc.) son manejadas por Mongoose
  const newProduct = new Product(productData);
  const savedProduct = await newProduct.save();
  return savedProduct;
};

/**
 * Buscar producto por nombre
 * @param {string} name - Nombre del producto a buscar
 * @returns {Object} - Producto encontrado
 * @throws {Error} - Error si el producto no existe o error interno
 */
export const findProductByNameService = async (name) => {
  // El modelo ya maneja trim y lowercase automáticamente
  const productExist = await Product.findOne({ name });
  
  if (!productExist) {
    const error = new Error(`Product ${name} doesn't exist`);
    error.statusCode = 400;
    throw error;
  }
  
  return { productExist };
};

/**
 * Buscar producto por ID
 * @param {string} productId - ID del producto a buscar
 * @returns {Object} - Producto encontrado
 * @throws {Error} - Error si el producto no existe o error interno
 */
export const findProductByIdService = async (productId) => {
  const productExist = await Product.findOne({ _id: productId });
  
  if (!productExist) {
    const error = new Error(`Product ${productId} doesn't exist`);
    error.statusCode = 400;
    throw error;
  }
  
  return { productExist };
};

/**
 * Actualizar un producto por ID
 * @param {string} productId - ID del producto a actualizar
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} - Producto actualizado
 * @throws {Error} - Error si el producto no existe o error interno
 */
export const updateProductService = async (productId, updateData) => {
  const productExist = await Product.findOne({ _id: productId });
  
  if (!productExist) {
    const error = new Error("Product you're trying to update does not exist");
    error.statusCode = 400;
    throw error;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: productId }, 
    updateData, 
    { new: true }
  );

  return updatedProduct;
};

/**
 * Eliminar un producto por ID
 * @param {string} productId - ID del producto a eliminar
 * @returns {Object} - Resultado de la operación
 * @throws {Error} - Error si el producto no existe o error interno
 */
export const deleteProductService = async (productId) => {
  const productExist = await Product.findOne({ _id: productId });
  
  if (!productExist) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }
  
  await Product.findByIdAndDelete(productId);
  return { message: "Product deleted successfully" };
};

/**
 * Obtener los estados disponibles para productos
 * @returns {Object} - Enumeración de estados
 */
export const getStatusService = async () => {
  return statusEnum;
};
