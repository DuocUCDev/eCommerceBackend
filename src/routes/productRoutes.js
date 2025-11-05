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
 * Rutas de productos
 * Prefijo: /api/products
 */

// GET /api/products - Listar productos (público con tenant)
router.get('/', extractTenant, getProducts);

// GET /api/products/:id - Obtener producto por ID (público con tenant)
router.get('/:id', extractTenant, getProductById);

// POST /api/products - Crear producto (solo admin)
router.post('/', 
  extractTenant, 
  authenticate, 
  requireRole('admin'), 
  createProduct
);

// PUT /api/products/:id - Actualizar producto (solo admin)
router.put('/:id', 
  extractTenant, 
  authenticate, 
  requireRole('admin'), 
  updateProduct
);

// DELETE /api/products/:id - Desactivar producto (solo admin)
router.delete('/:id', 
  extractTenant, 
  authenticate, 
  requireRole('admin'), 
  deleteProduct
);

module.exports = router;
