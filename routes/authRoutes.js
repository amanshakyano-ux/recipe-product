const express = require("express")
const router = express.Router();
const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})
const { register, login,updateProfile,getUserProfile } = require("../controller/authController")
 const{auth} = require("../middleware/authentication")


router.post("/register", upload.single("profileImage"), register)
router.post("/login", login)
router.put("/profile", auth, upload.single("profileImage"), updateProfile);
router.get("/user/:userId", auth, getUserProfile);

module.exports = router;

 