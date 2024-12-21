const Cart = require('../models/cartsModel');
const Order = require('../models/orderModel');

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.findAll();
        res.status(200).json({
            status: 'success',
            results: carts.length,
            data: {
                carts
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving carts.'
        });
    }
};

exports.createCart = async (req, res) => {
    const { user_id, course_id, order_id, created_at } = req.body;
  
    if (!user_id || !course_id) {
      return res.status(400).json({ error: 'User ID and Course ID are required' });
    }
  
    try {
      const newCart = await Cart.create({
        user_id,
        course_id,
        order_id,
        created_at: created_at || new Date()
      });
      res.status(201).json({
        status: 'success',
        data: {
          cart: newCart
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: err.message || 'Some error occurred while creating the cart.'
      });
    }
  };

exports.updateCart = async (req, res) => {
    const { id } = req.params;
    const { items, totalPrice } = req.body;

    try {
        const cart = await Cart.findByPk(id);
        if (!cart) {
            return res.status(404).json({
                status: "error",
                message: "Cart not found"
            });
        }
        cart.items = items || cart.items;
        cart.totalPrice = totalPrice || cart.totalPrice;

        await cart.save();
        res.status(200).json({
            status: 'success',
            data: {
                cart
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while updating the cart.'
        });
    }
};

exports.deleteCart = async (req, res) => {
    const { id } = req.params;

    try {
        // Bước 1: Xóa tất cả các đơn hàng có cart_id trùng với id giỏ hàng
        await Order.destroy({ where: { cart_id: id } });

        // Bước 2: Sau khi xóa các đơn hàng, tiến hành xóa giỏ hàng
        const cart = await Cart.findByPk(id);  // Đảm bảo bạn đã import model Cart
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Cart not found'
            });
        }

        await cart.destroy();
        res.status(200).json({
            status: 'success',
            message: 'Cart and related orders deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting cart and orders:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while deleting the cart and related orders'
        });
    }
};