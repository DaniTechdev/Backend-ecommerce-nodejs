const express = require("express");
const Products = require("./products.model");
const router = express.Router();

//post a product route

router.post("/create-product", async (req, res) => {
  try {
    const newProduct = new Products({
      ...req.body,
    });

    // const { product } = req.body;

    // const saveProduct = new Products({ product });

    const saveProduct = await newProduct.save();

    res.status(201).send(saveProduct);
  } catch (error) {}
});

module.exports = router;
