const express = require("express");
const Products = require("./products.model");
const Reviews = require("../reviews/reviews.model");
const router = express.Router();

//post a product route

router.post("/create-product", async (req, res) => {
  try {
    const newProduct = new Products({
      ...req.body,
    });

    // const { product } = req.body;

    // const saveProduct = new Products({ product });

    const savedProduct = await newProduct.save();

    //calculate reviews
    const reviews = await Reviews.find({ productId: savedProduct._id });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );

      const averageRating = totalRating / reviews.length;
      savedProduct.rating = averageRating;

      await savedProduct.save();
    }

    res.status(201).send(savedProduct);
  } catch (error) {
    console.error("Error creating new product");

    res.status(500).send({ message: "Failed to  creating new product" });
  }
});

//get all products

router.get("/", async (req, res) => {
  try {
  } catch (error) {
    console.error("Error creating new product");

    res.status(500).send({ message: "Failed in getting all product" });
  }
});

module.exports = router;
