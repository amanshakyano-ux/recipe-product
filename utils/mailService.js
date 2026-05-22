require("dotenv").config();
const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SIB_API_KEY;

const sendResetPasswordMail = async (email, resetLink) => {
  const tranEmailApi = new Sib.TransactionalEmailsApi();

  await tranEmailApi.sendTransacEmail({
    sender: {
      email: process.env.SENDER_EMAIL,
      name: "Recipe App",
    },
    to: [{ email }],
    subject: "Reset your Recipe App password",
    htmlContent: `
      <h3>Reset Your Password</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
    `,
  });
};

module.exports = { sendResetPasswordMail };