// routes/cartsRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartsController');

// Get all carts
router.get('/', cartController.getAllCarts);

// Create a new cart
router.post('/', cartController.createCart);

// Update a cart by ID
router.put('/:id', cartController.updateCart);

// Delete a cart by ID
router.delete('/:id', cartController.deleteCart);

module.exports = router;