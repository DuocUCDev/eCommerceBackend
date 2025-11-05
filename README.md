# E-Commerce Backend Multi-Tenant

Backend robusto y escalable para un e-commerce multi-tenant construido con Node.js, Express y MongoDB.

## 🚀 Características

- **Multi-tenancy**: Base de datos compartida con aislamiento por `tenantId`
- **Autenticación JWT**: Sistema seguro con email y contraseña hasheada
- **Control de acceso**: Roles de usuario (admin, customer)
- **Carrito persistente**: Gestión de carrito por usuario en base de datos
- **Gestión de órdenes**: Sistema completo de pedidos con tracking
- **Arquitectura limpia**: Separación en capas (modelos, controladores, rutas, middlewares)
- **Manejo de errores centralizado**: Respuestas consistentes y claras
- **Validación de datos**: Validación robusta con Joi
- **Seguridad**: CORS, Helmet, Rate Limiting, bcrypt

## 📖 Documentación Adicional

- **[QUICKSTART.md](./QUICKSTART.md)** - Guía de inicio rápido (¡Empieza aquí!)
- **[TESTING.md](./TESTING.md)** - Guía completa de pruebas funcionales
- **[GITFLOW.md](./GITFLOW.md)** - Workflow de Git y convenciones

## 📋 Requisitos Previos

- Node.js >= 14.x
- MongoDB >= 4.x
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd eCommerceBackend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce-multitenant

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3001
```

4. **Iniciar MongoDB**
```bash
# Si usas MongoDB local
mongod
```

5. **Iniciar el servidor**
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
eCommerceBackend/
├── src/
│   ├── config/           # Configuración de la aplicación
│   │   ├── database.js   # Conexión a MongoDB
│   │   └── env.js        # Variables de entorno
│   │
│   ├── models/           # Modelos de Mongoose
│   │   ├── Tenant.js     # Modelo de Tenant
│   │   ├── User.js       # Modelo de Usuario
│   │   ├── Product.js    # Modelo de Producto
│   │   ├── Cart.js       # Modelo de Carrito
│   │   └── Order.js      # Modelo de Orden
│   │
│   ├── controllers/      # Controladores (lógica de negocio)
│   │   ├── tenantController.js
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   │
│   ├── routes/           # Definición de rutas
│   │   ├── tenantRoutes.js
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   │
│   ├── middlewares/      # Middlewares personalizados
│   │   ├── auth.js       # Autenticación y autorización JWT
│   │   ├── tenant.js     # Extracción y validación de tenant
│   │   └── errorHandler.js # Manejo centralizado de errores
│   │
│   ├── utils/            # Utilidades
│   │   ├── jwt.js        # Funciones para JWT
│   │   ├── validators.js # Validadores con Joi
│   │   └── errors.js     # Clases de errores personalizadas
│   │
│   └── server.js         # Punto de entrada de la aplicación
│
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación. Todas las rutas protegidas requieren:

1. **Header de Autenticación**:
```
Authorization: Bearer <token>
```

2. **Header de Tenant** (en la mayoría de rutas):
```
x-tenant-id: <tenant_id>
```

### Flujo de Autenticación

1. Crear un tenant (si no existe)
2. Registrar un usuario con el `x-tenant-id`
3. Hacer login para obtener el token JWT
4. Usar el token en las peticiones subsecuentes

## 📚 API Endpoints

### Health Check

```
GET /health - Verificar estado del servidor
```

### Tenants

```
POST   /api/tenants          - Crear un tenant
GET    /api/tenants          - Obtener todos los tenants
GET    /api/tenants/:id      - Obtener un tenant por ID
PUT    /api/tenants/:id      - Actualizar un tenant
DELETE /api/tenants/:id      - Desactivar un tenant
```

### Autenticación

```
POST   /api/auth/register    - Registrar nuevo usuario
POST   /api/auth/login       - Iniciar sesión
GET    /api/auth/profile     - Obtener perfil (requiere auth)
PUT    /api/auth/profile     - Actualizar perfil (requiere auth)
```

### Usuarios (Admin only)

```
GET    /api/users            - Obtener todos los usuarios
GET    /api/users/:id        - Obtener un usuario por ID
PUT    /api/users/:id        - Actualizar un usuario
DELETE /api/users/:id        - Desactivar un usuario
```

### Productos

```
GET    /api/products                - Obtener todos los productos
GET    /api/products/categories     - Obtener categorías únicas
GET    /api/products/slug/:slug     - Obtener producto por slug
GET    /api/products/:id            - Obtener producto por ID
POST   /api/products                - Crear producto (admin)
PUT    /api/products/:id            - Actualizar producto (admin)
DELETE /api/products/:id            - Eliminar producto (admin)
```

### Carrito

```
GET    /api/cart                    - Obtener carrito del usuario
POST   /api/cart/items              - Añadir producto al carrito
PUT    /api/cart/items/:productId   - Actualizar cantidad
DELETE /api/cart/items/:productId   - Eliminar producto del carrito
DELETE /api/cart                    - Vaciar carrito
```

### Órdenes

```
POST   /api/orders                  - Crear orden desde carrito
GET    /api/orders/my-orders        - Obtener mis órdenes
GET    /api/orders                  - Obtener todas las órdenes (admin)
GET    /api/orders/:id              - Obtener orden por ID
PUT    /api/orders/:id/status       - Actualizar estado (admin)
POST   /api/orders/:id/cancel       - Cancelar orden
```

## 🧪 Ejemplos de Uso

### 1. Crear un Tenant

```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Tienda",
    "slug": "mi-tienda",
    "email": "admin@mitienda.com",
    "domain": "mitienda.com"
  }'
