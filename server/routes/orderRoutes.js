// orderRoutes.js

const express = require('express');
const router = express.Router();

// Import the OrderController
const OrderController = require('../controllers/orderController'); // Adjust the path if necessary


// Define routes and associate them with controller methods

// Create a new order
router.post('/', OrderController.createOrder);

// Get all orders
router.get('/', OrderController.getOrders);

// Get a specific order by ID
router.get('/:id', OrderController.getOrderById);

// Update an existing order
router.put('/:id', OrderController.updateOrder);

// Delete an order
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;
