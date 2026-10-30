import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import {
  CheckCircle2,
  Printer,
  Ticket as TicketIcon,
  Bus,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Home,
  User,
  CreditCard,
  QrCode,
} from "lucide-react";

export default function Ticket() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Recover booking from location state or fallback to latest local booking
  const getBookingData = () => {
    if (location.state) return location.state;
    try {
      const history = JSON.parse(localStorage.getItem("bookingHistory") || "[]");
      if (Array.isArray(history) && history.length > 0) {
        return history[0];
      }
    } catch (e) {
      console.log("Ticket read error:", e);
    }
    return null;
  };

  const booking = getBookingData();

  // 2. Empty state if no booking exists
  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
        <Header />
        <div className="pt-32 pb-20 px-4 flex-1 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full mx-auto text-center shadow-lg border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <TicketIcon size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              No Active Ticket Found
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              You haven't selected or booked a ticket yet. Browse our routes and book your seat!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/routeBus")}
                className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition"
              >
                Browse Buses
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
              >
                My Bookings
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // 3. Extract and normalize fields
  const bookingId =
    booking.bookingId ||
    booking._id ||
    booking.booking_id ||
    `BK${Date.now()}`;

  const busName =
    booking.busName ||
    booking.bus_name ||
    booking.bus?.bus_name ||
    "Volvo AC Luxury Liner";

  const registerNumber =
    booking.registerNumber ||
    booking.register_number ||
    booking.bus?.register_number ||
    "RJ45SK0000";

  let busType =
    booking.busType ||
    booking.bus_type ||
    booking.bus?.bus_type ||
    "AC Sleeper (2+2)";

  if (typeof busType === "object" && busType?.bus_type) {
    busType = busType.bus_type;
  } else if (typeof busType === "string" && /^[0-9a-fA-F]{24}$/.test(busType)) {
    busType = "AC Sleeper (2+2)";
  }

  const busModel =
    booking.model ||
    booking.busModel ||
    booking.bus?.model ||
    "2026 Multi-Axle";

  const extractCities = () => {
    if (booking.source_city && booking.distance_city) {
      return { from: booking.source_city, to: booking.distance_city };
    }
    if (booking.source && booking.destination) {
      return { from: booking.source, to: booking.destination };
    }
    const rStr = booking.route || "";
    if (rStr) {
      const parts = rStr.split(/->|→|—|–|\s+to\s+|-/i).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        return { from: parts[0], to: parts[1] };
      } else if (parts.length === 1) {
        return { from: parts[0], to: "Saweriya Seth" };
      }
    }
    return { from: "Jaipur", to: "Saweriya Seth" };
  };

  const { from: sourceCity, to: destinationCity } = extractCities();

  const departure =
    booking.departure ||
    booking.departure_time ||
    "09:30 PM";

  const arrival =
    booking.arrival ||
    booking.arrival_time ||
    "05:00 AM";

  const tripDate =
    booking.journey_date ||
    booking.journeyDate ||
    booking.date ||
    booking.createdAt ||
    new Date();

  const formattedDate = () => {
    try {
      const d = new Date(tripDate);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    } catch (e) {}
    return String(tripDate).split("T")[0] || "Today";
  };

  const seats = Array.isArray(booking.seats)
    ? booking.seats.join(", ")
    : Array.isArray(booking.seat_number)
    ? booking.seat_number.join(", ")
    : Array.isArray(booking.seatNumber)
    ? booking.seatNumber.join(", ")
    : booking.seats || booking.seat_number || booking.seatNumber || "1A";

  const passengersCount =
    booking.passengers ||
    (Array.isArray(booking.seats) ? booking.seats.length : null) ||
    (Array.isArray(booking.seat_number) ? booking.seat_number.length : null) ||
    1;

  const totalAmount =
    booking.total ||
    booking.total_amount ||
    booking.totalAmount ||
    booking.amount ||
    1200;

  const paymentStatus =
    booking.paymentStatus ||
    booking.payment_status ||
    "Paid";

  const paymentMethod =
    booking.paymentMethod ||
    booking.payment_method ||
    "UPI";

  let passengerName = "Passenger";
  try {
    const userData = JSON.parse(localStorage.getItem("userdata") || "{}");
    if (userData?.full_name || userData?.name) {
      passengerName = userData.full_name || userData.name;
    }
  } catch (e) {}

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
      <Header />

      {/* Main Container with generous top clearance for fixed header */}
      <main className="pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* ================= SUCCESS BANNER ================= */}
        <div className="text-center mb-8 animate-fade-in print:hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-sm border border-emerald-200">
            <CheckCircle2 size={36} className="animate-bounce" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Booking Confirmed! 🎉
          </h1>

          <p className="text-slate-600 font-medium text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Your bus seats are locked and your e-ticket is ready. A digital copy has also been saved to your profile.
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Confirmed Booking • Ticket #{bookingId}</span>
          </div>
        </div>

        {/* ================= REALISTIC E-TICKET CARD ================= */}
        <div
          id="printable-ticket"
          className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative"
        >
          {/* TICKET TOP HEADER BAR */}
          <div className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shrink-0">
                  <Bus size={26} className="text-orange-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-orange-400">
                      DriveBus Boarding Pass
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Verified
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                    {busName}
                  </h2>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    Coach: <span className="font-semibold text-white">{registerNumber}</span> • {busType}
                  </p>
                </div>
              </div>

              {/* Status & PNR */}
              <div className="sm:text-right border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  PNR / Booking ID
                </span>
                <span className="text-base sm:text-lg font-black font-mono text-orange-400 tracking-wider">
                  #{bookingId}
                </span>
              </div>
            </div>
          </div>

          {/* ROUTE & JOURNEY SCHEDULE */}
          <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* FROM (Origin) */}
              <div className="text-left">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <MapPin size={13} className="text-violet-600" />
                  Departure City
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
                  {sourceCity}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-violet-700 font-bold text-sm bg-violet-100/80 px-3 py-1 rounded-xl w-fit">
                  <Clock size={14} />
                  <span>{departure}</span>
                </div>
              </div>

              {/* ROUTE ARROW & DURATION */}
              <div className="flex flex-col items-center justify-center text-center px-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Confirmed Route
                </span>
                <div className="w-full flex items-center justify-center gap-2 text-slate-400">
                  <span className="w-3 h-3 rounded-full bg-violet-600 ring-4 ring-violet-100" />
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-violet-500 via-orange-400 to-emerald-500 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-bold text-slate-600 shadow-xs flex items-center gap-1">
                      <Bus size={10} className="text-orange-500" />
                      <span>Express</span>
                    </div>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                </div>
                <span className="text-xs font-semibold text-slate-500 mt-2 flex items-center gap-1">
                  <Calendar size={13} className="text-slate-400" />
                  {formattedDate()}
                </span>
              </div>

              {/* TO (Destination) */}
              <div className="md:text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex md:justify-end items-center gap-1.5 mb-1">
                  <MapPin size={13} className="text-emerald-600" />
                  Arrival City
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
                  {destinationCity}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-emerald-700 font-bold text-sm bg-emerald-100/80 px-3 py-1 rounded-xl w-fit md:ml-auto">
                  <Clock size={14} />
                  <span>{arrival}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PERFORATED TICKET TEAR-OFF LINE */}
          <div className="relative h-6 bg-slate-50/70 overflow-hidden flex items-center justify-between">
            {/* Left Notch */}
            <div className="w-6 h-6 rounded-r-full bg-slate-100 -ml-3 border-r border-slate-200" />
            {/* Dashed Line */}
            <div className="flex-1 border-b-2 border-dashed border-slate-300 mx-2" />
            {/* Right Notch */}
            <div className="w-6 h-6 rounded-l-full bg-slate-100 -mr-3 border-l border-slate-200" />
          </div>

          {/* PASSENGER & TICKET SPECS GRID */}
          <div className="p-6 sm:p-8 bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {/* Passenger */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                  <User size={13} className="text-slate-500" /> Passenger
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {passengerName}
                </p>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  <span>{passengersCount} {passengersCount === 1 ? "Passenger" : "Passengers"}</span>
                  {(booking.maleCount !== undefined || booking.femaleCount !== undefined) && (
                    <span className="block text-[10px] text-slate-700 font-bold mt-0.5">
                      👨 {booking.maleCount || 0} Male • 👩 {booking.femaleCount || 0} Female
                    </span>
                  )}
                </div>
              </div>

              {/* Seat Numbers */}
              <div className="p-4 rounded-2xl bg-violet-50/80 border border-violet-100">
                <span className="text-xs font-semibold text-violet-600 flex items-center gap-1.5 mb-1">
                  <TicketIcon size={13} /> Selected Seats
                </span>
                <p className="text-base sm:text-lg font-black text-violet-700">
                  {seats}
                </p>
                <span className="text-[11px] text-violet-600/80 font-medium">
                  {booking.genderSummary ? `${booking.genderSummary} • Confirmed` : "Reserved & Confirmed"}
                </span>
              </div>

              {/* Total Fare */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100">
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 mb-1">
                  <CreditCard size={13} /> Total Fare
                </span>
                <p className="text-base sm:text-lg font-black text-emerald-700">
                  ₹{totalAmount}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {paymentStatus} ({paymentMethod})
                </span>
              </div>

              {/* Bus Model / Specs */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                  <ShieldCheck size={13} className="text-slate-500" /> Bus Model
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {busModel}
                </p>
                <span className="text-[11px] text-slate-500 font-medium truncate block">
                  {busType}
                </span>
              </div>
            </div>

            {/* BARCODE & SCAN SECTION */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/60 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  <QrCode size={26} className="text-slate-800" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Digital Boarding QR Code</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Show this e-ticket on your mobile at the boarding point or boarding gate.
                  </p>
                </div>
              </div>

              {/* Reporting Notice */}
              <div className="sm:text-right text-xs text-slate-500 font-medium">
                <span className="inline-block px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-bold text-[11px]">
                  ⏱ Report 15 mins before departure
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Printer size={18} />
            <span>Print / Download Ticket</span>
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md shadow-violet-500/25 transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <TicketIcon size={18} />
            <span>View in Profile</span>
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            <span>Back to Home</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
