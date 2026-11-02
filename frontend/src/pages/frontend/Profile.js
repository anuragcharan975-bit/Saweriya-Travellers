import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate, Link } from "react-router-dom";
import { GetProfile, ChangePassword } from "../../Service/frontend/Auth";
import { API_url } from "../../Config/config";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  KeyRound,
  Ticket,
  Edit3,
  X,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Camera,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await GetProfile();
      let profileData = {};
      if (res?.data?.data) {
        profileData = res.data.data;
      } else if (res?.data) {
        profileData = res.data;
      } else {
        profileData = res || {};
      }
      setProfile(profileData);
    } catch (error) {
      console.log("Profile Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.old_password || passwordData.old_password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Old password must be at least 6 characters",
      });
      return;
    }

    if (!passwordData.new_password || passwordData.new_password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "New password must be at least 6 characters",
      });
      return;
    }

    try {
      const res = await ChangePassword(passwordData);
      Swal.fire({
        icon: "success",
        title: "Password Changed",
        text: res?.data?.message || res?.message || "Password updated successfully!",
        timer: 1800,
        showConfirmButton: false,
      });

      setPasswordData({ old_password: "", new_password: "" });
      setShowPasswordModal(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Password change failed. Please verify old password.",
      });
    }
  };

  const fullName = profile?.full_name || profile?.name || profile?.username || "Passenger";
  const email = profile?.email || "-";
  const mobile = profile?.mobile_no || profile?.mobile || profile?.phone || "-";
  const address = profile?.address || profile?.full_address || "Address Not Added";
  const memberSince = profile?.createdAt || profile?.created_at || null;
  const profileImage = profile?.profile_image || "";

  const getProfileImageUrl = () => {
    if (!profileImage) return "";
    if (profileImage.startsWith("http://") || profileImage.startsWith("https://")) {
      return profileImage;
    }
    if (profileImage.startsWith("/uploads/")) {
      return `${API_url}${profileImage}`;
    }
    if (profileImage.startsWith("uploads/")) {
      return `${API_url}/${profileImage}`;
    }
    return `${API_url}/uploads/${profileImage.replace(/^\/+/, "")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-28 pb-20">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-bold text-sm">Loading Your Profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex-1">
        {/* Top Header & Direct Link to Bookings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold mb-1.5">
              <User size={13} />
              <span>Customer Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My <span className="text-orange-500">Profile</span>
            </h1>
          </div>

          <button
            onClick={() => navigate("/my-bookings")}
            className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-orange-500/20 transition active:scale-95 self-start sm:self-auto"
          >
            <Ticket size={16} />
            <span>Go to My Bookings & Tickets</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs mb-8">
          {/* Cover Banner */}
          <div className="h-44 sm:h-52 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
            {/* Ambient decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

            {/* Travel Pattern / Grid Lines Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* Banner Top Badges */}
            <div className="absolute top-4 left-6 sm:left-8 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-slate-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5 shadow-xs">
                <Sparkles size={12} className="text-amber-400" />
                <span>Saweriya Express Member</span>
              </span>
            </div>

            <div className="absolute top-4 right-4 sm:right-6 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Verified Account</span>
              </span>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-8 relative z-10">
            {/* Header with Avatar & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-8">
              <div className="flex items-end gap-4">
                {/* Avatar Box with z-20 so it renders on top of the banner */}
                <div className="relative z-20 group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white p-1.5 shadow-2xl border-4 border-white shrink-0 overflow-hidden">
                    {profileImage && !imageError ? (
                      <img
                        src={getProfileImageUrl()}
                        alt={fullName}
                        className="w-full h-full rounded-2xl object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white flex items-center justify-center font-black text-3xl shadow-inner">
                        {fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Quick Edit Photo Camera Action */}
                  <Link
                    to="/edit-profile"
                    title="Change Profile Photo"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-lg border-2 border-white transition active:scale-90"
                  >
                    <Camera size={13} />
                  </Link>
                </div>

                <div className="mb-2">
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">{fullName}</h2>
                  <p className="text-slate-500 text-xs font-medium flex items-center gap-1.5 mt-0.5">
                    <Mail size={13} />
                    <span>{email}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <Link
                  to="/edit-profile"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                >
                  <Edit3 size={14} />
                  <span>Edit Profile</span>
                </Link>

                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                >
                  <KeyRound size={14} />
                  <span>Change Password</span>
                </button>
              </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{fullName}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div className="truncate">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5 truncate">{email}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{mobile}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Address</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{address}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Member Since</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {memberSince ? new Date(memberSince).toLocaleDateString("en-IN") : "2026"}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Security</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">••••••••</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= CHANGE PASSWORD MODAL ================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-slate-100">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X size={20} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
              <KeyRound size={24} />
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight">Change Password</h3>
            <p className="text-slate-500 text-xs mt-1 mb-6">
              Enter your current password and choose a new secure password (minimum 6 characters).
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Old Password
                </label>
                <input
                  type="password"
                  minLength={6}
                  placeholder="Enter current password"
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, old_password: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  minLength={6}
                  placeholder="Enter new password (min 6 characters)"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, new_password: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition active:scale-95"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
