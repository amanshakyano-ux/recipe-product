const express = require("express")
const router = express.Router();
const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})
const { register, login,updateProfile } = require("../controller/authController")
 const{auth} = require("../middleware/authentication")


router.post("/register", upload.single("profileImage"), register)
router.post("/login", login)
router.put("/profile", auth, upload.single("profileImage"), updateProfile);

module.exports = router;

 