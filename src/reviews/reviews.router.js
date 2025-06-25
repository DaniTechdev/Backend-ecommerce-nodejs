const express = require("express");
const Reviews = require("./reviews.model");
const Products = require("../products/products.model");
const router = express.Router();

//Post a new review

router.post("/post-review", async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;
    if (!comment || !userId || !productId || !rating) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const existingReview = await Reviews.findOne({ productId, userId });

    if (existingReview) {
      //update existing review not to have duplicate reviews
      existingReview.comment = comment;
      existingReview.rating = rating;
      await existingReview.save();
    } else {
      // Create a new review
      const newReview = new Reviews({ comment, rating, userId, productId });

      await newReview.save();
    }

    // Calculate the average rating for the product
    const reviews = await Reviews.find({ productId });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;
      const product = await Products.findById(productId);
      if (product) {
        product.rating = averageRating;
        await product.save({ validateBeforeSave: false });
      } else {
        return res.status(404).send({ message: "Product not found" });
      }
    }

    res
      .status(200)
      .send({ message: "Review processed successfully", reviews: reviews });
  } catch (error) {
    console.error("Error posting review", error);
    res.status(500).send({ message: "Failed to post review" });
  }
});

module.exports = router;
