const mongoose = require("mongoose")
const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")

const createCart = async function(req,res){
    try {
        let userId = req.params.userId
        if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ status: false, message: "Invalid User Id" })
        let findUser = await userModel.findById(userId)
        if (!findUser) return res.status(404).json({ status: false, message: "User not found" })

        let data = req.body
        let { cartId, productId, quantity } = data
        if (Object.keys(data).length == 0) return res.status(400).json({ status: false, message: "No data given for creation" })

        if (!productId) return res.status(400).json({ status: false, message: "Product Id is mandatory" })

        if (!mongoose.isValidObjectId(productId)) return res.status(400).json({ status: false, message: "Invalid Product Id" })

        if (cartId) {

            if (!mongoose.isValidObjectId(cartId)) return res.status(400).json({ status: false, message: "Invalid Cart Id" })
        }

        if (!quantity) {
            if (quantity == 0) return res.status(400).json({ status: false, message: "Quantity should be greater than 0" })
            quantity = 1
        }
        if (typeof quantity !== 'number') return res.status(400).json({ status: false, message: "Invalid quantity" })

        let product = await productModel.findById(productId)
        if (!product || product.availability == false) return res.status(404).json({ status: false, message: "Product not found or not available" })

        if (cartId) {
            const findCart = await cartModel.findById(cartId).populate('items.productId')

            if (!findCart) return res.status(404).json({ status: false, message: "Cart not found" })
            if (findCart.userId.toString() !== userId) return res.status(403).json({ status: false, message: "Unauthorized User" })

            let itemsArray = findCart.items
            let totalPrice = findCart.totalPrice
            let totalItems = findCart.totalItems
            let newProduct = true

            for (let i = 0; i < itemsArray.length; i++) {
                if (itemsArray[i].productId._id.toString() == productId) {     //product already exists in the cart
                    itemsArray[i].quantity += quantity
                    totalPrice += itemsArray[i].productId.price * quantity
                    newProduct = false
                }
            }
            if (newProduct == true) {                                    //product does not exist in the cart
                itemsArray.push({ productId: productId, quantity: quantity })
                totalPrice += product.price * quantity
            }
            totalPrice = totalPrice.toFixed(2)
            totalItems = itemsArray.length

            const addToCart = await cartModel.findOneAndUpdate({ _id: cartId }, { items: itemsArray, totalPrice: totalPrice, totalItems: totalItems }, { new: true }).select({ __v: 0 })

            if (!addToCart) return res.status(404).json({ status: false, message: "Cart not found" })
            else return res.status(200).json({ status: true, message: "Success", data: addToCart })
        }

        else {
            let cartData = {
                userId: userId,
                items: [{
                    productId: productId,
                    quantity: quantity
                }],
                totalPrice: (product.price * quantity).toFixed(2),
                totalItems: quantity
            }

            const findCart = await cartModel.findOne({ userId })
            if (findCart) return res.status(400).json({ status: false, message: "Cart already exists for this user so enter cartId" })

            const createCart = await cartModel.create(cartData)
            return res.status(201).json({ status: true, message: "Success", data: createCart })
        }

    }
         catch (error) {
            res.status(500).json({status: false, message: error.message});
        }
}

