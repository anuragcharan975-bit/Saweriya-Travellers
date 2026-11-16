require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../model/admin");

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/anurag_travels";
mongoose.connect(mongoUri);

async function createAdmin() {
  try {
    const admin = await Admin.findOne({ role_id: 1 });

    if (admin) {
      console.log("Admin already exists");
      process.exit();
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await Admin.create({
      email: adminEmail,
      password: hashedPassword,
      role_id: 1,
      status: true,
    });

    console.log("Admin Created Successfully");
    process.exit();
  } catch (err) {
    console.log("Admin creation error:", err);
    process.exit(1);
  }
}

createAdmin();
