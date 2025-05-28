const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET_KEY;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("token on verifyFunction");
  } catch (error) {}
};

module.exports = verifyToken;
