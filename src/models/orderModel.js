const mongoose = require("mongoose");
const ObjectId= mongoose.Schema.Types.ObjectId

const OrderSchema = new mongoose.Schema({
    userId: {
        type: ObjectId, 
        ref: "UserCollection",
        required: true,
        trim:true
    },
    items: [{
      productId: {
        type:ObjectId, 
        ref: "ProductCollection",
        required: true
    },
      quantity: {
        type:Number,
        required:true,
        trim:true 
    }
    }],
    totalPrice: {
        type:Number,
        required:true,
        trim:true
    },
    totalItems: {
        type:Number,
        required:true,
        trim:true
    },
    totalQuantity: {
      type: Number, 
      required:true,
      
    },
  cancellable: {
    type: Boolean,
     default: true
    },
  status: {
    type:String, 
    default: 'pending',
    enum:["pending", "completed", "cancelled"]
   },
  deletedAt: {
    type: Date,
   }, 
  isDeleted: {
    type:Boolean,
     default: false
    },
     
},{timestamps: true})

module.exports = mongoose.model("order", OrderSchema)