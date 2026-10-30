import axios from "axios";
import { API_url } from "../../Config/config";


// =====================================================
// LOGIN
// =====================================================

export const LoginApi = async (data) => {

    return await axios.post(
        `${API_url}/frontend/auth/login`,
        data
    );

};


// =====================================================
// REGISTER
// =====================================================

export const RegisterApi = async (data) => {

    return await axios.post(
        `${API_url}/frontend/auth/register`,
        data
    );

};


// =====================================================
// GET PROFILE
// =====================================================

export const GetProfile = async () => {
    const token = localStorage.getItem("usertoken") || localStorage.getItem("token") || "";
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return await axios.get(`${API_url}/frontend/auth/profile`, { headers });
};


// =====================================================
// UPDATE PROFILE
// =====================================================

export const UpdateProfile = async (data) => {
    const token = localStorage.getItem("usertoken") || localStorage.getItem("token") || "";
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return await axios.put(`${API_url}/frontend/auth/profile`, data, { headers });
};


// =====================================================
// CHANGE PASSWORD
// =====================================================

export const ChangePassword = async (data) => {
    const token = localStorage.getItem("usertoken") || localStorage.getItem("token") || "";
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return await axios.put(`${API_url}/frontend/auth/passwordChange`, data, { headers });
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

export const ForgotPasswordApi = async (data) => {

    return await axios.post(
        `${API_url}/frontend/auth/passwordForget`,
        data
    );

};


// =====================================================
// VERIFY OTP
// =====================================================

export const VerifyOtpApi = async (data) => {

    return await axios.post(
        `${API_url}/frontend/auth/verify-otp`,
        data
    );

};


// =====================================================
// RESET PASSWORD
// =====================================================

export const ResetPasswordApi = async (data) => {

    return await axios.post(
        `${API_url}/frontend/auth/reset-password`,
        data
    );

};