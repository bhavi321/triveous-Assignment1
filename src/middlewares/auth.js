const jwt = require("jsonwebtoken");

const authentication = async function (req, res, next) {
  try {
    let bearerToken = req.header("Authorization");
    if (!bearerToken)
      return res
        .status(400)
        .json({ status: false, message: "Bearer Token id mandatory" });
    bearerToken = bearerToken.replace("Bearer ", "");
    jwt.verify(bearerToken, "dummykey", function (err, decode) {
      if (err) {
        return res.status(401).json({ status: false, message: err.message });
      } else {
        req.bearerToken = decode.userId;
        next();
      }
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = { authentication };