```

### 2. Registrar un Usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "customer"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

### 4. Crear un Producto (Admin)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "name": "Producto Ejemplo",
    "slug": "producto-ejemplo",
    "description": "Descripción del producto",
    "price": 99.99,
    "category": "Electrónica",
    "inventory": {
      "quantity": 100
    }
  }'
```

### 5. Añadir al Carrito

```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "productId": "<PRODUCT_ID>",
    "quantity": 2
  }'
```

### 6. Crear una Orden

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "paymentMethod": "credit_card",
    "shippingAddress": {
      "firstName": "Juan",
      "lastName": "Pérez",
      "street": "Calle Principal 123",
      "city": "Ciudad",
      "state": "Estado",
      "zipCode": "12345",
      "country": "México",
      "phone": "+52 1234567890"
    }
  }'
```

## 🔒 Seguridad

- **Contraseñas hasheadas**: Usando bcryptjs con salt
- **JWT**: Tokens con expiración configurable
- **CORS**: Configurado para orígenes específicos
- **Helmet**: Protección de headers HTTP
- **Rate Limiting**: Prevención de ataques de fuerza bruta
- **Validación de entrada**: Con Joi en todas las rutas
- **Multi-tenancy**: Aislamiento completo de datos por tenant

## 🎯 Roles de Usuario

### Admin
- Gestionar usuarios
- CRUD completo de productos
- Ver todas las órdenes
- Actualizar estado de órdenes

### Customer
- Ver productos
- Gestionar carrito
- Crear órdenes
- Ver sus propias órdenes

## 📊 Modelos de Datos

### Tenant
```javascript
{
  name: String,
  slug: String (unique),
  email: String (unique),
  domain: String,
  status: Enum ['active', 'inactive', 'suspended'],
  settings: {
    currency: String,
    timezone: String,
    language: String
  }
}
```

### User
```javascript
{
  tenantId: ObjectId,
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: Enum ['admin', 'customer'],
  phone: String,
  address: Object,
  status: Enum ['active', 'inactive', 'suspended']
}
```

### Product
```javascript
{
  tenantId: ObjectId,
  name: String,
  slug: String,
  description: String,
  price: Number,
  category: String,
  inventory: {
    quantity: Number,
    trackInventory: Boolean
  },
  status: Enum ['active', 'draft', 'archived']
}
```

### Cart
```javascript
{
  tenantId: ObjectId,
  user: ObjectId,
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  status: Enum ['active', 'completed', 'abandoned']
}
```

### Order
```javascript
{
  tenantId: ObjectId,
  orderNumber: String (auto-generated),
  user: ObjectId,
  items: Array,
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  status: Enum ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  paymentStatus: Enum ['pending', 'paid', 'failed', 'refunded'],
  paymentMethod: String,
  shippingAddress: Object
}
```

## 🧰 Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución
- **Express**: Framework web
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación con tokens
- **Bcrypt**: Hashing de contraseñas
- **Joi**: Validación de datos
- **Helmet**: Seguridad HTTP
- **CORS**: Control de acceso
- **Express Rate Limit**: Limitación de peticiones

## 🚦 Manejo de Errores

El sistema incluye manejo centralizado de errores con respuestas consistentes:

```javascript
{
  success: false,
  message: "Descripción del error",
  errors: [] // Array de errores (opcional)
}
```

Códigos de estado HTTP:
- `200`: Éxito
- `201`: Creado
- `400`: Error de validación
- `401`: No autorizado
- `403`: Prohibido
- `404`: No encontrado
- `409`: Conflicto
- `500`: Error del servidor

## 📝 Mejores Prácticas

- ✅ Separación de responsabilidades
- ✅ Código modular y reutilizable
- ✅ Validación de entrada
- ✅ Manejo de errores robusto
- ✅ Índices en base de datos para optimización
- ✅ Soft delete (desactivación en lugar de eliminación)
- ✅ Paginación en listados
- ✅ Aislamiento de datos por tenant
- ✅ Seguridad en todas las capas

## 🔄 Próximas Mejoras

- [ ] Tests unitarios e integración con Jest
- [ ] Documentación con Swagger/OpenAPI
- [ ] Logging avanzado con Winston
- [ ] Cache con Redis
- [ ] Subida de imágenes con AWS S3
- [ ] Webhooks para eventos
- [ ] Notificaciones por email
- [ ] Métricas y monitoreo

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado siguiendo las mejores prácticas de Node.js y arquitectura limpia.

