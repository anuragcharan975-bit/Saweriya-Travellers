const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../model/admin"); 

mongoose.connect("mongodb://127.0.0.1:27017/anurag_travels");

async function createAdmin() {

  try {

    const admin = await Admin.findOne({ role_id: 1 });

    if (admin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await Admin.create({
      email: "admin@gmail.com",
      password: hashedPassword,
      role_id: 1,
      status: true,
    });

    console.log("Admin Created Successfully");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
}

createAdmin();