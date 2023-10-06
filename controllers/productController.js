const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Category = require('../models/category');
const Product = require('../models/product');


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
  