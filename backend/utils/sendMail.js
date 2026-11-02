const nodemailer = require("nodemailer");

const sendMail = async (to, subject, html) => {
  // If credentials are not provided, log email content and return gracefully
  if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
    console.log("-----------------------------------------");
    console.log("⚠️ EMAIL NOTICE (Credentials not configured in .env):");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("-----------------------------------------");
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html,
    });

    console.log("Mail Sent Successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Nodemailer Error:", error.message);
    throw error;
  }
};

module.exports = sendMail;
