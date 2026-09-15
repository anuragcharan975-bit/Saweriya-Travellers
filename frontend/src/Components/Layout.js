import React from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="h-[calc(100vh-96px)] bg-slate-100 overflow-hidden">
        <div className="flex h-full">

          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto scrollbar-hide">
            <Sidebar />
          </aside>

          {/* Page Content */}
          <section className="flex-1 overflow-y-auto scrollbar-hide p-6">
            <Outlet />
          </section>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}