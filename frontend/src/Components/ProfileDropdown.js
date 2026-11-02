import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    setOpen(false);
    navigate("/admin");
  };

  // Profile
  const handleProfile = () => {
    setOpen(false);
    navigate("/admin/profile");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-100 transition border border-slate-200/60 bg-white"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-800 leading-none">
            Admin
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
            Super Administrator
          </span>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl shadow-slate-200/50">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-800">Saweriya Control Portal</p>
            <p className="text-[11px] text-slate-500 truncate">admin@gmail.com</p>
          </div>

          {/* Profile */}
          <button
            onClick={handleProfile}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <User className="h-4 w-4 text-slate-500" />
            <span>Admin Profile</span>
          </button>

          {/* Divider */}
          <div className="my-1 border-t border-slate-100" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
