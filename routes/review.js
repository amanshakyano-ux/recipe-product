const express = require("express")
const router = express.Router();
const{createReview,deleteReview,updateReview,getReviewsByRecipe} = require("../controller/reviewController")
const { auth, checkBan } = require("../middleware/authentication")

router.use(auth,checkBan)

router.post("/create/:recipeId", createReview )
router.delete("/delete/:reviewId", deleteReview)
router.put("/update/:reviewId", updateReview)
router.get("/get/recipe/:recipeId", getReviewsByRecipe )



module.exports = router;