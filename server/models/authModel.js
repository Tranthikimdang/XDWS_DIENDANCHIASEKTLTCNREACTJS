const db = require('../config/firebaseconfig.js');

const getUserByEmail = async (email) => {
  try {
    return await db.auth().getUserByEmail(email);
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

module.exports = {
  getUserByEmail,
};
