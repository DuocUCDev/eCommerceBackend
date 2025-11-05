const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { extractTenant } = require('../middlewares/tenantMiddleware');

/**
 * Rutas de autenticación
 * Prefijo: /api/auth
 * 
 * Todas requieren x-tenant-id pero NO autenticación previa
 */

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', extractTenant, register);

// POST /api/auth/login - Login de usuario
router.post('/login', extractTenant, login);

module.exports = router;
