const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 100},
    flavor: { type: String, required: true },
    catagory: { type: Schema.Types.ObjectId, ref: "Catagory", required: true },
    inventory: { type: Number, required: true },
    price: {type: Number, required: true },
    imgurl: {type: String, required: true},
  });

// Virtual for products url
ProductSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/product/${this._id}`;
  });

// Export model
module.exports = mongoose.model("Product", ProductSchema);