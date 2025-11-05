const express = require('express');
const router = express.Router();
const { createTenant } = require('../controllers/tenantController');

/**
 * @swagger
 * /api/tenants:
 *   post:
 *     tags: [Tenants]
 *     summary: Crear nuevo tenant
 *     description: Crea un nuevo tenant con opción de crear admin inicial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mi Tienda
 *               slug:
 *                 type: string
 *                 example: mi-tienda
 *               adminName:
 *                 type: string
 *                 example: Administrador
 *               adminEmail:
 *                 type: string
 *                 format: email
 *                 example: admin@mitienda.com
 *               adminPassword:
 *                 type: string
 *                 format: password
 *                 example: Admin123!
 *     responses:
 *       201:
 *         description: Tenant creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 statusCode:
 *                   type: number
 *                 data:
 *                   type: object
 *                   properties:
 *                     tenant:
 *                       $ref: '#/components/schemas/Tenant'
 *                     admin:
 *                       $ref: '#/components/schemas/User'
 *       409:
 *         description: Slug ya en uso
 */
router.post('/', createTenant);

module.exports = router;
