import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Header from "./Header";
import Footer from "./Footer";
import { ResetPasswordApi } from "../../Service/frontend/Auth";

export default function ResetPassword() {

    const location = useLocation();
    const navigate = useNavigate();

    const email =
        location.state?.email ||
        localStorage.getItem("resetEmail") ||
        "";

    const formik = useFormik({

        initialValues: {
            newPassword: "",
            confirmPassword: ""
        },

        validationSchema: Yup.object({

            newPassword: Yup.string()
                .required("New Password is required")
                .min(6, "Password must be at least 6 characters"),

            confirmPassword: Yup.string()
                .oneOf(
                    [Yup.ref("newPassword")],
                    "Passwords do not match"
                )
                .required("Confirm Password is required")

        }),
        onSubmit: async (values) => {

            try {

                const res = await ResetPasswordApi({
                    email,
                    newPassword: values.newPassword
                });

                Swal.fire({
                    icon: "success",
                    title: res.data.message
                });

                localStorage.removeItem("resetEmail");

                navigate("/login");

            } catch (error) {

                Swal.fire({
                    icon: "error",
                    title: error.response?.data?.message || "Something went wrong"
                });

            }

        }

    });

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

                    <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
                        Reset Password
                    </h2>

                    <form onSubmit={formik.handleSubmit}>

                        <div className="mb-4">
                            <label className="block mb-2 font-semibold">
                                New Password
                            </label>

                            <input
                                type="password"
                                name="newPassword"
                                className="w-full border rounded-lg p-3"
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.newPassword &&
                                formik.errors.newPassword && (
                                    <p className="text-red-500 text-sm">
                                        {formik.errors.newPassword}
                                    </p>
                                )}
                        </div>

                        <div className="mb-5">

                            <label className="block mb-2 font-semibold">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                className="w-full border rounded-lg p-3"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.confirmPassword &&
                                formik.errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">
                                        {formik.errors.confirmPassword}
                                    </p>
                                )}

                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
                        >
                            Reset Password
                        </button>

                    </form>

                </div>

            </div>

            <Footer />
        </>
    );
}