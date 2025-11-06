const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// =====================
// Conectar a MongoDB
// =====================
connectDB();

// =====================
// Middlewares Globales
// =====================

// Seguridad con Helmet
app.use(helmet());

// CORS
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Logger HTTP con Morgan
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Formato colorido para desarrollo
} else {
  app.use(morgan('combined')); // Formato Apache para producción
}

// Rate limiting - prevenir ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por windowMs
  message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.'
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// Rutas
// =====================

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// =====================
// Documentación Swagger
// =====================

// Configuración especial para Vercel/producción
const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-Commerce API Docs',
  swaggerOptions: {
    persistAuthorization: true
  }
};

// Middleware de Swagger UI - Compatible con Vercel
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Endpoint para obtener la especificación JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// =====================
// Manejo de Errores
// =====================
app.use(errorHandler);

// =====================
// Iniciar Servidor
// =====================
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   🚀 Server running on port ${PORT}                ║
  ║   📦 Environment: ${config.NODE_ENV.padEnd(27)} ║
  ║   🔗 http://localhost:${PORT}                      ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
  `);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;

