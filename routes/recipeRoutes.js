const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createRecipe,
  getAllRecipes,
  getOneRecipe,
  getRecipesByUser,
  getRecipesByCategory,
  searchRecipes
} = require("../controller/recipeController");
const { auth } = require("../middleware/authentication");
router.use(auth);
router.post("/create", upload.single("recipeImage"), createRecipe);
router.get("/all", getAllRecipes);
router.get("/get/:id", getOneRecipe);
router.get("/user", getRecipesByUser);
router.get("/category/:category", getRecipesByCategory);
router.get("/search",searchRecipes)
module.exports = router;
