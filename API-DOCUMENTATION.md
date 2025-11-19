# Documentación de API - E-Commerce Backend

**URL Base:** `https://ecommerce-tenant.vercel.app`

## Tabla de Contenidos

1. [Health Check](#health-check)
2. [Tenants](#tenants)
3. [Autenticación](#autenticación)
4. [Productos](#productos)
5. [Carrito](#carrito)
6. [Órdenes](#órdenes)

---

## Health Check

### Verificar estado del servidor

**Endpoint:** `GET /health`

**URL Completa:** `https://ecommerce-tenant.vercel.app/health`

**Headers:** Ninguno requerido

**Request:** No requiere body

**Response 200:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Tenants

### Crear nuevo tenant

**Endpoint:** `POST /api/tenants`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/tenants`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Mi Tienda",
  "slug": "mi-tienda",
  "adminName": "Administrador",
  "adminEmail": "admin@mitienda.com",
  "adminPassword": "Admin123!"
}
```

**Campos:**
- `name` (string, requerido): Nombre del tenant
- `slug` (string, requerido): Identificador único del tenant (debe ser único)
- `adminName` (string, opcional): Nombre del administrador inicial
- `adminEmail` (string, opcional): Email del administrador inicial
- `adminPassword` (string, opcional): Contraseña del administrador inicial

**Response 201:**
```json
{
  "message": "Tenant creado exitosamente",
  "statusCode": 201,
  "data": {
    "tenant": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Mi Tienda",
      "slug": "mi-tienda",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "admin": {
      "id": "507f1f77bcf86cd799439012",
      "name": "Administrador",
      "email": "admin@mitienda.com",
      "role": "admin"
    }
  }
}
```

**Response 400:**
```json
{
  "message": "Faltan campos requeridos: name, slug",
  "statusCode": 400
}
```

**Response 409:**
```json
{
  "message": "El slug ya está en uso",
  "statusCode": 409
}
```

---

## Autenticación

### Registrar nuevo usuario

**Endpoint:** `POST /api/auth/register`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/auth/register`

**Headers:**
```
Content-Type: application/json
x-tenant-id: 507f1f77bcf86cd799439011
```

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123!",
  "role": "customer"
}
```

**Campos:**
- `name` (string, requerido): Nombre completo del usuario
- `email` (string, requerido): Email del usuario (debe ser único por tenant)
- `password` (string, requerido): Contraseña del usuario
- `role` (string, opcional): Rol del usuario (`admin` o `customer`). Por defecto es `customer`

**Response 201:**
```json
{
  "message": "Usuario registrado exitosamente",
  "statusCode": 201,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439013",
      "tenantId": "507f1f77bcf86cd799439011",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "customer",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response 400:**
```json
{
  "message": "Faltan campos requeridos: name, email, password",
  "statusCode": 400
}
```

**Response 409:**
```json
{
  "message": "El email ya está registrado en este tenant",
  "statusCode": 409
}
```

### Login de usuario

**Endpoint:** `POST /api/auth/login`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/auth/login`

**Headers:**
```
Content-Type: application/json
x-tenant-id: 507f1f77bcf86cd799439011
```

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "Password123!"
}
```

**Campos:**
- `email` (string, requerido): Email del usuario
- `password` (string, requerido): Contraseña del usuario

**Response 200:**
```json
{
  "message": "Login exitoso",
  "statusCode": 200,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439013",
      "tenantId": "507f1f77bcf86cd799439011",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "customer",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response 400:**
```json
{
  "message": "Faltan campos requeridos: email, password",
  "statusCode": 400
}
```

**Response 401:**
```json
{
  "message": "Credenciales inválidas",
  "statusCode": 401
}
```

**Response 403:**
```json
{
  "message": "Usuario inactivo",
  "statusCode": 403
}
```

---

## Productos

### Listar productos

**Endpoint:** `GET /api/products`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/products`

**Headers:**
```
x-tenant-id: 507f1f77bcf86cd799439011
```

**Query Parameters:**
- `isActive` (boolean, opcional): Filtrar por productos activos/inactivos
- `page` (integer, opcional): Número de página (default: 1)
- `limit` (integer, opcional): Cantidad de resultados por página (default: 20)

**Ejemplo:** `https://ecommerce-tenant.vercel.app/api/products?isActive=true&page=1&limit=20`

**Request:** No requiere body

**Response 200:**
```json
{
  "message": "Productos obtenidos exitosamente",
  "statusCode": 200,
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "tenantId": "507f1f77bcf86cd799439011",
        "name": "iPhone 15 Pro",
        "description": "Smartphone de última generación",
        "price": 1299.99,
        "stock": 50,
        "imagen": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
}
```

### Obtener producto por ID

**Endpoint:** `GET /api/products/:id`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/products/507f1f77bcf86cd799439014`

**Headers:**
```
x-tenant-id: 507f1f77bcf86cd799439011
```

**Request:** No requiere body

**Response 200:**
```json
{
  "message": "Producto obtenido exitosamente",
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "tenantId": "507f1f77bcf86cd799439011",
    "name": "iPhone 15 Pro",
    "description": "Smartphone de última generación",
    "price": 1299.99,
    "stock": 50,
    "imagen": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response 404:**
```json
{
  "message": "Producto no encontrado",
  "statusCode": 404
}
```

### Crear producto (Admin)

**Endpoint:** `POST /api/products`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/products`

**Headers:**
```
Content-Type: application/json
x-tenant-id: 507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "name": "iPhone 15 Pro",
  "description": "Smartphone de última generación",
  "price": 1299.99,
  "stock": 50,
  "imagen": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Campos:**
- `name` (string, requerido): Nombre del producto
- `description` (string, opcional): Descripción del producto
- `price` (number, requerido): Precio del producto
- `stock` (number, requerido): Cantidad en stock
- `imagen` (string, opcional): Imagen en formato base64 (máximo 5MB). Formatos soportados: PNG, JPEG, GIF, WEBP

**Response 201:**
```json
{
  "message": "Producto creado exitosamente",
  "statusCode": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "tenantId": "507f1f77bcf86cd799439011",
    "name": "iPhone 15 Pro",
    "description": "Smartphone de última generación",
    "price": 1299.99,
    "stock": 50,
    "imagen": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response 400:**
```json
{
  "message": "Faltan campos requeridos: name, price, stock",
  "statusCode": 400
}
```

**Response 403:**
```json
{
  "message": "No tiene permisos (requiere rol admin)",
  "statusCode": 403
}
```

### Actualizar producto (Admin)

**Endpoint:** `PUT /api/products/:id`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/products/507f1f77bcf86cd799439014`

**Headers:**
```
Content-Type: application/json
x-tenant-id: 507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "name": "iPhone 15 Pro Max",
  "description": "Smartphone de última generación - Edición Max",
  "price": 1399.99,
  "stock": 30,
  "imagen": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "isActive": true
}
```

**Campos (todos opcionales):**
- `name` (string): Nombre del producto
- `description` (string): Descripción del producto
- `price` (number): Precio del producto
- `stock` (number): Cantidad en stock
- `imagen` (string | null): Imagen en formato base64. Enviar `null` o cadena vacía para eliminar la imagen
- `isActive` (boolean): Estado activo/inactivo del producto

**Response 200:**
```json
{
  "message": "Producto actualizado exitosamente",
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "tenantId": "507f1f77bcf86cd799439011",
    "name": "iPhone 15 Pro Max",
    "description": "Smartphone de última generación - Edición Max",
    "price": 1399.99,
    "stock": 30,
    "imagen": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Response 403:**
```json
{
  "message": "Sin permisos",
  "statusCode": 403
}
```

**Response 404:**
```json
{
  "message": "Producto no encontrado",
  "statusCode": 404
}
```

### Desactivar producto (Admin)

**Endpoint:** `DELETE /api/products/:id`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/products/507f1f77bcf86cd799439014`

**Headers:**
```
x-tenant-id: 507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request:** No requiere body

**Response 200:**
```json
{
  "message": "Producto desactivado exitosamente",
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "tenantId": "507f1f77bcf86cd799439011",
    "name": "iPhone 15 Pro",
    "isActive": false,
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Response 403:**
```json
{
  "message": "Sin permisos",
  "statusCode": 403
}
```

**Response 404:**
```json
{
  "message": "Producto no encontrado",
  "statusCode": 404
}
```

---

## Carrito

### Obtener carrito del usuario

**Endpoint:** `GET /api/cart`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/cart`

**Headers:**
```
x-tenant-id: 507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request:** No requiere body

**Response 200:**
```json
{
  "message": "Carrito obtenido exitosamente",
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "tenantId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439013",
    "items": [
      {
        "productId": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "iPhone 15 Pro",
          "price": 1299.99,
          "stock": 50,
          "imagen": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
        },
        "quantity": 2
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

### Agregar producto al carrito

**Endpoint:** `POST /api/cart/items`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/cart/items`

**Headers:**
```
Content-Type: application/json
x-tenant-id: 507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439014",
  "quantity": 2
}
```

**Campos:**
- `productId` (string, requerido): ID del producto
- `quantity` (number, requerido): Cantidad a agregar (mínimo 1)

**Response 200:**
```json
{
  "message": "Producto agregado al carrito",
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "tenantId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439013",
    "items": [
      {
        "productId": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "iPhone 15 Pro",
          "price": 1299.99
        },
        "quantity": 2
      }
    ]
  }
}
```

**Response 400:**
```json
{
  "message": "Faltan campos requeridos: productId, quantity (mínimo 1)",
  "statusCode": 400
}
```

**Response 404:**
```json
{
  "message": "Producto no encontrado o inactivo",
  "statusCode": 404
}
```

### Actualizar cantidad de producto en carrito

**Endpoint:** `PUT /api/cart/items/:productId`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/cart/items/507f1f77bcf86cd799439014`

**Headers:**
```
Content-Type: application/json
x-tenant-id: 507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "quantity": 5
}
```

**Campos:**
- `quantity` (number, requerido): Nueva cantidad (mínimo 1)

**Response 200:**
```json
{
  "message": "Cantidad actualizada",
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "tenantId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439013",
    "items": [
      {
        "productId": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "iPhone 15 Pro",
          "price": 1299.99
        },
        "quantity": 5
      }
    ]
  }
}
```

**Response 400:**
```json
{
  "message": "La cantidad debe ser al menos 1",
  "statusCode": 400
}
```

**Response 404:**
```json
{
  "message": "Producto no encontrado en el carrito",
  "statusCode": 404
}
```

### Eliminar producto del carrito

**Endpoint:** `DELETE /api/cart/items/:productId`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/cart/items/507f1f77bcf86cd799439014`

**Headers:**
```
x-tenant-id: 507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request:** No requiere body

**Response 200:**
```json
{
  "message": "Producto eliminado del carrito",
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "tenantId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439013",
    "items": [],
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

**Response 404:**
```json
{
  "message": "Carrito no encontrado",
  "statusCode": 404
}
```

### Vaciar carrito

**Endpoint:** `DELETE /api/cart`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/cart`

**Headers:**
```
x-tenant-id: 507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request:** No requiere body

**Response 200:**
```json
{
  "message": "Carrito vaciado",
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "tenantId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439013",
    "items": [],
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

**Response 404:**
```json
{
  "message": "Carrito no encontrado",
  "statusCode": 404
}
```

---

## Órdenes

### Crear orden desde carrito

**Endpoint:** `POST /api/orders`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/orders`

**Headers:**
```
x-tenant-id: 507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request:** No requiere body (usa el carrito del usuario autenticado)

**Response 201:**
```json
{
  "message": "Orden creada exitosamente",
  "statusCode": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "tenantId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439013",
    "items": [
      {
        "productId": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "iPhone 15 Pro",
          "price": 1299.99
        },
        "quantity": 2,
        "price": 1299.99
      }
    ],
    "total": 2599.98,
    "status": "pending",
    "createdAt": "2024-01-15T10:45:00.000Z",
    "updatedAt": "2024-01-15T10:45:00.000Z"
  }
}
```

**Response 400:**
```json
{
  "message": "El carrito está vacío",
  "statusCode": 400
}
```

### Listar órdenes

**Endpoint:** `GET /api/orders`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/orders`

**Headers:**
```
x-tenant-id: 507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `page` (integer, opcional): Número de página (default: 1)
- `limit` (integer, opcional): Cantidad de resultados por página (default: 10)

**Ejemplo:** `https://ecommerce-tenant.vercel.app/api/orders?page=1&limit=10`

**Nota:** 
- Los usuarios con rol `customer` solo ven sus propias órdenes
- Los usuarios con rol `admin` ven todas las órdenes del tenant

**Request:** No requiere body

**Response 200:**
```json
{
  "message": "Órdenes obtenidas exitosamente",
  "statusCode": 200,
  "data": {
    "orders": [
      {
        "_id": "507f1f77bcf86cd799439016",
        "tenantId": "507f1f77bcf86cd799439011",
        "userId": "507f1f77bcf86cd799439013",
        "items": [
          {
            "productId": {
              "_id": "507f1f77bcf86cd799439014",
              "name": "iPhone 15 Pro",
              "price": 1299.99
            },
            "quantity": 2,
            "price": 1299.99
          }
        ],
        "total": 2599.98,
        "status": "pending",
        "createdAt": "2024-01-15T10:45:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
```

### Obtener orden por ID

**Endpoint:** `GET /api/orders/:id`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/orders/507f1f77bcf86cd799439016`

**Headers:**
```
x-tenant-id: 507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request:** No requiere body

**Nota:** 
- Los usuarios con rol `customer` solo pueden ver sus propias órdenes
- Los usuarios con rol `admin` pueden ver cualquier orden del tenant

**Response 200:**
```json
{
  "message": "Orden obtenida exitosamente",
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "tenantId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439013",
    "items": [
      {
        "productId": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "iPhone 15 Pro",
          "price": 1299.99
        },
        "quantity": 2,
        "price": 1299.99
      }
    ],
    "total": 2599.98,
    "status": "pending",
    "createdAt": "2024-01-15T10:45:00.000Z",
    "updatedAt": "2024-01-15T10:45:00.000Z"
  }
}
```

**Response 404:**
```json
{
  "message": "Orden no encontrada",
  "statusCode": 404
}
```

### Actualizar estado de orden (Admin)

**Endpoint:** `PUT /api/orders/:id/status`

**URL Completa:** `https://ecommerce-tenant.vercel.app/api/orders/507f1f77bcf86cd799439016/status`

**Headers:**
```
Content-Type: application/json
x-tenant-id: 507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "status": "paid"
}
```

**Campos:**
- `status` (string, requerido): Nuevo estado de la orden. Valores permitidos: `pending`, `paid`, `shipped`, `cancelled`

**Nota:** Si se cancela una orden, el stock de los productos se devuelve automáticamente.

**Response 200:**
```json
{
  "message": "Estado de orden actualizado",
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "tenantId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439013",
    "items": [
      {
        "productId": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "iPhone 15 Pro"
        },
        "quantity": 2,
        "price": 1299.99
      }
    ],
    "total": 2599.98,
    "status": "paid",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Response 400:**
```json
{
  "message": "Status inválido. Debe ser uno de: pending, paid, shipped, cancelled",
  "statusCode": 400
}
```

**Response 403:**
```json
{
  "message": "Sin permisos (requiere admin)",
  "statusCode": 403
}
```

**Response 404:**
```json
{
  "message": "Orden no encontrada",
  "statusCode": 404
}
```

---

## Notas Importantes

### Autenticación

- La mayoría de los endpoints requieren autenticación mediante JWT token en el header `Authorization: Bearer <token>`
- El token se obtiene al hacer login o registro exitoso
- Todos los endpoints (excepto `/api/tenants` y `/api/auth/*`) requieren el header `x-tenant-id`

### Headers Comunes

- `x-tenant-id`: ID del tenant (requerido en la mayoría de endpoints)
- `Authorization: Bearer <token>`: Token JWT (requerido para endpoints protegidos)
- `Content-Type: application/json`: Para requests con body

### Códigos de Estado HTTP

- `200`: OK - Operación exitosa
- `201`: Created - Recurso creado exitosamente
- `400`: Bad Request - Error en la solicitud (campos faltantes, datos inválidos)
- `401`: Unauthorized - No autenticado o credenciales inválidas
- `403`: Forbidden - Sin permisos (requiere rol específico)
- `404`: Not Found - Recurso no encontrado
- `409`: Conflict - Conflicto (ej: email o slug ya existe)

### Roles de Usuario

- `customer`: Usuario regular que puede comprar productos
- `admin`: Administrador que puede gestionar productos y órdenes

### Formato de Imágenes

- Las imágenes se envían y reciben en formato base64
- Formatos soportados: PNG, JPEG, GIF, WEBP
- Tamaño máximo: 5MB
- Formato esperado: `data:image/<tipo>;base64,<datos>` o solo los datos base64

### Paginación

- Los endpoints que soportan paginación usan los parámetros `page` y `limit`
- La respuesta incluye información de paginación con `total`, `page`, `limit` y `pages`

