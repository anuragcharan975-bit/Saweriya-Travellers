import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import AdminLoader from "./AdminLoader";

export default function Layout() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-slate-200/80 shrink-0 hidden md:block">
          <Sidebar />
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto min-h-[calc(100vh-80px)] flex flex-col">
          {loading ? (
            <AdminLoader duration={1500} />
          ) : (
            <div className="transition-opacity duration-300 opacity-100 flex-1">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
