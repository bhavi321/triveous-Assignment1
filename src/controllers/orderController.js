const mongoose = require("mongoose")
const orderModel = require("../models/orderModel")
const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")



const createOrder = async function (req, res) {
    try{
    let usersId = req.params.userId

    let cartId = req.body.cartId
    let isCancel =  req.body.cancellable

    if(!(req.body)) return res.status(400).send({ status: false, message: "Please provide some data in body" })
    if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Please provide some data in body" })

    if (!mongoose.isValidObjectId(usersId)) return res.status(400).send({ status: false, message: "userId is invalid" })

    if (!cartId) return res.status(400).send({ status: false, message: "Please enter Cartid in request body" })
    if (!mongoose.isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "invalid cart id" })

if(isCancel||isCancel==''){
    if(typeof isCancel != "boolean") return res.status(400).send({status:false,message:"Provide Cancellable in boolean"})
   
}


    let checkUser = await userModel.findOne({ _id: usersId })
    if (!checkUser) return res.status(404).send({ status: false, message: "User not found with this user id" })

    //--------------------------------AUTHORIZATION-----------------------------------------
    if (usersId !== req.bearerToken) return res.status(403).send({ status: false, message: "You are not authorised" })
    //--------------------------------------------------------------------------------------------
    let getCart = await cartModel.findOne({ _id: cartId, userId: usersId }).select({ _id: 0, __v: 0 }).lean()
    let findCart = getCart.items
    if(findCart.length == 0) return res.status(400).send({status : false, message : "Cart is empty. Please add items in cart"})
    if (!getCart) return res.status(404).send({ status: false, message: "Cart doesn't exist with this  cartId or userID" })


    
    let tQ = 0
    for (let i = 0; i < getCart.items.length; i++) {
        tQ = tQ + getCart.items[i].quantity
    }
    getCart.totalQuantity = tQ
    getCart.cancellable = isCancel

    let createData = await orderModel.create(getCart)
    await cartModel.findOneAndUpdate({ _id: cartId }, { $set: { items: [], totalItems: 0, totalPrice: 0 } })

    let { _id, userId, items, totalPrice, totalItems, totalQuantity, cancellable, status, createdAt, updatedAt } = createData

    return res.status(200).send({ status: true, message: "Success", data: { _id, userId, items, totalPrice, totalItems, totalQuantity, cancellable, status, createdAt, updatedAt } })
    }catch(err){
        return res.status(500).send({status : false, error : err.message})
    }
}



module.exports = {createOrder}