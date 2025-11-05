const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Configuración de Swagger para documentación de API
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce Multi-Tenant API',
      version: '1.0.0',
      description: 'API REST para e-commerce multi-tenant con Node.js, Express y MongoDB',
      contact: {
        name: 'API Support',
        email: 'support@ecommerce.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.ecommerce.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido del login'
        },
        tenantId: {
          type: 'apiKey',
          in: 'header',
          name: 'x-tenant-id',
          description: 'ID del tenant para multi-tenancy'
        }
      },
      schemas: {
        Tenant: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Mi Tienda' },
            slug: { type: 'string', example: 'mi-tienda' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            tenantId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan@example.com' },
            role: { type: 'string', enum: ['admin', 'customer'], example: 'customer' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            tenantId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'iPhone 15 Pro' },
            description: { type: 'string', example: 'Smartphone de última generación' },
            price: { type: 'number', example: 1299.99 },
            stock: { type: 'number', example: 50 },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Cart: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            tenantId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                  quantity: { type: 'number', example: 2 }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            tenantId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  quantity: { type: 'number' },
                  price: { type: 'number' }
                }
              }
            },
            total: { type: 'number', example: 2599.98 },
            status: { 
              type: 'string', 
              enum: ['pending', 'paid', 'shipped', 'cancelled'],
              example: 'pending' 
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error description' },
            statusCode: { type: 'number', example: 400 },
            details: { type: 'array', items: { type: 'object' } }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación (registro y login)'
      },
      {
        name: 'Tenants',
        description: 'Gestión de tenants (inquilinos)'
      },
      {
        name: 'Products',
        description: 'Gestión de productos del catálogo'
      },
      {
        name: 'Cart',
        description: 'Carrito de compras persistente'
      },
      {
        name: 'Orders',
        description: 'Gestión de órdenes y pedidos'
      }
    ]
  },
  apis: ['./src/routes/*.js'] // Archivos a escanear para documentación
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerSpec
};

