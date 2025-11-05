const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { extractTenant } = require('../middlewares/tenantMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');

// Aplicar middlewares a todas las rutas
router.use(extractTenant);
router.use(authenticate);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Obtener carrito del usuario
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
 *       200:
 *         description: Carrito obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *   delete:
 *     tags: [Cart]
 *     summary: Vaciar carrito
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
 *       200:
 *         description: Carrito vaciado
 */
router.get('/', getCart);
router.delete('/', clearCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Agregar producto al carrito
 *     security:
 *       - bearerAuth: []
 *       - tenantId: []
 *     parameters:
 *       - in: header
 *         name: x-tenant-id
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
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Producto agregado al carrito
 *       400:
 *         description: Stock insuficiente o datos inválidos
 *       404:
 *         description: Producto no encontrado
 */
router.post('/items', addToCart);

/**
 * @swagger
 * /api/cart/items/{productId}:
 *   put:
 *     tags: [Cart]
 *     summary: Actualizar cantidad de producto
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
 *         name: productId
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
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 example: 5
 *     responses:
 *       200:
 *         description: Cantidad actualizada
 *   delete:
 *     tags: [Cart]
 *     summary: Eliminar producto del carrito
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
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 */
router.put('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeFromCart);

module.exports = router;
