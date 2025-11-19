const mongoose = require('mongoose');

/**
 * Modelo de Producto
 * Los productos pertenecen a un tenant específico
 */
const productSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'El tenantId es requerido']
  },
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  imagen: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Imagen es opcional
        // Validar formato base64 (con o sin data URI prefix)
        const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,|^[A-Za-z0-9+/]+={0,2}$/;
        return base64Regex.test(v);
      },
      message: 'El formato de la imagen debe ser base64 válido'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice compuesto para facilitar búsquedas por tenant
productSchema.index({ tenantId: 1, name: 1 });

module.exports = mongoose.model('Product', productSchema);

