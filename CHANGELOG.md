# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.2] - 2025-11-06

### Corregido
- Configuración de Swagger UI para Vercel serverless
- Añadido vercel.json para deployment correcto en Vercel
- Añadido .vercelignore para optimizar deploy
- Middleware de Swagger ajustado para funciones serverless

### Agregado
- Archivo vercel.json para configuración de Vercel
- Archivo .vercelignore
- swaggerOptions con persistAuthorization

## [1.0.1] - 2025-11-06

### Corregido
- Eliminado índice obsoleto `email_1` de colección tenants
- Tenant ahora se crea correctamente sin campo email

## [1.0.0] - 2025-11-05

### Agregado
- Backend e-commerce multi-tenant completo
- Autenticación JWT con bcryptjs
- Sistema multi-tenant con header x-tenant-id
- 5 modelos Mongoose (Tenant, User, Product, Cart, Order)
- 18 endpoints RESTful
- Swagger UI para documentación interactiva
- Middlewares de autenticación y autorización
- Control de acceso por roles (admin, customer)
- Carrito persistente en MongoDB
- Sistema de órdenes con gestión automática de stock
- Seguridad: Helmet, CORS, Rate Limiting
- Logging HTTP con Morgan
- Documentación completa (README, QUICKSTART, TESTING, GITFLOW, API-EXAMPLES)

### Corregido
- Eliminado índice obsoleto `email_1` de colección tenants
- El modelo Tenant ya no requiere campo email
- Índices duplicados en modelo Tenant

### Seguridad
- JWT_SECRET generado con crypto.randomBytes (256 bits)
- Passwords hasheados con bcrypt (salt 10)
- Validación de tenant activo en cada request
- Aislamiento completo de datos por tenant

