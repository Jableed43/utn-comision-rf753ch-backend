import request from "supertest";
import { createTestApp } from "./app.js";
import { setupTestDB, cleanupTestDB, teardownTestDB } from "./setup.js";

const app = createTestApp();

describe("📦 Product Endpoints", () => {
  let categoryId;
  let authToken;

  // Setup antes de todos los tests
  beforeAll(async () => {
    await setupTestDB();

    // Crear categoría para usar en productos
    const categoryResponse = await request(app)
      .post("/api/category/create")
      .send({ name: "Electrónicos" });
    categoryId = categoryResponse.body._id;

    // Crear usuario y obtener token para endpoints protegidos
    await request(app)
      .post("/api/user/create")
      .send({
        name: "test",
        lastName: "user",
        email: "test@test.com",
        age: 25,
        password: "Test123"
      });

    const loginResponse = await request(app)
      .post("/api/user/login")
      .send({ email: "test@test.com", password: "Test123" });
    
    authToken = loginResponse.body.token;
  });

  // Cleanup después de cada test
  afterEach(async () => {
    // Solo limpiar productos, mantener categoría y usuario
    const collections = await import("mongoose").then(m => m.default.connection.collections);
    if (collections.products) {
      await collections.products.deleteMany({});
    }
  });

  // Teardown después de todos los tests
  afterAll(async () => {
    await teardownTestDB();
  });

  describe("POST /api/product/create", () => {
    it("✅ Debería crear un nuevo producto exitosamente", async () => {
      const productData = {
        name: "iPhone 15",
        price: 999.99,
        description: "Último modelo de iPhone",
        category: categoryId,
        stock: 10
      };

      const response = await request(app)
        .post("/api/product/create")
        .send(productData)
        .expect(200);

      expect(response.body).toHaveProperty("name", "iphone 15"); // lowercase automático
      expect(response.body).toHaveProperty("price", 999.99);
      expect(response.body).toHaveProperty("category", categoryId);
      expect(response.body).toHaveProperty("_id");
    });

    it("❌ Debería fallar con nombre duplicado", async () => {
      const productData = {
        name: "Samsung Galaxy",
        price: 899.99,
        category: categoryId
      };

      // Crear primer producto
      await request(app)
        .post("/api/product/create")
        .send(productData)
        .expect(200);

      // Intentar crear segundo producto con mismo nombre
      const response = await request(app)
        .post("/api/product/create")
        .send(productData)
        .expect(400);

      expect(response.body.message).toContain("already exists");
    });

    it("❌ Debería fallar con datos faltantes", async () => {
      const invalidProductData = {
        // name faltante (required)
        price: 100
        // price faltante (required)
      };

      const response = await request(app)
        .post("/api/product/create")
        .send(invalidProductData)
        .expect(400);

      expect(response.body.message).toBe("Validation error");
    });

    it("❌ Debería fallar con precio negativo", async () => {
      const invalidProductData = {
        name: "Producto Inválido",
        price: -50, // Precio negativo
        category: categoryId
      };

      const response = await request(app)
        .post("/api/product/create")
        .send(invalidProductData)
        .expect(400);

      expect(response.body.message).toBe("Validation error");
    });
  });

  describe("GET /api/product/get", () => {
    beforeEach(async () => {
      // Crear productos de prueba
      const products = [
        { name: "Laptop Dell", price: 799.99, category: categoryId },
        { name: "Mouse Inalámbrico", price: 29.99, category: categoryId },
        { name: "Teclado Mecánico", price: 149.99, category: categoryId }
      ];

      for (const product of products) {
        await request(app)
          .post("/api/product/create")
          .send(product);
      }
    });

    it("✅ Debería obtener lista de productos con categorías populadas", async () => {
      const response = await request(app)
        .get("/api/product/get")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("price");
      expect(response.body[0]).toHaveProperty("category");
      // Verificar que la categoría está populada
      expect(response.body[0].category).toHaveProperty("name");
    });

    it("❌ Debería devolver error cuando no hay productos", async () => {
      // Limpiar productos
      const collections = await import("mongoose").then(m => m.default.connection.collections);
      if (collections.products) {
        await collections.products.deleteMany({});
      }

      const response = await request(app)
        .get("/api/product/get")
        .expect(400);

      expect(response.body.message).toContain("no products");
    });
  });

  describe("GET /api/product/status", () => {
    it("✅ Debería obtener estados disponibles con autorización", async () => {
      const response = await request(app)
        .get("/api/product/status")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toContain("AVAILABLE");
      expect(response.body).toContain("NOT AVAILABLE");
      expect(response.body).toContain("DISCONTINUED");
    });

    it("❌ Debería fallar sin token de autorización", async () => {
      await request(app)
        .get("/api/product/status")
        .expect(401);
    });
  });

  describe("GET /api/product/get-by-id/:id", () => {
    let productId;

    beforeEach(async () => {
      const productResponse = await request(app)
        .post("/api/product/create")
        .send({
          name: "Producto para buscar",
          price: 199.99,
          category: categoryId
        });
      
      productId = productResponse.body._id;
    });

    it("✅ Debería encontrar producto por ID con autorización", async () => {
      const response = await request(app)
        .get(`/api/product/get-by-id/${productId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.productExist).toHaveProperty("name", "producto para buscar");
      expect(response.body.productExist).toHaveProperty("_id", productId);
    });

    it("❌ Debería fallar sin autorización", async () => {
      await request(app)
        .get(`/api/product/get-by-id/${productId}`)
        .expect(401);
    });

    it("❌ Debería fallar con ID inexistente", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .get(`/api/product/get-by-id/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.message).toContain("doesn't exist");
    });
  });

  describe("POST /api/product/get-by-name", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/product/create")
        .send({
          name: "Producto Específico",
          price: 299.99,
          category: categoryId
        });
    });

    it("✅ Debería encontrar producto por nombre con autorización", async () => {
      const response = await request(app)
        .post("/api/product/get-by-name")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Producto Específico" })
        .expect(200);

      expect(response.body.productExist).toHaveProperty("name", "producto específico");
    });

    it("✅ Debería encontrar producto independientemente de mayúsculas/espacios", async () => {
      const response = await request(app)
        .post("/api/product/get-by-name")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "  PRODUCTO ESPECÍFICO  " })
        .expect(200);

      expect(response.body.productExist).toHaveProperty("name", "producto específico");
    });

    it("❌ Debería fallar sin autorización", async () => {
      await request(app)
        .post("/api/product/get-by-name")
        .send({ name: "Producto Específico" })
        .expect(401);
    });

    it("❌ Debería fallar con nombre inexistente", async () => {
      const response = await request(app)
        .post("/api/product/get-by-name")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Producto Inexistente" })
        .expect(400);

      expect(response.body.message).toContain("doesn't exist");
    });
  });

  describe("PUT /api/product/update/:id", () => {
    let productId;

    beforeEach(async () => {
      const productResponse = await request(app)
        .post("/api/product/create")
        .send({
          name: "Producto a actualizar",
          price: 199.99,
          category: categoryId
        });
      
      productId = productResponse.body._id;
    });

    it("✅ Debería actualizar producto exitosamente", async () => {
      const updateData = {
        name: "Producto actualizado",
        price: 249.99,
        description: "Descripción actualizada"
      };

      const response = await request(app)
        .put(`/api/product/update/${productId}`)
        .send(updateData)
        .expect(201);

      expect(response.body).toHaveProperty("name", "producto actualizado");
      expect(response.body).toHaveProperty("price", 249.99);
      expect(response.body).toHaveProperty("description", "Descripción actualizada");
    });

    it("❌ Debería fallar con ID inexistente", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      
      const response = await request(app)
        .put(`/api/product/update/${fakeId}`)
        .send({ price: 299.99 })
        .expect(400);

      expect(response.body.message).toContain("does not exist");
    });
  });

  describe("DELETE /api/product/delete/:id", () => {
    let productId;

    beforeEach(async () => {
      const productResponse = await request(app)
        .post("/api/product/create")
        .send({
          name: "Producto a eliminar",
          price: 99.99,
          category: categoryId
        });
      
      productId = productResponse.body._id;
    });

    it("✅ Debería eliminar producto exitosamente", async () => {
      const response = await request(app)
        .delete(`/api/product/delete/${productId}`)
        .expect(201);

      expect(response.body.message).toContain("deleted successfully");
    });

    it("❌ Debería fallar con ID inexistente", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .delete(`/api/product/delete/${fakeId}`)
        .expect(404);

      expect(response.body.message).toContain("not found");
    });
  });

  describe("🔗 Casos de integración", () => {
    it("✅ Debería crear, buscar, actualizar y eliminar producto completo", async () => {
      // 1. Crear producto
      const createResponse = await request(app)
        .post("/api/product/create")
        .send({
          name: "Producto Integración",
          price: 599.99,
          description: "Producto de prueba integral",
          category: categoryId,
          stock: 5
        })
        .expect(200);

      const productId = createResponse.body._id;

      // 2. Buscar por ID
      const findResponse = await request(app)
        .get(`/api/product/get-by-id/${productId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(findResponse.body.productExist.name).toBe("producto integración");

      // 3. Actualizar producto
      const updateResponse = await request(app)
        .put(`/api/product/update/${productId}`)
        .send({ price: 649.99, stock: 8 })
        .expect(201);

      expect(updateResponse.body.price).toBe(649.99);
      expect(updateResponse.body.stock).toBe(8);

      // 4. Verificar en lista general
      const listResponse = await request(app)
        .get("/api/product/get")
        .expect(200);

      const updatedProduct = listResponse.body.find(p => p._id === productId);
      expect(updatedProduct.price).toBe(649.99);

      // 5. Eliminar producto
      await request(app)
        .delete(`/api/product/delete/${productId}`)
        .expect(201);

      // 6. Verificar que ya no existe
      await request(app)
        .get(`/api/product/get-by-id/${productId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);
    });
  });
});
