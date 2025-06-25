const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const jwt_secret = process.env.JWT_SECRET_KEY;

  try {
    const token = await req.cookies.token;
    // console.log("token on verifyFunction", token);

    // const token = req.headers["authorization"].split(" ")[1];
    console.log("jwt_token", jwt_secret);

    if (!token) {
      return res.status(404).send({ message: "Invalid token" });
    }

    const decoded = jwt.verify(token, jwt_secret);

    if (!decoded) {
      return res.status(404).send({ message: "Invalid token or not valid" });
    }

    req.userId = decoded.userId;

    req.role = decoded.role;

    next();
  } catch (error) {
    console.error("Error while verifying token");
    res.status(401).send({ message: "Error while verifying token" });
  }
};

module.exports = verifyToken;
