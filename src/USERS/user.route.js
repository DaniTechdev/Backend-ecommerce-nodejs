const express = require("express");
const router = express.Router();
const User = require("./user.model");
// const bcrypt = require("bcrypt");

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
  } catch (error) {}
});
module.exports = router;
