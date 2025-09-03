import request from "supertest";
import { createTestApp } from "./app.js";
import { setupTestDB, cleanupTestDB, teardownTestDB } from "./setup.js";

const app = createTestApp();

describe("👤 User Endpoints", () => {
  let authToken;
  let createdUserId;

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

  describe("POST /api/user/create", () => {
    it("✅ Debería crear un nuevo usuario exitosamente", async () => {
      const userData = {
        name: "juan",
        lastName: "perez",
        email: "juan.perez@test.com",
        age: 25,
        password: "Test123"
      };

      const response = await request(app)
        .post("/api/user/create")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("message", "User created");
      createdUserId = response.body.userId;
    });

    it("❌ Debería fallar con email duplicado", async () => {
      const userData = {
        name: "juan",
        lastName: "perez",
        email: "juan.perez@test.com",
        age: 25,
        password: "Test123"
      };

      // Crear primer usuario
      await request(app)
        .post("/api/user/create")
        .send(userData)
        .expect(201);

      // Intentar crear segundo usuario con mismo email
      const response = await request(app)
        .post("/api/user/create")
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain("already exists");
    });

    it("❌ Debería fallar con datos inválidos", async () => {
      const invalidUserData = {
        name: "a", // Muy corto
        lastName: "b", // Muy corto
        email: "invalid-email", // Email inválido
        age: 15, // Menor a 16
        password: "123" // Password muy simple
      };

      const response = await request(app)
        .post("/api/user/create")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.message).toBe("Validation error");
    });
  });

  describe("GET /api/user/get", () => {
    beforeEach(async () => {
      // Crear usuario de prueba
      const userData = {
        name: "test",
        lastName: "user",
        email: "test@test.com",
        age: 30,
        password: "Test123"
      };

      await request(app)
        .post("/api/user/create")
        .send(userData);
    });

    it("✅ Debería obtener lista de usuarios", async () => {
      const response = await request(app)
        .get("/api/user/get")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("email");
    });
  });

  describe("POST /api/user/login", () => {
    beforeEach(async () => {
      // Crear usuario para login
      const userData = {
        name: "login",
        lastName: "test",
        email: "login@test.com",
        age: 28,
        password: "Login123"
      };

      await request(app)
        .post("/api/user/create")
        .send(userData);
    });

    it("✅ Debería hacer login exitosamente", async () => {
      const loginData = {
        email: "login@test.com",
        password: "Login123"
      };

      const response = await request(app)
        .post("/api/user/login")
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty("message", "Logged in");
      expect(response.body).toHaveProperty("token");
      authToken = response.body.token;
    });

    it("❌ Debería fallar con credenciales incorrectas", async () => {
      const loginData = {
        email: "login@test.com",
        password: "WrongPassword"
      };

      const response = await request(app)
        .post("/api/user/login")
        .send(loginData)
        .expect(400);

      expect(response.body.message).toContain("incorrect");
    });

    it("❌ Debería fallar con campos faltantes", async () => {
      const loginData = {
        email: "login@test.com"
        // password faltante
      };

      const response = await request(app)
        .post("/api/user/login")
        .send(loginData)
        .expect(400);

      expect(response.body.message).toContain("missing field");
    });
  });

  describe("PUT /api/user/update/:id", () => {
    let userId;
    let token;

    beforeEach(async () => {
      // Crear usuario y hacer login para obtener token
      const userData = {
        name: "update",
        lastName: "test",
        email: "update@test.com",
        age: 26,
        password: "Update123"
      };

      await request(app)
        .post("/api/user/create")
        .send(userData);

      const loginResponse = await request(app)
        .post("/api/user/login")
        .send({ email: "update@test.com", password: "Update123" });

      token = loginResponse.body.token;

      // Obtener el ID del usuario creado
      const usersResponse = await request(app).get("/api/user/get");
      userId = usersResponse.body[0]._id;
    });

    it("✅ Debería actualizar usuario exitosamente", async () => {
      const updateData = {
        name: "updated",
        age: 27
      };

      const response = await request(app)
        .put(`/api/user/update/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(201);

      expect(response.body).toHaveProperty("name", "updated");
      expect(response.body).toHaveProperty("age", 27);
    });

    it("❌ Debería fallar sin token de autorización", async () => {
      const updateData = {
        name: "updated"
      };

      await request(app)
        .put(`/api/user/update/${userId}`)
        .send(updateData)
        .expect(401);
    });
  });

  describe("DELETE /api/user/delete/:id", () => {
    let userId;
    let token;

    beforeEach(async () => {
      // Crear usuario y hacer login
      const userData = {
        name: "delete",
        lastName: "test",
        email: "delete@test.com",
        age: 29,
        password: "Delete123"
      };

      await request(app)
        .post("/api/user/create")
        .send(userData);

      const loginResponse = await request(app)
        .post("/api/user/login")
        .send({ email: "delete@test.com", password: "Delete123" });

      token = loginResponse.body.token;

      // Obtener el ID del usuario
      const usersResponse = await request(app).get("/api/user/get");
      userId = usersResponse.body[0]._id;
    });

    it("✅ Debería eliminar usuario exitosamente", async () => {
      const response = await request(app)
        .delete(`/api/user/delete/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toContain("deleted successfully");
    });

    it("❌ Debería fallar sin token de autorización", async () => {
      await request(app)
        .delete(`/api/user/delete/${userId}`)
        .expect(401);
    });

    it("❌ Debería fallar con ID inexistente", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      
      const response = await request(app)
        .delete(`/api/user/delete/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body.message).toContain("not found");
    });
  });
});
