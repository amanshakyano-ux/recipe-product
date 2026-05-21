const express = require("express");
const router = express.Router();
const{ getCollectionRecipes,createCollection, addRecipeToCollection, removeRecipeFromCollection, removeCollection ,getUserCollections} = require("../controller/collection");
const{auth} = require("../middleware/authentication")
router.use(auth)

router.post("/create", createCollection)
router.post("/add/:collectionId/:recipeId", addRecipeToCollection)
router.delete("/remove/:collectionId/:recipeId", removeRecipeFromCollection)
router.get("/mycollections", getUserCollections)  
router.delete("/delete/:collectionId", removeCollection)
router.get("/:collectionId/recipes", getCollectionRecipes)  
module.exports = router;