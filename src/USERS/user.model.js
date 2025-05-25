import mongoose from "mongoose";
const { Schema } = mongoose;

const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, require: true, unique: true }, //unique means no two
  email: { type: String, require: true, unique: true }, //unquie means no two emails should exists
  passsword: { type: String, require: true },
  role: {
    type: String,
    default: "user",
  },
  profileImage: String,
  bio: { type: String, maxlength: 200 },
  profession: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = new model("User", userSchema);

module.exports = User;
