import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Bus,
  Award,
  Headphones,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { RegisterApi } from "../../Service/frontend/Auth";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      mobile_no: "",
      password: "",
    },

    validationSchema: Yup.object({
      full_name: Yup.string()
        .required("Full name is required")
        .min(3, "Name must be at least 3 characters"),

      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      mobile_no: Yup.number()
        .typeError("Mobile number must be numeric")
        .required("Mobile number is required")
        .test(
          "len",
          "Mobile number must be exactly 10 digits",
          (value) => value && value.toString().length === 10
        ),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await RegisterApi(values);

        await Swal.fire({
          icon: "success",
          title: "Registration Successfull",
          text: res.data.message || "Your account has been created successfully.",
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#f97316",
          timer: 1000,
          timerProgressBar: true,
        });

        resetForm();
        navigate("/login");

      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.response?.data?.message || "Something went wrong. Please try again.",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#dc2626",
        });
      }
    },
  });

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4 py-20 mt-5">
        
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
          
          {/* Left Side - Brand Section */}
          <div className="bg-gradient-to-br from-[#0F1B4C] to-[#1B2B72] text-white p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Bus className="text-orange-400" size={36} />
                <span className="text-3xl font-bold">DriveBus</span>
              </div>
              
              <h1 className="text-4xl font-bold mt-10 leading-tight">
                Welcome Aboard!
                <br />
                <span className="text-orange-400">Start Your Journey</span>
              </h1>
              
              <p className="mt-4 text-blue-200 leading-relaxed">
                Create your account and get access to exclusive bus deals, 
                easy booking, and a seamless travel experience.
              </p>
            </div>

            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-sm">Book buses in just 2 minutes</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                <Award className="text-yellow-400" size={20} />
                <span className="text-sm">Best price guaranteed</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                <Headphones className="text-blue-400" size={20} />
                <span className="text-sm">24/7 customer support</span>
              </div>
            </div>

            <div className="mt-8">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format"
                className="rounded-xl h-48 w-full object-cover shadow-lg"
                alt="Bus"
              />
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="p-8 lg:p-10  ">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#0F1B4C]">
                Create Account
              </h2>
              <p className="text-gray-500 mt-1">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Enter your full name"
                    value={formik.values.full_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-3 py-3.5 border ${
                      formik.touched.full_name && formik.errors.full_name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-orange-500"
                    } rounded-xl focus:outline-none focus:ring-2 transition`}
                  />
                </div>
                {formik.touched.full_name && formik.errors.full_name && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.full_name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-3 py-3.5 border ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-orange-500"
                    } rounded-xl focus:outline-none focus:ring-2 transition`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="mobile_no"
                    placeholder="Enter 10-digit mobile number"
                    value={formik.values.mobile_no}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-3 py-3.5 border ${
                      formik.touched.mobile_no && formik.errors.mobile_no
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-orange-500"
                    } rounded-xl focus:outline-none focus:ring-2 transition`}
                  />
                </div>
                {formik.touched.mobile_no && formik.errors.mobile_no && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.mobile_no}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-12 py-3.5 border ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-orange-500"
                    } rounded-xl focus:outline-none focus:ring-2 transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Password must be at least 6 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3.5 rounded-xl transition duration-300 shadow-lg hover:shadow-xl text-lg mt-2"
              >
                Create Account
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center mt-6 text-gray-600">
              Already have an account?
              <Link to="/login" className="text-orange-500 font-semibold ml-2 hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}