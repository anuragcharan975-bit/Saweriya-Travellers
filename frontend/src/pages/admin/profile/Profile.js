import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  KeyRound,
  Camera,
  CheckCircle,
  Save,
  Lock,
  Eye,
  EyeOff,
  Server,
  Activity,
  Calendar,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  GetAdminProfile,
  UpdateAdminProfile,
  ChangeAdminPassword,
} from "../../../Service/admin/Auth";
import { API_url } from "../../../Config/config";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Profile Form state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile_no: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Password Form state
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await GetAdminProfile();
      if (res?.data?.data) {
        const d = res.data.data;
        setProfile(d);
        setFormData({
          full_name: d.full_name || "Saweriya Admin",
          email: d.email || "admin@gmail.com",
          mobile_no: d.mobile_no || "",
        });
        if (d.profile_image) {
          const imgUrl = d.profile_image.startsWith("http")
            ? d.profile_image
            : `${API_url}/uploads/${d.profile_image}`;
          setImagePreview(imgUrl);
        }
      }
    } catch (err) {
      console.error("Failed to load admin profile:", err);
      // Fallback data
      setFormData({
        full_name: "Saweriya Admin",
        email: "admin@gmail.com",
        mobile_no: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "File Too Large",
          text: "Profile image must be less than 2 MB.",
        });
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (formData.mobile_no && !/^[0-9]{10}$/.test(String(formData.mobile_no).trim())) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Mobile Number",
        text: "Mobile number must be exactly 10 digits",
      });
      return;
    }

    try {
      setSavingProfile(true);
      const data = new FormData();
      data.append("full_name", formData.full_name);
      data.append("email", formData.email);
      data.append("mobile_no", formData.mobile_no);
      if (selectedFile) {
        data.append("profile_image", selectedFile);
      }

      const res = await UpdateAdminProfile(data);
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: res.data.message || "Admin profile updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchProfile();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.old_password || !passwordData.new_password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both old and new passwords.",
      });
      return;
    }
    if (passwordData.new_password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "New password must be at least 6 characters long.",
      });
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      Swal.fire({
        icon: "error",
        title: "Mismatch",
        text: "New password and Confirm password do not match.",
      });
      return;
    }

    try {
      setSavingPassword(true);
      const res = await ChangeAdminPassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Password Changed",
          text: "Your password has been changed successfully!",
        });
        setPasswordData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl shadow-slate-900/10 border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span>Saweriya Travellers Admin Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Administrator Profile
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-xl">
              Manage your personal credentials, contact email, profile avatar, and administrative access settings.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
            <Activity className="text-emerald-400" size={24} />
            <div>
              <p className="text-[11px] text-slate-300 font-medium">Console Status</p>
              <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Active & Verified
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-indigo-500 to-indigo-700" />

            {/* Profile Avatar */}
            <div className="relative mt-8 mb-4">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl bg-slate-900 overflow-hidden flex items-center justify-center relative group">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Admin Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-indigo-300" />
                )}
                <label
                  htmlFor="admin_avatar"
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-xs font-semibold"
                >
                  <Camera size={20} className="mb-1" />
                  <span>Change</span>
                </label>
              </div>
              <input
                id="admin_avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <h2 className="text-xl font-black text-slate-800">
              {formData.full_name || "Saweriya Admin"}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {formData.email}
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <ShieldCheck size={14} />
              <span>Super Administrator (Role #1)</span>
            </div>

            <div className="w-full border-t border-slate-100 my-6" />

            {/* Admin Badges & Details */}
            <div className="w-full space-y-3 text-left text-xs">
              <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-semibold flex items-center gap-2">
                  <Server size={14} className="text-slate-400" /> Role Type
                </span>
                <span className="font-bold text-slate-800">Master Admin</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-semibold flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" /> Privileges
                </span>
                <span className="font-bold text-emerald-600">Full Access</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-semibold flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" /> Created On
                </span>
                <span className="font-medium text-slate-700">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Primary Console"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Form 1: General Details */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">General Information</h3>
                <p className="text-xs text-slate-500">Update your name, contact email, and mobile number.</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Saweriya Admin"
                      required
                      className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="admin@gmail.com"
                      required
                      className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mobile / Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.mobile_no}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setFormData({ ...formData, mobile_no: val });
                    }}
                    placeholder="+91 9876543210"
                    className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{savingProfile ? "Saving Profile..." : "Save Profile"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Form 2: Change Password */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Security & Password</h3>
                <p className="text-xs text-slate-500">Change your administrator account login password.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full pl-11 pr-11 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.new_password}
                      minLength={6}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-11 pr-11 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      placeholder="Repeat new password"
                      className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-500/25 transition disabled:opacity-50"
                >
                  <KeyRound size={16} />
                  <span>{savingPassword ? "Updating Password..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
