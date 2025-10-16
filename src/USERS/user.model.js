// import mongoose from "mongoose";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, require: true, unique: true }, //unique means no two
  email: { type: String, require: true, unique: true }, //unquie means no two emails should exists
  password: { type: String, require: true },
  role: {
    type: String,
    default: "admin",
  },
  profileImage: String,
  bio: { type: String, maxlength: 200 },
  profession: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//hashing password
//note we have pre method and post method,
//pre means before you save to database
//post method means after saving to database

//we will signify save before saving to database and then define the action we want to carry on, likewise in post methiod
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  //   const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(user.password, 10);

  user.password = hashedPassword;
  next();
});

//match password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = new model("User", userSchema);

module.exports = User;
