const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Category = require('../models/category');
const Product = require('../models/product');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require( "firebase/storage");
const initializeApp = require("firebase/app");
const firebaseConfig = require('../config/firebase.config');
const multer = require('multer');




exports.index = asyncHandler( async (req, res, next) => {
    // Find products where quantity is greater than zero and sort by name
    const allProducts = await Product.find().where('quantity').gt(0).sort({name: 1}).populate('category');

    res.render('product_list', {title: 'Products', banner_title: 'Products', product_list: allProducts})
});

exports.product_detail = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category');

    if(product === null) {
        // No results.
        const err = new Error("product not found");
        err.status = 404;
        return next(err);
    };

    res.render('product_detail', {
        title: 'Products',
        banner_title: product.name,
        product: product
    });
  });

  exports.product_create_get = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().sort({name: 1});
    

    res.render('product_form', {
        title: 'Add product',
        allCategories: allCategories
    });
  });

exports.product_create_post = [
// Validate and sanitize the name field.
  body("name", "category name must contain at least 3 characters")
  .trim()
  .isLength({ min: 2 })
  .escape(),

// Process request after validation and sanitization.
asyncHandler(async (req, res, next) => {

  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a category object with escaped and trimmed data.
  const category = new Category({ name: req.body.name });

  if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
    res.render("product_form", {
      title: "Create product",
      product: product,
      errors: errors.array(),
    });
    return;
  } else {
    // Data from form is valid.
    // Check if category with same name already exists.
    const categoryExists = await Category.findOne({ name: req.body.name }).exec();
    if (categoryExists) {
      // Category exists, redirect to its detail page.
      res.redirect(categoryExists.url);
    } else {
      await category.save();
      // New category saved. Redirect to category detail page.
      res.redirect(category.url);
    }
  }
}),
]

// Display list category to edit
exports.category_edit_list = asyncHandler( async (req, res, next) => {
  const allCategories = await Category.find().sort({name: 1});

    res.render('category_edit', {
        title: 'Category',
        banner_title: 'Category',
        category_list: allCategories,
    });
});

// Display category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of category and all their products (in parallel)
    const [category, productsInCategory] = await Promise.all([
      Category.findById(req.params.id),
      Product.find({ category: req.params.id }),
    ]);
    if (category === null) {
      // No results.
      res.redirect("/categories");
    }
  
    res.render("category_delete", {
      title: "Delete category",
      banner_title: category.name,
      category: category,
      productsInCategory: productsInCategory,
    });
  });
  
  // Handle category delete on POST.
  exports.category_delete_post = asyncHandler(async (req, res, next) => {
    // Get details of category and all their products (in parallel)
    const [category, productsInCategory] = await Promise.all([
        Category.findById(req.params.id),
        Product.find({ category: req.params.id }),
      ]);
    
      if (productsInCategory.length > 0) {
        // category has books. Render in same way as for GET route.
        res.render("category_delete", {
          title: "Delete category",
          banner_title: category.name,
          category: category,
          productsInCategory: productsInCategory,
        });
        return;
      } else {
        // Author has no books. Delete object and redirect to the list of authors.
        await category.findByIdAndRemove(req.body.categoryid);
        res.redirect("/categories");
      }
  });

  // Display category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
  
    res.render("category_form", {
      title: "Update category",
      category: category,
    });
  });
  
  // Handle category update on POST.
  exports.category_update_post = [
      // Validate and sanitize the name field.
      body("name", "category name must contain at least 3 characters")
      .trim()
      .isLength({ min: 3 })
      .escape(),
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a category object with escaped and trimmed data.
      const category = new Category({ 
        name: req.body.name,
        _id: req.params.id, // This is required, or a new ID will be assigned!
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("category_form", {
          title: "Create category",
          category: category,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
        // Check if category with same name already exists.
        const categoryExists = await Category.findOne({ name: req.body.name });
        if (categoryExists) {
          // category exists, redirect to its detail page.
          res.redirect(categoryExists.url);
        } else {
          const updatedcategory = await Category.findByIdAndUpdate(req.params.id, category);
          //Updated category saved. Redirect to category detail page.
          res.redirect(updatedcategory.url);
        }
      }
    }),
  ]
  