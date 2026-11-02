const Admin = require("../../model/admin");
const bcrypt = require("bcrypt");
const generateToken = require("../../utils/jwt");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const data = await Admin.findOne({
            email,
            role_id: 1,
        });

        if (!data) {
            return res.status(401).json({
                message: "Invalid Email",
            });
        }

        const isMatch = await bcrypt.compare(password, data.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password",
            });
        }

        const token = generateToken({
            _id: data._id,
            email: data.email,
            role_id: data.role_id,
        });

        res.status(200).json({
            message: "Login Successful",
            token,
            role_id: data.role_id,
            user_id: data._id,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const adminId = req.user?.user_id || req.user?.id || req.user?._id;
        const data = await Admin.findById(adminId).select("-password");

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Admin profile not found",
            });
        }

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const adminId = req.user?.user_id || req.user?.id || req.user?._id;
        const { full_name, mobile_no, email } = req.body;

        const updateData = {};
        if (full_name !== undefined) updateData.full_name = full_name;
        if (mobile_no !== undefined) {
            const cleanMobile = String(mobile_no).trim();
            if (cleanMobile && !/^[0-9]{10}$/.test(cleanMobile)) {
                return res.status(400).json({
                    success: false,
                    message: "Mobile number must be exactly 10 digits"
                });
            }
            updateData.mobile_no = cleanMobile;
        }
        if (email !== undefined) updateData.email = email;
        if (req.file) {
            updateData.profile_image = req.file.filename;
        }

        const data = await Admin.findByIdAndUpdate(adminId, updateData, {
            new: true,
        }).select("-password");

        res.status(200).json({
            success: true,
            message: "Admin profile updated successfully",
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const adminId = req.user?.user_id || req.user?.id || req.user?._id;
        const { old_password, new_password } = req.body;

        if (!old_password || !new_password) {
            return res.status(400).json({
                success: false,
                message: "Old password and new password are required"
            });
        }
        if (new_password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        const isMatch = await bcrypt.compare(old_password, admin.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(new_password, salt);
        await admin.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    login,
    getProfile,
    updateProfile,
    changePassword,
};
