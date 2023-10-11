const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Category = require('../models/category');
const Product = require('../models/product');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require( "firebase/storage");
const {initializeApp} = require("firebase/app");
const app = require('../config/firebase.config');
const multer = require('multer');


const giveCurrentDateTime = () => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
}
// Created upload variable with multer memory storage
const upload = multer({storage: multer.memoryStorage()});
// Initialize firebase
initializeApp(app);




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
        allCategories: allCategories,
        addInputImg: true
    });
  });

exports.product_create_post = [
  upload.single('image'),
// Validate and sanitize the name field.
  body("name", "product name must contain at least 2 characters")
  .trim()
  .isLength({ min: 2 })
  .escape(),

// Process request after validation and sanitization.
asyncHandler(async (req, res, next) => {

  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a category object with escaped and trimmed data.
  const product = new Product(
    { 
      name: req.body.name,
      flavor: req.body.flavor,
      category: req.body.category,
      quantity: req.body.quantity,
      price: req.body.price,
    });

  if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
    res.render("product_form", {
      title: "Add product",
      product: product,
      errors: errors.array(),
      addInputImg: true
    });
    return;
  } else {
    // Data from form is valid.
    // Check if category with same name already exists.
    const productExists = await Product.findOne({ name: req.body.name });
    if (productExists) {
      // Category exists, redirect to its detail page.
      res.redirect(productExists.url);
    } else {
      // Upload image file and get url
      try {
        const dateTime = giveCurrentDateTime();

        const storage = getStorage();
        const storageRef = ref(storage, req.file.originalname + dateTime);

        // Create file metadata including the content type
        const metadata = {
          contentType: req.file.mimetype,
      };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Pass downloadURL to imgurl on product
        product.imgurl = downloadURL
        // Save product
        await product.save();
        // New category saved. Redirect to category detail page.
        res.redirect(product.url);
      } catch(error) {
        // If error occurs input 404 error
        const err = new Error(error);
        err.status = 404;
        return next(err);
      }
    }
  }
}),
]

// Display list product to edit
exports.product_edit_list = asyncHandler( async (req, res, next) => {
  // Find products where quantity is greater than zero and sort by name
  const allProducts = await Product.find().where('quantity').gt(0).sort({name: 1}).populate('category');

  res.render('product_edit', { title: 'Products', banner_title: 'Edit Products', product_list: allProducts })
});

// Display product delete page on GET.
exports.product_delete_get = asyncHandler(async (req, res, next) => {
  // Gets product by id with category
  const product = await Product.findById(req.params.id).populate('category');

  if(product === null) {
      // No results.
      const err = new Error("product not found");
      err.status = 404;
      return next(err);
  };
  
    res.render("product_delete", {
      title: "Delete product",
      banner_title: product.name,
      product: product,
    });
  });
  
  // Handle product delete on POST.
  exports.product_delete_post = asyncHandler(async (req, res, next) => {
    // find product by id and remove
    await Product.findByIdAndRemove(req.body.productid);
    res.redirect("/products");
  });

  // Display product update form on GET.
exports.product_update_get = asyncHandler(async (req, res, next) => {
    const [product, allCategories] = await Promise.all([
      Product.findById(req.params.id).populate('category'),
      Category.find().sort({name: 1})
    ]) 
  
    res.render("product_form", {
      title: "Update product",
      product: product,
      allCategories: allCategories,
      addInputImg: false
    });
  });
  
  // Handle product update on POST.
  exports.product_update_post = [
      // Validate and sanitize the name field.
      body("name", "product name must contain at least 2 characters")
      .trim()
      .isLength({ min: 2 })
      .escape(),
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a product object with escaped and trimmed data.
      const product = new Product({ 
        _id: req.params.id, // This is required, or a new ID will be assigned!
        name: req.body.name,
        flavor: req.body.flavor,
        category: req.body.category,
        quantity: req.body.quantity,
        price: req.body.price,
        imgurl: req.body.imgurl
      });

      if (!errors.isEmpty()) {
        const allCategories = await Category.find().sort({name: 1});
        console.log(product)

        // There are errors. Render the form again with sanitized values/error messages.
        res.render("product_form", {
        title: "Update product",
        product: product,
        allCategories: allCategories,
        addInputImg: false,
        errors: errors.array()
        });
        return;
      } else {
          const updatedProduct = await Product.updateOne(
            {_id:req.params.id},
            {
              $set:
              {
                name: req.body.name,
                flavor: req.body.flavor,
                category: req.body.category,
                quantity: req.body.quantity,
                price: req.body.price,
              }
            }
          )
          //Updated product saved. Redirect to product detail page.
          res.redirect(product.url);
      }
    }),
  ]
  