const express = require("express");
const router = express.Router();

const { createCategory,getCategories } = require("../controllers/categoryController");
const {createProduct, getProductsByCategoryId,getProductByProductId} = require("../controllers/productController");
const {createUser} = require("../controllers/userController")

//--------------------------Category--------------------------------
router.post("/category/create", createCategory);
router.get("/category/get", getCategories);

//--------------------------Product--------------------------------
router.post("/product/create", createProduct);
router.get("/products/:categoryId", getProductsByCategoryId);
router.get("/product/:productId", getProductByProductId);

//--------------------------User--------------------------------
router.post("/user/create", createUser);

router.all("/*", function (req, res) {
  return res
    .status(400)
    .send({ status: false, message: "invalid http request" });
});

module.exports = router;
