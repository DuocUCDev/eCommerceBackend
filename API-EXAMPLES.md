# 📡 Ejemplos de Uso de la API

Este documento contiene ejemplos prácticos de todos los endpoints del e-commerce multi-tenant.

## 🔑 Headers Necesarios

Según el endpoint, necesitarás:

```bash
# Para rutas de autenticación y públicas del tenant
x-tenant-id: <TENANT_ID>

# Para rutas protegidas
x-tenant-id: <TENANT_ID>
Authorization: Bearer <JWT_TOKEN>
```

---

## 🚀 Flujo Completo de Uso

### 1️⃣ Crear un Tenant

```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Tienda",
    "slug": "mi-tienda",
    "adminName": "Administrador",
    "adminEmail": "admin@mitienda.com",
    "adminPassword": "Admin123!"
  }'
```

**Respuesta:**
```json
{
  "message": "Tenant creado exitosamente",
  "statusCode": 201,
  "data": {
    "tenant": {
      "id": "690be0c2d9adcf4bd95dec21",
      "name": "Mi Tienda",
      "slug": "mi-tienda",
      "isActive": true,
      "createdAt": "2025-11-05T23:41:54.000Z"
    },
    "admin": {
      "id": "690be0c2d9adcf4bd95dec23",
      "name": "Administrador",
      "email": "admin@mitienda.com",
      "role": "admin"
    }
  }
}
```

**💾 Guardar:** `TENANT_ID` y el email/password del admin

---

### 2️⃣ Login como Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21" \
  -d '{
    "email": "admin@mitienda.com",
    "password": "Admin123!"
  }'
```

**Respuesta:**
```json
{
  "message": "Login exitoso",
  "statusCode": 200,
  "data": {
    "user": {
      "id": "690be0c2d9adcf4bd95dec23",
      "tenantId": "690be0c2d9adcf4bd95dec21",
      "name": "Administrador",
      "email": "admin@mitienda.com",
      "role": "admin",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**💾 Guardar:** `TOKEN` (válido por 7 días)

---

### 3️⃣ Crear Productos (Admin)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Smartphone de última generación",
    "price": 1299.99,
    "stock": 50
  }'
```

**Respuesta:**
```json
{
  "message": "Producto creado exitosamente",
  "statusCode": 201,
  "data": {
    "tenantId": "690be0c2d9adcf4bd95dec21",
    "name": "iPhone 15 Pro",
    "description": "Smartphone de última generación",
    "price": 1299.99,
    "stock": 50,
    "isActive": true,
    "id": "690be123..."
  }
}
```

---

### 4️⃣ Listar Productos (Público)

```bash
curl http://localhost:3000/api/products \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21"
```

**Con filtros:**
```bash
curl "http://localhost:3000/api/products?isActive=true&page=1&limit=10" \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21"
```

---

### 5️⃣ Registrar un Cliente

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "Cliente123!"
  }'
```

**Respuesta:**
```json
{
  "message": "Usuario registrado exitosamente",
  "statusCode": 201,
  "data": {
    "user": {
      "id": "690be456...",
      "tenantId": "690be0c2d9adcf4bd95dec21",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "customer",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 6️⃣ Agregar al Carrito (Cliente)

```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{
    "productId": "690be123...",
    "quantity": 2
  }'
```

---

### 7️⃣ Ver el Carrito

```bash
curl http://localhost:3000/api/cart \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

---

### 8️⃣ Crear una Orden

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

**Respuesta:**
```json
{
  "message": "Orden creada exitosamente",
  "statusCode": 201,
  "data": {
    "tenantId": "690be0c2d9adcf4bd95dec21",
    "userId": "690be456...",
    "items": [
      {
        "productId": "690be123...",
        "quantity": 2,
        "price": 1299.99
      }
    ],
    "total": 2599.98,
    "status": "pending",
    "id": "690be789...",
    "createdAt": "..."
  }
}
```

---

### 9️⃣ Listar Mis Órdenes (Cliente)

```bash
curl http://localhost:3000/api/orders \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

---

### 🔟 Actualizar Estado de Orden (Admin)

```bash
curl -X PUT http://localhost:3000/api/orders/690be789.../status \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "status": "paid"
  }'
```

---

## 🛡️ Ejemplos de Errores

### Error 400 - Falta header x-tenant-id

```bash
curl http://localhost:3000/api/products
```

**Respuesta:**
```json
{
  "message": "Falta el header x-tenant-id",
  "statusCode": 400
}
```

---

### Error 401 - Sin autenticación

```bash
curl http://localhost:3000/api/cart \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21"
```

**Respuesta:**
```json
{
  "message": "Token de autenticación no proporcionado",
  "statusCode": 401
}
```

---

### Error 403 - Sin permisos (customer intentando crear producto)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{"name": "Test", "price": 10, "stock": 5}'
```

**Respuesta:**
```json
{
  "message": "Acceso denegado. Se requiere rol: admin",
  "statusCode": 403
}
```

---

### Error 404 - Producto no encontrado

```bash
curl http://localhost:3000/api/products/507f1f77bcf86cd799439011 \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21"
```

**Respuesta:**
```json
{
  "message": "Producto no encontrado",
  "statusCode": 404
}
```

---

### Error 409 - Email duplicado

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: 690be0c2d9adcf4bd95dec21" \
  -d '{
    "name": "Test",
    "email": "admin@mitienda.com",
    "password": "123456"
  }'
