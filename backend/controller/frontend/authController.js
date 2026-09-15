const Authentication = require("../../model/authentication");
const sendMail = require("../../utils/sendMail");
const bcrypt = require("bcrypt");
const generateToken = require("../../utils/jwt");
const Otp = require("../../model/otp");
const generateOtp = require("../../utils/otp");


const register = async (req, res) => {

    try {

        const { email, mobile_no, full_name, password } = req.body;

        if (!/^[0-9]{10}$/.test(mobile_no)) {
            return res.status(400).json({
                success: false,
                message: "Mobile number must be exactly 10 digits"
            });
        }

        const existingEmail = await Authentication.findOne({ email, role_id: 4 });

        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const data = await Authentication.create({
            full_name,
            email,
            mobile_no,
            password: hashPassword,
            role_id: 4
        });

        await sendMail(
            email,
            "🎉 Welcome to DriveBus",
            `<h2>Hello ${full_name}</h2>
            <p>Your account has been created successfully.</p>
            <p>Email : ${email}</p>
            <p>Password : ${password}</p>`
        );

        return res.status(201).json({
            success: true,
            message: "Registration Successfully Completed",
            registerData: data
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const data = await Authentication.findOne({
            email,
            role_id: 4
        });

        if (!data) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const isMatch = await bcrypt.compare(password, data.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = generateToken(data);

        return res.status(200).json({
            success: true,
            message: "Login Successfull",
            token,
            user: data
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getProfile = async (req, res) => {

    try {

        const user = await Authentication.findById(req.user.user_id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const changePassword = async (req, res) => {

    try {

        const { old_password, new_password } = req.body;

        const user = await Authentication.findById(req.user.user_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            old_password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old Password Incorrect"
            });
        }

        const hashPassword = await bcrypt.hash(new_password, 10);

        user.password = hashPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password Changed Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const forgotPassword = async (req, res) => {
    try {
        console.log("Forgot Password API Hit");
        console.log(req.body);

        const { email } = req.body;

        const user = await Authentication.findOne({
            email,
            role_id: 4
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email not found"
            });
        }

        const otp = generateOtp();

        // Delete old OTP
        await Otp.deleteMany({ email });

        // Save new OTP
        await Otp.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        // Send OTP
        await sendMail(
            email,
            "DriveBus Password Reset OTP",
            `
            <h2>Password Reset OTP</h2>
            <p>Your OTP is <b>${otp}</b></p>
            <p>This OTP is valid for 5 minutes.</p>
            `
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const verifyOtp = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const data = await Otp.findOne({ email, otp });

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (new Date() > data.expiresAt) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP Verified Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const resetPassword = async (req, res) => {

    try {

        const { email, newPassword } = req.body;

        const user = await Authentication.findOne({
            email,
            role_id: 4
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashPassword;

        await user.save();

        // Delete OTP after password reset
        await Otp.deleteMany({ email });

        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const {
            full_name,
            mobile_no
        } = req.body;

        const updateData = {
            full_name,
            mobile_no
        };

        // Profile image agar upload hui hai
        if (req.file) {
            updateData.profile_image = req.file.filename;
        }

        const user = await Authentication.findByIdAndUpdate(
            userId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        });

    } catch (error) {
        console.log("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Profile update failed",
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    changePassword,
    forgotPassword,
    verifyOtp,
    resetPassword,
    updateProfile
};