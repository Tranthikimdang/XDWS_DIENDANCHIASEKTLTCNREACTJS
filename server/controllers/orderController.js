// controllers/orderController.js

const { Order, User, Cart } = require('../models'); // Import from centralized models

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { user_id, cart_id, total_amount, payment_method, order_status, payment_status } = req.body;

    // Validate required fields
    if (!user_id || !cart_id || !total_amount || !payment_method) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Validate if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User is not associated to Order!' });
    }

    // Validate if cart exists
    const cart = await Cart.findByPk(cart_id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart is not associated to Order!' });
    }

    // Optional: Check if the cart is already associated with an order
    const existingOrder = await Order.findOne({ where: { cart_id } });
    if (existingOrder) {
      return res.status(400).json({ message: 'This cart is already associated with an order.' });
    }

    // Create the order
    const newOrder = await Order.create({
      user_id,
      cart_id,
      total_amount,
      payment_method,
      order_status: order_status || 'pending',
      payment_status: payment_status || (payment_method === 'card' ? 'paid' : 'unpaid'),
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.status(201).json({ message: 'Order created successfully.', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', {
      message: error.message,
      stack: error.stack,
      data: req.body,
    });
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          { model: User, attributes: ['id', 'name', 'email'] },
          { model: Cart, attributes: ['id'] },
        ],
      });
      res.status(200).json({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
    console.log({ Order, User, Cart });
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Cart, attributes: ['id', 'items'] },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status, total_amount, payment_method } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order_status) order.order_status = order_status;
    if (payment_status) order.payment_status = payment_status;
    if (total_amount) order.total_amount = total_amount;
    if (payment_method) order.payment_method = payment_method;
    order.updated_at = new Date();

    await order.save();

    res.status(200).json({ message: 'Order updated successfully.', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    await order.destroy();
    res.status(200).json({ message: 'Order deleted successfully.' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};