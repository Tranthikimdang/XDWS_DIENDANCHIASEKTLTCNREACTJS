const express = require('express');
const router = express.Router();
const authorityDetailController = require('../controllers/authorityDetailController');

router.get('/authorityDetail', authorityDetailController.listUsers);
router.post('/authorityDetail', authorityDetailController.createUser);
router.put('/authorityDetail/:id', authorityDetailController.updateUser);
router.delete('/authorityDetail/:id', authorityDetailController.deleteUser);
router.get('/authorityDetail/:id', authorityDetailController.getOneUser);

module.exports = router;
