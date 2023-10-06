const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 100},
  });

// Virtual for products url
CategorySchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/categories/${this._id}`;
  });

// Export model
module.exports = mongoose.model("Category", CategorySchema);