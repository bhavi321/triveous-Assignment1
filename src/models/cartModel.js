const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "user",
      required: true,
      trim: true
    },
    items: [
      {
        _id:0,
        productId: {
          type: ObjectId,
          ref: "product",
          required: true
        },
        quantity: { type: Number, required: true, trim: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      trim: true
    },
    totalItems: {
      type: Number,
      required: true,
      trim: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);