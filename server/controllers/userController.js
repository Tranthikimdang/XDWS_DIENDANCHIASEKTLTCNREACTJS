const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while retrieving users.'
        });
    }
};

exports.createUser = async (req, res) => {
    const { name, password, birthday, cardId, email, imageUrl, location, phone, role } = req.body;

    if (!name || !password || !email) {
        return res.status(400).json({ error: 'Name, password, and email are required' });
    }

    try {
        const newUser = await User.create({
            name,
            password,
            birthday,
            cardId,
            email,
            imageUrl,
            location,
            phone,
            role
        });
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while creating the user.'
        });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, password, birthday, cardId, email, imageUrl, location, phone, role } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }
        user.name = name || user.name;
        user.password = password || user.password; // Lưu ý: Thông thường, bạn nên băm mật khẩu trước khi lưu
        user.birthday = birthday || user.birthday;
        user.cardId = cardId || user.cardId;
        user.email = email || user.email;
        user.imageUrl = imageUrl || user.imageUrl;
        user.location = location || user.location;
        user.phone = phone || user.phone;
        user.role = role || user.role;

        await user.save();
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while updating the user.'
        });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }
        await user.destroy();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while deleting the user.'
        });
    }
};
