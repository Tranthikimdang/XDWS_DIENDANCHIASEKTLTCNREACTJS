const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); // Đảm bảo rằng bạn đã tạo orderController

// Lấy tất cả đơn hàng
router.get('/', orderController.getAllOrders);

// Tạo đơn hàng mới
router.post('/', orderController.createOrder);

// Cập nhật thông tin đơn hàng theo ID
router.put('/:id', orderController.updateOrder);

// Xóa đơn hàng theo ID
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
