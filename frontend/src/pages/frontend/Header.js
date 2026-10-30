import React, { useState, useEffect } from "react";
import BusLogo from "../../assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  LogOut,
  Ticket,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Compass,
  Route as RouteIcon,
  HelpCircle,
  PhoneCall,
  Home as HomeIcon,
} from "lucide-react";

export default function Header() {
  const token = localStorage.getItem("usertoken");
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close menus on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Handle scroll effect for glassmorphism elevation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("userdata");
    navigate("/login");
  };

  const getUserData = () => {
    try {
      const data = localStorage.getItem("userdata");
      if (!data || data === "undefined") return {};
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  };

  const user = getUserData();
  const userName = user?.full_name || user?.name || "Passenger";
  const userEmail = user?.email || "";

  const navLinks = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Search Bus", path: "/search-bus", icon: Compass },
    { name: "Routes", path: "/routeBus", icon: RouteIcon },
    { name: "About", path: "/about", icon: HelpCircle },
    { name: "Contact", path: "/contact", icon: PhoneCall },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/30"
          : "bg-slate-950/80 backdrop-blur-xl border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* ================= BRAND LOGO ================= */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src={BusLogo}
                  alt="DriveBus Logo"
                  className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-white tracking-tight leading-none">
                    Drive<span className="text-orange-500">Bus</span>
                  </span>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Express
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">
                  Smart Intercity Travel
                </span>
              </div>
            </Link>
          </div>

          {/* ================= DESKTOP NAVIGATION ================= */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-white/[0.04] p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 relative ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-white" : "text-slate-400"} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* ================= RIGHT CONTROLS ================= */}
          <div className="flex items-center gap-3">
            {!token ? (
              <div className="hidden sm:flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all duration-200 active:scale-95 flex items-center gap-1.5"
                >
                  <User size={14} />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md shadow-orange-500/25 transition-all duration-200 active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>Register</span>
                </Link>
              </div>
            ) : (
              /* LOGGED IN USER AVATAR & DROPDOWN */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 transition-all duration-200 focus:outline-none"
                >
                  <div className="relative">
                    <img
                      src={
                        user?.profile_image
                          ? `http://localhost:4000/uploads/${user.profile_image}`
                          : user?.image
                          ? `http://localhost:4000/uploads/${user.image}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              userName
                            )}&background=ff6b00&color=fff&bold=true`
                      }
                      alt="profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-orange-500 shadow-xs"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
                  </div>

                  <span className="hidden md:block text-xs font-bold text-slate-200 max-w-[120px] truncate">
                    {userName.split(" ")[0]}
                  </span>

                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${
                      profileDropdownOpen ? "rotate-180 text-orange-400" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu Modal */}
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/60 p-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="px-3.5 py-3 border-b border-slate-800 mb-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-white truncate">
                            {userName}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Verified
                          </span>
                        </div>
                        {userEmail && (
                          <p className="text-xs text-slate-400 truncate">
                            {userEmail}
                          </p>
                        )}
                      </div>

                      {/* Navigation Actions */}
                      <div className="space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-orange-500/10 hover:text-orange-400 transition"
                        >
                          <Ticket size={16} className="text-orange-500" />
                          <span>My Profile & Bookings</span>
                        </Link>

                        <Link
                          to="/contact"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/5 text-slate-300 transition"
                        >
                          <HelpCircle size={16} className="text-slate-400" />
                          <span>Help & Support</span>
                        </Link>
                      </div>

                      <div className="pt-1 mt-1 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={logout}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 w-full transition"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ================= MOBILE HAMBURGER TOGGLE ================= */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ================= MOBILE EXPANDABLE DRAWER ================= */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 px-2 space-y-2 bg-slate-950/95 backdrop-blur-2xl rounded-b-3xl">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {!token && (
              <div className="pt-3 mt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 rounded-2xl text-center text-xs font-bold text-white bg-white/10 border border-white/15"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 rounded-2xl text-center text-xs font-bold text-white bg-orange-500"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
