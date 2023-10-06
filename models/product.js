const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true, minLength: 2, maxLength: 100},
    flavor: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    quantity: { type: Number, required: true },
    price: {type: Number, required: true },
    imgurl: {type: String, required: true},
  });

// Virtual for products url
ProductSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/products/${this._id}`;
  });

// Export model
module.exports = mongoose.model("Product", ProductSchema);