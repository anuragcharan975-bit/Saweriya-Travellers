const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    html,
  });

  console.log("Mail Sent:", info);
};

module.exports = sendMail;