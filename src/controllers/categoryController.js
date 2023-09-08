const CategoryModel = require("../models/categoryModel");

const createCategory = async function (req, res) {
  try {
    let categoryData = await CategoryModel.create(req.body);
    return res.status(201).json({ status: true, data: categoryData });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
const getCategories = async function (req, res) {
  try {  
    let categoryData = await CategoryModel.find();
    return res.status(200).json({ status: true, data: categoryData });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = { createCategory, getCategories };
