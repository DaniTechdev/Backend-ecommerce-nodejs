const express = require("express");
const Reviews = require("./reviews.model");
const Products = require("../products/products.model");
const router = express.Router();

//Post a new review

router.post("/post-review", async (req, res) => {
  console.log("Received request to post review", req.body);

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

//total review count

router.get("/total-reviews", async (req, res) => {
  try {
    const totalReviews = await Reviews.countDocuments({});

    res.status(200).send({ totalReviews });
  } catch (error) {
    console.error("Error fetching total reviews", error);
    res.status(500).send({ message: "Failed to fetch total review counts" });
  }
});

//get reviews by userId

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send({ message: "User ID is required" });
  }
  try {
    const reviews = await Reviews.find({ userId: userId }).sort({
      ceatedAt: -1,
    });

    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .send({ message: "No reviews found for this user" });
    }
    res.status(200).send(reviews);
  } catch (error) {
    console.error("Error fetching reviews by userId", error);
    res.status(500).send({ message: "Failed to fetch reviews by userId" });
  }
});

module.exports = router;
