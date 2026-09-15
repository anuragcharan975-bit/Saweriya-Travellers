import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
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
    localStorage.removeItem("usertoken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setOpen(false);

    navigate("/login");
  };

  // Profile
  const handleProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
          <User className="h-5 w-5 text-green-600" />
        </div>

        <span className="font-medium text-gray-700">
          Profile
        </span>

        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
          {/* Profile */}
          <button
            onClick={handleProfile}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100"
          >
            <User className="h-5 w-5 text-gray-500" />

            <span>My Profile</span>
          </button>

          {/* Divider */}
          <div className="my-1 border-t border-gray-100" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />

            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}