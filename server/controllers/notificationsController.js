const { Op } = require('sequelize');
const Notification = require('../models/notificationsModel'); // Mô hình thông báo
const Follow = require('../models/followModel');
// Tạo thông báo mới
exports.createNotification = async (req, res) => {
    const { userId, type, relatedId, message } = req.body;
    try {
        const newNotification = await Notification.create({
            userId,
            type,
            relatedId,
            message
        });
        res.status(201).json({
            status: 'success',
            data: {
                notification: newNotification
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Some error occurred while creating the notification.'
        });
    }
};

// Lấy tất cả thông báo
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.status(200).json({
            status: 'success',
            results: notifications.length,
            data: {
                notifications
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving notifications.'
        });
    }
};

// Lấy thông báo theo trạng thái
exports.getNotificationsByStatus = async (req, res) => {
    const { status } = req.params; // Lấy trạng thái từ URL
    try {
        const notifications = await Notification.findAll({
            where: {
                type: status // Lọc thông báo theo trạng thái (trong `type`)
            }
        });
        res.status(200).json({
            status: 'success',
            results: notifications.length,
            data: {
                notifications
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving notifications.'
        });
    }
};

// Cập nhật thông báo
// exports.updateNotification = async (req, res) => {
//     const { id } = req.params;
//     const { userId, type, relatedId, message, isRead } = req.body;

//     try {
//         const notification = await Notification.findByPk(id);
//         if (!notification) {
//             return res.status(404).json({
//                 status: "error",
//                 message: "Notification not found"
//             });
//         }

//         notification.userId = userId || notification.userId;
//         notification.type = type || notification.type;
//         notification.relatedId = relatedId || notification.relatedId;
//         notification.message = message || notification.message;
//         notification.isRead = isRead !== undefined ? isRead : notification.isRead; // Kiểm tra nếu có giá trị `isRead`

//         await notification.save();
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 notification
//             }
//         });
//     } catch (err) {
//         res.status(500).send({
//             status: 'error',
//             message: err.message || 'Some error occurred while updating the notification.'
//         });
//     }
// };

exports.updateNotification = async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;
  
    try {
      const notification = await Notification.findByPk(id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      notification.type = type || notification.type;
      await notification.save();
  
      res.json({ message: 'Notification updated successfully', notification });
    } catch (error) {
      res.status(500).json({ message: 'Error updating notification', error });
    }
  };

// Xóa thông báo
exports.deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({
                status: "error",
                message: "Notification not found"
            });
        }
        await notification.destroy();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while deleting the notification.'
        });
    }
};

// Đánh dấu thông báo là đã đọc
exports.markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({
                status: "error",
                message: "Notification not found"
            });
        }
        notification.isRead = true; // Đánh dấu là đã đọc
        await notification.save();
        res.status(200).json({
            status: 'success',
            message: 'Notification marked as read',
            data: {
                notification
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while marking the notification as read.'
        });
    }
};

// Lấy thông báo theo userId
exports.getUserNotifications = async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await Notification.findAll({
            where: {
                userId: userId
            }
        });
        res.status(200).json({
            status: 'success',
            results: notifications.length,
            data: {
                notifications
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving user notifications.'
        });
    }
};

// Tìm kiếm thông báo
exports.searchNotifications = async (req, res) => {
    const { searchTerm } = req.query;
    try {
        const notifications = await Notification.findAll({
            where: {
                message: {
                    [Op.like]: `%${searchTerm}%` // Tìm kiếm theo từ khóa trong message
                }
            }
        });
        res.status(200).json({
            status: 'success',
            results: notifications.length,
            data: {
                notifications
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while searching notifications.'
        });
    }
};

