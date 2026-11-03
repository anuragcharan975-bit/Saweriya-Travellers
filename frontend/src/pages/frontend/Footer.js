import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bus,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  BedDouble,
  Zap,
  Navigation,
  Briefcase,
  X,
  CheckCircle2,
} from "lucide-react";

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  // The 5 canonical verified popular routes
  const popularFooterRoutes = [
    {
      name: "Jaipur → Delhi",
      id: "6a86d0e1799407248ea06fc9",
      tag: "Superfast Express",
      fare: "₹450",
    },
    {
      name: "Delhi → Jaipur",
      id: "6ae86e457b369fafc905aaeb",
      tag: "Highway Cruiser",
      fare: "₹480",
    },
    {
      name: "Mumbai → Pune",
      id: "6ae86e457b369fafc905aaed",
      tag: "Deccan Expressway",
      fare: "₹350",
    },
    {
      name: "Bangalore → Goa",
      id: "6ae86e457b369fafc905aaef",
      tag: "Luxury Sleeper AC",
      fare: "₹950",
    },
    {
      name: "Ahmedabad → Surat",
      id: "6ae86e467b369fafc905aaf1",
      tag: "Intercity Fast",
      fare: "₹420",
    },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16">
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand & Fleet Info */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                <Bus size={22} />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Saweriya <span className="text-orange-500">Travellers</span>
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              India's smart, tech-enabled bus reservation platform. Seamless booking, real-time live bus tracking, and certified safe Volvo & Luxury Sleeper fleets.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 w-fit">
              <ShieldCheck size={16} />
              <span>Certified Safe & Sanitized Fleets</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-wide uppercase text-xs flex items-center gap-1.5">
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/search-bus" className="hover:text-orange-400 transition-colors flex items-center justify-between group">
                  <span>Search & Book Buses</span>
                  <ChevronRight size={13} className="text-slate-600 group-hover:text-orange-400 group-hover:translate-x-0.5 transition" />
                </Link>
              </li>
              <li>
                <Link to="/routeBus" className="hover:text-orange-400 transition-colors flex items-center justify-between group">
                  <span>All Intercity Routes</span>
                  <ChevronRight size={13} className="text-slate-600 group-hover:text-orange-400 group-hover:translate-x-0.5 transition" />
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-orange-400 transition-colors flex items-center justify-between group">
                  <span>My Bookings & E-Tickets</span>
                  <ChevronRight size={13} className="text-slate-600 group-hover:text-orange-400 group-hover:translate-x-0.5 transition" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors flex items-center justify-between group">
                  <span>About Saweriya</span>
                  <ChevronRight size={13} className="text-slate-600 group-hover:text-orange-400 group-hover:translate-x-0.5 transition" />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors flex items-center justify-between group">
                  <span>Contact & 24/7 Support</span>
                  <ChevronRight size={13} className="text-slate-600 group-hover:text-orange-400 group-hover:translate-x-0.5 transition" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Functional Services (Click-to-Book / View) */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-wide uppercase text-xs flex items-center gap-1.5">
              <Sparkles size={13} className="text-orange-500" />
              <span>Services & Fleet</span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              {/* Luxury Sleeper Coaches -> direct route view */}
              <li>
                <Link
                  to="/view-buses/6ae86e457b369fafc905aaef"
                  className="group flex items-center justify-between hover:text-orange-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BedDouble size={15} className="text-orange-500 shrink-0" />
                    <span>Luxury Sleeper Coaches</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white transition">
                    Book AC
                  </span>
                </Link>
              </li>

              {/* Intercity Daily Commutes -> Jaipur-Delhi */}
              <li>
                <Link
                  to="/view-buses/6a86d0e1799407248ea06fc9"
                  className="group flex items-center justify-between hover:text-orange-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Zap size={15} className="text-amber-400 shrink-0" />
                    <span>Intercity Daily Commutes</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 group-hover:border-orange-500/30 transition">
                    Express
                  </span>
                </Link>
              </li>

              {/* Deccan Expressway Cruiser -> Mumbai-Pune */}
              <li>
                <Link
                  to="/view-buses/6ae86e457b369fafc905aaed"
                  className="group flex items-center justify-between hover:text-orange-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Bus size={15} className="text-blue-400 shrink-0" />
                    <span>Expressway Cruisers</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 group-hover:border-orange-500/30 transition">
                    Fastest
                  </span>
                </Link>
              </li>

              {/* Live GPS Bus Tracking Modal */}
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal("gps")}
                  className="group w-full flex items-center justify-between hover:text-orange-400 transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <Navigation size={15} className="text-emerald-400 shrink-0" />
                    <span>Live GPS Bus Tracking</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live
                  </span>
                </button>
              </li>

              {/* Corporate Bus Charters */}
              <li>
                <Link
                  to="/contact"
                  className="group flex items-center justify-between hover:text-orange-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase size={15} className="text-indigo-400 shrink-0" />
                    <span>Corporate Bus Charters</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                    Hire
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information & Desk */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-wide uppercase text-xs">
              Contact & Help
            </h3>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:support@saweriyatravellers.com"
                className="flex items-center gap-2.5 hover:text-orange-400 transition-colors"
              >
                <Mail size={16} className="text-orange-400 shrink-0" />
                <span className="text-slate-300 truncate">support@saweriyatravellers.com</span>
              </a>
              <a
                href="tel:+917297893373"
                className="flex items-center gap-2.5 hover:text-orange-400 transition-colors"
              >
                <Phone size={16} className="text-orange-400 shrink-0" />
                <span className="text-slate-300 font-semibold">+91 7297893373</span>
              </a>
              <p className="flex items-center gap-2.5">
                <MapPin size={16} className="text-orange-400 shrink-0" />
                <span className="text-slate-300">Jaipur, Rajasthan, India</span>
              </p>
            </div>

            <div className="mt-5 p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs flex items-center gap-3">
              <Clock size={16} className="text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-200 font-bold block">24/7 Operations Desk</span>
                <span className="text-slate-400">Instant Help on Ticket & Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Intercity Routes Strip */}
        <div className="mt-12 pt-8 border-t border-slate-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Popular Daily Express Routes:
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {popularFooterRoutes.map((route) => (
              <Link
                key={route.id}
                to={'/view-buses/' + route.id}
                className="group inline-flex items-center gap-2 bg-slate-900/90 hover:bg-orange-500/10 text-slate-300 hover:text-orange-400 px-3.5 py-2 rounded-xl text-xs border border-slate-800 hover:border-orange-500/30 transition-all duration-200"
              >
                <span className="font-semibold">{route.name}</span>
                <span className="text-[10px] text-slate-500 group-hover:text-orange-300">from {route.fare}</span>
                <ArrowUpRight size={13} className="text-slate-500 group-hover:text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================= COPYRIGHT & LEGAL ================= */}
      <div className="border-t border-slate-900 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Saweriya Travellers Pvt Ltd. All Rights Reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0 font-medium">
            <button
              type="button"
              onClick={() => setActiveModal("privacy")}
              className="hover:text-orange-400 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("terms")}
              className="hover:text-orange-400 transition-colors"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("safety")}
              className="hover:text-orange-400 transition-colors"
            >
              Safety Guidelines
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL DIALOGS ================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-slate-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X size={16} />
            </button>

            {activeModal === "gps" && (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Navigation size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Live GPS Fleet Tracking</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Every Saweriya Travellers coach is fitted with government AIS-140 certified GPS locators and dual emergency SOS switches.
                </p>
                <div className="space-y-2.5 text-xs text-slate-700 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Real-time location updates every 30 seconds</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Live SMS link dispatched 30 mins prior to trip departure</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>24x7 Centralized Speed & Route Monitoring Center</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/search-bus"
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-3 text-center rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition"
                  >
                    Find Tracked Buses
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {activeModal === "privacy" && (
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Privacy Policy</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Saweriya Travellers safeguards your personal identification and payment records using bank-grade 256-bit SSL encryption. We never sell or share passenger data with third-party telemarketers.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  Understood
                </button>
              </div>
            )}

            {activeModal === "terms" && (
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Terms of Service</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Tickets booked on Saweriya Travellers are subject to bus seat availability. Cancellation policies allow instant cancellation via your "My Bookings" portal with refunds credited per the tariff matrix.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  Understood
                </button>
              </div>
            )}

            {activeModal === "safety" && (
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Safety & Fleet Standards</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  All coaches undergo daily multi-point mechanical inspections, tire pressure audits, and professional sanitization before every passenger journey.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  Understood
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
