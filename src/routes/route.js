const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");
const {
  createProduct,
  getProductsByCategoryId,
  getProductByProductId,
} = require("../controllers/productController");
const { createUser, loginUser } = require("../controllers/userController");
const {
  createCart,
  updateCartByParams,
  getCartByParams,
  deleteCartByParams
} = require("../controllers/cartController");
const { authentication } = require("../middlewares/auth");

//--------------------------Category--------------------------------
router.post("/category/create", createCategory);
router.get("/category/get", getCategories);

//--------------------------Product--------------------------------
router.post("/product/create", createProduct);
router.get("/products/:categoryId", getProductsByCategoryId);
router.get("/product/:productId", getProductByProductId);

//--------------------------User--------------------------------
router.post("/user/create", createUser);
router.post("/user/login", loginUser);

//--------------------------Cart--------------------------------
router.post("/cart/create/:userId", authentication, createCart);
router.put("/cart/update/:userId", authentication, updateCartByParams);
//router.get("/cart/get/:userId", authentication, getCartByParams);
//router.delete("/cart/delete/:userId", authentication, deleteCartByParams);

router.all("/*", function (req, res) {
  return res
    .status(400)
    .send({ status: false, message: "invalid http request" });
});

module.exports = router;
