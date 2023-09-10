const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { userJoi, loginJoi } = require("../middlewares/joiValidation");
const createUser = async function (req, res) {
  try {
    const body = req.body;

    if (Object.keys(body).length == 0) {
      return res
        .status(400)
        .json({ status: "false", message: "All fields are mandatory" });
    }

    const checkMail = await UserModel.findOne({ email: body.email });
    if (checkMail)
      return res.status(400).json({ message: "email already present" });

    const { error, value } = userJoi.validate(body, { abortEarly: false });
    if (error)
      return res
        .status(400)
        .json({ message: error.details[0].message.replaceAll('"', "") });

    const hashedPassword = bcrypt.hashSync(body.password, 10);
    body.password = hashedPassword;

    let userData = await UserModel.create(body);

    res.status(201).json({ message: "success", data: userData });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

const loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;

    const { error } = loginJoi.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ error });

    let user = await UserModel.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "email is not found" });

    let hashedToken = user.password;
    let decrypt = await bcrypt.compare(password, hashedToken);

    if (decrypt == true) {
      let token = jwt.sign({ userId: user._id }, "dummykey", {
        expiresIn: "4h",
      });
      return res
        .status(200)
        .json({ message: "User login successful", data: {userId : user._id, token : token} });
    } else {
      return res.status(400).json({ message: "enter valid password" });
    }
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};
module.exports = { createUser, loginUser };
