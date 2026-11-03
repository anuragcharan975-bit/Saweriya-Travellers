import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Armchair,
  BusFront,
  Lock,
  ShieldCheck,
  X,
  CreditCard,
  Users,
  BedDouble,
  Coffee,
  Utensils,
  Plus,
  Minus,
  Layers,
  Heart,
  UserCheck,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { ViewSchedule } from "../../Service/admin/Schedule";
import { GetLiveBookedSeats } from "../../Service/frontend/Booking";

export default function BusSeat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [scheduleData, setScheduleData] = useState(location.state?.bus || null);

  useEffect(() => {
    if (!scheduleData && id) {
      ViewSchedule(id)
        .then((res) => {
          if (res) setScheduleData(res);
        })
        .catch((err) => console.log("Schedule load error:", err));
    }
  }, [id, scheduleData]);

  const bus = scheduleData || location.state?.bus || {};

  const totalSeats =
    Number(bus?.total_seats) ||
    Number(bus?.bus?.total_seats) ||
    40;

  // Base fare (low rate for sitting seater)
  const baseFare = Number(bus?.fare || bus?.route?.fare || 500);

  // Seater rate: low rate (₹450 / ₹500)
  const seaterFare = baseFare;

  // Sleeper berth rate: high rate (+55% premium luxury berth)
  const sleeperFare = Math.round((baseFare * 1.55) / 10) * 10;

  const seatLetters = ["A", "B", "C", "D"];
  const rowCount = Math.ceil(totalSeats / 4);
  const halfRows = Math.floor(rowCount / 2); // e.g. Rows 1-5 Lower (Seater), Rows 6-10 Upper (Sleeper)

  const isSleeperSeat = (seat) => {
    if (!seat) return false;
    const match = seat.match(/\d+/);
    if (!match) return false;
    const rowNum = parseInt(match[0], 10);
    return rowNum > halfRows;
  };

  const getSeatType = (seat) => (isSleeperSeat(seat) ? "Sleeper" : "Seater");
  const getSeatFare = (seat) => (isSleeperSeat(seat) ? sleeperFare : seaterFare);

  const seats = Array.from({ length: totalSeats }, (_, index) => {
    const row = Math.floor(index / 4) + 1;
    const column = index % 4;
    return `${row}${seatLetters[column]}`;
  });

  // Deck filter: 'all' | 'lower' | 'upper'
  const [activeDeck, setActiveDeck] = useState("all");

  // ==========================================
  // BOOKING MODES: 'standard' | 'couple' | 'group'
  // ==========================================
  const [bookingMode, setBookingMode] = useState("standard");

  const [selected, setSelected] = useState([]);
  const [seatGenders, setSeatGenders] = useState({});
  const [bookedSeats, setBookedSeats] = useState([]);
  const [isTripCompleted, setIsTripCompleted] = useState(false);

  // ==========================================
  // DISTANCE & 450+ KM CATERING CALCULATION
  // ==========================================
  const routeDistanceRaw =
    bus?.route?.distance ||
    bus?.distance ||
    location.state?.route?.distance ||
    location.state?.searchData?.distance ||
    "";

  const parseDistanceKm = (distStr) => {
    if (!distStr) return 0;
    const cleaned = String(distStr).replace(/,/g, "").replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const distanceKm = parseDistanceKm(routeDistanceRaw);
  const isLongRoute = distanceKm >= 450;
  const [showAddonsManual, setShowAddonsManual] = useState(false);
  const enableAddons = isLongRoute || showAddonsManual;

  // Highway Catering menu (Tea, Coffee, Dinner plate, Snacks, Mineral water)
  const CATERING_MENU = [
    {
      id: "tea",
      name: "Kulhad Masala Chai",
      tag: "Hot Beverage",
      icon: "☕",
      desc: "Ginger, cardamom & clove brewed milk tea in highway clay kulhad",
      price: 30,
      veg: true,
    },
    {
      id: "coffee",
      name: "Fresh Brewed Filter Coffee",
      tag: "Rich Roast",
      icon: "☕",
      desc: "Aromatic South Indian roast filter coffee served steaming hot",
      price: 50,
      veg: true,
    },
    {
      id: "dinner_veg",
      name: "Royal Veg Dinner Plate / Thali",
      tag: "Bestseller Meal",
      icon: "🍱",
      desc: "Paneer butter masala, dal makhani, 4 butter rotis, jeera rice & gulab jamun",
      price: 180,
      veg: true,
    },
    {
      id: "dinner_nonveg",
      name: "Special Chicken Dinner Plate",
      tag: "Highway Special",
      icon: "🍗",
      desc: "Spicy chicken curry, 4 butter rotis, steamed rice, fresh salad & sweet",
      price: 220,
      veg: false,
    },
    {
      id: "snacks_box",
      name: "Highway Snacks Combo Plate",
      tag: "Evening Snack",
      icon: "🥪",
      desc: "Grilled sandwich, crispy samosa, potato wafers & mint dip",
      price: 90,
      veg: true,
    },
    {
      id: "water_bottle",
      name: "Packaged Mineral Water (1L)",
      tag: "Pure Hydration",
      icon: "💧",
      desc: "Chilled sealed BIS-certified pure drinking water bottle",
      price: 20,
      veg: true,
    },
  ];

  const [addons, setAddons] = useState({});

  const updateAddon = (id, delta) => {
    setAddons((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const addonsTotal = Object.entries(addons).reduce((sum, [id, count]) => {
    const item = CATERING_MENU.find((m) => m.id === id);
    return sum + (item ? item.price * count : 0);
  }, 0);

  const addonsCount = Object.values(addons).reduce((a, b) => a + b, 0);

  // Clear stale legacy localStorage key once on mount
  useEffect(() => {
    try {
      localStorage.removeItem("bookedSeats");
    } catch (e) {}
  }, []);

  // Fetch live booked seats for this specific schedule & travel date
  useEffect(() => {
    const scheduleId = id || scheduleData?._id;
    const searchDate = location.state?.searchDate || location.state?.searchData?.date || "";

    if (scheduleId) {
      GetLiveBookedSeats(scheduleId, searchDate)
        .then((res) => {
          if (res?.success) {
            if (res.isCompleted) {
              setBookedSeats([]);
              setIsTripCompleted(true);
            } else {
              setBookedSeats(res.bookedSeats || []);
              setIsTripCompleted(false);
            }
          }
        })
        .catch((err) => console.log("Live booked seats error:", err));
    }
  }, [id, scheduleData, location.state]);

  // Gender counts
  const maleCount = selected.filter(
    (s) => (seatGenders[s] || "Male") === "Male"
  ).length;

  const femaleCount = selected.filter(
    (s) => seatGenders[s] === "Female"
  ).length;

  const seaterSelected = selected.filter((s) => !isSleeperSeat(s));
  const sleeperSelected = selected.filter((s) => isSleeperSeat(s));

  // ==========================================
  // COUPLE & GROUP DISCOUNT LOGIC
  // ==========================================
  const isCoupleMode = bookingMode === "couple";
  const isGroupMode = bookingMode === "group" || selected.length >= 4;

  // Strict verification criteria:
  // Couple mode requires 1 Male & 1 Female passenger!
  const hasFemalePassenger = femaleCount >= 1;
  const isCoupleApproved = isCoupleMode && selected.length === 2 && hasFemalePassenger;

  let discountPercent = 0;
  let discountType = "NONE";

  if (isCoupleMode) {
    discountType = "COUPLE";
    if (isCoupleApproved) {
      discountPercent = 35; // 35% Couple Discount
    }
  } else if (isGroupMode) {
    discountType = "GROUP";
    discountPercent = 30; // 30% Group Discount
  }

  const seatsTotal = selected.reduce((sum, s) => sum + getSeatFare(s), 0);
  const discountAmount = Math.round((seatsTotal * discountPercent) / 100);
  const discountedSeatsTotal = Math.max(0, seatsTotal - discountAmount);
  const grandTotal = discountedSeatsTotal + addonsTotal;

  // Handle seat clicks
  const handleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    if (selected.includes(seat)) {
      const nextSelected = selected.filter((item) => item !== seat);
      setSelected(nextSelected);
      const nextGenders = { ...seatGenders };
      delete nextGenders[seat];
      setSeatGenders(nextGenders);
      return;
    }

    if (isCoupleMode && selected.length >= 2) {
      Swal.fire({
        icon: "info",
        title: "Couple Booking Limit",
        text: "Couple Special (35% OFF) is for exactly 2 seats (1 Male + 1 Female).",
        confirmButtonColor: "#e11d48",
      });
      return;
    }

    // GROUP SEAT LIMIT UP TO 12 SEATS
    if (selected.length >= 12) {
      Swal.fire({
        icon: "info",
        title: "Group Seat Limit Reached",
        text: "You can select a maximum of 12 seats per group booking.",
        confirmButtonColor: "#059669",
      });
      return;
    }

    if (selected.length >= 6 && !isGroupMode) {
      // Auto-unlock group saver mode for 7-12 seats with 30% discount
      setBookingMode("group");
      Swal.fire({
        icon: "success",
        title: "👥 Group Booking Mode Activated!",
        text: "Seat limit extended to 12 seats with 30% Group Discount!",
        confirmButtonColor: "#059669",
        timer: 2200,
        timerProgressBar: true,
      });
    }

    // Default gender: in couple mode, if 1st seat is Male, make 2nd seat Female automatically!
    let defaultGender = "Male";
    if (isCoupleMode && selected.length === 1) {
      const firstSeatGender = seatGenders[selected[0]] || "Male";
      defaultGender = firstSeatGender === "Male" ? "Female" : "Male";
    }

    setSelected([...selected, seat]);
    setSeatGenders((prev) => ({
      ...prev,
      [seat]: defaultGender,
    }));
  };

  const setGenderForSeat = (seat, gender) => {
    setSeatGenders((prev) => ({
      ...prev,
      [seat]: gender,
    }));
  };

  const removeSeat = (seat) => {
    setSelected(selected.filter((item) => item !== seat));
    const nextGenders = { ...seatGenders };
    delete nextGenders[seat];
    setSeatGenders(nextGenders);
  };

  // Toggle couple mode with romantic theme transition
  const toggleCoupleMode = () => {
    if (bookingMode === "couple") {
      setBookingMode("standard");
    } else {
      setBookingMode("couple");
      // If user currently has more than 2 seats selected, trim to 2
      if (selected.length > 2) {
        setSelected(selected.slice(0, 2));
      }
      // Notify user of romantic theme and female traveller mandatory rule
      Swal.fire({
        icon: "info",
        title: "💑 Romantic Couple Mode Activated",
        html: `
          <div style="font-size: 13px; text-align: left; color: #475569; line-height: 1.6;">
            <p><b>✨ 35% Couple Privilege Discount</b> has been unlocked!</p>
            <div style="margin-top: 8px; padding: 10px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; color: #9f1239;">
              <b>⚠️ Mandatory Verification Rule:</b><br/>
              Both <b>1 Male (👨)</b> and <b>1 Female (👩)</b> are mandatory.<br/>
              Physical presence of the female traveller is mandatory at the boarding stand. If no female is present at the stand, the 35% discount is void and full fare must be paid.
            </div>
          </div>
        `,
        confirmButtonColor: "#e11d48",
        confirmButtonText: "Got It 💕",
      });
    }
  };

  const handleProceed = () => {
    if (selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Select Seats",
        text: "Please select at least one seat to continue.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    // Couple Validation
    if (isCoupleMode) {
      if (selected.length !== 2) {
        Swal.fire({
          icon: "warning",
          title: "Couple Booking Requires 2 Seats",
          text: "Please select exactly 2 seats for Couple booking (35% OFF).",
          confirmButtonColor: "#e11d48",
        });
        return;
      }
      if (!hasFemalePassenger) {
        Swal.fire({
          icon: "error",
          title: "Female Passenger Mandatory",
          html: `
            <div style="font-size: 13px; color: #475569; text-align: left;">
              <b>Couple 35% Discount cannot be approved without a female passenger.</b><br/><br/>
              Please change one passenger's gender to <b>Female (👩)</b> below to claim your 35% couple discount.
              <br/><br/>
              <small style="color: #e11d48;">*Rule: No female passenger at the bus stand = Full ticket price payable without discount.</small>
            </div>
          `,
          confirmButtonColor: "#e11d48",
          confirmButtonText: "Assign Female Passenger",
        });
        return;
      }
    }

    const token = localStorage.getItem("usertoken") || localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to finalize your booking.",
        confirmButtonColor: "#f97316",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    const activeBusObj = bus?.bus || (typeof bus === "object" ? bus : {});
    const activeRouteObj = bus?.route || {};

    const busName =
      activeBusObj?.bus_name ||
      bus?.bus_name ||
      "Volvo AC Luxury Liner";

    const registerNumber =
      activeBusObj?.register_number ||
      bus?.register_number ||
      "RJ45SK0000";

    const busType =
      activeBusObj?.bus_type ||
      bus?.bus_type ||
      "AC Sleeper (2+2)";

    const model =
      activeBusObj?.model ||
      bus?.model ||
      "2026 Multi-Axle";

    const sourceCity =
      activeRouteObj?.source_city ||
      bus?.source_city ||
      "Jaipur";

    const distanceCity =
      activeRouteObj?.distance_city ||
      bus?.distance_city ||
      bus?.destination_city ||
      "Delhi";

    const routeStr = `${sourceCity} → ${distanceCity}`;
    const departure = bus?.departure_time || "09:30 PM";
    const arrival = bus?.arrival_time || "05:00 AM";
    const journeyDate = bus?.trip_date || new Date().toISOString();

    const selectedAddonsList = Object.entries(addons)
      .filter(([_, c]) => c > 0)
      .map(([id, count]) => {
        const item = CATERING_MENU.find((m) => m.id === id);
        return {
          id,
          name: item.name,
          count,
          price: item.price,
          total: item.price * count,
          icon: item.icon,
        };
      });

    const seatTypesMap = selected.reduce((acc, s) => {
      acc[s] = getSeatType(s);
      return acc;
    }, {});

    navigate("/payment", {
      state: {
        booking: {
          bookingId: `BK${Date.now()}`,
          busName: busName,
          bus_name: busName,
          registerNumber: registerNumber,
          register_number: registerNumber,
          busType: busType,
          bus_type: busType,
          model: model,
          source_city: sourceCity,
          distance_city: distanceCity,
          route: routeStr,
          journeyDate: journeyDate,
          journey_date: journeyDate,
          departure: departure,
          departure_time: departure,
          arrival: arrival,
          arrival_time: arrival,
          seats: selected,
          seat_number: selected,
          seatTypes: seatTypesMap,
          seat_types: seatTypesMap,
          seaterCount: seaterSelected.length,
          sleeperCount: sleeperSelected.length,
          seaterFare: seaterFare,
          sleeperFare: sleeperFare,
          seatsTotal: seatsTotal,
          // Discount specs
          bookingMode: bookingMode,
          discountType: discountType,
          discount_type: discountType,
          discountPercent: discountPercent,
          discount_percent: discountPercent,
          discountAmount: discountAmount,
          discount_amount: discountAmount,
          female_verification_required: isCoupleMode,
          femaleVerificationRequired: isCoupleMode,
          stand_verification_note: isCoupleMode
            ? "Mandatory Female Passenger Stand Verification Required: 1 Female traveller must be present at boarding stand. If no female traveller is present at stand, 35% discount is void and full fare must be paid."
            : "",
          seatGenders: seatGenders,
          maleCount: maleCount,
          femaleCount: femaleCount,
          genderSummary: `${maleCount} Male, ${femaleCount} Female`,
          passengers: selected.length,
          fare: seaterFare,
          addons: selectedAddonsList,
          addons_amount: addonsTotal,
          addonsTotal: addonsTotal,
          distance: routeDistanceRaw || (distanceKm ? `${distanceKm} km` : ""),
          distanceKm: distanceKm,
          total: grandTotal,
          total_amount: grandTotal,
          busId: activeBusObj?._id || bus?._id || null,
          scheduleId: bus?._id || bus?.schedule_id || id || null,
        },
      },
    });
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between font-sans transition-colors duration-700 ${
        isCoupleMode
          ? "bg-gradient-to-b from-rose-950 via-slate-950 to-pink-950 text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      <div>
        <Header />

        <div className="pt-28 pb-16 relative overflow-hidden">
          {/* ROMANTIC THEME FLOATING PARTICLES */}
          {isCoupleMode && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-10 left-10 text-rose-500/30 text-4xl animate-bounce">
                ❤️
              </div>
              <div className="absolute top-40 right-20 text-pink-400/25 text-3xl animate-pulse">
                💕
              </div>
              <div className="absolute bottom-20 left-1/4 text-rose-400/20 text-5xl">
                🌹
              </div>
              <div className="absolute top-1/2 right-10 text-pink-500/20 text-3xl">
                💖
              </div>
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-rose-500/10 rounded-full blur-3xl"></div>
            </div>
          )}

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Header info bar */}
            <div
              className={`mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl p-5 sm:p-6 border shadow-sm transition-all ${
                isCoupleMode
                  ? "bg-slate-900/90 border-rose-500/30 text-white shadow-rose-950/40"
                  : "bg-white border-slate-200/90 text-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      isCoupleMode
                        ? "text-rose-300 bg-rose-950/80 border-rose-500/40"
                        : "text-orange-600 bg-orange-50 border-orange-200"
                    }`}
                  >
                    Step 2 of 3: Seat & Special Offers
                  </span>

                  {isCoupleMode && (
                    <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xs flex items-center gap-1 animate-pulse">
                      <Heart size={12} className="fill-white" />
                      <span>35% Couple Privilege Active</span>
                    </span>
                  )}

                  {isGroupMode && !isCoupleMode && (
                    <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                      <Users size={12} />
                      <span>30% Group Saver Active (Limit: 12 Seats)</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-black mt-2 flex items-center gap-2">
                  {isCoupleMode ? (
                    <span className="text-rose-200 flex items-center gap-2">
                      <span>Romantic Couple Corner & Seating</span>
                      <span>💕</span>
                    </span>
                  ) : (
                    <span>Choose Your Preferred Seats</span>
                  )}
                </h1>
                <p
                  className={`text-xs sm:text-sm mt-0.5 ${
                    isCoupleMode ? "text-rose-200/70" : "text-slate-500"
                  }`}
                >
                  Lower Seater (Low Rate ₹{seaterFare}) & Upper Sleeper (High Rate ₹{sleeperFare})
                </p>
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-4 h-4 rounded-md border-2 ${
                      isCoupleMode ? "border-rose-400/40 bg-slate-800" : "border-slate-300 bg-white"
                    }`}
                  ></div>
                  <span className={isCoupleMode ? "text-rose-200" : "text-slate-600"}>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-md bg-blue-600 shadow-xs"></div>
                  <span className="text-blue-500 font-bold">Male (👨)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-md bg-rose-500 shadow-xs"></div>
                  <span className="text-rose-400 font-bold">Female (👩)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-md bg-slate-700 text-slate-500"></div>
                  <span className="text-slate-500">Booked</span>
                </div>
              </div>
            </div>

            {/* TRIP COMPLETED / SEATS RESET NOTICE */}
            {isTripCompleted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between gap-4 animate-fade-in shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-400">Bus Journey Completed</h4>
                    <p className="text-xs opacity-80 mt-0.5">
                      This bus has reached its destination. All coach seats have been freed and are available for new bookings!
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
                  Seats Reset
                </span>
              </div>
            )}

            {/* SPECIAL OFFER & THEME SWITCHER BAR */}
            <div
              className={`mb-6 p-4 rounded-3xl border transition-all ${
                isCoupleMode
                  ? "bg-gradient-to-r from-rose-950/90 via-pink-950/80 to-slate-900 border-rose-500/40 shadow-lg shadow-rose-950/50"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                      isCoupleMode
                        ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {isCoupleMode ? "💑" : "🎁"}
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base flex items-center gap-2">
                      <span>Travel Offers & Privilege Modes</span>
                      {isCoupleMode && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                          Romantic Ambience
                        </span>
                      )}
                    </h3>
                    <p
                      className={`text-xs mt-0.5 ${
                        isCoupleMode ? "text-rose-200/80" : "text-slate-500"
                      }`}
                    >
                      Couples get <b>35% OFF</b> with mandatory female passenger • Groups get <b>30% OFF (Up to 12 seats)</b>!
                    </p>
                  </div>
                </div>

                {/* Offer Toggle Buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => setBookingMode("standard")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      bookingMode === "standard"
                        ? "bg-slate-900 text-white shadow-xs"
                        : isCoupleMode
                        ? "bg-slate-800 text-rose-200 hover:bg-slate-700 border border-rose-500/20"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Standard Fare
                  </button>

                  <button
                    type="button"
                    onClick={toggleCoupleMode}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm ${
                      isCoupleMode
                        ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-500/40 ring-2 ring-rose-300"
                        : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                    }`}
                  >
                    <Heart size={14} className={isCoupleMode ? "fill-white" : "text-rose-600"} />
                    <span>💑 Couple Special (35% OFF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (bookingMode === "group") {
                        setBookingMode("standard");
                      } else {
                        setBookingMode("group");
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isGroupMode && !isCoupleMode
                        ? "bg-emerald-600 text-white shadow-xs"
                        : isCoupleMode
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                        : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                    }`}
                  >
                    <Users size={14} />
                    <span>👥 Group Saver (30% OFF • 12 Seats)</span>
                  </button>
                </div>
              </div>

              {/* STRICT VERIFICATION NOTICE FOR COUPLE MODE */}
              {isCoupleMode && (
                <div className="mt-4 pt-3.5 border-t border-rose-500/20 text-xs text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-amber-300 block">
                        Mandatory Stand-side Verification Clause:
                      </span>
                      <span>
                        Couple ticket discount requires 1 Male (👨) + 1 Female (👩). Physical presence of the female traveller is mandatory at the boarding point.{" "}
                        <strong className="text-white">
                          If no female traveller is present at the stand, 35% discount is void and full fare must be paid.
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-900/60 border border-rose-400/30">
                    <UserCheck size={14} className="text-rose-300" />
                    <span className="font-bold text-[11px] text-white">
                      Female Status:{" "}
                      {hasFemalePassenger ? (
                        <span className="text-emerald-400 font-black">Approved (👩 {femaleCount})</span>
                      ) : (
                        <span className="text-rose-300 font-black">Pending (Add 1 👩)</span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* SEAT CATEGORY (DECK) TABS */}
            <div
              className={`mb-6 rounded-3xl p-3 border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 ${
                isCoupleMode
                  ? "bg-slate-900/90 border-rose-500/30 text-white"
                  : "bg-white border-slate-200/90 text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isCoupleMode ? "bg-rose-500/20 text-rose-300" : "bg-orange-500/10 text-orange-600"
                  }`}
                >
                  <Layers size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Select Seat Category:
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveDeck("all")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeDeck === "all"
                      ? isCoupleMode
                        ? "bg-rose-600 text-white"
                        : "bg-slate-900 text-white shadow-sm"
                      : isCoupleMode
                      ? "bg-slate-800 text-rose-200 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>All Cabins ({totalSeats})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDeck("lower")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeDeck === "lower"
                      ? "bg-blue-600 text-white shadow-sm"
                      : isCoupleMode
                      ? "bg-blue-950/40 text-blue-300 hover:bg-blue-900/50 border border-blue-400/20"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60"
                  }`}
                >
                  <Armchair size={14} />
                  <span>Lower Seater (₹{seaterFare})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDeck("upper")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeDeck === "upper"
                      ? "bg-purple-600 text-white shadow-sm"
                      : isCoupleMode
                      ? "bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 border border-purple-400/20"
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60"
                  }`}
                >
                  <BedDouble size={14} />
                  <span>Upper Sleeper (₹{sleeperFare})</span>
                </button>
              </div>
            </div>

            {/* ROUTE DISTANCE & 450+ KM CATERING CALLOUT */}
            <div
              className={`mb-6 p-4 rounded-2xl border transition-all ${
                isCoupleMode
                  ? "bg-slate-900/80 border-rose-500/30 text-white"
                  : isLongRoute
                  ? "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-orange-300 shadow-sm text-slate-900"
                  : "bg-white border-slate-200 shadow-xs text-slate-900"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isCoupleMode
                        ? "bg-rose-600 text-white"
                        : isLongRoute
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Utensils size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                        Route Distance:
                      </span>
                      <span
                        className={`text-xs font-black font-mono px-2 py-0.5 rounded-md border ${
                          isCoupleMode
                            ? "bg-slate-800 border-rose-500/30 text-rose-200"
                            : "bg-white border-slate-200 text-slate-800"
                        }`}
                      >
                        {routeDistanceRaw || (distanceKm ? `${distanceKm} km` : "Intercity Express")}
                      </span>
                      {isLongRoute ? (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-600 text-white">
                          450+ KM Long Journey Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500/20">
                          Direct Route
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${isCoupleMode ? "text-rose-200/70" : "text-slate-600"}`}>
                      {isLongRoute
                        ? "Special highway meal & refreshment service available for your long route! Add fresh tea, coffee, or dinner plate below."
                        : "Complimentary drinking water provided. Highway dinner plate & beverages available for 450+ km long journeys."}
                    </p>
                  </div>
                </div>

                {!isLongRoute && (
                  <button
                    type="button"
                    onClick={() => setShowAddonsManual(!showAddonsManual)}
                    className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold border border-orange-200 transition"
                  >
                    {showAddonsManual ? "Hide Catering Menu" : "Preview 450+ km Catering Menu"}
                  </button>
                )}
              </div>
            </div>

            {/* LIVE PASSENGER COUNTER STRIP */}
            {selected.length > 0 && (
              <div
                className={`mb-6 p-4 rounded-2xl text-white shadow-md flex flex-wrap items-center justify-between gap-4 animate-fade-in border ${
                  isCoupleMode
                    ? "bg-gradient-to-r from-rose-950 via-pink-900 to-rose-950 border-rose-500/50 shadow-rose-950/60"
                    : "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isCoupleMode ? "bg-rose-500/30 text-rose-300" : "bg-white/10 text-orange-400"
                    }`}
                  >
                    <Users size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                      Live Passenger Count
                    </span>
                    <h4 className="text-sm sm:text-base font-extrabold text-white">
                      {selected.length} {selected.length === 1 ? "Seat Selected" : "Seats Selected"} (
                      {seaterSelected.length > 0 ? `${seaterSelected.length} Seater` : ""}
                      {seaterSelected.length > 0 && sleeperSelected.length > 0 ? ", " : ""}
                      {sleeperSelected.length > 0 ? `${sleeperSelected.length} Sleeper` : ""})
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold text-xs sm:text-sm">
                    <span className="text-base">👨</span>
                    <span>
                      Male: <strong className="text-white text-base font-mono">{maleCount}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-300 font-bold text-xs sm:text-sm">
                    <span className="text-base">👩</span>
                    <span>
                      Female: <strong className="text-white text-base font-mono">{femaleCount}</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ================= LEFT SIDE: CABIN LAYOUT & CATERING ================= */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. CABIN SEAT MATRIX */}
                <div
                  className={`rounded-3xl shadow-sm border p-6 sm:p-8 transition-all ${
                    isCoupleMode
                      ? "bg-slate-900/90 border-rose-500/30 text-white shadow-rose-950/40"
                      : "bg-white border-slate-200/90 text-slate-900"
                  }`}
                >
                  {/* Cabin Header & Driver */}
                  <div className="border-b border-slate-200/30 pb-5 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isCoupleMode ? "bg-rose-950 text-rose-300 border border-rose-500/30" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <BusFront size={22} />
                      </div>
                      <div>
                        <h3 className="font-black text-base">
                          {bus?.bus_name || bus?.bus?.bus_name || "Volvo AC Luxury Coach"}
                        </h3>
                        <p className={`text-xs ${isCoupleMode ? "text-rose-200/70" : "text-slate-400"}`}>
                          Front Cockpit & Driver Cabin
                        </p>
                      </div>
                    </div>

                    {/* Steering Wheel / Driver Box */}
                    <div className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Driver Cabin</span>
                    </div>
                  </div>

                  {/* Windshield indicator line */}
                  <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-slate-300/40 to-transparent rounded-full mb-6"></div>

                  {/* SECTION 1: LOWER DECK (SEATER - LOW RATE) */}
                  {(activeDeck === "all" || activeDeck === "lower") && (
                    <div className="mb-8">
                      <div
                        className={`mb-4 flex items-center justify-between px-3 py-2 rounded-xl border ${
                          isCoupleMode
                            ? "bg-blue-950/40 border-blue-400/30 text-blue-200"
                            : "bg-blue-50/70 border-blue-100 text-blue-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-extrabold text-xs">
                          <Armchair size={15} className="text-blue-400" />
                          <span>LOWER DECK • PUSHBACK SEATER</span>
                        </div>
                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          ₹{seaterFare} (Low Rate)
                        </span>
                      </div>

                      <div className="space-y-3 max-w-md mx-auto">
                        {Array.from({ length: halfRows }, (_, rIndex) => {
                          const row = rIndex;
                          const rowSeats = seats.slice(row * 4, row * 4 + 4);
                          const leftSeats = rowSeats.slice(0, 2);
                          const rightSeats = rowSeats.slice(2, 4);

                          return (
                            <div key={`lower_${row}`} className="flex items-center justify-between gap-3 sm:gap-6">
                              {/* Left Pair (A, B) */}
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
                                {leftSeats.map((seat) => {
                                  const isBooked = bookedSeats.includes(seat);
                                  const isSelected = selected.includes(seat);
                                  const gender = seatGenders[seat] || "Male";

                                  return (
                                    <button
                                      key={seat}
                                      type="button"
                                      disabled={isBooked}
                                      onClick={() => handleSeat(seat)}
                                      className={`
                                        relative w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 font-bold text-xs shadow-xs
                                        ${
                                          isBooked
                                            ? "bg-slate-800/40 border border-slate-700 text-slate-500 cursor-not-allowed"
                                            : isSelected
                                            ? isCoupleMode
                                              ? "bg-gradient-to-br from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/40 scale-105 ring-2 ring-rose-300"
                                              : gender === "Female"
                                              ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30 scale-105 ring-2 ring-rose-300"
                                              : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105 ring-2 ring-blue-300"
                                            : isCoupleMode
                                            ? "bg-slate-800/80 border-2 border-rose-500/30 hover:border-rose-400 text-rose-100 active:scale-95"
                                            : "bg-white border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 active:scale-95"
                                        }
                                      `}
                                    >
                                      {isBooked ? (
                                        <Lock size={14} className="text-slate-500" />
                                      ) : isSelected ? (
                                        <span className="text-[12px] leading-none mb-0.5">
                                          {isCoupleMode ? "💑" : gender === "Female" ? "👩" : "👨"}
                                        </span>
                                      ) : (
                                        <Armchair size={15} />
                                      )}
                                      <span className="text-[11px] mt-0.5">{seat}</span>

                                      <span className="text-[8px] opacity-75 block scale-90 -mt-0.5">
                                        ₹{seaterFare}
                                      </span>

                                      {isSelected && (
                                        <span
                                          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-black ${
                                            gender === "Female"
                                              ? "bg-rose-200 text-rose-800"
                                              : "bg-blue-200 text-blue-900"
                                          }`}
                                        >
                                          {gender === "Female" ? "F" : "M"}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Gangway */}
                              <div
                                className={`w-8 sm:w-10 text-center text-[10px] font-bold uppercase tracking-widest shrink-0 py-2 rounded-lg border ${
                                  isCoupleMode
                                    ? "bg-slate-800/80 border-slate-700 text-rose-300/50"
                                    : "bg-slate-50 border-slate-100 text-slate-300"
                                }`}
                              >
                                {row + 1}
                              </div>

                              {/* Right Pair (C, D) */}
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-start">
                                {rightSeats.map((seat) => {
                                  const isBooked = bookedSeats.includes(seat);
                                  const isSelected = selected.includes(seat);
                                  const gender = seatGenders[seat] || "Male";

                                  return (
                                    <button
                                      key={seat}
                                      type="button"
                                      disabled={isBooked}
                                      onClick={() => handleSeat(seat)}
                                      className={`
                                        relative w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 font-bold text-xs shadow-xs
                                        ${
                                          isBooked
                                            ? "bg-slate-800/40 border border-slate-700 text-slate-500 cursor-not-allowed"
                                            : isSelected
                                            ? isCoupleMode
                                              ? "bg-gradient-to-br from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/40 scale-105 ring-2 ring-rose-300"
                                              : gender === "Female"
                                              ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30 scale-105 ring-2 ring-rose-300"
                                              : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105 ring-2 ring-blue-300"
                                            : isCoupleMode
                                            ? "bg-slate-800/80 border-2 border-rose-500/30 hover:border-rose-400 text-rose-100 active:scale-95"
                                            : "bg-white border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 active:scale-95"
                                        }
                                      `}
                                    >
                                      {isBooked ? (
                                        <Lock size={14} className="text-slate-500" />
                                      ) : isSelected ? (
                                        <span className="text-[12px] leading-none mb-0.5">
                                          {isCoupleMode ? "💑" : gender === "Female" ? "👩" : "👨"}
                                        </span>
                                      ) : (
                                        <Armchair size={15} />
                                      )}
                                      <span className="text-[11px] mt-0.5">{seat}</span>

                                      <span className="text-[8px] opacity-75 block scale-90 -mt-0.5">
                                        ₹{seaterFare}
                                      </span>

                                      {isSelected && (
                                        <span
                                          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-black ${
                                            gender === "Female"
                                              ? "bg-rose-200 text-rose-800"
                                              : "bg-blue-200 text-blue-900"
                                          }`}
                                        >
                                          {gender === "Female" ? "F" : "M"}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: UPPER DECK (SLEEPER - HIGH RATE) */}
                  {(activeDeck === "all" || activeDeck === "upper") && (
                    <div>
                      <div
                        className={`mb-4 flex items-center justify-between px-3 py-2 rounded-xl border ${
                          isCoupleMode
                            ? "bg-rose-950/60 border-rose-500/40 text-rose-200"
                            : "bg-purple-50/70 border-purple-100 text-purple-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-extrabold text-xs">
                          <BedDouble size={15} className={isCoupleMode ? "text-rose-400" : "text-purple-600"} />
                          <span>UPPER DECK • LUXURY SLEEPER BERTHS</span>
                        </div>
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-md border ${
                            isCoupleMode
                              ? "bg-rose-500/20 text-rose-300 border-rose-400/30"
                              : "bg-purple-500/20 text-purple-700 border-purple-200"
                          }`}
                        >
                          ₹{sleeperFare} (High Rate)
                        </span>
                      </div>

                      <div className="space-y-3 max-w-md mx-auto">
                        {Array.from({ length: rowCount - halfRows }, (_, rIndex) => {
                          const row = halfRows + rIndex;
                          const rowSeats = seats.slice(row * 4, row * 4 + 4);
                          const leftSeats = rowSeats.slice(0, 2);
                          const rightSeats = rowSeats.slice(2, 4);

                          return (
                            <div key={`upper_${row}`} className="flex items-center justify-between gap-3 sm:gap-6">
                              {/* Left Pair (A, B) */}
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
                                {leftSeats.map((seat) => {
                                  const isBooked = bookedSeats.includes(seat);
                                  const isSelected = selected.includes(seat);
                                  const gender = seatGenders[seat] || "Male";

                                  return (
                                    <button
                                      key={seat}
                                      type="button"
                                      disabled={isBooked}
                                      onClick={() => handleSeat(seat)}
                                      className={`
                                        relative w-12 sm:w-16 h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 font-bold text-xs shadow-xs
                                        ${
                                          isBooked
                                            ? "bg-slate-800/40 border border-slate-700 text-slate-500 cursor-not-allowed"
                                            : isSelected
                                            ? isCoupleMode
                                              ? "bg-gradient-to-br from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/40 scale-105 ring-2 ring-rose-300"
                                              : gender === "Female"
                                              ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30 scale-105 ring-2 ring-rose-300"
                                              : "bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-500/30 scale-105 ring-2 ring-purple-300"
                                            : isCoupleMode
                                            ? "bg-slate-800/80 border-2 border-rose-500/40 hover:border-rose-400 text-rose-100 active:scale-95"
                                            : "bg-white border-2 border-purple-200/80 hover:border-purple-500 hover:text-purple-700 text-slate-800 active:scale-95"
                                        }
                                      `}
                                    >
                                      {isBooked ? (
                                        <Lock size={14} className="text-slate-500" />
                                      ) : isSelected ? (
                                        <span className="text-[12px] leading-none mb-0.5">
                                          {isCoupleMode ? "💑" : gender === "Female" ? "👩" : "👨"}
                                        </span>
                                      ) : (
                                        <BedDouble size={16} className={isCoupleMode ? "text-rose-400" : "text-purple-600"} />
                                      )}
                                      <span className="text-[11px] mt-0.5 font-black">{seat}</span>

                                      <span
                                        className={`text-[8px] font-semibold block scale-90 -mt-0.5 ${
                                          isCoupleMode ? "text-rose-300" : "text-purple-600"
                                        }`}
                                      >
                                        ₹{sleeperFare}
                                      </span>

                                      {isSelected && (
                                        <span
                                          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-black ${
                                            gender === "Female"
                                              ? "bg-rose-200 text-rose-800"
                                              : "bg-blue-200 text-blue-900"
                                          }`}
                                        >
                                          {gender === "Female" ? "F" : "M"}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Gangway */}
                              <div
                                className={`w-8 sm:w-10 text-center text-[10px] font-bold uppercase tracking-widest shrink-0 py-2 rounded-lg border ${
                                  isCoupleMode
                                    ? "bg-slate-800/80 border-slate-700 text-rose-400/50"
                                    : "bg-purple-50 border-purple-100 text-purple-400"
                                }`}
                              >
                                {row + 1}
                              </div>

                              {/* Right Pair (C, D) */}
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-start">
                                {rightSeats.map((seat) => {
                                  const isBooked = bookedSeats.includes(seat);
                                  const isSelected = selected.includes(seat);
                                  const gender = seatGenders[seat] || "Male";

                                  return (
                                    <button
                                      key={seat}
                                      type="button"
                                      disabled={isBooked}
                                      onClick={() => handleSeat(seat)}
                                      className={`
                                        relative w-12 sm:w-16 h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 font-bold text-xs shadow-xs
                                        ${
                                          isBooked
                                            ? "bg-slate-800/40 border border-slate-700 text-slate-500 cursor-not-allowed"
                                            : isSelected
                                            ? isCoupleMode
                                              ? "bg-gradient-to-br from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/40 scale-105 ring-2 ring-rose-300"
                                              : gender === "Female"
                                              ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30 scale-105 ring-2 ring-rose-300"
                                              : "bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-500/30 scale-105 ring-2 ring-purple-300"
                                            : isCoupleMode
                                            ? "bg-slate-800/80 border-2 border-rose-500/40 hover:border-rose-400 text-rose-100 active:scale-95"
                                            : "bg-white border-2 border-purple-200/80 hover:border-purple-500 hover:text-purple-700 text-slate-800 active:scale-95"
                                        }
                                      `}
                                    >
                                      {isBooked ? (
                                        <Lock size={14} className="text-slate-500" />
                                      ) : isSelected ? (
                                        <span className="text-[12px] leading-none mb-0.5">
                                          {isCoupleMode ? "💑" : gender === "Female" ? "👩" : "👨"}
                                        </span>
                                      ) : (
                                        <BedDouble size={16} className={isCoupleMode ? "text-rose-400" : "text-purple-600"} />
                                      )}
                                      <span className="text-[11px] mt-0.5 font-black">{seat}</span>

                                      <span
                                        className={`text-[8px] font-semibold block scale-90 -mt-0.5 ${
                                          isCoupleMode ? "text-rose-300" : "text-purple-600"
                                        }`}
                                      >
                                        ₹{sleeperFare}
                                      </span>

                                      {isSelected && (
                                        <span
                                          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-black ${
                                            gender === "Female"
                                              ? "bg-rose-200 text-rose-800"
                                              : "bg-purple-200 text-purple-900"
                                          }`}
                                        >
                                          {gender === "Female" ? "F" : "M"}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Rear Indicator */}
                  <div
                    className={`mt-8 pt-4 border-t text-center text-xs font-medium ${
                      isCoupleMode ? "border-slate-800 text-rose-300/40" : "border-slate-100 text-slate-400"
                    }`}
                  >
                    Rear of the Coach
                  </div>
                </div>

                {/* 2. HIGHWAY CATERING & REFRESHMENTS SECTION (450+ KM ADDONS) */}
                {enableAddons && (
                  <div
                    className={`rounded-3xl shadow-sm border p-6 sm:p-7 relative overflow-hidden animate-fade-in ${
                      isCoupleMode
                        ? "bg-slate-900/90 border-rose-500/30 text-white"
                        : "bg-white border-orange-200/80 text-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200/30 mb-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            isCoupleMode
                              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                              : "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                          }`}
                        >
                          <Coffee size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-base">
                              Highway Catering & Travel Add-ons
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isCoupleMode
                                  ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                                  : "bg-orange-100 text-orange-700 border border-orange-200"
                              }`}
                            >
                              450+ KM Route Special
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 ${isCoupleMode ? "text-rose-200/70" : "text-slate-500"}`}>
                            Delivered fresh & steaming hot to your seat at certified highway food plazas
                          </p>
                        </div>
                      </div>

                      {addonsCount > 0 && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {addonsCount} Items Selected (₹{addonsTotal})
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {CATERING_MENU.map((item) => {
                        const count = addons[item.id] || 0;
                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-2xl border transition-all ${
                              count > 0
                                ? isCoupleMode
                                  ? "bg-rose-950/60 border-rose-500/60 ring-1 ring-rose-400"
                                  : "bg-orange-50/60 border-orange-300 ring-1 ring-orange-300"
                                : isCoupleMode
                                ? "bg-slate-800/60 border-slate-700/80 hover:bg-slate-800"
                                : "bg-slate-50/80 border-slate-200/80 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2.5">
                                <span className="text-2xl mt-0.5">{item.icon}</span>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="text-xs sm:text-sm font-bold leading-tight">
                                      {item.name}
                                    </h4>
                                    <span
                                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                        item.veg
                                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                          : "bg-rose-50 text-rose-700 border border-rose-200"
                                      }`}
                                    >
                                      {item.tag}
                                    </span>
                                  </div>
                                  <p
                                    className={`text-[11px] mt-0.5 line-clamp-2 ${
                                      isCoupleMode ? "text-rose-200/70" : "text-slate-500"
                                    }`}
                                  >
                                    {item.desc}
                                  </p>
                                  <span className="text-xs font-black block mt-1.5">
                                    ₹{item.price}
                                  </span>
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div
                                className={`flex items-center gap-1.5 p-1 rounded-xl border shadow-2xs shrink-0 self-center ${
                                  isCoupleMode
                                    ? "bg-slate-900 border-slate-700"
                                    : "bg-white border-slate-200"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => updateAddon(item.id, -1)}
                                  disabled={count === 0}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition ${
                                    count === 0
                                      ? "opacity-30 cursor-not-allowed"
                                      : "hover:bg-rose-500 hover:text-white"
                                  }`}
                                >
                                  <Minus size={12} />
                                </button>

                                <span className="w-5 text-center font-bold text-xs font-mono">
                                  {count}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => updateAddon(item.id, 1)}
                                  className="w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-xs font-bold shadow-2xs transition"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ================= RIGHT SIDE: STICKY JOURNEY SUMMARY ================= */}
              <div className="lg:col-span-5 sticky top-28 space-y-6">
                <div
                  className={`rounded-3xl shadow-sm border p-6 sm:p-7 transition-all ${
                    isCoupleMode
                      ? "bg-slate-900/90 border-rose-500/30 text-white shadow-rose-950/40"
                      : "bg-white border-slate-200/90 text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200/30 mb-5">
                    <h3 className="text-xl font-black flex items-center gap-2">
                      <span>Journey Summary</span>
                      {isCoupleMode && <span>💕</span>}
                    </h3>
                    {discountPercent > 0 && (
                      <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                        {discountPercent}% Discount Applied
                      </span>
                    )}
                  </div>

                  {/* Trip Details Card */}
                  <div
                    className={`rounded-2xl p-4 border space-y-3 mb-6 ${
                      isCoupleMode
                        ? "bg-slate-800/80 border-slate-700 text-rose-100"
                        : "bg-slate-50 border-slate-100 text-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-70 font-medium">Route:</span>
                      <span className="font-bold capitalize">
                        {bus?.source_city || bus?.route?.source_city || "Jaipur"} → {bus?.destination_city || bus?.route?.distance_city || "Delhi"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-70 font-medium">Distance:</span>
                      <span className="font-bold">
                        {routeDistanceRaw || (distanceKm ? `${distanceKm} km` : "280 km Direct")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-70 font-medium">Departure:</span>
                      <span className="font-bold">
                        {bus?.departure_time || "09:00 PM"}
                      </span>
                    </div>

                    {bus?.trip_date && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="opacity-70 font-medium">Travel Date:</span>
                        <span className="font-bold">
                          {new Date(bus.trip_date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Selected Seats Badges */}
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-2">
                      Selected Seats ({selected.length})
                    </span>
                    {selected.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selected.map((seat) => {
                          const gender = seatGenders[seat] || "Male";
                          const isSleeper = isSleeperSeat(seat);
                          return (
                            <span
                              key={seat}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border ${
                                isCoupleMode
                                  ? "bg-rose-950/80 border-rose-500/50 text-rose-200"
                                  : isSleeper
                                  ? "bg-purple-50 border-purple-200 text-purple-800"
                                  : "bg-blue-50 border-blue-200 text-blue-800"
                              }`}
                            >
                              <span>{isCoupleMode ? "💑" : isSleeper ? "🛏️" : "💺"}</span>
                              <span>
                                {seat} ({isSleeper ? "Sleeper" : "Seater"} • ₹{getSeatFare(seat)}) {gender === "Female" ? "👩" : "👨"}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeSeat(seat)}
                                className="ml-1 opacity-60 hover:opacity-100 transition"
                                title="Remove seat"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <div
                        className={`p-3 rounded-xl border border-dashed text-xs text-center font-medium ${
                          isCoupleMode
                            ? "bg-slate-800/40 border-slate-700 text-slate-500"
                            : "bg-slate-50 border-slate-200 text-slate-400"
                        }`}
                      >
                        Click on available seats on the layout to select
                      </div>
                    )}
                  </div>

                  {/* Passenger Gender Details */}
                  {selected.length > 0 && (
                    <div className="mb-6 border-t border-slate-200/30 pt-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider block">
                          Passenger Gender Assignment
                        </span>
                        <span className="text-[11px] opacity-75">
                          {maleCount} Male, {femaleCount} Female
                        </span>
                      </div>

                      {/* Validation Warning Callout for Couple Mode */}
                      {isCoupleMode && !hasFemalePassenger && (
                        <div className="mb-3 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                          <AlertTriangle size={15} className="text-amber-400 shrink-0" />
                          <span>
                            <strong>Female Passenger Required:</strong> Set at least 1 passenger to Female (👩) to approve 35% discount.
                          </span>
                        </div>
                      )}

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {selected.map((seat) => {
                          const currentGender = seatGenders[seat] || "Male";
                          const isSleeper = isSleeperSeat(seat);
                          return (
                            <div
                              key={seat}
                              className={`flex items-center justify-between p-2.5 rounded-xl border ${
                                isCoupleMode
                                  ? "bg-slate-800/80 border-slate-700"
                                  : "bg-slate-50 border-slate-200/80"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                    isCoupleMode
                                      ? "bg-rose-900 text-rose-200"
                                      : isSleeper
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {seat}
                                </div>
                                <div className="text-left">
                                  <span className="text-xs font-bold block">
                                    Seat {seat}
                                  </span>
                                  <span className="text-[10px] opacity-70">
                                    {isSleeper ? "Sleeper Berth" : "Seater Chair"} • ₹{getSeatFare(seat)}
                                  </span>
                                </div>
                              </div>

                              <div
                                className={`flex items-center gap-1 p-1 rounded-xl border shadow-2xs ${
                                  isCoupleMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => setGenderForSeat(seat, "Male")}
                                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                    currentGender === "Male"
                                      ? "bg-blue-600 text-white"
                                      : "opacity-60 hover:opacity-100"
                                  }`}
                                >
                                  <span>👨 M</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setGenderForSeat(seat, "Female")}
                                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                    currentGender === "Female"
                                      ? "bg-rose-500 text-white"
                                      : "opacity-60 hover:opacity-100"
                                  }`}
                                >
                                  <span>👩 F</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Price Calculation Breakdown */}
                  <div className="border-t border-slate-200/30 pt-4 space-y-2.5 text-sm">
                    {seaterSelected.length > 0 && (
                      <div className="flex justify-between">
                        <span className="opacity-80">Lower Seater ({seaterSelected.length} × ₹{seaterFare})</span>
                        <span className="font-semibold">
                          ₹{seaterSelected.length * seaterFare}
                        </span>
                      </div>
                    )}

                    {sleeperSelected.length > 0 && (
                      <div className="flex justify-between">
                        <span className="opacity-80">Upper Sleeper ({sleeperSelected.length} × ₹{sleeperFare})</span>
                        <span className="font-semibold">
                          ₹{sleeperSelected.length * sleeperFare}
                        </span>
                      </div>
                    )}

                    {/* DISCOUNT ROW */}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-bold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                        <span className="flex items-center gap-1">
                          <Sparkles size={14} />
                          <span>
                            {isCoupleMode ? "Couple Privilege (35% OFF)" : "Group Saver Discount (30% OFF)"}
                          </span>
                        </span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}

                    {/* Pending Verification Notice */}
                    {isCoupleMode && !isCoupleApproved && (
                      <div className="text-[11px] text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        *35% Couple Discount unlocked when 1 Female passenger is assigned.
                      </div>
                    )}

                    {addonsTotal > 0 && (
                      <div className="flex justify-between text-orange-400 font-medium">
                        <span>Highway Catering ({addonsCount} items)</span>
                        <span className="font-bold">
                          +₹{addonsTotal}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between opacity-80">
                      <span>GST & Highway Taxes</span>
                      <span className="font-semibold text-emerald-400">
                        ₹0 (Waived)
                      </span>
                    </div>

                    <div className="border-t border-slate-200/30 pt-3 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs uppercase font-bold opacity-70 block">
                          Total Amount Payable
                        </span>
                        <span
                          className={`text-2xl font-black ${
                            isCoupleMode ? "text-rose-400" : "text-orange-500"
                          }`}
                        >
                          ₹{grandTotal}
                        </span>
                      </div>
                      {discountAmount > 0 ? (
                        <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                          Saved ₹{discountAmount}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          Best Fare Guaranteed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Proceed Button */}
                  <button
                    type="button"
                    onClick={handleProceed}
                    disabled={selected.length === 0}
                    className={`
                      w-full mt-6 py-4 rounded-2xl font-black text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-98
                      ${
                        selected.length === 0
                          ? "bg-slate-700 text-slate-400 cursor-not-allowed shadow-none"
                          : isCoupleMode
                          ? "bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-600/30"
                          : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25"
                      }
                    `}
                  >
                    <CreditCard size={18} />
                    <span>
                      {selected.length === 0
                        ? "Select Seats to Proceed"
                        : isCoupleMode
                        ? `Proceed with Couple Privilege ₹${grandTotal}`
                        : `Proceed to Pay ₹${grandTotal} (${maleCount}M, ${femaleCount}F)`}
                    </span>
                  </button>

                  {/* Safe checkout notice */}
                  <div
                    className={`mt-4 flex items-center justify-center gap-2 text-xs font-medium ${
                      isCoupleMode ? "text-rose-200/60" : "text-slate-400"
                    }`}
                  >
                    <ShieldCheck size={15} className="text-emerald-400" />
                    <span>256-Bit SSL Encrypted & Official Saweriya Reservation</span>
                  </div>
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
