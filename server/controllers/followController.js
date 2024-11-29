const Follow = require('../models/followModel');
const User = require('../models/userModel');

// Lấy danh sách tất cả các hành động theo dõi
exports.getAllFollows = async (req, res) => {
    try {
        const follows = await Follow.findAll();
        res.status(200).json({
            status: 'success',
            results: follows.length,
            data: follows
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Error occurred while retrieving follows.'
        });
    }
};

// Hủy theo dõi
exports.deleteFollow = async (req, res) => {
    const { id } = req.params;

    try {
        const follow = await Follow.findByPk(id);
        if (!follow) {
            return res.status(404).json({
                status: 'error',
                message: 'Follow record not found.'
            });
        }
        await follow.destroy();
        res.status(204).json({ status: 'success' });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Error occurred while deleting the follow.'
        });
    }
};

// Lấy danh sách người dùng mà một người dùng đang theo dõi
exports.getFollowing = async (req, res) => {
    const { follower_id } = req.params;

    try {
        const following = await Follow.findAll({
            where: { follower_id },
            include: [{ model: User, as: 'Target', attributes: ['id', 'name'] }]
        });
        res.status(200).json({
            status: 'success',
            results: following.length,
            data: following
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Error occurred while retrieving following list.'
        });
    }
};

// Lấy danh sách người theo dõi một người dùng
exports.getFollowers = async (req, res) => {
    const { target_id } = req.params;

    try {
        const followers = await Follow.findAll({
            where: { target_id },
            include: [{ model: User, as: 'Follower', attributes: ['id', 'name'] }]
        });
        res.status(200).json({
            status: 'success',
            results: followers.length,
            data: followers
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Error occurred while retrieving followers list.'
        });
    }
};

// Tạo yêu cầu theo dõi mới
exports.createFollow = async (req, res) => {
    const { follower_id, target_id } = req.body;

    if (!follower_id || !target_id) {
        return res.status(400).json({
            status: 'error',
            message: 'Both follower_id and target_id are required.'
        });
    }

    try {
        const existingFollow = await Follow.findOne({ where: { follower_id, target_id } });
        if (existingFollow) {
            return res.status(400).json({
                status: 'error',
                message: 'Follow request already exists.'
            });
        }

        const newFollow = await Follow.create({ follower_id, target_id });
        res.status(201).json({
            status: 'success',
            data: newFollow
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Error occurred while creating the follow.'
        });
    }
};

// Phê duyệt yêu cầu theo dõi
exports.approveFollow = async (req, res) => {
    const { id } = req.params;

    try {
        const follow = await Follow.findByPk(id);
        if (!follow) {
            return res.status(404).json({
                status: 'error',
                message: 'Follow request not found.'
            });
        }

        follow.is_approved = true;
        follow.status = 'friend';
        await follow.save();

        res.status(200).json({
            status: 'success',
            data: follow
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Error occurred while approving the follow.'
        });
    }
};

// Lấy danh sách yêu cầu đang chờ phê duyệt
exports.getPendingFollows = async (req, res) => {
    try {
        const pendingFollows = await Follow.findAll({
            where: { is_approved: false },
            include: [{ model: User, as: 'Follower', attributes: ['id', 'name'] }]
        });

        res.status(200).json({
            status: 'success',
            data: pendingFollows
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Error occurred while retrieving pending follows.'
        });
    }
};

// Kiểm tra trạng thái theo dõi
exports.checkFollowStatus = async (req, res) => {
    const { follower_id, target_id } = req.params;
  
    try {
      const follow = await Follow.findOne({
        where: { follower_id, target_id },
      });
  
      if (!follow) {
        return res.status(200).json({
          status: 'not_followed',
          followId: null,
        });
      }
  
      const response = {
        status: follow.is_approved ? 'friend' : 'pending', // Trạng thái bạn bè hoặc đang chờ
        followId: follow.id,
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.error('Error checking follow status:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to check follow status. Please try again.',
      });
    }
  };
  exports.updateFollow = async (req, res) => {
    const { id } = req.params;
    const { status, is_approved } = req.body;
  
    try {
      const follow = await Follow.findByPk(id);
      if (!follow) {
        return res.status(404).json({ message: 'Follow record not found' });
      }
  
      follow.status = status || follow.status;
      follow.is_approved = is_approved !== undefined ? is_approved : follow.is_approved;
      await follow.save();
  
      res.json({ message: 'Follow record updated successfully', follow });
    } catch (error) {
      res.status(500).json({ message: 'Error updating follow', error });
    }
  };
  