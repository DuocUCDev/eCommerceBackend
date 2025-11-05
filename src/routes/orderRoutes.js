const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { extractTenant } = require('../middlewares/tenantMiddleware');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');

// Aplicar middlewares a todas las rutas
router.use(extractTenant);
router.use(authenticate);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Crear orden desde carrito
 *     description: Crea una orden con los items del carrito actual, reduce stock y vacía el carrito
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     parameters:
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Carrito vacío o stock insuficiente
 *   get:
 *     tags: [Orders]
 *     summary: Listar órdenes
 *     description: Customer ve sus órdenes, Admin ve todas del tenant
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     parameters:
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de órdenes obtenida exitosamente
 */
router.post('/', createOrder);
router.get('/', getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Obtener orden por ID
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     parameters:
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden obtenida exitosamente
 *       404:
 *         description: Orden no encontrada
 */
router.get('/:id', getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Actualizar estado de orden (Admin)
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     parameters:
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, cancelled]
 *                 example: paid
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       403:
 *         description: Sin permisos (requiere admin)
 *       404:
 *         description: Orden no encontrada
 */
router.put('/:id/status', requireRole('admin'), updateOrderStatus);

module.exports = router;
