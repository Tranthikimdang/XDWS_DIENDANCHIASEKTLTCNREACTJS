const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController'); // Đảm bảo đã tạo followController

// Middleware để validate ID hoặc input (có thể dùng thư viện như express-validator để nâng cao)
const validateId = (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid ID format.'
        });
    }
    next();
};

// Lấy tất cả các bản ghi theo dõi
router.get('/', followController.getAllFollows);

// Tạo một hành động theo dõi mới
router.post('/', followController.createFollow);

// Xóa một hành động theo dõi theo ID
router.delete('/:id', validateId, followController.deleteFollow);

// Lấy danh sách những người mà một người dùng đang theo dõi
router.get('/following/:follower_id', followController.getFollowing);

// Lấy danh sách những người theo dõi một người dùng
router.get('/followers/:target_id', followController.getFollowers);

// Phê duyệt yêu cầu theo dõi
router.put('/:id/approve', validateId, followController.approveFollow);

// Lấy danh sách yêu cầu follow chờ duyệt
router.get('/pending', followController.getPendingFollows);

// Kiểm tra trạng thái theo dõi giữa hai người dùng
router.get('/status/:follower_id/:target_id', followController.checkFollowStatus);

// Cập nhật trạng thái follow
router.put('/:id', validateId, followController.updateFollow);

module.exports = router;
