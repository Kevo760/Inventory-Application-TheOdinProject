const express = require("express");
const router = express.Router();

/// Controller
const category_controller = require('../controllers/categoryController');

/// Category Routes

// Gets request to create a category
router.get('/add', category_controller.category_create_get);

// Post request for creating category
router.post('/add', category_controller.category_create_post);

// Gets all products in category to edit
router.get('/edit', category_controller.category_edit_list);

// Get all products in category
router.get('/:id', category_controller.category_detail);

// Gets category list
router.get('/', category_controller.index);

module.exports = router;

