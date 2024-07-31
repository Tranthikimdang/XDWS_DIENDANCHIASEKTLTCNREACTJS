const userModel = require('../models/userModel');

// List all users
const listUsers = async (req, res) => {
  try {
    const user = await userModel.getAllUsers();
    res.status(200).json({
      data: user,
      status: 200,
      message: "success",
    });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const newUser = req.body;
    const userId = await userModel.addUser(newUser);
    res.status(201).json({ id: userId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const message = await userModel.updateUser(userId, updatedData);
    res.status(200).json({ message });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userModel.deleteUser(userId);
    res.status(200).json({ message: `User with id ${userId} deleted successfully.` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser
};
