import React from "react";
import DriveBusLogo from "../../assets/adminlogo.png";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "animate.css";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoginApi } from "../../Service/admin/Auth";

export default function Login() {
  const navigate = useNavigate();

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

    onSubmit: async (values) => {
      try {
        const body = {
          email: values.email,
          password: values.password,
        };

        const res = await LoginApi(body);
        const { user_id, role_id, token } = res.data
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("role", role_id);

Swal.fire({
  toast: true,
  position: "center",
  icon: "success",
  title: "Login Successful",
  showConfirmButton: false,
  timer: 1500,
  background: "transparent",
  color: "#22c55e",
  iconColor: "#22c55e",
});
  
        navigate("/admin/dashboard");
      } catch (error) {
        console.log(error);

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text:
            error?.response?.data?.message ||
            "Invalid Email or Password",
        });
      }
    },
  });

  return (
    <div className="login-wrapper">
      <div className="card">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white-500 shadow-lg bg-white flex items-center justify-center">
            <img
              src={DriveBusLogo}
              alt="DriveBus Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h2>Admin Login</h2>
        <form onSubmit={formik.handleSubmit}>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.email && formik.errors.email && (
              <p style={{ color: "red", fontSize: "14px" }}>
                {formik.errors.email}
              </p>
            )}
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.password && formik.errors.password && (
              <p style={{ color: "red", fontSize: "14px" }}>
                {formik.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}