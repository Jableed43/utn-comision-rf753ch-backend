import request from "supertest";
import { createTestApp } from "./app.js";
import { setupTestDB, cleanupTestDB, teardownTestDB } from "./setup.js";

const app = createTestApp();

describe("🏷️ Category Endpoints", () => {
  // Setup antes de todos los tests
  beforeAll(async () => {
    await setupTestDB();
  });

  // Cleanup después de cada test
  afterEach(async () => {
    await cleanupTestDB();
  });

  // Teardown después de todos los tests
  afterAll(async () => {
    await teardownTestDB();
  });

  describe("POST /api/category/create", () => {
    it("✅ Debería crear una nueva categoría exitosamente", async () => {
      const categoryData = {
        name: "Electrónicos"
      };

      const response = await request(app)
        .post("/api/category/create")
        .send(categoryData)
        .expect(201);

      expect(response.body).toHaveProperty("name", "electrónicos"); // lowercase automático
      expect(response.body).toHaveProperty("_id");
    });

    it("❌ Debería fallar con nombre duplicado", async () => {
      const categoryData = {
        name: "Electrónicos"
      };

      // Crear primera categoría
      await request(app)
        .post("/api/category/create")
        .send(categoryData)
        .expect(201);

      // Intentar crear segunda categoría con mismo nombre
      const response = await request(app)
        .post("/api/category/create")
        .send(categoryData)
        .expect(400);

      expect(response.body.message).toContain("already exists");
    });

    it("❌ Debería fallar sin nombre", async () => {
      const categoryData = {};

      const response = await request(app)
        .post("/api/category/create")
        .send(categoryData)
        .expect(400);

      expect(response.body.message).toBe("Validation error");
    });

    it("✅ Debería manejar espacios y mayúsculas automáticamente", async () => {
      const categoryData = {
        name: "  ROPA Y ACCESORIOS  "
      };

      const response = await request(app)
        .post("/api/category/create")
        .send(categoryData)
        .expect(201);

      expect(response.body.name).toBe("ropa y accesorios"); // trim + lowercase
    });
  });

  describe("GET /api/category/get", () => {
    beforeEach(async () => {
      // Crear categorías de prueba
      const categories = ["Electrónicos", "Ropa", "Hogar"];
      
      for (const categoryName of categories) {
        await request(app)
          .post("/api/category/create")
          .send({ name: categoryName });
      }
    });

    it("✅ Debería obtener lista de categorías", async () => {
      const response = await request(app)
        .get("/api/category/get")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("_id");
    });

    it("📋 Debería devolver mensaje cuando no hay categorías", async () => {
      // Limpiar todas las categorías
      await cleanupTestDB();

      const response = await request(app)
        .get("/api/category/get")
        .expect(204);

      expect(response.body.message).toContain("no categories");
    });
  });

  describe("DELETE /api/category/delete/:id", () => {
    let categoryId;

    beforeEach(async () => {
      // Crear categoría para eliminar
      const categoryResponse = await request(app)
        .post("/api/category/create")
        .send({ name: "Categoría a eliminar" });

      categoryId = categoryResponse.body._id;
    });

    it("✅ Debería eliminar categoría exitosamente", async () => {
      const response = await request(app)
        .delete(`/api/category/delete/${categoryId}`)
        .expect(200);

      expect(response.body).toHaveProperty("name", "categoría a eliminar");
      expect(response.body).toHaveProperty("_id", categoryId);
    });

    it("❌ Debería fallar con ID inexistente", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .delete(`/api/category/delete/${fakeId}`)
        .expect(400);

      expect(response.body.message).toContain("does not exist");
    });

    it("❌ Debería fallar con ID inválido", async () => {
      const invalidId = "invalid-id";

      await request(app)
        .delete(`/api/category/delete/${invalidId}`)
        .expect(500); // Error interno por ID inválido
    });
  });

  describe("🔗 Casos de integración", () => {
    it("✅ Debería crear, listar y eliminar categorías en secuencia", async () => {
      // 1. Crear categoría
      const createResponse = await request(app)
        .post("/api/category/create")
        .send({ name: "Test Integration" })
        .expect(201);

      const categoryId = createResponse.body._id;

      // 2. Verificar que aparece en la lista
      const listResponse = await request(app)
        .get("/api/category/get")
        .expect(200);

      expect(listResponse.body).toHaveLength(1);
      expect(listResponse.body[0].name).toBe("test integration");

      // 3. Eliminar categoría
      await request(app)
        .delete(`/api/category/delete/${categoryId}`)
        .expect(200);

      // 4. Verificar que ya no aparece en la lista
      const emptyListResponse = await request(app)
        .get("/api/category/get")
        .expect(204);

      expect(emptyListResponse.body.message).toContain("no categories");
    });

    it("✅ Debería crear múltiples categorías con nombres similares", async () => {
      const categories = [
        "Electrónicos",
        "Electrodomésticos",
        "Electrónica"
      ];

      // Crear todas las categorías
      for (const categoryName of categories) {
        await request(app)
          .post("/api/category/create")
          .send({ name: categoryName })
          .expect(201);
      }

      // Verificar que todas existen
      const response = await request(app)
        .get("/api/category/get")
        .expect(200);

      expect(response.body).toHaveLength(3);
    });
  });
});
