const mongoose = require('mongoose');

/**
 * Modelo de Carrito de Compras
 * Carrito persistente por usuario
 */
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'El productId es requerido']
  },
  quantity: {
    type: Number,
    required: [true, 'La cantidad es requerida'],
    min: [1, 'La cantidad debe ser al menos 1']
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'El tenantId es requerido']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El userId es requerido']
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

// Índice compuesto para búsquedas por tenant y usuario
cartSchema.index({ tenantId: 1, userId: 1 });

module.exports = mongoose.model('Cart', cartSchema);

