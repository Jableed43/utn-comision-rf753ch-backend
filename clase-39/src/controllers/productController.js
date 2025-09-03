import {
  getProductsService,
  createProductService,
  findProductByNameService,
  findProductByIdService,
  updateProductService,
  deleteProductService,
  getStatusService
} from "../services/productService.js";

export const getProducts = async (req, res) => {
  try {
    const products = await getProductsService();
    return res.status(200).json(products);
  } catch (error) {
    // Manejo de errores específicos del servicio
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const savedProduct = await createProductService(req.body);
    return res.status(200).json(savedProduct);
  } catch (error) {
    // Manejo de errores específicos de Mongoose
    if (error.code === 11000) {
      // Error de duplicado (unique constraint)
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return res.status(400).json({ 
        message: `Product with ${field}: ${value} already exists` 
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

export const findProductByName = async (req, res) => {
  try {
    const name = req.body.name;
    const result = await findProductByNameService(name);
    res.status(200).json(result);
  } catch (error) {
    // Manejo de errores específicos del servicio
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const findProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await findProductByIdService(productId);
    res.status(200).json(result);
  } catch (error) {
    // Manejo de errores específicos del servicio
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await updateProductService(productId, req.body);
    res.status(201).json(updatedProduct);
  } catch (error) {
    // Manejo de errores específicos del servicio
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}


export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await deleteProductService(productId);
    res.status(201).json(result);
  } catch (error) {
    // Manejo de errores específicos del servicio
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getStatus = async (req, res) => {
  try {
    const status = await getStatusService();
    return res.status(200).json(status);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};