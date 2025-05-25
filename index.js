const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 5000;
var cors = require("cors");

//middlewares setup

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use(cookieParser());

bodyParser.json();

// This is actually redundant since express.json() does the same thing
// You can remove this line as it's not needed when using express.json()
// bodyParser.urlencoded({ extended: true })
// Similar to express.urlencoded() - also redundant

// express.urlencoded() is the modern way (Express 4.16+)
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

async function main() {
  //   await mongoose.connect("mongodb://127.0.0.1:27017/test");
  await mongoose.connect(process.env.MONGO_URI);
}

main()
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World developers !");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
