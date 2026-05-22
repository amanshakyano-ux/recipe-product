const express = require("express")
const router = express.Router();
const { addToFavorites, removeFromFavorites, getFavoriteRecipes } =require("../controller/favorite")
const { auth, checkBan } = require("../middleware/authentication")
router.use(auth,checkBan)


router.post("/add/:recipeId", addToFavorites)
router.delete("/remove/:recipeId", removeFromFavorites)
router.get("/myfavorites", getFavoriteRecipes)  
module.exports = router;
