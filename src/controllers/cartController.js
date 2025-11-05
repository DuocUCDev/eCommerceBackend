const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Obtener carrito del usuario
 * GET /api/cart
 */
const getCart = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const userId = req.user.userId;

    let cart = await Cart.findOne({ tenantId, userId }).populate('items.productId');

    // Si no existe carrito, crear uno vacío
    if (!cart) {
      cart = await Cart.create({
        tenantId,
        userId,
        items: []
      });
    }

    res.status(200).json({
      message: 'Carrito obtenido exitosamente',
      statusCode: 200,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Agregar producto al carrito
 * POST /api/cart/items
 */
const addToCart = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    // Validar campos requeridos
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        message: 'Faltan campos requeridos: productId, quantity (mínimo 1)',
        statusCode: 400
      });
    }

    // Verificar que el producto existe y pertenece al tenant
    const product = await Product.findOne({ _id: productId, tenantId, isActive: true });

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado o inactivo',
        statusCode: 404
      });
    }

    // Verificar stock disponible
    if (product.stock < quantity) {
      return res.status(400).json({
        message: 'Stock insuficiente',
        statusCode: 400
      });
    }

    // Buscar o crear carrito
    let cart = await Cart.findOne({ tenantId, userId });

    if (!cart) {
      cart = new Cart({
        tenantId,
        userId,
        items: []
      });
    }

    // Buscar si el producto ya está en el carrito
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId.toString()
    );

    if (existingItemIndex >= 0) {
      // Actualizar cantidad
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Agregar nuevo item
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate('items.productId');

    res.status(200).json({
      message: 'Producto agregado al carrito',
      statusCode: 200,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar cantidad de producto en carrito
 * PUT /api/cart/items/:productId
 */
const updateCartItem = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validar quantity
    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({
        message: 'La cantidad debe ser al menos 1',
        statusCode: 400
      });
    }

    const cart = await Cart.findOne({ tenantId, userId });

    if (!cart) {
      return res.status(404).json({
        message: 'Carrito no encontrado',
        statusCode: 404
      });
    }

    // Buscar el item en el carrito
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId.toString()
    );

    if (itemIndex < 0) {
      return res.status(404).json({
        message: 'Producto no encontrado en el carrito',
        statusCode: 404
      });
    }

    // Verificar stock
    const product = await Product.findOne({ _id: productId, tenantId });
    if (product && product.stock < quantity) {
      return res.status(400).json({
        message: 'Stock insuficiente',
        statusCode: 400
      });
    }

    // Actualizar cantidad
    cart.items[itemIndex].quantity = quantity;

    await cart.save();
    await cart.populate('items.productId');

    res.status(200).json({
      message: 'Cantidad actualizada',
      statusCode: 200,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar producto del carrito
 * DELETE /api/cart/items/:productId
 */
const removeFromCart = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ tenantId, userId });

    if (!cart) {
      return res.status(404).json({
        message: 'Carrito no encontrado',
        statusCode: 404
      });
    }

    // Filtrar el item
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId.toString()
    );

    await cart.save();
    await cart.populate('items.productId');

    res.status(200).json({
      message: 'Producto eliminado del carrito',
      statusCode: 200,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vaciar carrito
 * DELETE /api/cart
 */
const clearCart = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const userId = req.user.userId;

    const cart = await Cart.findOne({ tenantId, userId });

    if (!cart) {
      return res.status(404).json({
        message: 'Carrito no encontrado',
        statusCode: 404
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: 'Carrito vaciado',
      statusCode: 200,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
