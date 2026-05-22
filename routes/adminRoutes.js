const express = require("express");
const router = express.Router();

const { auth, adminAuth } = require("../middleware/authentication");

const {
  getAllUsers,
  banUser,
  unBanUser,
  deleteRecipe,
  deleteReview,
  getDashboardStats,
} = require("../controller/admin");

const { getAllRecipes } = require("../controller/recipeController");

router.use(auth);
router.use(adminAuth);

router.get("/getAllRecipes", getAllRecipes);
router.get("/getAllUsers", getAllUsers);
router.get("/getDashboard", getDashboardStats);

router.delete("/deleteRecipe/:recipeId", deleteRecipe);
router.delete("/deleteReview/:reviewId", deleteReview);

router.patch("/banUser/:targetUser", banUser);
router.patch("/unBanUser/:targetUser", unBanUser);

module.exports = router;
