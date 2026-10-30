import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import Swal from "sweetalert2";
import { VerifyOtpApi, ForgotPasswordApi } from "../../Service/frontend/Auth";
export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();

    const email =
        location.state?.email ||
        localStorage.getItem("resetEmail") ||
        "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [seconds, setSeconds] = useState(30);

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    useEffect(() => {
        if (seconds <= 0) return;

        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (!otp.trim()) {
            Swal.fire("Error", "Please enter OTP", "error");
            return;
        }

        try {
            setLoading(true);

            const res = await VerifyOtpApi({
                email,
                otp,
            });

            const msg = res.data?.otp 
                ? `${res.data.message} (Your OTP: ${res.data.otp})` 
                : (res.data?.message || "OTP resent successfully");
            Swal.fire("Success", msg, "success");

            navigate("/reset-password", {
                state: { email },
            });
        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.message || "OTP verification failed",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setResendLoading(true);

            const res = await ForgotPasswordApi({
                email,
            });

            const msg = res.data?.otp 
                ? `${res.data.message} (Your OTP: ${res.data.otp})` 
                : (res.data?.message || "OTP resent successfully");
            Swal.fire("Success", msg, "success");

            setOtp("");
            setSeconds(30);
        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.message || "Failed to resend OTP",
                "error"
            );
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
                    Verify OTP
                </h2>

                <div className="mb-6">
                    <label className="block text-lg font-semibold mb-2">Email</label>
                    <div className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50">
                        <Mail size={20} className="text-gray-500" />
                        <input
                            type="email"
                            value={email}
                            readOnly
                            className="w-full bg-transparent outline-none text-gray-700"
                        />
                    </div>
                </div>

                <form onSubmit={handleVerifyOtp}>
                    <div className="mb-6">
                        <label className="block text-lg font-semibold mb-2">OTP</label>
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="Enter 6-digit OTP"
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-70"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <div className="mt-5 text-center">
                    <button
                        onClick={handleResendOtp}
                        disabled={resendLoading || seconds > 0}
                        className="text-blue-600 font-semibold disabled:text-gray-400"
                    >
                        {resendLoading
                            ? "Resending..."
                            : seconds > 0
                                ? `Resend OTP (${seconds}s)`
                                : "Resend OTP"}
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate("/forgot-password")}
                        className="text-gray-600 hover:text-black"
                    >
                        Back to Forgot Password
                    </button>
                </div>
            </div>
        </div>
    );
}