const ProductModel = require("../models/productModel");

const createProduct = async function (req, res) {
  try {
    let body = req.body;

    let { title, price, description, availability, categoryId } = body;

    if (Object.keys(body).length == 0) {
      return res
        .status(400)
        .json({ status: "false", message: "All fields are mandatory" });
    }

    if (!title)
      return res
        .status(400)
        .json({ status: false, message: "title is mandotary" });
    let productData = await ProductModel.create(body);
    return res.status(201).json({ status: true, data: productData });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
};

const getProductsByCategoryId = async function (req, res) {
  const categoryId = req.params.categoryId;
  const getProduct = await ProductModel.find({ categoryId: categoryId });
  return res.status(200).json({ status: true, data: getProduct });
};

const getProductByProductId = async function (req, res) {
    const productId = req.params.productId;
    const getProduct = await ProductModel.findOne({ _id: productId });
    return res.status(200).json({ status: true, data: getProduct });
  };

module.exports = { createProduct, getProductsByCategoryId, getProductByProductId };
