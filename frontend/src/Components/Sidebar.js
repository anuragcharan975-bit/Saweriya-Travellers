import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BusFront,
  SlidersHorizontal,
  Route as RouteIcon,
  CalendarDays,
  Armchair,
  HelpCircle,
  Tag,
  Mail,
  MessageSquare,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      active: location.pathname === "/admin/dashboard",
    },
    {
      title: "Users",
      path: "/admin/user",
      icon: Users,
      active:
        location.pathname === "/admin/user" ||
        location.pathname.startsWith("/admin/user/"),
    },
    {
      title: "Staff",
      path: "/admin/staff",
      icon: UserCheck,
      active:
        location.pathname === "/admin/staff" ||
        location.pathname.startsWith("/admin/staff/"),
    },
    {
      title: "Buses",
      path: "/admin/bus",
      icon: BusFront,
      active:
        location.pathname === "/admin/bus" ||
        location.pathname.startsWith("/admin/bus/"),
    },
    {
      title: "Bus Types",
      path: "/admin/bustype",
      icon: SlidersHorizontal,
      active:
        location.pathname === "/admin/bustype" ||
        location.pathname.startsWith("/admin/bustype/"),
    },
    {
      title: "Routes",
      path: "/admin/bus-route",
      icon: RouteIcon,
      active:
        location.pathname === "/admin/bus-route" ||
        location.pathname.startsWith("/admin/bus-route/"),
    },
    {
      title: "Schedules",
      path: "/admin/schedule",
      icon: CalendarDays,
      active:
        location.pathname === "/admin/schedule" ||
        location.pathname.startsWith("/admin/schedule/"),
    },
    {
      title: "Seats",
      path: "/admin/seat",
      icon: Armchair,
      active:
        location.pathname === "/admin/seat" ||
        location.pathname.startsWith("/admin/seat/"),
    },
    {
      title: "Offers",
      path: "/admin/offer",
      icon: Tag,
      active:
        location.pathname === "/admin/offer" ||
        location.pathname.startsWith("/admin/offer/"),
    },
    {
      title: "FAQs",
      path: "/admin/faq",
      icon: HelpCircle,
      active:
        location.pathname === "/admin/faq" ||
        location.pathname.startsWith("/admin/faq/"),
    },
    {
      title: "Subscribers",
      path: "/admin/subscription",
      icon: Mail,
      active:
        location.pathname === "/admin/subscription" ||
        location.pathname.startsWith("/admin/subscription/"),
    },
    {
      title: "Contacts",
      path: "/admin/contact",
      icon: MessageSquare,
      active:
        location.pathname === "/admin/contact" ||
        location.pathname.startsWith("/admin/contact/"),
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="px-3">
        <h3 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Fleet Operations
        </h3>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 group ${
                item.active
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25 font-semibold"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <Icon
                size={19}
                className={`transition-colors ${
                  item.active
                    ? "text-white"
                    : "text-slate-400 group-hover:text-violet-600"
                }`}
              />
              <span>{item.title}</span>
              {item.active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
