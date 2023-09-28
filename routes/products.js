const express = require("express");
const router = express.Router();

// Controller
const products_controller = require('../controllers/productController');

// PRODUCT ROUTES

// Get product list
router.get('/', products_controller.index);


module.exports = router;