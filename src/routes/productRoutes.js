const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { extractTenant } = require('../middlewares/tenantMiddleware');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Listar productos
 *     description: Obtiene lista de productos del tenant con filtros y paginación
 *     parameters:
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *   post:
 *     tags: [Products]
 *     summary: Crear producto (Admin)
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
 *               - name
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro
 *               description:
 *                 type: string
 *                 example: Smartphone de última generación
 *               price:
 *                 type: number
 *                 example: 1299.99
 *               stock:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       403:
 *         description: No tiene permisos (requiere rol admin)
 */
router.get('/', extractTenant, getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Obtener producto por ID
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
 *         description: Producto obtenido exitosamente
 *       404:
 *         description: Producto no encontrado
 *   put:
 *     tags: [Products]
 *     summary: Actualizar producto (Admin)
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Producto no encontrado
 *   delete:
 *     tags: [Products]
 *     summary: Desactivar producto (Admin)
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
 *         description: Producto desactivado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', extractTenant, getProductById);

router.post('/', 
  extractTenant, 
  authenticate, 
  requireRole('admin'), 
  createProduct
);

router.put('/:id', 
  extractTenant, 
  authenticate, 
  requireRole('admin'), 
  updateProduct
);

router.delete('/:id', 
  extractTenant, 
  authenticate, 
  requireRole('admin'), 
  deleteProduct
);

module.exports = router;
