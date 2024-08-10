const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get('/login', loginController.listUsers);
router.post('/login', loginController.createUser);
router.put('/login/:id', loginController.updateUser);
router.delete('/login/:id', loginController.deleteUser);
router.get('/login/email/:email', loginController.getUserByEmail);
module.exports = router;
