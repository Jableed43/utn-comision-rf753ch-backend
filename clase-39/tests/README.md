# 🧪 Tests del Backend

Este directorio contiene los tests para nuestro backend de Express con Mongoose.

## 📁 Estructura de Tests

```
tests/
├── setup.js           # Configuración de base de datos en memoria
├── app.js             # Aplicación Express para testing
├── user.test.js       # Tests de endpoints de usuarios
├── category.test.js   # Tests de endpoints de categorías
├── product.test.js    # Tests de endpoints de productos
└── README.md          # Este archivo
```

## 🚀 Comandos Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (recarga automática)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage

# Ejecutar tests con output detallado
npm run test:verbose
```

## 🎯 Cobertura de Tests

### 👤 **User Endpoints**
- ✅ POST `/api/user/create` - Crear usuario
- ✅ GET `/api/user/get` - Obtener usuarios
- ✅ POST `/api/user/login` - Autenticar usuario
- ✅ PUT `/api/user/update/:id` - Actualizar usuario (protegido)
- ✅ DELETE `/api/user/delete/:id` - Eliminar usuario (protegido)

### 🏷️ **Category Endpoints**
- ✅ POST `/api/category/create` - Crear categoría
- ✅ GET `/api/category/get` - Obtener categorías
- ✅ DELETE `/api/category/delete/:id` - Eliminar categoría

### 📦 **Product Endpoints**
- ✅ POST `/api/product/create` - Crear producto
- ✅ GET `/api/product/get` - Obtener productos
- ✅ GET `/api/product/status` - Obtener estados (protegido)
- ✅ GET `/api/product/get-by-id/:id` - Buscar por ID (protegido)
- ✅ POST `/api/product/get-by-name` - Buscar por nombre (protegido)
- ✅ PUT `/api/product/update/:id` - Actualizar producto
- ✅ DELETE `/api/product/delete/:id` - Eliminar producto

## 🔍 Casos de Test Incluidos

### ✅ **Casos Exitosos**
- Creación de entidades con datos válidos
- Búsqueda y listado de datos
- Actualización de registros
- Eliminación de registros
- Autenticación y autorización

### ❌ **Casos de Error**
- Validaciones de Mongoose (datos faltantes, formatos incorrectos)
- Errores de duplicidad (unique constraints)
- Endpoints protegidos sin autorización
- Búsqueda de registros inexistentes
- IDs inválidos

### 🔗 **Casos de Integración**
- Flujos completos CRUD
- Relaciones entre entidades (productos y categorías)
- Secuencias de operaciones

## 🛠️ Tecnologías Utilizadas

- **Jest**: Framework de testing
- **Supertest**: Testing de APIs HTTP
- **MongoDB Memory Server**: Base de datos en memoria para tests
- **Mongoose**: ODM para MongoDB

## 📊 Ejemplo de Ejecución

```bash
$ npm test

> clase-39@1.0.0 test
> node --experimental-vm-modules node_modules/.bin/jest

✅ Connected to in-memory MongoDB for testing

 PASS  tests/category.test.js
 PASS  tests/user.test.js  
 PASS  tests/product.test.js

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        12.34 s

✅ Test database connection closed
```

## 🔧 Configuración

Los tests utilizan:
- **Base de datos en memoria**: No requiere MongoDB instalado
- **Puertos dinámicos**: Sin conflictos con el servidor de desarrollo
- **Cleanup automático**: Cada test empieza con una base limpia
- **Setup/Teardown**: Configuración y limpieza automática

## 💡 Notas Importantes

1. **Aislamiento**: Cada test es independiente y no afecta a otros
2. **Performance**: Los tests son rápidos gracias a la base de datos en memoria
3. **Cobertura**: Se cubren tanto casos exitosos como de error
4. **Realismo**: Los tests usan la misma lógica de negocio que la aplicación real
