import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock,Bus } from "lucide-react";
import DriveBusLogo from "../../assets/logo.png";
import Header from "./Header";
import Footer from "./Footer";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { LoginApi } from "../../Service/frontend/Auth";

export default function Login() {

  const navigate = useNavigate()


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({

      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),


      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),


    onSubmit: async (values, { resetForm }) => {
      try {

        const res = await LoginApi(values);
        console.log(res.data);
        const { token } = res.data;

        localStorage.setItem("usertoken", token);

        if (res.data.user) {
          localStorage.setItem(
            "userdata",
            JSON.stringify(res.data.user)
          );
        }

        await Swal.fire({
          icon: "success",
          title: "Login Successful 🎉",
          text: res.data.message || "Your account has been login successfully.",
          confirmButtonText: "Go to Profile",
          confirmButtonColor: "#16a34a",
          timer: 2000,
          timerProgressBar: true,
        });

        resetForm();
        navigate("/profile");

      } catch (error) {

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.response?.data?.message || "Something went wrong. Please try again.",
          confirmButtonText: "OK",
          confirmButtonColor: "#dc2626",
        });

      }
    },
  });


  return (
    <div>
      <Header />
      <div className="min-h-screen bg-[#0F1B4C] flex items-center justify-center px-4 py-20 mt-8">

        <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">

          {/* Left Side */}
          <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#0F1B4C] to-[#1A2A6C] text-white p-12">

            <div className="flex items-center gap-3">
                <Bus className="text-orange-400" size={36} />
                <span className="text-3xl font-bold">DriveBus</span>
              </div>
            <h1 className="text-5xl mt-2 font-bold leading-tight">
              Welcome Back
            </h1>

            <p className="mt-4 text-gray-300 leading-8">
              Login to your DriveBus account to book buses, manage your
              bookings, track tickets and enjoy a smooth travel experience.
            </p>

            <div className="mt-10">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900"
                alt="Bus"
                className="rounded-2xl shadow-lg"
              />
            </div>

          </div>

          {/* Right Side */}

          <div className="p-10 md:p-14 flex flex-col justify-center">

            <div className="lg:hidden flex justify-center mb-6">
              <img
                src={DriveBusLogo}
                alt="DriveBus"
                className="w-36"
              />
            </div>

            <h2 className="text-4xl font-bold text-[#0F1B4C]">
              Login
            </h2>

            <p className="text-gray-500 mt-2 mb-8">
              Sign in to continue
            </p>

            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-4 text-gray-400"
                  size={20}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded-xl pl-12 pr-4 py-3 outline-none focus:border-orange-500"
                />

                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-4 text-gray-400"
                  size={20}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded-xl pl-12 pr-4 py-3 outline-none focus:border-orange-500"
                />

                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                )}
              </div>

              <div className="flex justify-between items-center text-sm">

                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Remember Me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-orange-500 hover:underline"
                >
                  Forgot Password?
                </Link>

              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold duration-300"
              >
                Login
              </button>

            </form>

            <p className="text-center mt-8 text-gray-600">
              Don't have an account?
              <Link
                to="/register"
                className="text-orange-500 font-semibold ml-2"
              >
                Register
              </Link>
            </p>

          </div>

        </div>

      </div>
      <Footer />
    </div>
  );
}