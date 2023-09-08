const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const ProductSchema = new mongoose.Schema(
  {
    categoryId:{
        type: ObjectId,
        ref: "category"
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", ProductSchema);
