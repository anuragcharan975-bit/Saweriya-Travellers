import React from "react";
import ProfileDropdown from "./ProfileDropdown";
import  DriveBusLogo from "../assets/adminlogo.png"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1700px] mx-auto px-8">

        <div className="h-24 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-4">

            <a
              href="/"
              className="flex items-center gap-3"
            >
              <div className="text-violet-600">
                <i data-lucide="bus" className="w-10 h-10"></i>
              </div>

    <img
      src={DriveBusLogo}
      alt="DriveBus Logo"
      className="w-40 h-auto object-contain"
    />

            </a>

        

          </div>

          {/* Right Side */}

          <div className="flex items-center gap-8">

          

            <div className="h-12 w-px bg-slate-300"></div>

            <ProfileDropdown />

          </div>

        </div>

      </div>
    </header>
  );
}