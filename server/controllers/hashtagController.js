const Hashtag = require('../models/hashtagModel'); // Đảm bảo bạn đã tạo model này

// Lấy tất cả hashtag
exports.getAllHashtags = async (req, res) => {
    try {
        const hashtags = await Hashtag.findAll();
        res.status(200).json({
            status: 'success',
            results: hashtags.length,
            data: {
                hashtags
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving hashtags.'
        });
    }
};

// Tạo mới một hashtag
exports.createHashtag = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const newHashtag = await Hashtag.create({ name });
        res.status(201).json({
            status: 'success',
            data: {
                hashtag: newHashtag
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while creating the hashtag.'
        });
    }
};

// Cập nhật một hashtag
exports.updateHashtag = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const hashtag = await Hashtag.findByPk(id);
        if (!hashtag) {
            return res.status(404).json({
                status: "error",
                message: "Hashtag not found"
            });
        }
        hashtag.name = name || hashtag.name;

        await hashtag.save();
        res.status(200).json({
            status: 'success',
            data: {
                hashtag
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while updating the hashtag.'
        });
    }
};

// Xóa một hashtag
exports.deleteHashtag = async (req, res) => {
    const { id } = req.params;
    try {
        const hashtag = await Hashtag.findByPk(id);
        if (!hashtag) {
            return res.status(404).json({
                status: "error",
                message: "Hashtag not found"
            });
        }
        await hashtag.destroy();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while deleting the hashtag.'
        });
    }
};
