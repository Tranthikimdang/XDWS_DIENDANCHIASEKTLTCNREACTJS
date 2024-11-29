// controllers/cartController.js
const Cart = require('../models/cartModel');
const { Op } = require('sequelize');

// Create a new cart item
exports.createCart = async (req, res) => {
    try {
        const { user_id, course_id, order_id } = req.body;

        // Validate required fields
        if (!user_id || !course_id) {
            return res.status(400).json({ message: 'User ID and Course ID are required.' });
        }

        const newCart = await Cart.create({
            user_id,
            course_id,
            order_id: order_id || null
        });

        return res.status(200).json(newCart);
    } catch (error) {
        console.error('Error creating cart:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all cart items
exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.findAll();
        return res.status(200).json(carts);
    } catch (error) {
        console.error('Error fetching carts:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get a cart item by ID
exports.getCartById = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findByPk(id);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update a cart item
exports.updateCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, course_id, order_id } = req.body;

        const cart = await Cart.findByPk(id);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        // Update fields if provided
        if (user_id !== undefined) cart.user_id = user_id;
        if (course_id !== undefined) cart.course_id = course_id;
        if (order_id !== undefined) cart.order_id = order_id;

        await cart.save();

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a cart item
exports.deleteCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findByPk(id);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        await cart.destroy();

        return res.status(200).json({ message: 'Cart deleted successfully.' });
    } catch (error) {
        console.error('Error deleting cart:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get carts by user ID
exports.getCartsByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const carts = await Cart.findAll({
            where: {
                user_id: user_id
            }
        });

        return res.status(200).json(carts);
    } catch (error) {
        console.error('Error fetching carts by user ID:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Clear all carts for a user
exports.clearCartsByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const result = await Cart.destroy({
            where: {
                user_id: user_id
            }
        });

        return res.status(200).json({ message: `${result} cart item(s) deleted successfully.` });
    } catch (error) {
        console.error('Error clearing carts by user ID:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};