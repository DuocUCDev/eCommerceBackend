const express = require('express');
const router = express.Router();
const { createTenant } = require('../controllers/tenantController');

/**
 * Rutas de tenants
 * Prefijo: /api/tenants
 * 
 * Ruta pública para crear nuevos tenants
 */

// POST /api/tenants - Crear nuevo tenant
router.post('/', createTenant);

module.exports = router;
