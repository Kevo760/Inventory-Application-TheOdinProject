const express = require("express");
const router = express.Router();

/// Controller
const category_controller = require('../controllers/categoryController');

/// Category Routes



// GET request to create a category
router.get('/add', category_controller.category_create_get);

// POST request for creating category
router.post('/add', category_controller.category_create_post);

// GET request to delete category
router.get("/:id/delete", category_controller.category_delete_get);

// POST request to delete category
router.post("/:id/delete", category_controller.category_delete_post);

// GET update on category
router.get('/:id/update', category_controller.category_update_get);

// POST update on category
router.post('/:id/update', category_controller.category_update_post);

// GET all products in category to edit
router.get('/edit', category_controller.category_edit_list);

// GET all products in category
router.get('/:id', category_controller.category_detail);

// GET category list
router.get('/', category_controller.index);



module.exports = router;