const updateCartByParams = async function (req, res) {
    try {

        let data = req.body
        let userId = req.params.userId

        if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ status: false, message: "Enter valid user ID" })
        let userPresent = await userModel.findOne({ _id: userId })
        if (!userPresent) return res.status(404).json({ status: false, message: "User not found with this user ID" })

        //------------------------Authorization--------------------------
        if (userId != req.bearerToken) return res.status(403).json({ status: false, message: "You are not authorized" })
        //---------------------------------------------------------------

        let { cartId, productId, removeProduct } = data

        if (!cartId) return res.status(400).json({ status: false, message: "Cart ID is mandatory for updation" })
        if (!mongoose.isValidObjectId(cartId)) return res.status(400).json({ status: false, message: "Enter valid cart ID" })
        let cartPresent = await cartModel.findOne({ _id: cartId })
        if (!cartPresent) return res.status(404).json({ status: false, message: "cart not found with this cart ID" })

        if (!productId) return res.status(400).json({ status: false, message: "Product ID is mandatory for updation" })
        if (!mongoose.isValidObjectId(productId)) return res.status(400).json({ status: false, message: "Enter valid product ID" })
        let productPresent = await productModel.findOne({ _id: productId, availability: true })
        if (!productPresent) return res.status(404).json({ status: false, message: "product not found or it is already deleted with this product ID" })

        let itemsArr = cartPresent.items

        let itemPresent = itemsArr.map(x => x.productId.toString())
        if (!itemPresent.includes(productId)) return res.status(404).json({ message: "this product does not exist in cart or already deleted" })


        if ((removeProduct != 0 && removeProduct != 1) || typeof removeProduct != "number") return res.status(400).json({ status: false, message: "removeProduct must be 0 or 1." })

        let obj = {}

        let quantity = 0
        productPrice = productPresent.price

        resultArr = itemsArr.filter(x => x.productId.toString() != productId)




        for (let i = 0; i < itemsArr.length; i++) {
            if (itemsArr[i].productId.toString() == productId) {
                quantity = itemsArr[i].quantity

            }
        }




        if (removeProduct == 0) {
            obj.items = resultArr
            obj.totalItems = resultArr.length
            obj.totalPrice = cartPresent.totalPrice - quantity * productPrice
            var remove = await cartModel.findOneAndUpdate({ _id: cartId }, obj, { new: true })
            return res.status(200).json({ status: true, message: "Success", data: remove })


        }
        else if (removeProduct == 1) {
            let newArr = []
            for (let i = 0; i < itemsArr.length; i++) {
                if (itemsArr[i].productId.toString() == productId) {
                    itemsArr[i].quantity -= 1
                    if (itemsArr[i].quantity == 0) {
                        obj.items = resultArr
                        obj.totalItems = resultArr.length
                        obj.totalPrice = cartPresent.totalPrice - quantity * productPrice
                        var remove = await cartModel.findOneAndUpdate({ _id: cartId }, obj, { new: true })
                        return res.status(200).json({ status: true, message: "Success", data: remove })
                    }
                    newArr.push(itemsArr[i])

                }

            }
            let newResult = [...newArr, ...resultArr]
            obj.items = newResult
            obj.totalPrice = cartPresent.totalPrice - productPrice

            var decrease = await cartModel.findOneAndUpdate({ _id: cartId }, obj, { new: true })
            return res.status(200).json({ status: true, message: "Success", data: decrease })
        }

    } catch (err) {
        return res.status(500).json({ status: false, error: err.message })
    }
}

const getCartByParams = async function (req, res) {
    try {
        let userId = req.params.userId

        if (userId == undefined) return res.status(400).json({ status: false, message: "please give userId in params" })
        if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ status: false, message: "invalid userid in params" })

        //----------Authorization----------------
        if (userId !== req.bearerToken) return res.status(401).json({ status: false, message: "user is not authorized" })
        //---------------------------------------
        let user = await userModel.findOne({ _id: userId })
        if (!user) return res.status(404).json({ status: false, message: "user doesn't exist or deleted" })

        let cart = await cartModel.findOne({ userId: userId }).select({ __v: 0 })
        if (!cart) return res.status(404).json({ status: false, message: "No cart exist" })

        res.status(200).json({ status: true, message: "Success", data: cart })
    } catch (err) {
        return res.status(500).json({ status: false, error: err.message })
    }

}

const deleteCartByParams = async function (req, res) {

    try {
        let userId = req.params.userId;

        if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ status: false, message: "userId is invalid" })
        if (userId !== req.bearerToken) return res.status(403).json({ status: false, message: "You are not authorised" })

        let usercheck = await userModel.findOne({ _id: userId })
        if (!usercheck) return res.status(404).json({ status: false, message: "User not Found" })

        let cartDelete = await cartModel.findOneAndUpdate({ userId: userId }, { $set: { items: [], totalItems: 0, totalPrice: 0 } }, { new: true })
        if (!cartDelete) return res.status(404).json({ status: false, message: "Cart Doesn't Exist" })

        return res.status(204).json({ status: true, message: "success", data: {} })


    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }

}


module.exports = {createCart,updateCartByParams,getCartByParams,deleteCartByParams}