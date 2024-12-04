const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationsController'); // Import controller

// Định nghĩa các route cho thông báo
router.get('/', notificationController.getAllNotifications); // Lấy tất cả thông báo
router.get('/status/:status', notificationController.getNotificationsByStatus); // Lấy thông báo theo trạng thái
router.get('/user/:userId', notificationController.getUserNotifications); // Lấy thông báo của một người dùng
router.post('/', notificationController.createNotification); // Tạo thông báo mới
router.put('/:id', notificationController.updateNotification); // Cập nhật thông báo
router.delete('/:id', notificationController.deleteNotification); // Xóa thông báo
router.patch('/:id/read', notificationController.markNotificationAsRead); // Đánh dấu thông báo đã đọc
router.get('/search', notificationController.searchNotifications); // Tìm kiếm thông báo

module.exports = router;
