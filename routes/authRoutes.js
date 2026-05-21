const express = require("express")
const router = express.Router();
const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})
const { register, login } = require("../controller/authController")

router.post("/register", upload.single("profileImage"), register)
router.post("/login", login)

module.exports = router;

 