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
    const { items, paymentMethod, status, totalAmount, user_email, user_id, user_name } = req.body;

    if (!items || !paymentMethod || !totalAmount || !user_id || !user_email || !user_name) {
        return res.status(400).json({ error: 'Items, payment method, total amount, user ID, user email, and user name are required' });
    }

    try {
        const newOrder = await Order.create({
            items,
            paymentMethod,
            status,
            totalAmount,
            user_email,
            user_id,
            user_name
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
    const { items, paymentMethod, status, totalAmount, user_email, user_id, user_name } = req.body;

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                status: "error",
                message: "Order not found"
            });
        }
        order.items = items || order.items;
        order.paymentMethod = paymentMethod || order.paymentMethod;
        order.status = status || order.status;
        order.totalAmount = totalAmount || order.totalAmount;
        order.user_email = user_email || order.user_email;
        order.user_id = user_id || order.user_id;
        order.user_name = user_name || order.user_name;

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
