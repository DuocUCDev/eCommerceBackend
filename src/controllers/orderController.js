const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Crear orden desde el carrito
 * POST /api/orders
 */
const createOrder = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const userId = req.user.userId;

    // Obtener carrito del usuario
    const cart = await Cart.findOne({ tenantId, userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: 'El carrito está vacío',
        statusCode: 400
      });
    }

    // Preparar items de la orden con precio actual
    const orderItems = [];
    let total = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.productId;

      // Verificar que el producto existe y está activo
      if (!product || !product.isActive) {
        return res.status(400).json({
          message: `Producto ${product?.name || 'desconocido'} no disponible`,
          statusCode: 400
        });
      }

      // Verificar stock
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para ${product.name}`,
          statusCode: 400
        });
      }

      // Agregar item con precio actual
      orderItems.push({
        productId: product._id,
        quantity: cartItem.quantity,
        price: product.price
      });

      total += product.price * cartItem.quantity;
    }

    // Crear orden
    const order = await Order.create({
      tenantId,
      userId,
      items: orderItems,
      total,
      status: 'pending'
    });

    // Reducir stock de productos
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Vaciar carrito
    cart.items = [];
    await cart.save();

    // Poblar la orden con datos de productos
    await order.populate('items.productId');

    res.status(201).json({
      message: 'Orden creada exitosamente',
      statusCode: 201,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar órdenes
 * GET /api/orders
 */
const getOrders = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const userId = req.user.userId;
    const userRole = req.user.role;
    const { page = 1, limit = 10 } = req.query;

    // Filtro base
    const filter = { tenantId };

    // Si no es admin, solo ver sus propias órdenes
    if (userRole !== 'admin') {
      filter.userId = userId;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate('items.productId')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      message: 'Órdenes obtenidas exitosamente',
      statusCode: 200,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener orden por ID
 * GET /api/orders/:id
 */
const getOrderById = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const userId = req.user.userId;
    const userRole = req.user.role;
    const { id } = req.params;

    const filter = { _id: id, tenantId };

    // Si no es admin, solo puede ver sus propias órdenes
    if (userRole !== 'admin') {
      filter.userId = userId;
    }

    const order = await Order.findOne(filter).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        message: 'Orden no encontrada',
        statusCode: 404
      });
    }

    res.status(200).json({
      message: 'Orden obtenida exitosamente',
      statusCode: 200,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar estado de orden (solo admin)
 * PUT /api/orders/:id/status
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const { id } = req.params;
    const { status } = req.body;

    // Validar status
    const validStatuses = ['pending', 'paid', 'shipped', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status inválido. Debe ser uno de: ${validStatuses.join(', ')}`,
        statusCode: 400
      });
    }

    const order = await Order.findOne({ _id: id, tenantId });

    if (!order) {
      return res.status(404).json({
        message: 'Orden no encontrada',
        statusCode: 404
      });
    }

    // Si se cancela, devolver stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } }
        );
      }
    }

    order.status = status;
    await order.save();
    await order.populate('items.productId');

    res.status(200).json({
      message: 'Estado de orden actualizado',
      statusCode: 200,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};
