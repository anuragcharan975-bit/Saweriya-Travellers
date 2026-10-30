import React from "react";
import ProfileDropdown from "./ProfileDropdown";
import DriveBusLogo from "../assets/adminlogo.png";
import { Globe, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-[1700px] mx-auto px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <img
                src={DriveBusLogo}
                alt="DriveBus Admin"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">
              <ShieldCheck size={14} className="text-violet-600" />
              Console Portal
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* View Live Customer Site */}
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/70 transition"
              title="Open Public Website in new tab"
            >
              <Globe size={15} className="text-slate-500" />
              <span>Live Website</span>
            </Link>

            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
