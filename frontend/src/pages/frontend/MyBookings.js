import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { API_url } from "../../Config/config";
import { BookingHistory, CancelBooking } from "../../Service/frontend/Booking";
import {
  Ticket,
  Bus,
  Clock,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Printer,
  X,
  ArrowRight,
  ShieldCheck,
  User,
} from "lucide-react";

export default function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let apiBookings = [];

      let userId = "";
      let userEmail = "";
      try {
        const userData = JSON.parse(localStorage.getItem("userdata") || "{}");
        userId = userData?._id || userData?.id || userData?.user_id || localStorage.getItem("user_id") || "";
        userEmail = userData?.email || userData?.user_email || localStorage.getItem("user_email") || "";
      } catch (e) {}

      try {
        const res = await BookingHistory(userId, userEmail);
        if (Array.isArray(res?.data?.data)) {
          apiBookings = res.data.data;
        } else if (Array.isArray(res?.data)) {
          apiBookings = res.data;
        } else if (Array.isArray(res)) {
          apiBookings = res;
        }
      } catch (err) {
        console.log("MyBookings API note:", err.message);
      }

      // If empty, try direct fallback endpoint
      if (!apiBookings || apiBookings.length === 0) {
        try {
          const directRes = await axios.get(`${API_url}/frontend/booking/history`);
          if (Array.isArray(directRes?.data?.data)) {
            apiBookings = directRes.data.data;
          } else if (Array.isArray(directRes?.data)) {
            apiBookings = directRes.data;
          }
        } catch (e) {}
      }

      // Merge with localStorage
      let localBookings = [];
      try {
        const saved = localStorage.getItem("bookingHistory");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) localBookings.push(...parsed);
        }
        if (userId) {
          const uSaved = localStorage.getItem(`bookingHistory_${userId}`);
          if (uSaved) {
            const parsedU = JSON.parse(uSaved);
            if (Array.isArray(parsedU)) localBookings.push(...parsedU);
          }
        }
      } catch (e) {}

      const mergedMap = new Map();
      apiBookings.forEach((b, idx) => {
        if (!b) return;
        const key = b._id || b.bookingId || `api_${idx}`;
        mergedMap.set(String(key), b);
      });
      localBookings.forEach((b, idx) => {
        if (!b) return;
        const key = b._id || b.bookingId || `loc_${idx}`;
        if (!mergedMap.has(String(key))) {
          mergedMap.set(String(key), b);
        } else {
          mergedMap.set(String(key), { ...mergedMap.get(String(key)), ...b });
        }
      });

      const all = Array.from(mergedMap.values())
        .filter((b) => {
          const st = (b.booking_status || b.bookingStatus || "").toLowerCase();
          return st !== "cancelled";
        })
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || a.created_at || a.bookedAt || a.journey_date || 0).getTime();
          const dateB = new Date(b.createdAt || b.created_at || b.bookedAt || b.journey_date || 0).getTime();
          return dateB - dateA;
        });

      setBookings(all);
    } catch (error) {
      console.error("Fetch bookings error:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCancelBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: "Cancel this Ticket?",
      text: "Are you sure you want to cancel this ticket? Once cancelled, it will be removed completely.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Cancel & Remove Ticket",
      cancelButtonText: "Keep Ticket",
    });

    if (!result.isConfirmed) return;

    // Immediately remove from UI state
    setBookings((prev) => prev.filter((b) => b._id !== bookingId && b.bookingId !== bookingId));

    try {
      // 1. Remove from localStorage
      try {
        const saved = JSON.parse(localStorage.getItem("bookingHistory") || "[]");
        const updated = saved.filter((b) => b._id !== bookingId && b.bookingId !== bookingId);
        localStorage.setItem("bookingHistory", JSON.stringify(updated));

        const userData = JSON.parse(localStorage.getItem("userdata") || "{}");
        const uid = userData?._id || userData?.id;
        if (uid) {
          localStorage.setItem(`bookingHistory_${uid}`, JSON.stringify(updated));
        }
      } catch (e) {}

      // 2. Call backend cancel API
      if (bookingId && !bookingId.startsWith("BK") && /^[0-9a-fA-F]{24}$/.test(bookingId)) {
        await CancelBooking(bookingId);
      }

      Swal.fire({
        icon: "success",
        title: "Ticket Cancelled & Removed",
        text: "The booked ticket has been removed from your account.",
        timer: 1600,
        showConfirmButton: false,
      });

      fetchBookings();
    } catch (err) {
      console.log("Cancel note:", err);
      fetchBookings();
    }
  };

  // Stats calculation
  const totalBookingsCount = bookings.length;
  const confirmedCount = bookings.filter((b) => {
    const st = (b.booking_status || b.bookingStatus || "").toLowerCase();
    return st === "booked" || st === "confirmed";
  }).length;
  const totalAmountSpent = bookings.reduce((sum, b) => {
    const amt = Number(b.total_amount ?? b.totalAmount ?? b.total ?? 0);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  // Filtered bookings (Cancelled bookings are completely hidden/removed)
  const filteredBookings = bookings.filter((b) => {
    const rawSt = (b.booking_status || b.bookingStatus || "").toLowerCase();
    if (rawSt === "cancelled") return false;

    const bStatus = (b.booking_status || b.bookingStatus || "Booked").toUpperCase();
    if (statusFilter !== "ALL" && bStatus !== statusFilter) {
      return false;
    }
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    const bId = String(b.bookingId || b._id || "").toLowerCase();
    const bName = String(b.bus_name || b.busName || "").toLowerCase();
    const bRoute = String(b.route || "").toLowerCase();
    const bFrom = String(b.source_city || b.source || "").toLowerCase();
    const bTo = String(b.distance_city || b.destination || "").toLowerCase();

    return (
      bId.includes(term) ||
      bName.includes(term) ||
      bRoute.includes(term) ||
      bFrom.includes(term) ||
      bTo.includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        {/* ================= PAGE HEADER & STATS ================= */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-2">
                <Ticket size={14} />
                <span>Customer Bookings Dashboard</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                My Bookings & <span className="text-orange-500">E-Tickets</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                View your confirmed bus seats, download official digital tickets, or manage bookings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchBookings}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-xs transition"
                title="Refresh Bookings"
              >
                <RefreshCw size={14} className={loading ? "animate-spin text-orange-500" : ""} />
                <span>Refresh Bookings</span>
              </button>

              <Link
                to="/profile"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition"
              >
                <User size={14} />
                <span>My Profile</span>
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{totalBookingsCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Ticket size={24} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirmed Seats</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{confirmedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Amount Spent</p>
                <p className="text-2xl font-black text-slate-900 mt-1">₹{totalAmountSpent.toLocaleString("en-IN")}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Bus size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= SEARCH & STATUS FILTER ================= */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Bus, City, or Booking ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {["ALL", "BOOKED", "COMPLETED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === st
                    ? "bg-orange-500 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st === "ALL" ? "All Active Bookings" : st === "BOOKED" ? "Confirmed Seats" : "Completed Trips"}
              </button>
            ))}
          </div>
        </div>

        {/* ================= BOOKINGS LIST ================= */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Loading Your Booked Tickets...</h3>
            <p className="text-slate-400 text-xs mt-1">Fetching live seat reservations and ticket information</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4">
              <Ticket size={36} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              {bookings.length === 0 ? "No Bus Bookings Found" : "No Matching Bookings Found"}
            </h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto mb-6">
              {bookings.length === 0
                ? "You haven't booked any bus tickets yet. Choose your destination and book a comfortable luxury seat today!"
                : "No bookings match your current search criteria. Try clearing search or status filters."}
            </p>
            {bookings.length === 0 ? (
              <button
                onClick={() => navigate("/routeBus")}
                className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition"
              >
                Browse Bus Routes & Book Now
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Clear Search Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((b, idx) => {
              const bId = b.bookingId || b._id || `BK${idx + 1000}`;
              const bName = b.bus_name || b.busName || "Volvo AC Luxury Coach";
              const regNo = b.register_number || b.registerNumber || "RJ45SK0000";
              const bType = typeof b.bus_type === "string" && !/^[0-9a-fA-F]{24}$/.test(b.bus_type) ? b.bus_type : "AC Sleeper (2+2)";
              const bModel = b.model || "2026 Multi-Axle";

              // Cities
              let fromCity = b.source_city || b.source || "";
              let toCity = b.distance_city || b.destination || "";
              if (!fromCity || !toCity) {
                const rStr = b.route || "";
                const parts = rStr.split(/->|→|—|–|\s+to\s+|-/i).map((s) => s.trim()).filter(Boolean);
                if (parts.length >= 2) {
                  fromCity = parts[0];
                  toCity = parts[1];
                } else {
                  fromCity = "Jaipur";
                  toCity = "Saweriya Seth";
                }
              }

              // Timings
              const depTime = b.departure || b.departure_time || "09:30 PM";
              const arrTime = b.arrival || b.arrival_time || "05:00 AM";
              const jDate = b.journey_date || b.journeyDate || b.trip_date || b.createdAt || new Date();
              const formattedDate = new Date(jDate).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              // Seats
              const seatsStr = Array.isArray(b.seat_number)
                ? b.seat_number.join(", ")
                : Array.isArray(b.seats)
                ? b.seats.join(", ")
                : Array.isArray(b.seatNumber)
                ? b.seatNumber.join(", ")
                : b.seat_number || b.seats || "1A";

              const seatsCount = Array.isArray(b.seat_number)
                ? b.seat_number.length
                : Array.isArray(b.seats)
                ? b.seats.length
                : seatsStr.split(",").length;

              // Amount
              const amt = Number(b.total_amount ?? b.totalAmount ?? b.total ?? 0);

              // Status
              const rawStatus = (b.booking_status || b.bookingStatus || "Booked").toUpperCase();
              const isConfirmed = rawStatus === "BOOKED" || rawStatus === "CONFIRMED";
              const isCancelled = rawStatus === "CANCELLED";

              return (
                <div
                  key={b._id || idx}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
                >
                  {/* Card Header Banner */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
                        <Bus size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-black tracking-tight">{bName}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10">
                            {regNo}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                          <span>{bType}</span>
                          <span>•</span>
                          <span>{bModel}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="text-right mr-2 hidden sm:block">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PNR / Ticket ID</p>
                        <p className="text-xs font-mono font-bold text-orange-400">{bId}</p>
                      </div>

                      <button
                        onClick={() => handleCopyId(bId)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition text-xs flex items-center gap-1"
                        title="Copy Ticket ID"
                      >
                        {copiedId === bId ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>

                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                          isConfirmed
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : isCancelled
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {isConfirmed && <CheckCircle2 size={13} />}
                        {isCancelled && <XCircle size={13} />}
                        <span>{isConfirmed ? "Confirmed" : isCancelled ? "Cancelled" : rawStatus}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                      {/* Route & Timings */}
                      <div className="md:col-span-2 flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">From (Boarding)</p>
                          <h4 className="text-base font-black text-slate-900 mt-0.5">{fromCity}</h4>
                          <p className="text-xs font-bold text-orange-600 mt-0.5 flex items-center gap-1">
                            <Clock size={12} />
                            <span>{depTime}</span>
                          </p>
                        </div>

                        <div className="flex flex-col items-center px-2 shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 mb-1">Direct Trip</span>
                          <div className="w-16 h-0.5 bg-slate-200 relative flex items-center justify-center">
                            <ArrowRight size={14} className="text-orange-500 absolute" />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1">{formattedDate}</span>
                        </div>

                        <div className="flex-1 text-right">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">To (Destination)</p>
                          <h4 className="text-base font-black text-slate-900 mt-0.5">{toCity}</h4>
                          <p className="text-xs font-bold text-slate-600 mt-0.5 flex items-center justify-end gap-1">
                            <Clock size={12} />
                            <span>{arrTime}</span>
                          </p>
                        </div>
                      </div>

                      {/* Seats & Info */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Booked Seats ({seatsCount})</p>
                        <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                          {seatsStr.split(",").map((s, sIdx) => {
                            const trimmed = s.trim();
                            const type = b.seatTypes?.[trimmed] || b.seat_types?.[trimmed];
                            return (
                              <span
                                key={sIdx}
                                className={`px-2.5 py-1 rounded-lg font-black text-xs border ${
                                  type === "Sleeper"
                                    ? "bg-purple-100 text-purple-700 border-purple-200"
                                    : "bg-orange-100 text-orange-700 border-orange-200"
                                }`}
                              >
                                Seat {trimmed} {type ? `(${type})` : ""}
                              </span>
                            );
                          })}
                        </div>
                        {Array.isArray(b.addons) && b.addons.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 flex-wrap text-[11px] text-slate-700 font-semibold">
                            <span className="text-[10px] text-orange-600 font-bold uppercase">Catering:</span>
                            {b.addons.map((a, ai) => (
                              <span key={ai} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                                {a.count}× {a.name}
                              </span>
                            ))}
                          </div>
                        )}
                        {b.genderSummary && (
                          <p className="text-[11px] text-slate-500 font-medium mt-1.5">{b.genderSummary}</p>
                        )}
                      </div>

                      {/* Total Amount & Action Buttons */}
                      <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3">
                        <div className="text-left md:text-right">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fare Paid</p>
                          <h3 className="text-2xl font-black text-slate-900 mt-0.5">₹{amt.toLocaleString("en-IN")}</h3>
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center md:justify-end gap-1">
                            <ShieldCheck size={12} />
                            <span>All Taxes Included</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <button
                            onClick={() => navigate("/ticket", { state: b })}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
                          >
                            <Printer size={14} />
                            <span>View / Print E-Ticket</span>
                          </button>

                          {isConfirmed && (
                            <button
                              onClick={() => handleCancelBooking(b._id || b.bookingId)}
                              className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                              title="Cancel Booking"
                            >
                              <X size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
