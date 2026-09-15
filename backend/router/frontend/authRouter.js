const express = require("express");

const authRouter = express.Router();

const controller = require("../../controller/frontend/authController");

const validate = require("../../middleware/validate");

const verifyToken = require("../../middleware/verifyToken");

const upload = require("../../middleware/upload");

const {
    registerValidation,
    loginValidation,
    changePasswordValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    verifyOtpValidation
} = require("../../validation/frontend/authValidation");


// =====================================================
// REGISTER
// =====================================================

authRouter.post( "/register",   validate(registerValidation),   controller.register
);


// =====================================================
// LOGIN
// =====================================================

authRouter.post(
    "/login",
    validate(loginValidation),
    controller.login
);


// =====================================================
// PROFILE
// GET PROFILE
// =====================================================

authRouter.get(
    "/profile",
    verifyToken,
    controller.getProfile
);


// =====================================================
// UPDATE PROFILE
// IMPORTANT
// =====================================================

authRouter.put(
    "/profile",
    verifyToken,
    upload.single("profile_image"),
    controller.updateProfile
);


// =====================================================
// CHANGE PASSWORD
// =====================================================

authRouter.put(
    "/passwordChange",
    verifyToken,
    validate(changePasswordValidation),
    controller.changePassword
);


// =====================================================
// FORGOT PASSWORD
// =====================================================

authRouter.post(
    "/passwordForget",
    validate(forgotPasswordValidation),
    controller.forgotPassword
);


// =====================================================
// VERIFY OTP
// =====================================================

authRouter.post(
    "/verify-otp",
    validate(verifyOtpValidation),
    controller.verifyOtp
);


// =====================================================
// RESET PASSWORD
// =====================================================

authRouter.post(
    "/reset-password",
    validate(resetPasswordValidation),
    controller.resetPassword
);


module.exports = authRouter;