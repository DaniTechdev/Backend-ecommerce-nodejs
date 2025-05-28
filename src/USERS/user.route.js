const express = require("express");
const router = express.Router();
const User = require("./user.model");
const bcrypt = require("bcrypt");
const generateToken = require("../middleware/generateToken");
const verifyToken = require("../middleware/verifyToken");

//Register endpoint

// router.get("/", async (req, res) => {
//   res.send("Registeration routess");
// });

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // const salt = await bcrypt.genSalt(10);

    // const hashedPassword = await bcrypt.hashSync(password, salt);

    const user = new User({
      username: username,
      email: email,
      password: password,
    });

    await user.save();

    res.status(200).json({ message: "User registered successully" });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).send({ message: "Error registering user" });
  }
});

//login user endpoint

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    console.log("email", email, password);

    if (!user)
      return res.status(404).send({ message: "user not found registered" });

    const isMatch = await user.comparePassword(password);

    // const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    //generate token
    const token = await generateToken(user._id);
    // console.log("token", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).send({
      message: "user login succesfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        profession: user.profession,
      },
    });
  } catch (error) {
    console.error("Error in logging in User", error);
    res.status(500).send({ message: "Error in logging in user" });
  }
});

//all users

router.get("/users", verifyToken, async (req, res) => {
  res.send({ message: "protected users" });
});
module.exports = router;
