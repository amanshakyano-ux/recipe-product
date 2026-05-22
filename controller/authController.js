const isStrInvalid = require("../utils/strValidation");
const { User } = require("../models/users");
const s3 = require("../utils/s3Service");
const bcrypt = require("bcrypt");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const generateToken = require("../utils/generateToken");


const register = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    if (isStrInvalid(name) || isStrInvalid(email) || isStrInvalid(password)) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are mandatory",
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    let profileImage = null;

    if (req.file) {
      const file = req.file;
      const fileName = `profiles/${Date.now()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3.send(command);

      profileImage = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      bio,
      profileImage,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isStrInvalid(email) || isStrInvalid(password)) {
      return res.status(400).json({
        success: false,
        message: "Email and password are mandatory",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

      
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong Password",
      });
    }


if (user.isBanned) {
  return res.status(403).json({
    success: false,
    message: "Your account is banned"
  });
}
    return res.status(200).json({
      success: true,
      message: "User logged in",
      token: generateToken(user.id),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = { register,login};
