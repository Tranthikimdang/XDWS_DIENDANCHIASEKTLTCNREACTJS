const User = require('../models/authorityDetailModel');

// List all users
const listUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json({
      data: users,
      status: 200,
      message: "success",
    });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ status: 500, error: error.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { name, email, location, phone, IdAuthority } = req.body;
  if (!name || !email || !location || !phone || !IdAuthority) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const newUser = { name, email, location, phone, IdAuthority };
  try {
    const id = await User.addUser(newUser);
    res.status(201).json({ id, message: "User created successfully." });
  } catch (error) {
    console.error('Error in createUser:', error); 
    res.status(500).json({ error: error.message });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, location, phone } = req.body;

  if (!name || !email || !location || !phone) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const user = { name, email, location, phone };

  try {
    const updated = await User.updateUser(id, user);
    if (updated) {
      res.status(200).json({ status: 200, message: "User updated successfully." });
    } else {
      res.status(404).json({ status: 404, error: "User not found." });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ status: 500, error: error.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await User.deleteUser(id);
    if (deleted) {
      res.status(204).json({ status: 204, message: "User deleted successfully" }); // No content status
    } else {
      res.status(404).json({ status: 404, error: "User not found." });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ status: 500, error: error.message });
  }
};

const getOneUser = async (req, res) => {
  const { id } = req.params;
  const userId = id || req.body.userId; // Lấy ID từ tham số URL hoặc từ body

  try {
    const user = await authorityDetailModel.getOneUser(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getOneUser
};
