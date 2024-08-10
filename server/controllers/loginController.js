const User = require('../models/userModel.js');

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
  const { name,password, email, location, phone } = req.body;
  if (!name ||!password || !email || !location || !phone) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const newUser = {  name,password, email, location, phone, role: 0, created_at: new Date(), updated_at: new Date(), is_deleted: false };
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
  const {  name,password, email, location, phone } = req.body;

  if (!name || !password || !email || !location || !phone || !role) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const user = {  name,password, email, location, phone, role: 0,  updated_at: new Date(), is_deleted: false };

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
      res.status(204).json({ status: 204, message: "User deleted successfully" }); 
    } else {
      res.status(404).json({ status: 404, error: "User not found." });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ status: 500, error: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.getOneUser(email);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user by email:', error);
    res.status(404).json({ message: 'User not found.'});
  }
};

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail
};
