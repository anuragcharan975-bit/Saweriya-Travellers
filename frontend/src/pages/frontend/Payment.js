import React, { useState, useEffect } from "react";
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
  Copy,
  Check,
  Smartphone,
  Clock,
  Sparkles,
  Banknote,
  Bus,
  MapPin,
  Calendar,
  Users
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { CreateBooking } from "../../Service/frontend/Booking";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const booking = location.state?.booking;

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiSubOption, setUpiSubOption] = useState("qr"); // "qr" or "id"
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("HDFC");
  const [selectedWallet, setSelectedWallet] = useState("Paytm");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 min countdown

  // Card details state
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  // Countdown timer for QR code validity
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const copyUpiId = () => {
    navigator.clipboard?.writeText("saweriyatravellers@okhdfcbank");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // ==========================================
  // NO BOOKING FALLBACK
  // ==========================================
  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
        <Header />
        <div className="pt-32 pb-20 flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-10 max-w-md mx-auto text-center shadow-sm border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Ticket size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">No Active Booking</h2>
            <p className="text-slate-500 text-sm mb-6">
              Please select your bus and seats first before proceeding to checkout.
            </p>
            <button
              onClick={() => navigate("/routeBus")}
              className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-md hover:bg-orange-600 transition"
            >
              Browse Bus Routes
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
        userId = userData?._id || userData?.id || userData?.user_id || localStorage.getItem("user_id") || "";
        userEmail = userData?.email || userData?.user_email || localStorage.getItem("user_email") || "";
      } catch (uErr) {
        // ignore
      }

      // 1. Sync to backend API
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
          seat_types: booking.seatTypes || booking.seat_types || {},
          addons: booking.addons || [],
          addons_amount: booking.addonsTotal || booking.addons_amount || 0,
          distance: booking.distance || "",
          discount_type: booking.discountType || booking.discount_type || "NONE",
          discount_amount: booking.discountAmount || booking.discount_amount || 0,
          discount_percent: booking.discountPercent || booking.discount_percent || 0,
          female_verification_required: Boolean(booking.female_verification_required ?? booking.femaleVerificationRequired ?? false),
          stand_verification_note: booking.stand_verification_note || "",
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
        backendBooking = res?.data?.data || res?.data || res;
      } catch (apiErr) {
        console.warn("Backend booking API note:", apiErr?.response?.data || apiErr);
        const errorMsg =
          apiErr?.response?.data?.message ||
          "Unable to complete booking. Please verify seats and travel timing.";
        setProcessing(false);
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: errorMsg,
          confirmButtonColor: "#f97316",
        });
        return;
      }

      // 2. Prepare comprehensive paid booking record
      const finalBookingId = backendBooking?._id || booking.bookingId || `BK${Date.now()}`;
      const paidBooking = {
        ...booking,
        _id: backendBooking?._id || finalBookingId,
        bookingId: finalBookingId,
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
        seatTypes: booking.seatTypes || booking.seat_types || {},
        seat_types: booking.seatTypes || booking.seat_types || {},
        seaterCount: booking.seaterCount || 0,
        sleeperCount: booking.sleeperCount || 0,
        seaterFare: booking.seaterFare || booking.fare,
        sleeperFare: booking.sleeperFare || booking.fare,
        seatsTotal: booking.seatsTotal || (booking.fare * (booking.passengers || 1)),
        addons: booking.addons || [],
        addons_amount: booking.addonsTotal || booking.addons_amount || 0,
        addonsTotal: booking.addonsTotal || booking.addons_amount || 0,
        distance: booking.distance || "",
        bookingMode: booking.bookingMode || "standard",
        discountType: booking.discountType || booking.discount_type || "NONE",
        discount_type: booking.discountType || booking.discount_type || "NONE",
        discountPercent: booking.discountPercent || booking.discount_percent || 0,
        discount_percent: booking.discountPercent || booking.discount_percent || 0,
        discountAmount: booking.discountAmount || booking.discount_amount || 0,
        discount_amount: booking.discountAmount || booking.discount_amount || 0,
        female_verification_required: Boolean(booking.female_verification_required ?? booking.femaleVerificationRequired ?? false),
        femaleVerificationRequired: Boolean(booking.female_verification_required ?? booking.femaleVerificationRequired ?? false),
        stand_verification_note: booking.stand_verification_note || "",
        maleCount: booking.maleCount ?? 0,
        femaleCount: booking.femaleCount ?? 0,
        genderSummary: booking.genderSummary || "",
        total: booking.total || booking.total_amount,
        total_amount: booking.total || booking.total_amount,
        paymentStatus: paymentMethod === "Cash" ? "Pay on Boarding" : "Paid",
        paymentMethod: paymentMethod === "UPI" ? `UPI (${upiSubOption.toUpperCase()})` : paymentMethod,
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
      if (userId) {
        localStorage.setItem(`bookingHistory_${userId}`, JSON.stringify(updatedHistory));
      }

      // 4. Show SweetAlert2 success modal
      await Swal.fire({
        icon: "success",
        title: paymentMethod === "Cash" ? "Seat Reserved!" : "Payment Confirmed! 🎉",
        html: `
          <div style="font-size: 14px; color: #475569; margin-top: 8px;">
            Your booking <b>#${paidBooking.bookingId}</b> has been confirmed.<br/>
            ${paymentMethod === "Cash" ? "You can pay ₹" + paidBooking.total + " cash upon boarding the bus." : "Transaction completed via " + paymentMethod + "."}<br/>
            Your digital e-ticket is ready for travel.
          </div>
        `,
        confirmButtonColor: "#f97316",
        confirmButtonText: "View My Ticket ➔",
        timer: 2600,
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
      title: "UPI (Scan QR / GPay / PhonePe / Paytm)",
      desc: "Fastest checkout with Zero transaction fees",
      icon: QrCode,
      badge: "Instant & Recommended",
    },
    {
      id: "Card",
      title: "Credit / Debit Card",
      desc: "Visa, MasterCard, RuPay, Maestro accepted",
      icon: CreditCard,
    },
    {
      id: "Net Banking",
      title: "Net Banking",
      desc: "All major Indian public & private banks",
      icon: Building,
    },
    {
      id: "Cash",
      title: "Pay on Bus (Cash / Counter)",
      desc: "Reserve your seat now & pay cash to conductor upon boarding",
      icon: Banknote,
      badge: "No Card Needed",
    },
    {
      id: "Wallet",
      title: "Digital Wallets",
      desc: "Amazon Pay, Paytm Wallet, Mobikwik",
      icon: Wallet,
    },
  ];

  const popularBanks = [
    { id: "HDFC", name: "HDFC Bank" },
    { id: "SBI", name: "State Bank of India" },
    { id: "ICICI", name: "ICICI Bank" },
    { id: "AXIS", name: "Axis Bank" },
    { id: "KOTAK", name: "Kotak Mahindra" },
    { id: "PNB", name: "Punjab National Bank" },
  ];

  const wallets = [
    { id: "Paytm", name: "Paytm Wallet" },
    { id: "AmazonPay", name: "Amazon Pay" },
    { id: "PhonePeWallet", name: "PhonePe Wallet" },
    { id: "Mobikwik", name: "Mobikwik" },
  ];

  const upiQuickSuffixes = ["@okhdfcbank", "@okaxis", "@oksbi", "@ybl", "@paytm", "@ibl"];

  // Generate dynamic QR Code URL embedding payment details
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    `upi://pay?pa=saweriyatravellers@okhdfcbank&pn=SaweriyaTravellers&am=${booking.total}&cu=INR&tn=BusBooking-${booking.bookingId}`
  )}`;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      <div>
        <Header />

        <div className="pt-28 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Top Steps Progress Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition self-start"
              >
                <ArrowLeft size={16} />
                <span>Back to Seat Selection</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  Step 3 of 3: Payment
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ================= LEFT: PAYMENT METHODS ================= */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        Choose Payment Mode
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Select your preferred payment method to confirm seats
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-black text-sm">
                      ₹
                    </div>
                  </div>

                  {/* Payment Choices List */}
                  <div className="space-y-3">
                    {paymentMethods.map((m) => {
                      const isSelected = paymentMethod === m.id;
                      const Icon = m.icon;

                      return (
                        <div
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id)}
                          className={`
                            p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                            ${
                              isSelected
                                ? "border-orange-500 bg-orange-50/40 shadow-xs"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                              <div
                                className={`
                                  w-11 h-11 rounded-xl flex items-center justify-center transition shrink-0
                                  ${
                                    isSelected
                                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20"
                                      : "bg-slate-100 text-slate-600"
                                  }
                                `}
                              >
                                <Icon size={20} />
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-bold text-slate-900">
                                    {m.title}
                                  </span>
                                  {m.badge && (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
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
                              className="w-4 h-4 text-orange-500 focus:ring-orange-400 accent-orange-500 shrink-0 ml-2"
                            />
                          </div>

                          {/* ================= METHOD 1: ADVANCED UPI QR CODE & VPA ================= */}
                          {isSelected && m.id === "UPI" && (
                            <div className="mt-5 pt-5 border-t border-orange-200/60 space-y-5 animate-in fade-in duration-200">
                              {/* Sub tabs: QR vs UPI ID */}
                              <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUpiSubOption("qr");
                                  }}
                                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                    upiSubOption === "qr"
                                      ? "bg-white text-orange-600 shadow-xs"
                                      : "text-slate-600 hover:text-slate-900"
                                  }`}
                                >
                                  <QrCode size={14} />
                                  <span>Scan QR Code</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUpiSubOption("id");
                                  }}
                                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                    upiSubOption === "id"
                                      ? "bg-white text-orange-600 shadow-xs"
                                      : "text-slate-600 hover:text-slate-900"
                                  }`}
                                >
                                  <Smartphone size={14} />
                                  <span>Enter UPI ID</span>
                                </button>
                              </div>

                              {/* QR CODE VIEW */}
                              {upiSubOption === "qr" && (
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-center gap-6">
                                  {/* QR Visual Box */}
                                  <div className="relative p-3 bg-white rounded-2xl border-2 border-dashed border-orange-400 shadow-sm shrink-0 text-center">
                                    <img
                                      src={qrCodeUrl}
                                      alt="UPI Payment QR Code"
                                      className="w-40 h-40 object-contain mx-auto rounded-lg"
                                      onError={(e) => {
                                        // Fallback SVG if image api times out
                                        e.target.style.display = "none";
                                      }}
                                    />
                                    <div className="mt-2 flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-slate-700">
                                      <span>Pay ₹{booking.total}</span>
                                    </div>
                                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                                      ● Active
                                    </span>
                                  </div>

                                  {/* Instructions & Timer */}
                                  <div className="flex-1 space-y-3 text-center md:text-left">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
                                      <Clock size={13} />
                                      <span>QR Expires in {formatTime(timeLeft)}</span>
                                    </div>

                                    <h4 className="text-sm font-bold text-slate-900">
                                      Scan with any UPI App on your phone
                                    </h4>

                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                      {["GPay", "PhonePe", "Paytm", "BHIM", "CRED"].map((app) => (
                                        <span
                                          key={app}
                                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200"
                                        >
                                          {app}
                                        </span>
                                      ))}
                                    </div>

                                    {/* Copyable UPI VPA */}
                                    <div className="pt-2">
                                      <span className="text-[11px] text-slate-400 block mb-1">
                                        Or pay directly to Merchant UPI ID:
                                      </span>
                                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800">
                                        <span>saweriyatravellers@okhdfcbank</span>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            copyUpiId();
                                          }}
                                          className="p-1 rounded-md hover:bg-white text-orange-600 transition"
                                          title="Copy UPI ID"
                                        >
                                          {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* UPI ID INPUT VIEW */}
                              {upiSubOption === "id" && (
                                <div className="space-y-3">
                                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                                    Enter Your Virtual Payment Address (VPA)
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={upiId}
                                      onChange={(e) => setUpiId(e.target.value)}
                                      placeholder="mobileNumber@upi / yourname@okhdfcbank"
                                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm font-semibold"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>

                                  {/* Quick suffix chips */}
                                  <div className="flex flex-wrap gap-1.5 pt-1">
                                    <span className="text-[11px] text-slate-400 self-center mr-1">
                                      Quick Suffix:
                                    </span>
                                    {upiQuickSuffixes.map((suf) => (
                                      <button
                                        key={suf}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const prefix = upiId.includes("@")
                                            ? upiId.split("@")[0]
                                            : upiId || "user";
                                          setUpiId(`${prefix}${suf}`);
                                        }}
                                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 font-mono text-[11px] border border-slate-200 transition"
                                      >
                                        {suf}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* ================= METHOD 2: CREDIT / DEBIT CARD ================= */}
                          {isSelected && m.id === "Card" && (
                            <div className="mt-5 pt-5 border-t border-orange-200/60 space-y-4 animate-in fade-in duration-200">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                  Card Number
                                </label>
                                <input
                                  type="text"
                                  maxLength={19}
                                  value={cardData.number}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
                                    setCardData({ ...cardData, number: formatted });
                                  }}
                                  placeholder="4532  ••••  ••••  8892"
                                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm font-mono font-bold tracking-wider"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                  Cardholder Full Name
                                </label>
                                <input
                                  type="text"
                                  value={cardData.name}
                                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                                  placeholder="e.g. Ramesh Kumar"
                                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-orange-500 outline-none text-sm font-semibold"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                    Valid Thru (MM/YY)
                                  </label>
                                  <input
                                    type="text"
                                    maxLength={5}
                                    value={cardData.expiry}
                                    onChange={(e) => {
                                      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                                      if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                                      setCardData({ ...cardData, expiry: v });
                                    }}
                                    placeholder="08/28"
                                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-orange-500 outline-none text-sm font-mono font-bold"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                    CVV / CVC
                                  </label>
                                  <input
                                    type="password"
                                    maxLength={4}
                                    value={cardData.cvv}
                                    onChange={(e) => {
                                      const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                                      setCardData({ ...cardData, cvv: v });
                                    }}
                                    placeholder="•••"
                                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-orange-500 outline-none text-sm font-mono font-bold"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ================= METHOD 3: NET BANKING ================= */}
                          {isSelected && m.id === "Net Banking" && (
                            <div className="mt-5 pt-5 border-t border-orange-200/60 space-y-4 animate-in fade-in duration-200">
                              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                                Select Popular Indian Bank
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                {popularBanks.map((b) => (
                                  <button
                                    key={b.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedBank(b.id);
                                    }}
                                    className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                                      selectedBank === b.id
                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-xs"
                                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                                    }`}
                                  >
                                    {b.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ================= METHOD 4: PAY ON BUS / CASH ================= */}
                          {isSelected && m.id === "Cash" && (
                            <div className="mt-5 pt-5 border-t border-orange-200/60 space-y-3 animate-in fade-in duration-200">
                              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
                                <h4 className="font-bold flex items-center gap-1.5 text-amber-800">
                                  <Sparkles size={14} className="text-amber-600" />
                                  <span>Cash on Boarding Selected</span>
                                </h4>
                                <p className="text-amber-700">
                                  Your seats will be reserved immediately. You can hand over ₹{booking.total} cash directly to the bus conductor before departure.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* ================= METHOD 5: WALLETS ================= */}
                          {isSelected && m.id === "Wallet" && (
                            <div className="mt-5 pt-5 border-t border-orange-200/60 space-y-4 animate-in fade-in duration-200">
                              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                                Select Digital Wallet
                              </label>
                              <div className="grid grid-cols-2 gap-2.5">
                                {wallets.map((w) => (
                                  <button
                                    key={w.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedWallet(w.id);
                                    }}
                                    className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                                      selectedWallet === w.id
                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-xs"
                                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                                    }`}
                                  >
                                    {w.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Guarantee badge */}
                  <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 text-xs text-emerald-800 font-medium">
                    <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    <span>
                      Guaranteed seat confirmation with official Saweriya Travellers Digital PNR ticket.
                    </span>
                  </div>
                </div>
              </div>

              {/* ================= RIGHT: SUMMARY RECEIPT ================= */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-7">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 className="text-lg font-black text-slate-900">
                      Booking Summary
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                      Express
                    </span>
                  </div>

                  {/* Bus & Route Card */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                      <Bus size={16} className="text-orange-500 shrink-0" />
                      <span className="truncate">{booking.busName || "Saweriya Travellers"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                      <MapPin size={14} className="text-slate-400 shrink-0" />
                      <span>{booking.route || `${booking.source_city || "Jaipur"} → ${booking.distance_city || "Delhi"}`}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock size={12} className="text-slate-400" />
                        {booking.departure || "09:30 PM"}
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Calendar size={12} className="text-slate-400" />
                        {booking.journeyDate ? new Date(booking.journeyDate).toLocaleDateString("en-IN") : "Today"}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Specs */}
                  <div className="space-y-3 text-xs sm:text-sm mt-5">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Booking Ref:</span>
                      <span className="font-mono font-bold text-slate-900">
                        #{booking.bookingId}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Selected Seats:</span>
                      <span className="font-black text-orange-600 text-sm">
                        {Array.isArray(booking.seats)
                          ? booking.seats.join(", ")
                          : booking.seats}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Passengers:</span>
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <Users size={14} className="text-slate-400" />
                        <span>{booking.passengers} Passenger{booking.passengers > 1 ? "s" : ""}</span>
                        {booking.maleCount !== undefined || booking.femaleCount !== undefined ? (
                          <span className="text-[11px] font-semibold text-slate-500 ml-1">
                            ({booking.maleCount || 0}M, {booking.femaleCount || 0}F)
                          </span>
                        ) : null}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Bus Type:</span>
                      <span className="font-semibold text-slate-700">
                        {booking.busType || "AC Sleeper (2+2)"}
                      </span>
                    </div>
                  </div>

                  <hr className="my-5 border-slate-100" />

                  {/* Price Breakdown */}
                  <div className="space-y-2 mb-6 text-xs text-slate-500">
                    {booking.seaterCount > 0 && (
                      <div className="flex justify-between">
                        <span>Lower Seater ({booking.seaterCount} × ₹{booking.seaterFare})</span>
                        <span className="font-semibold text-slate-700">₹{booking.seaterCount * booking.seaterFare}</span>
                      </div>
                    )}

                    {booking.sleeperCount > 0 && (
                      <div className="flex justify-between">
                        <span>Upper Sleeper ({booking.sleeperCount} × ₹{booking.sleeperFare})</span>
                        <span className="font-semibold text-slate-700">₹{booking.sleeperCount * booking.sleeperFare}</span>
                      </div>
                    )}

                    {!booking.seaterCount && !booking.sleeperCount && (
                      <div className="flex justify-between">
                        <span>Seat Fare ({booking.passengers} × ₹{booking.fare})</span>
                        <span className="font-semibold text-slate-700">₹{booking.seatsTotal || booking.total}</span>
                      </div>
                    )}

                    {Array.isArray(booking.addons) && booking.addons.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                          Highway Catering & Add-ons (450+ KM):
                        </span>
                        {booking.addons.map((a, i) => (
                          <div key={i} className="flex justify-between text-slate-700 pl-1 font-medium">
                            <span>{a.icon || "🍽️"} {a.count} × {a.name}</span>
                            <span>+₹{a.total}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Promotional Discounts */}
                    {booking.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        <span>
                          {booking.discountType === "COUPLE"
                            ? "💑 Couple Special (35% OFF)"
                            : "👥 Group Saver Discount (30% OFF)"}
                        </span>
                        <span>-₹{booking.discountAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between pt-1">
                      <span>Service Tax / GST</span>
                      <span className="text-emerald-600 font-bold">FREE (₹0)</span>
                    </div>

                    <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                      <span>Total Amount Payable</span>
                      <span className="text-2xl text-orange-600 font-black">
                        ₹{booking.total}
                      </span>
                    </div>
                  </div>

                  {/* Stand-side Female Verification Alert */}
                  {booking.female_verification_required && (
                    <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                      <div className="font-extrabold flex items-center gap-1.5 text-rose-700">
                        <span>⚠️ Stand-side Verification Clause:</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-rose-800">
                        Female traveller presence is mandatory at the boarding point. If no female passenger is present at the stand, the 35% discount will be revoked and full regular fare must be paid directly to the station supervisor.
                      </p>
                    </div>
                  )}

                  {/* Pay CTA Button */}
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-base shadow-lg shadow-orange-500/30 transition-all active:scale-98 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    <Lock size={18} />
                    <span>
                      {processing
                        ? "Confirming Reservation..."
                        : paymentMethod === "Cash"
                        ? `Confirm Seat & Pay on Boarding (₹${booking.total})`
                        : `Pay ₹${booking.total} & Confirm Booking`}
                    </span>
                  </button>

                  <p className="text-[11px] text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    <span>Instant confirmation with SMS & E-Ticket download</span>
                  </p>
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
