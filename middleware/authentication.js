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


const adminAuth = async(req,res,next) =>{

    if(req.user.role !== "admin")
    {
        return res.status(403).json({
            success:false,
            message:"You dont have permisson to touch  admin api's"
        })
    }
    next();
}

const checkBan = (req, res, next) => {
  if (req.user.isBanned) {
    return res.status(403).json({
      success: false,
      message: "Your account is banned"
    });
  }

  next();
};
module.exports = { auth,adminAuth,checkBan };