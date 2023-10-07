const express = require("express");
const router = express.Router();


/// Controller
const products_controller = require('../controllers/productController');

/// PRODUCT ROUTES

// GET request to create a product
router.get('/add', products_controller.product_create_get);

// POST request for creating product
router.post('/add', products_controller.product_create_post);

// // GET request to delete product
// router.get("/:id/delete", products_controller.product_delete_get);

// // POST request to delete product
// router.post("/:id/delete", products_controller.product_delete_post);

// // GET update on product
// router.get('/:id/update', products_controller.product_update_get);

// // POST update on product
// router.post('/:id/update', products_controller.product_update_post);

// // GET all products in product to edit
// router.get('/edit', products_controller.product_edit_list);

// GET all products in product
router.get('/:id', products_controller.product_detail);

// GET product list
router.get('/', products_controller.index);


module.exports = router;