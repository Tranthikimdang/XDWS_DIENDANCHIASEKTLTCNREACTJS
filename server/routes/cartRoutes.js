// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


router.post('/', cartController.createCart);

router.get('/', cartController.getAllCarts);

router.get('/:id', cartController.getCartById);


router.put('/:id', cartController.updateCart);


router.delete('/:id', cartController.deleteCart);


router.get('/user/:user_id', cartController.getCartsByUserId);


router.delete('/user/:user_id', cartController.clearCartsByUserId);

module.exports = router;