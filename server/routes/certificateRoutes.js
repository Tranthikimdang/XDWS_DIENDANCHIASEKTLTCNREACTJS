const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificatesController'); // Đảm bảo rằng bạn đã tạo certificateController

// Lấy tất cả chứng chỉ
router.get('/', certificateController.getAllCertificates);

// Tạo chứng chỉ mới
router.post('/', certificateController.createCertificate);

// Cập nhật thông tin chứng chỉ theo ID
router.put('/:id', certificateController.updateCertificate);

// Xóa chứng chỉ theo ID
router.delete('/:id', certificateController.deleteCertificate);

module.exports = router;
