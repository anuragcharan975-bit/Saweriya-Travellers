import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BusFront,
  Route as RouteIcon,
  CalendarDays,
  UserCheck,
  PlusCircle,
  Clock,
  ArrowRight,
  MapPin,
  CheckCircle2,
} from "lucide-react";

import { ViewAllBus } from "../../../Service/admin/Bus";
import { ViewAllRoute } from "../../../Service/admin/Route";
import { ViewAllSchedule } from "../../../Service/admin/Schedule";
import { ViewAllStaff } from "../../../Service/admin/Staff";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBuses: 0,
    activeBuses: 0,
    totalRoutes: 0,
    totalSchedules: 0,
    totalStaff: 0,
    drivers: 0,
    conductors: 0,
  });

  const [recentSchedules, setRecentSchedules] = useState([]);
  const [recentBuses, setRecentBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [busRes, routeRes, scheduleRes, staffRes] = await Promise.allSettled([
          ViewAllBus(),
          ViewAllRoute(),
          ViewAllSchedule(),
          ViewAllStaff(),
        ]);

        const buses = busRes.status === "fulfilled" && Array.isArray(busRes.value?.data)
          ? busRes.value.data
          : [];

        const routes = routeRes.status === "fulfilled" && Array.isArray(routeRes.value?.data)
          ? routeRes.value.data
          : [];

        const schedules = scheduleRes.status === "fulfilled" && Array.isArray(scheduleRes.value?.data)
          ? scheduleRes.value.data
          : [];

        const staff = staffRes.status === "fulfilled" && Array.isArray(staffRes.value?.data)
          ? staffRes.value.data
          : [];

        const activeBuses = buses.filter((b) => b?.status === true).length;
        const drivers = staff.filter((s) => s?.role_id === 2).length;
        const conductors = staff.filter((s) => s?.role_id === 3).length;

        setStats({
          totalBuses: buses.length,
          activeBuses,
          totalRoutes: routes.length,
          totalSchedules: schedules.length,
          totalStaff: staff.length,
          drivers,
          conductors,
        });

        setRecentSchedules(schedules.slice(0, 5));
        setRecentBuses(buses.slice(0, 4));
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white p-8 md:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-violet-200 mb-4 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Operations Active • {currentDate}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            DriveBus Operations Console
          </h1>
          <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
            Monitor fleet schedules, driver allocations, and city routes in real-time.
            Everything is synchronized with local MongoDB services.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/admin/schedule/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-sm transition shadow-md hover:shadow-violet-500/30"
            >
              <PlusCircle size={16} />
              Schedule Trip
            </Link>
            <Link
              to="/admin/bus/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-sm transition border border-white/10"
            >
              <BusFront size={16} />
              Add Bus
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Buses Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Fleet
            </span>
            <div className="p-3 rounded-2xl bg-violet-50 text-violet-600">
              <BusFront size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800">
              {loading ? "..." : stats.totalBuses}
            </span>
            <span className="text-xs text-slate-500">Vehicles</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-slate-100 pt-3">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 size={13} /> {stats.activeBuses} Active
            </span>
            <Link to="/admin/bus" className="text-slate-400 hover:text-violet-600 flex items-center gap-1">
              Manage <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Routes Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Intercity Routes
            </span>
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <RouteIcon size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800">
              {loading ? "..." : stats.totalRoutes}
            </span>
            <span className="text-xs text-slate-500">Connected Hubs</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-slate-100 pt-3">
            <span className="text-blue-600 font-semibold flex items-center gap-1">
              <MapPin size={13} /> North India
            </span>
            <Link to="/admin/bus-route" className="text-slate-400 hover:text-blue-600 flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Schedules Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Trips & Schedules
            </span>
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
              <CalendarDays size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800">
              {loading ? "..." : stats.totalSchedules}
            </span>
            <span className="text-xs text-slate-500">Live Slots</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-slate-100 pt-3">
            <span className="text-amber-600 font-semibold flex items-center gap-1">
              <Clock size={13} /> Real-time
            </span>
            <Link to="/admin/schedule" className="text-slate-400 hover:text-amber-600 flex items-center gap-1">
              Schedule <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Staff Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Crew & Staff
            </span>
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
              <UserCheck size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800">
              {loading ? "..." : stats.totalStaff}
            </span>
            <span className="text-xs text-slate-500">Crew Members</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-slate-100 pt-3">
            <span className="text-rose-600 font-semibold">
              {stats.drivers} Drivers • {stats.conductors} Conductors
            </span>
            <Link to="/admin/staff" className="text-slate-400 hover:text-rose-600 flex items-center gap-1">
              Manage <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Launch Command Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          Quick Operations
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/bus/add"
            className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-violet-50 hover:text-violet-700 transition border border-slate-200/60 group"
          >
            <div className="p-2.5 rounded-xl bg-white text-violet-600 shadow-xs group-hover:bg-violet-600 group-hover:text-white transition">
              <BusFront size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm">Add New Bus</p>
              <p className="text-xs text-slate-400">Register vehicle</p>
            </div>
          </Link>

          <Link
            to="/admin/bus-route/add"
            className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition border border-slate-200/60 group"
          >
            <div className="p-2.5 rounded-xl bg-white text-blue-600 shadow-xs group-hover:bg-blue-600 group-hover:text-white transition">
              <RouteIcon size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm">Add City Route</p>
              <p className="text-xs text-slate-400">Source to Dest</p>
            </div>
          </Link>

          <Link
            to="/admin/schedule/add"
            className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-amber-50 hover:text-amber-700 transition border border-slate-200/60 group"
          >
            <div className="p-2.5 rounded-xl bg-white text-amber-600 shadow-xs group-hover:bg-amber-600 group-hover:text-white transition">
              <CalendarDays size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm">Create Schedule</p>
              <p className="text-xs text-slate-400">Set departure slot</p>
            </div>
          </Link>

          <Link
            to="/admin/staff/add"
            className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-700 transition border border-slate-200/60 group"
          >
            <div className="p-2.5 rounded-xl bg-white text-rose-600 shadow-xs group-hover:bg-rose-600 group-hover:text-white transition">
              <UserCheck size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm">Add Crew Member</p>
              <p className="text-xs text-slate-400">With profile photo</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Trips & Active Fleet Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Schedules Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Active Trip Schedules</h3>
              <p className="text-xs text-slate-400 mt-0.5">Recently created departures</p>
            </div>
            <Link
              to="/admin/schedule"
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 inline-flex items-center gap-1"
            >
              All Schedules <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Route</th>
                  <th className="px-6 py-3.5">Bus</th>
                  <th className="px-6 py-3.5">Departure</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentSchedules.length > 0 ? (
                  recentSchedules.map((item, idx) => (
                    <tr key={item._id || idx} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {item.route?.source_city && item.route?.distance_city
                          ? `${item.route.source_city} → ${item.route.distance_city}`
                          : item.route?.route_name || "Custom Route"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {item.bus?.bus_name || "Assigned Bus"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1 font-mono text-xs">
                          <Clock size={13} className="text-slate-400" />
                          {item.departure_time || "09:00 AM"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.status === true
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {item.status ? "Active" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-xs">
                      No trip schedules recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fleet Highlights (1 Col) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Fleet Overview</h3>
              <p className="text-xs text-slate-400 mt-0.5">Vehicles ready for assignment</p>
            </div>
            <Link
              to="/admin/bus"
              className="text-xs font-semibold text-violet-600 hover:text-violet-700"
            >
              Fleet List
            </Link>
          </div>

          <div className="space-y-3">
            {recentBuses.length > 0 ? (
              recentBuses.map((bus, idx) => (
                <div
                  key={bus._id || idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-violet-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white text-violet-600 border border-slate-200 shadow-2xs">
                      <BusFront size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">
                        {bus.bus_name || "Luxury Cruiser"}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        {bus.register_number || "REG-XXXX"} • {bus.total_seats || 40} Seats
                      </p>
                    </div>
                  </div>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      bus.status ? "bg-emerald-500 ring-4 ring-emerald-100" : "bg-slate-300"
                    }`}
                    title={bus.status ? "Active Vehicle" : "Inactive"}
                  />
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-slate-400">No buses registered.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
