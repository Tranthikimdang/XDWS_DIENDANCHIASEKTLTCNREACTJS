const Order = require('../models/orderModel');

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: {
                orders
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving orders.'
        });
    }
};

// Tạo mới đơn hàng
exports.createOrder = async (req, res) => {
    const { item, payment, status, user_id, cart_id, username } = req.body;

    if (!item || !payment || !user_id || !username || !cart_id) {
        return res.status(400).json({ error: 'Item, payment, user ID, username, and cart ID are required' });
    }

    try {
        const newOrder = await Order.create({
            item,
            payment,
            status: status || 'pending',
            user_id,
            cart_id,
            username
        });
        res.status(201).json({
            status: 'success',
            data: {
                order: newOrder
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while creating the order.'
        });
    }
};

// Cập nhật đơn hàng
exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    const { item, payment, status, user_id, cart_id, username } = req.body;

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                status: "error",
                message: "Order not found"
            });
        }
        order.item = item || order.item;
        order.payment = payment || order.payment;
        order.status = status || order.status;
        order.user_id = user_id || order.user_id;
        order.cart_id = cart_id || order.cart_id;
        order.username = username || order.username;

        await order.save();
        res.status(200).json({
            status: 'success',
            data: {
                order
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while updating the order.'
        });
    }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                status: "error",
                message: "Order not found"
            });
        }
        await order.destroy();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while deleting the order.'
        });
    }
};