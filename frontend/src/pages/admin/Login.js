import React from "react";
import SaweriyaLogo from "../../assets/adminlogo.png";
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
        <div className="flex justify-center mb-4">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-100 shadow-xl bg-slate-900 flex items-center justify-center p-1">
            <img
              src={SaweriyaLogo}
              alt="Saweriya Travellers Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Admin Login</h2>
          <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-1">Saweriya Travellers Console</p>
        </div>
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
              minLength={6}
              placeholder="Enter Password (min 6 characters)"
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