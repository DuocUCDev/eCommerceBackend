# 🧪 Guía de Pruebas del Backend

## Pruebas Funcionales Manuales

### 1️⃣ Verificar Servidor

```bash
npm start
```

Deberías ver:
```
✅ MongoDB conectado
🚀 Server running on port 3000
```

### 2️⃣ Health Check

```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-05T23:15:48.684Z"
}
```

---

## 🔄 Flujo de Prueba Completo

### Paso 1: Crear un Tenant

```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tienda Demo",
    "slug": "tienda-demo",
    "email": "admin@tiendademo.com",
    "domain": "tiendademo.com"
  }'
```

**Guardar el `_id` del tenant para usar como `x-tenant-id`**

---

### Paso 2: Registrar un Usuario Admin

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -d '{
    "email": "admin@tiendademo.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "Principal",
    "role": "admin"
  }'
```

**Guardar el `token` JWT de la respuesta**

---

### Paso 3: Login del Usuario

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -d '{
    "email": "admin@tiendademo.com",
    "password": "Admin123!"
  }'
```

---

### Paso 4: Crear un Producto (Admin)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "name": "Laptop HP Pavilion",
    "slug": "laptop-hp-pavilion",
    "description": "Laptop potente para trabajo y gaming",
    "price": 15999.99,
    "category": "Electrónica",
    "inventory": {
      "quantity": 50,
      "trackInventory": true,
      "lowStockThreshold": 10
    },
    "images": [{
      "url": "https://example.com/laptop.jpg",
      "alt": "Laptop HP Pavilion",
      "isPrimary": true
    }],
    "tags": ["laptop", "hp", "gaming"],
    "status": "active"
  }'
```

---

### Paso 5: Listar Productos

```bash
# Sin autenticación (público)
curl http://localhost:3000/api/products \
  -H "x-tenant-id: <TENANT_ID>"
```

**Con filtros:**
```bash
curl "http://localhost:3000/api/products?category=Electrónica&minPrice=10000&maxPrice=20000" \
  -H "x-tenant-id: <TENANT_ID>"
```

---

### Paso 6: Registrar un Cliente

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -d '{
    "email": "cliente@example.com",
    "password": "Cliente123!",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+52 1234567890",
    "role": "customer"
  }'
```

**Guardar el nuevo token del cliente**

---

### Paso 7: Añadir al Carrito

```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{
    "productId": "<PRODUCT_ID>",
    "quantity": 2
  }'
```

---

### Paso 8: Ver el Carrito

```bash
curl http://localhost:3000/api/cart \
  -H "x-tenant-id: <TENANT_ID>" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

---

### Paso 9: Crear una Orden

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{
    "paymentMethod": "credit_card",
    "shippingAddress": {
      "firstName": "Juan",
      "lastName": "Pérez",
      "street": "Av. Reforma 123",
      "city": "Ciudad de México",
      "state": "CDMX",
      "zipCode": "01000",
      "country": "México",
      "phone": "+52 1234567890"
    },
    "notes": "Entregar en horario de oficina"
  }'
```

---

### Paso 10: Ver Mis Órdenes

```bash
curl http://localhost:3000/api/orders/my-orders \
  -H "x-tenant-id: <TENANT_ID>" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

---

### Paso 11: Ver Todas las Órdenes (Admin)

```bash
curl http://localhost:3000/api/orders \
  -H "x-tenant-id: <TENANT_ID>" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

### Paso 12: Actualizar Estado de Orden (Admin)

```bash
curl -X PUT http://localhost:3000/api/orders/<ORDER_ID>/status \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "status": "shipped",
    "paymentStatus": "paid",
    "trackingNumber": "TRACK123456789"
  }'
```

---

## 🔍 Verificaciones Importantes

### ✅ Checklist de Pruebas

