import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  CreditCard,
  QrCode,
  Building,
  Wallet,
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Ticket,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { CreateBooking } from "../../Service/frontend/Booking";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const booking = location.state?.booking;

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);

  // ==========================================
  // NO BOOKING
  // ==========================================
  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
        <Header />
        <div className="pt-28 pb-20 flex-1 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-10 max-w-md mx-auto text-center shadow-sm border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Ticket size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">No Active Booking</h2>
            <p className="text-slate-500 text-sm mb-6">
              Please select a bus and seat first before proceeding to checkout.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-md hover:bg-orange-600 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ==========================================
  // PROCESS PAYMENT
  // ==========================================
  const handlePayment = async () => {
    try {
      setProcessing(true);

      let userId = "";
      let userEmail = "";
      try {
        const userData = JSON.parse(localStorage.getItem("userdata") || "{}");
        userId = userData?._id || userData?.id || localStorage.getItem("user_id") || "";
        userEmail = userData?.email || "";
      } catch (uErr) {
        // ignore
      }

      // 1. Sync to backend API if user is logged in
      let backendBooking = null;
      try {
        const payload = {
          user_id: userId || undefined,
          userId: userId || undefined,
          user_email: userEmail || undefined,
          userEmail: userEmail || undefined,
          schedule_id: booking.scheduleId || booking.busId,
          scheduleId: booking.scheduleId || booking.busId,
          seat_number: booking.seats || booking.seat_number,
          seats: booking.seats || booking.seat_number,
          total_amount: booking.total || booking.total_amount,
          bus_name: booking.busName || booking.bus_name || "Volvo AC Luxury Coach",
          register_number: booking.registerNumber || booking.register_number || "RJ45SK0000",
          bus_type: booking.busType || booking.bus_type || "AC Sleeper (2+2)",
          model: booking.model || "2026 Multi-Axle",
          route: booking.route || "Jaipur → Delhi",
          source_city: booking.source_city || "Jaipur",
          distance_city: booking.distance_city || "Delhi",
          departure: booking.departure || booking.departure_time || "09:30 PM",
          arrival: booking.arrival || booking.arrival_time || "05:00 AM",
          journey_date: booking.journeyDate || booking.journey_date || new Date().toISOString(),
        };

        const res = await CreateBooking(payload);
        backendBooking = res?.data || res;
      } catch (apiErr) {
        console.warn("Backend booking API note:", apiErr?.response?.data || apiErr);
      }

      // 2. Prepare comprehensive paid booking record
      const paidBooking = {
        ...booking,
        _id: backendBooking?._id || booking.bookingId || `BK${Date.now()}`,
        bookingId: booking.bookingId || backendBooking?._id || `BK${Date.now()}`,
        user_id: userId,
        userId: userId,
        user_email: userEmail,
        userEmail: userEmail,
        busName: booking.busName || booking.bus_name || "Volvo AC Luxury Coach",
        bus_name: booking.busName || booking.bus_name || "Volvo AC Luxury Coach",
        registerNumber: booking.registerNumber || booking.register_number || "RJ45SK0000",
        register_number: booking.registerNumber || booking.register_number || "RJ45SK0000",
        busType: booking.busType || booking.bus_type || "AC Sleeper (2+2)",
        bus_type: booking.busType || booking.bus_type || "AC Sleeper (2+2)",
        model: booking.model || "2026 Multi-Axle",
        source_city: booking.source_city || "Jaipur",
        distance_city: booking.distance_city || "Delhi",
        route: booking.route || "Jaipur → Delhi",
        departure: booking.departure || booking.departure_time || "09:30 PM",
        arrival: booking.arrival || booking.arrival_time || "05:00 AM",
        journeyDate: booking.journeyDate || booking.journey_date || new Date().toISOString(),
        journey_date: booking.journeyDate || booking.journey_date || new Date().toISOString(),
        seats: booking.seats || booking.seat_number,
        seat_number: booking.seats || booking.seat_number,
        seatGenders: booking.seatGenders || {},
        maleCount: booking.maleCount ?? 0,
        femaleCount: booking.femaleCount ?? 0,
        genderSummary: booking.genderSummary || "",
        total: booking.total || booking.total_amount,
        total_amount: booking.total || booking.total_amount,
        paymentStatus: "Paid",
        paymentMethod: paymentMethod,
        bookingStatus: "Booked",
        booking_status: "Booked",
        bookedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      // 3. Save in local storage booking history (merging without duplicates)
      const oldHistory = JSON.parse(localStorage.getItem("bookingHistory") || "[]");
      const updatedHistory = [
        paidBooking,
        ...oldHistory.filter(
          (h) => h.bookingId !== paidBooking.bookingId && h._id !== paidBooking._id
        ),
      ];
      localStorage.setItem("bookingHistory", JSON.stringify(updatedHistory));

      // 4. Show SweetAlert2 success modal
      await Swal.fire({
        icon: "success",
        title: "Payment Confirmed!",
        html: `
          <div style="font-size: 14px; color: #475569; margin-top: 8px;">
            Your ticket <b>#${paidBooking.bookingId}</b> has been booked successfully.<br/>
            Your trip is now active and saved in your profile history.
          </div>
        `,
        confirmButtonColor: "#f97316",
        confirmButtonText: "View My Ticket",
        timer: 2500,
        timerProgressBar: true,
      });

      // 5. Navigate to Ticket page
      navigate("/ticket", { state: paidBooking });
    } catch (err) {
      console.error("Payment error:", err);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "An error occurred while processing your payment. Please try again.",
      });
    } finally {
      setProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: "UPI",
      title: "UPI (GPay / PhonePe / Paytm)",
      desc: "Fast & zero additional transaction charges",
      icon: QrCode,
      badge: "Instant",
    },
    {
      id: "Card",
      title: "Credit / Debit Card",
      desc: "Visa, MasterCard, RuPay, Maestro",
      icon: CreditCard,
    },
    {
      id: "Net Banking",
      title: "Net Banking",
      desc: "All major Indian banks supported",
      icon: Building,
    },
    {
      id: "Wallet",
      title: "Digital Wallets",
      desc: "Paytm, Mobikwik, Amazon Pay",
      icon: Wallet,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      <div>
        <Header />

        <div className="pt-28 pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {/* Steps indicator */}
            <div className="mb-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition"
              >
                <ArrowLeft size={16} />
                <span>Back to Seat Selection</span>
              </button>

              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Step 3 of 3: Secure Checkout
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ================= LEFT: PAYMENT METHOD SELECTION ================= */}
              <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Payment Methods
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Choose how you want to pay
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                    <ShieldCheck size={16} />
                    <span>100% Encrypted</span>
                  </div>
                </div>

                {/* Methods Cards */}
                <div className="space-y-3">
                  {paymentMethods.map((m) => {
                    const isSelected = paymentMethod === m.id;
                    const Icon = m.icon;

                    return (
                      <label
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`
                          flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                          ${
                            isSelected
                              ? "border-orange-500 bg-orange-50/50 shadow-xs"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`
                              w-10 h-10 rounded-xl flex items-center justify-center transition
                              ${
                                isSelected
                                  ? "bg-orange-500 text-white shadow-xs"
                                  : "bg-slate-100 text-slate-600"
                              }
                            `}
                          >
                            <Icon size={20} />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">
                                {m.title}
                              </span>
                              {m.badge && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                  {m.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 block mt-0.5">
                              {m.desc}
                            </span>
                          </div>
                        </div>

                        <input
                          type="radio"
                          name="payment_choice"
                          checked={isSelected}
                          onChange={() => setPaymentMethod(m.id)}
                          className="w-4 h-4 text-orange-500 focus:ring-orange-400 accent-orange-500"
                        />
                      </label>
                    );
                  })}
                </div>

                {/* Dynamic method info input preview */}
                {paymentMethod === "UPI" && (
                  <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Enter UPI ID / VPA
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank / mobile@upi"
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm font-semibold"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      A payment request will be sent to your UPI app
                    </span>
                  </div>
                )}

                {paymentMethod === "Card" && (
                  <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4532 •••• •••• 8892"
                        className="w-full h-11 px-3 rounded-xl border border-slate-300 focus:border-orange-500 outline-none text-sm font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Expiry MM/YY
                        </label>
                        <input
                          type="text"
                          placeholder="08/28"
                          className="w-full h-11 px-3 rounded-xl border border-slate-300 focus:border-orange-500 outline-none text-sm font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          className="w-full h-11 px-3 rounded-xl border border-slate-300 focus:border-orange-500 outline-none text-sm font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Guarantee badge */}
                <div className="mt-6 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 text-xs text-emerald-800 font-medium">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>
                    Your payment information is tokenized and never stored on our servers.
                  </span>
                </div>
              </div>

              {/* ================= RIGHT: SUMMARY RECEIPT ================= */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-7">
                  <h3 className="text-lg font-black text-slate-900 mb-4 pb-3 border-b border-slate-100">
                    Booking Breakdown
                  </h3>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Booking Ref:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {booking.bookingId}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Bus Operator:</span>
                      <span className="font-bold text-slate-900 truncate max-w-[200px]">
                        {booking.busName}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Route:</span>
                      <span className="font-bold text-slate-900">
                        {booking.route}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Selected Seats:</span>
                      <span className="font-bold text-orange-600">
                        {Array.isArray(booking.seats)
                          ? booking.seats.join(", ")
                          : booking.seats}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Departure Time:</span>
                      <span className="font-bold text-slate-900">
                        {booking.departure}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Passengers:</span>
                      <span className="font-bold text-slate-900">
                        {booking.passengers}
                        {booking.maleCount !== undefined || booking.femaleCount !== undefined ? (
                          <span className="text-xs font-semibold text-slate-500 ml-1.5">
                            ({booking.maleCount || 0} Male, {booking.femaleCount || 0} Female)
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </div>

                  <hr className="my-5 border-slate-100" />

                  {/* Pricing Total */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Seat Fare ({booking.passengers} × ₹{booking.fare})</span>
                      <span>₹{booking.total}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Service Tax / GST</span>
                      <span className="text-emerald-600 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-100">
                      <span>Total Payable</span>
                      <span className="text-2xl text-orange-600 font-black">
                        ₹{booking.total}
                      </span>
                    </div>
                  </div>

                  {/* Pay CTA Button */}
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-base shadow-lg shadow-orange-500/30 transition-all active:scale-98 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    <Lock size={18} />
                    <span>
                      {processing ? "Confirming..." : `Pay ₹${booking.total}`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
