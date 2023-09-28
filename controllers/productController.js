const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Product = require('../models/product')

exports.index = asyncHandler( async (req, res, next) => {
    const allProducts = await Product.find().sort({name: 1})

    res.render('product_list', {title: 'Products', product_list: allProducts})
})