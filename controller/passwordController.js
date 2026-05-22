require("dotenv").config();

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const { User, ForgotPasswordRequest } = require("../models");
const isStrInvalid = require("../utils/strValidation");
const { sendResetPasswordMail } = require("../utils/mailService");

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (isStrInvalid(email)) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const id = uuidv4();

    await ForgotPasswordRequest.create({
      id,
      isActive: true,
      userId: user.id,
    });

    const resetLink = `${process.env.BASE_URL}/api/password/reset/${id}`;

    await sendResetPasswordMail(email, resetLink);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your registered email",
    });
  } catch (err) {
    next(err);
  }
};

const resetPasswordPage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await ForgotPasswordRequest.findOne({
      where: {
        id,
        isActive: true,
      },
    });

    if (!request) {
      return res.status(400).send("<h3>Reset link expired or invalid</h3>");
    }

    return res.status(200).send(`
      <html>
        <body>
          <h3>Reset Your Password</h3>
          <form action="/api/password/update/${id}" method="POST">
            <input type="password" name="newPassword" placeholder="Enter new password" required />
            <button type="submit">Reset Password</button>
          </form>
        </body>
      </html>
    `);
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (isStrInvalid(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    const request = await ForgotPasswordRequest.findOne({
      where: {
        id,
        isActive: true,
      },
    });

    if (!request) {
      return res.status(400).send("<h3>Reset link expired or invalid</h3>");
    }

    const user = await User.findByPk(request.userId);

    if (!user) {
      return res.status(404).send("<h3>User not found</h3>");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    request.isActive = false;
    await request.save();

    return res.status(200).send("<h3>Password updated successfully ✅</h3>");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  forgotPassword,
  resetPasswordPage,
  updatePassword,
};