import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const isDashboardActive = location.pathname === "/admin/dashboard";

  const isUserActive =
    location.pathname === "/admin/user" ||
    location.pathname.startsWith("/admin/user/");

  const isStaffActive =
    location.pathname === "/admin/staff" ||
    location.pathname.startsWith("/admin/staff/");

  const isBusActive =
    location.pathname === "/admin/bus" ||
    location.pathname.startsWith("/admin/bus/");

  const isBustypeActive =
    location.pathname === "/admin/bustype" ||
    location.pathname.startsWith("/admin/bustype/");

  const isRouteActive =
    location.pathname === "/admin/bus-route" ||
    location.pathname.startsWith("/admin/bus-route/");

  const isScheduleActive =
    location.pathname === "/admin/schedule" ||
    location.pathname.startsWith("/admin/schedule/");

  const isSeatActive =
    location.pathname === "/admin/seat" ||
    location.pathname.startsWith("/admin/seat/");

  const isFaqActive =
    location.pathname === "/admin/faq" ||
    location.pathname.startsWith("/admin/faq/");

  const isOfferActive =
    location.pathname === "/admin/offer" ||
    location.pathname.startsWith("/admin/offer/");

  const isSubscriptionActive =
    location.pathname === "/admin/subscription" ||
    location.pathname.startsWith("/admin/subscription/");

  const isContactActive =
    location.pathname === "/admin/contact" ||
    location.pathname.startsWith("/admin/contact/");

  return (
    <aside className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sticky top-24 mt-5">
      <h3 className="text-xs font-bold tracking-widest text-violet-600 uppercase mb-6">
        Console Settings
      </h3>

      <div className="border-b border-slate-200 mb-4"></div>

      <div className="space-y-2">

        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition ${isDashboardActive
            ? "bg-violet-50 text-violet-600"
            : "text-slate-700 hover:bg-slate-100"
            }`}
        >
          <i data-lucide="bar-chart-2"></i>
          Dashboard
        </Link>

        <Link
          to="/admin/user"
          className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition ${isUserActive
            ? "bg-violet-50 text-violet-600"
            : "text-slate-700 hover:bg-slate-100"
            }`}
        >
          <i data-lucide="users"></i>
          Users
        </Link>

        <Link
          to="/admin/staff"
          className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition ${isStaffActive
            ? "bg-violet-50 text-violet-600"
            : "text-slate-700 hover:bg-slate-100"
            }`}
        >
          <i data-lucide="user-check"></i>
          Staff
        </Link>

        <Link
          to="/admin/bus"
          className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition ${isBusActive
            ? "bg-violet-50 text-violet-600"
            : "text-slate-700 hover:bg-slate-100"
            }`}
        >
          <i data-lucide="bus"></i>
          Buses
        </Link>

        <Link
          to="/admin/bustype"
          className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition ${isBustypeActive
            ? "bg-violet-50 text-violet-600"
            : "text-slate-700 hover:bg-slate-100"
            }`}
        >
          <i data-lucide="users"></i>
          Bus Types
        </Link>

        <Link
          to="/admin/bus-route"
          className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition ${isRouteActive
            ? "bg-violet-50 text-violet-600"
            : "text-slate-700 hover:bg-slate-100"
            }`}
        >
          <i data-lucide="map"></i>
          Routes
        </Link>

        <Link
          to="/admin/schedule"
          className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition ${isScheduleActive
            ? "bg-violet-50 text-violet-600"
            : "text-slate-700 hover:bg-slate-100"
            }`}
        >
          <i data-lucide="clock"></i>
          Schedules
        </Link>

        <Link
          to="/admin/seat"
          className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition ${isSeatActive
            ? "bg-violet-50 text-violet-600"
            : "text-slate-700 hover:bg-slate-100"
            }`}
        >
          <i data-lucide="users"></i>
          Seats
        </Link>

        <Link
          to="/admin/faq"
          className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition ${isFaqActive
            ? "bg-violet-50 text-violet-600"
            : "text-slate-700 hover:bg-slate-100"
            }`}
        >
          <i data-lucide="users"></i>
          Faqs
        </Link>

        <Link
          to="/admin/offer"
          className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition ${isOfferActive
            ? "bg-violet-50 text-violet-600"
            : "text-slate-700 hover:bg-slate-100"
            }`}
        >
          <i data-lucide="users"></i>
          Offers
        </Link>

        <Link
          to="/admin/subscription"
          className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition ${isSubscriptionActive
            ? "bg-violet-50 text-violet-600"
            : "text-slate-700 hover:bg-slate-100"
            }`}
        >
          <i data-lucide="users"></i>
          Subscribers
        </Link>

        <Link
          to="/admin/contact"
          className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition ${isContactActive
            ? "bg-violet-50 text-violet-600"
            : "text-slate-700 hover:bg-slate-100"
            }`}
        >
          <i data-lucide="users"></i>
          Contacts
        </Link>
      </div>
    </aside>
  );
}