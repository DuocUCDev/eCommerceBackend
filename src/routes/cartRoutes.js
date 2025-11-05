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

/**
 * Rutas de carrito
 * Prefijo: /api/cart
 * 
 * Todas requieren autenticación (customer o admin)
 */

// Aplicar middlewares a todas las rutas
router.use(extractTenant);
router.use(authenticate);

// GET /api/cart - Obtener carrito del usuario
router.get('/', getCart);

// POST /api/cart/items - Agregar producto al carrito
router.post('/items', addToCart);

// PUT /api/cart/items/:productId - Actualizar cantidad
router.put('/items/:productId', updateCartItem);

// DELETE /api/cart/items/:productId - Eliminar producto
router.delete('/items/:productId', removeFromCart);

// DELETE /api/cart - Vaciar carrito
router.delete('/', clearCart);

module.exports = router;