- [ ] El servidor inicia sin errores
- [ ] MongoDB se conecta exitosamente
- [ ] Se puede crear un tenant
- [ ] Se puede registrar un usuario admin
- [ ] Se puede registrar un usuario customer
- [ ] El login devuelve un token válido
- [ ] Solo admin puede crear productos
- [ ] Cualquiera puede listar productos
- [ ] Solo usuarios autenticados pueden acceder al carrito
- [ ] El carrito se persiste correctamente
- [ ] Se pueden crear órdenes desde el carrito
- [ ] El inventario se reduce al crear una orden
- [ ] Solo admin puede ver todas las órdenes
- [ ] Los clientes solo ven sus propias órdenes
- [ ] La validación de tenant funciona (diferentes tenants no acceden a datos de otros)

---

## 🛡️ Pruebas de Seguridad

### 1. Sin Token (debe fallar)

```bash
curl http://localhost:3000/api/cart
# Esperado: 401 Unauthorized
```

### 2. Sin Tenant ID (debe fallar)

```bash
curl http://localhost:3000/api/products
# Esperado: 401 "Header x-tenant-id es requerido"
```

### 3. Usuario de un tenant accediendo a otro (debe fallar)

```bash
# Registrado en tenant A, intentando acceder con tenant-id B
curl http://localhost:3000/api/cart \
  -H "x-tenant-id: <TENANT_B_ID>" \
  -H "Authorization: Bearer <TOKEN_TENANT_A>"
# Esperado: 401 "Usuario no pertenece al tenant especificado"
```

### 4. Customer intentando crear producto (debe fallar)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{"name": "Test", ...}'
# Esperado: 403 "No tienes permisos para realizar esta acción"
```

---

## 📊 Pruebas de Rendimiento Básicas

### Rate Limiting

Hacer más de 100 requests en 15 minutos desde la misma IP:

```bash
for i in {1..101}; do
  curl http://localhost:3000/health
done
```

**Esperado:** Después de 100 requests, obtener respuesta de rate limit.

---

## 🐛 Casos de Error

### Datos inválidos

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -d '{
    "email": "email-invalido",
    "password": "123"
  }'
# Esperado: 400 con errores de validación
```

### Producto no existente

```bash
curl http://localhost:3000/api/products/507f1f77bcf86cd799439011 \
  -H "x-tenant-id: <TENANT_ID>"
# Esperado: 404 "Producto no encontrado"
```

---

## 🎯 Scripts de Prueba Automatizada

### Script completo de prueba (bash)

Guarda esto como `test.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🧪 Iniciando pruebas del backend..."

# 1. Health check
echo -e "\n1️⃣ Health Check"
curl -s $BASE_URL/health | json_pp

# 2. Crear tenant
echo -e "\n2️⃣ Creando Tenant..."
TENANT_RESPONSE=$(curl -s -X POST $BASE_URL/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Store",
    "slug": "test-store",
    "email": "test@store.com"
  }')
echo $TENANT_RESPONSE | json_pp
TENANT_ID=$(echo $TENANT_RESPONSE | jq -r '.data._id')
echo "Tenant ID: $TENANT_ID"

# Continuar con más pruebas...
```

---

## 📈 Métricas a Monitorear

- Tiempo de respuesta de endpoints
- Tasa de errores por endpoint
- Conexiones activas a MongoDB
- Uso de memoria del servidor
- Número de requests por segundo

---

## 🔧 Troubleshooting

### Error: "Cannot connect to MongoDB"

```bash
# Verificar que las credenciales en .env son correctas
cat .env | grep MONGODB_URI
```

### Error: "Port 3000 already in use"

```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# O cambiar puerto en .env
PORT=3001
```

### Error: "Token inválido"

- Verificar que el token no ha expirado
- Verificar que se está usando el formato correcto: `Bearer <token>`
- Generar un nuevo token haciendo login

---

## 📝 Notas

- Todos los endpoints que modifican datos requieren autenticación
- El header `x-tenant-id` es obligatorio en casi todas las rutas
- Los roles se verifican a nivel de middleware
- El carrito se crea automáticamente al añadir el primer item
- Las órdenes reducen automáticamente el inventario

