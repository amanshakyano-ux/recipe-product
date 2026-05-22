const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  resetPasswordPage,
  updatePassword,
} = require("../controller/passwordController");

router.post("/forgot", forgotPassword);
router.get("/reset/:id", resetPasswordPage);
router.post("/update/:id", updatePassword);

module.exports = router;