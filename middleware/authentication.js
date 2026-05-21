require("dotenv").config();

const jwt = require("jsonwebtoken");
const { User } = require("../models/users");

const auth = async (req, res, next) => {
  try {

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;

    next();

  } catch (err) {
    console.log("THIS IS THE MIDDLEWARE ERROR");

    return res.status(401).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = { auth };