require("dotenv").config();
const jwt = require("jsonwebtoken")

function generateToken(id){
 return jwt.sign({id},process.env.JWT_KEY)

}
module.exports = generateToken;