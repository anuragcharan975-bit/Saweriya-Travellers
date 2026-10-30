import React from "react";
import { Link } from "react-router-dom";
import {
  Bus,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                <Bus size={22} />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Drive<span className="text-orange-500">Bus</span>
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              India's smart, tech-enabled bus reservation platform. Seamless booking, real-time live bus tracking, and certified safe fleets.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 w-fit">
              <ShieldCheck size={16} />
              <span>Certified Safe & Sanitized</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base text-white font-bold mb-4 tracking-wide uppercase text-xs">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/routeBus" className="hover:text-orange-400 transition-colors">
                  All Bus Routes
                </Link>
              </li>
              <li>
                <Link to="/search-bus" className="hover:text-orange-400 transition-colors">
                  Search & Book
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base text-white font-bold mb-4 tracking-wide uppercase text-xs">
              Services
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-orange-400 cursor-pointer transition-colors">
                Luxury Sleeper Coaches
              </li>
              <li className="hover:text-orange-400 cursor-pointer transition-colors">
                Intercity Daily Commutes
              </li>
              <li className="hover:text-orange-400 cursor-pointer transition-colors">
                Live GPS Bus Tracking
              </li>
              <li className="hover:text-orange-400 cursor-pointer transition-colors">
                Corporate Bus Charters
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-base text-white font-bold mb-4 tracking-wide uppercase text-xs">
              Contact & Help
            </h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2.5">
                <Mail size={16} className="text-orange-400 shrink-0" />
                <span className="text-slate-300">support@drivebus.com</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={16} className="text-orange-400 shrink-0" />
                <span className="text-slate-300">+91 9664366393</span>
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin size={16} className="text-orange-400 shrink-0" />
                <span className="text-slate-300">Jaipur, Rajasthan, India</span>
              </p>
            </div>

            <div className="mt-5 p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs flex items-center gap-3">
              <Clock size={16} className="text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-200 font-bold block">24/7 Operations Desk</span>
                <span className="text-slate-400">Available all 365 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-900 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DriveBus Technologies Pvt Ltd. All Rights Reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0 font-medium">
            <span className="hover:text-orange-400 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-orange-400 cursor-pointer transition-colors">
              Terms of Service
            </span>
            <span className="hover:text-orange-400 cursor-pointer transition-colors">
              Safety Guidelines
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
