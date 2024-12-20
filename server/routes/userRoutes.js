const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Đảm bảo rằng bạn đã tạo userController

// Lấy tất cả người dùng
router.get('/', userController.getAllUsers);

// Lấy id câu hỏi
router.get('/:id', userController.getUserId); 

// Tạo người dùng mới
router.post('/', userController.createUser);

// Cập nhật thông tin người dùng theo ID
router.put('/:id', userController.updateUser);

// Xóa người dùng theo ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
