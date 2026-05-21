const express = require("express")
const router = express.Router();
const {followUser,unfollowUser,getFollowers,getFollowing} = require("../controller/follow");
const { auth } = require("../middleware/authentication");
router.use(auth)
router.get("/getAllfollowers",getFollowers)
router.get("/getAllfollowing",getFollowing)
router.post("/followUser/:followId",followUser)
router.post("/unfollowUser/:followId",unfollowUser)

module.exports = router;