const jwt = require("jsonwebtoken");
const User = require("../USERS/user.model");

const generateToken = async (userId) => {
  const jwt_secret = process.env.JWT_SECRET_KEY;

  //   console.log("jwt_secret", jwt_secret);

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      jwt_secret, //  This must match your verification secret
      { expiresIn: "1h" } // Use expire for token lifetime
    );

    // console.log("token", token);

    return token;
  } catch (error) {}
};

module.exports = generateToken;
