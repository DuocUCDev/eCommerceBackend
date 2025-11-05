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

/**
 * Rutas de órdenes
 * Prefijo: /api/orders
 * 
 * Todas requieren autenticación
 */

// Aplicar middlewares a todas las rutas
router.use(extractTenant);
router.use(authenticate);

// POST /api/orders - Crear orden desde carrito
router.post('/', createOrder);

// GET /api/orders - Listar órdenes (customer: sus órdenes, admin: todas)
router.get('/', getOrders);

// GET /api/orders/:id - Obtener orden por ID
router.get('/:id', getOrderById);

// PUT /api/orders/:id/status - Actualizar estado (solo admin)
router.put('/:id/status', requireRole('admin'), updateOrderStatus);

module.exports = router;
