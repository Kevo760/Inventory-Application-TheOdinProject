const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CatagorySchema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 100},
  });

// Virtual for products url
CatagorySchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/category/${this._id}`;
  });

// Export model
module.exports = mongoose.model("Catagory", CatagorySchema);