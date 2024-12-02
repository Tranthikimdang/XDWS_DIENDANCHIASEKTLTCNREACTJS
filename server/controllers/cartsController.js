const Cart = require('../models/cartsModel');

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
        const cart = await Cart.findByPk(id);
        if (!cart) {
            return res.status(404).json({
                status: "error",
                message: "Cart not found"
            });
        }
        await cart.destroy();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while deleting the cart.'
        });
    }
};