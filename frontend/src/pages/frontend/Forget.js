import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

import Header from "./Header";
import Footer from "./Footer";
import { ForgotPasswordApi } from "../../Service/frontend/Auth";

export default function ForgotPassword() {

    const navigate = useNavigate();

    const formik = useFormik({

        initialValues: {
            email: "",
        },

        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid Email")
                .required("Email is required"),
        }),

        onSubmit: async (values, { resetForm }) => {

            try {

                const res = await ForgotPasswordApi(values);

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: res.data.message,
                });

                localStorage.setItem("resetEmail", values.email);

                resetForm();

                navigate("/verify-otp", { state: { email: values.email } });
            } catch (error) {
                console.log(error.response);

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response?.data?.message || "Something went wrong",
                });

            }

        },

    });

    return (
        <>
            <Header />

            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">

                    <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
                        Forgot Password
                    </h2>

                    <form onSubmit={formik.handleSubmit}>

                        <div className="mb-5">

                            <label className="block mb-2 font-semibold">
                                Email
                            </label>

                            <div className="flex items-center border rounded-lg px-3">

                                <Mail size={18} className="text-gray-500" />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email"
                                    className="w-full p-3 outline-none"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                            </div>

                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.email}
                                </p>
                            )}

                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
                        >
                            Send OTP
                        </button>

                    </form>

                    <div className="text-center mt-5">

                        <Link
                            to="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Back to Login
                        </Link>

                    </div>

                </div>

            </div>

            <Footer />
        </>
    );
}