```

**Respuesta:**
```json
{
  "message": "El email ya está registrado en este tenant",
  "statusCode": 409
}
```

---

## 📊 Resumen de Códigos HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Faltan campos o datos inválidos |
| 401 | Unauthorized | Sin autenticación o token inválido |
| 403 | Forbidden | Sin permisos para la acción |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Recurso duplicado (email, slug, etc.) |
| 500 | Server Error | Error interno del servidor |

---

## 🎯 Flujo Típico del Cliente

```
1. POST /api/tenants (crear tenant)
   ↓
2. POST /api/auth/register (registrar cliente)
   ↓
3. POST /api/auth/login (obtener token)
   ↓
4. GET /api/products (ver catálogo)
   ↓
5. POST /api/cart/items (agregar productos)
   ↓
6. GET /api/cart (ver carrito)
   ↓
7. POST /api/orders (crear orden)
   ↓
8. GET /api/orders (ver mis órdenes)
```

---

## 🔐 Seguridad Multi-Tenant

**Importante:** Cada tenant está completamente aislado:

- ❌ Un usuario de Tenant A **NO** puede ver productos de Tenant B
- ❌ Un usuario de Tenant A **NO** puede hacer login con Tenant B
- ❌ Las órdenes, carritos y productos están filtrados por tenantId

**Ejemplo:**

```bash
# Usuario registrado en Tenant A
# Intentando acceder con Tenant B
curl http://localhost:3000/api/cart \
  -H "x-tenant-id: TENANT_B_ID" \
  -H "Authorization: Bearer <TOKEN_FROM_TENANT_A>"

# Resultado: Error o carrito vacío (aislamiento correcto)
```

---

## 📝 Notas Importantes

1. **Passwords**: Nunca se retornan en las respuestas (hasheados con bcrypt)
2. **Stock**: Se valida antes de agregar al carrito y al crear orden
3. **Carrito**: Se vacía automáticamente al crear una orden
4. **Soft Delete**: Los productos se desactivan (`isActive: false`), no se eliminan
5. **Paginación**: Disponible en productos y órdenes
6. **Roles**: `admin` tiene acceso completo, `customer` solo a sus recursos

---

## 🧪 Script de Prueba Completo

Guarda esto como `test-api.sh`:

```bash
#!/bin/bash

BASE="http://localhost:3000"

echo "🧪 Prueba completa de la API"
echo ""

# 1. Crear tenant
echo "1. Creando tenant..."
TENANT=$(curl -s -X POST $BASE/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Store",
    "slug": "test-'$(date +%s)'",
    "adminName": "Admin",
    "adminEmail": "admin@test.com",
    "adminPassword": "Admin123!"
  }')
TENANT_ID=$(echo $TENANT | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "✅ Tenant ID: $TENANT_ID"
echo ""

# 2. Login admin
echo "2. Login como admin..."
LOGIN=$(curl -s -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: $TENANT_ID" \
  -d '{"email":"admin@test.com","password":"Admin123!"}')
TOKEN=$(echo $LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "✅ Token obtenido"
echo ""

# 3. Crear producto
echo "3. Creando producto..."
PRODUCT=$(curl -s -X POST $BASE/api/products \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: $TENANT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Producto Test",
    "description": "Descripción",
    "price": 99.99,
    "stock": 100
  }')
PRODUCT_ID=$(echo $PRODUCT | grep -o '"id":"[^"]*' | grep -v tenant | head -1 | cut -d'"' -f4)
echo "✅ Producto ID: $PRODUCT_ID"
echo ""

# 4. Listar productos
echo "4. Listando productos..."
curl -s $BASE/api/products -H "x-tenant-id: $TENANT_ID" | head -c 100
echo "..."
echo ""

# 5. Registrar cliente
echo "5. Registrando cliente..."
CUSTOMER=$(curl -s -X POST $BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: $TENANT_ID" \
  -d '{
    "name": "Cliente Test",
    "email": "cliente@test.com",
    "password": "Cliente123!"
  }')
CUSTOMER_TOKEN=$(echo $CUSTOMER | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "✅ Cliente registrado"
echo ""

# 6. Agregar al carrito
echo "6. Agregando al carrito..."
curl -s -X POST $BASE/api/cart/items \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: $TENANT_ID" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d "{\"productId\":\"$PRODUCT_ID\",\"quantity\":2}" | head -c 100
echo "..."
echo ""

# 7. Ver carrito
echo "7. Viendo carrito..."
curl -s $BASE/api/cart \
  -H "x-tenant-id: $TENANT_ID" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" | head -c 100
echo "..."
echo ""

# 8. Crear orden
echo "8. Creando orden..."
curl -s -X POST $BASE/api/orders \
  -H "x-tenant-id: $TENANT_ID" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" | head -c 100
echo "..."
echo ""

# 9. Ver mis órdenes
echo "9. Viendo mis órdenes..."
curl -s $BASE/api/orders \
  -H "x-tenant-id: $TENANT_ID" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" | head -c 100
echo "..."
echo ""

echo "✅ Prueba completa finalizada"
```

**Ejecutar:**
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 📚 Documentación Relacionada

- **[README.md](./README.md)** - Documentación principal
- **[QUICKSTART.md](./QUICKSTART.md)** - Inicio rápido
- **[TESTING.md](./TESTING.md)** - Guía de pruebas
- **[GITFLOW.md](./GITFLOW.md)** - Workflow de Git

