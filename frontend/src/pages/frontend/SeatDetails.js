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

  // Sleeper berth rate: high rate (+55% or premium luxury berth)
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

  // High-way Catering menu (Tea, Coffee, Dinner plate, Snacks, Mineral water)
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

  // Calculate live male & female counts
  const maleCount = selected.filter(
    (s) => (seatGenders[s] || "Male") === "Male"
  ).length;

  const femaleCount = selected.filter(
    (s) => seatGenders[s] === "Female"
  ).length;

  const seaterSelected = selected.filter((s) => !isSleeperSeat(s));
  const sleeperSelected = selected.filter((s) => isSleeperSeat(s));

  const seatsTotal = selected.reduce((sum, s) => sum + getSeatFare(s), 0);
  const grandTotal = seatsTotal + addonsTotal;

  const handleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    if (selected.includes(seat)) {
      setSelected(selected.filter((item) => item !== seat));
      const nextGenders = { ...seatGenders };
      delete nextGenders[seat];
      setSeatGenders(nextGenders);
      return;
    }

    if (selected.length >= 6) {
      Swal.fire({
        icon: "info",
        title: "Seat Limit Reached",
        text: "You can select a maximum of 6 seats per booking.",
      });
      return;
    }

    setSelected([...selected, seat]);
    setSeatGenders((prev) => ({
      ...prev,
      [seat]: "Male",
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
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
      <div>
        <Header />

        <div className="pt-28 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Header info bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                  Step 2 of 3: Seat & Service Selection
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-2 flex items-center gap-2">
                  <span>Choose Your Seats & Deck Type</span>
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                  Lower Deck Seater (Low Rate ₹{seaterFare}) & Upper Deck Sleeper Berth (High Rate ₹{sleeperFare})
                </p>
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-md border-2 border-slate-300 bg-white"></div>
                  <span className="text-slate-600">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-md bg-blue-600 shadow-xs"></div>
                  <span className="text-blue-700 font-bold">Male (👨)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-md bg-rose-500 shadow-xs"></div>
                  <span className="text-rose-700 font-bold">Female (👩)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-md bg-slate-200 text-slate-400"></div>
                  <span className="text-slate-400">Booked</span>
                </div>
              </div>
            </div>

            {/* TRIP COMPLETED / SEATS RESET NOTICE */}
            {isTripCompleted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-4 animate-fade-in shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Bus Journey Completed</h4>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      This bus has reached its destination. All coach seats have been freed and are available for new bookings!
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-200/60 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  Seats Reset
                </span>
              </div>
            )}

            {/* SEAT TYPE & DECK SELECTION TABS */}
            <div className="mb-6 bg-white rounded-3xl p-3 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <Layers size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Seat Category:
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveDeck("all")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeDeck === "all"
                      ? "bg-slate-900 text-white shadow-sm"
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
                isLongRoute
                  ? "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-orange-300 shadow-sm"
                  : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isLongRoute
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Utensils size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Route Distance:
                      </span>
                      <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800">
                        {routeDistanceRaw || (distanceKm ? `${distanceKm} km` : "Intercity Express")}
                      </span>
                      {isLongRoute ? (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-600 text-white">
                          450+ KM Long Journey Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Direct Route
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
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
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md flex flex-wrap items-center justify-between gap-4 animate-fade-in border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-orange-400 shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
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
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8">
                  {/* Cabin Header & Driver */}
                  <div className="border-b border-slate-100 pb-5 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <BusFront size={22} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base">
                          {bus?.bus_name || bus?.bus?.bus_name || "Volvo AC Luxury Coach"}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                          Front Cockpit & Driver Cabin
                        </p>
                      </div>
                    </div>

                    {/* Steering Wheel / Driver Box */}
                    <div className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Driver Cabin</span>
                    </div>
                  </div>

                  {/* Windshield indicator line */}
                  <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent rounded-full mb-6"></div>

                  {/* SECTION 1: LOWER DECK (SEATER - LOW RATE) */}
                  {(activeDeck === "all" || activeDeck === "lower") && (
                    <div className="mb-8">
                      <div className="mb-4 flex items-center justify-between px-2 bg-blue-50/70 py-2 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs">
                          <Armchair size={15} className="text-blue-600" />
                          <span>LOWER DECK • PUSHBACK SEATER</span>
                        </div>
                        <span className="text-xs font-black text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
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
                                            ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                                            : isSelected
                                            ? gender === "Female"
                                              ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30 scale-105 ring-2 ring-rose-300"
                                              : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105 ring-2 ring-blue-300"
                                            : "bg-white border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 active:scale-95"
                                        }
                                      `}
                                    >
                                      {isBooked ? (
                                        <Lock size={14} className="text-slate-400" />
                                      ) : isSelected ? (
                                        <span className="text-[12px] leading-none mb-0.5">
                                          {gender === "Female" ? "👩" : "👨"}
                                        </span>
                                      ) : (
                                        <Armchair size={15} />
                                      )}
                                      <span className="text-[11px] mt-0.5">{seat}</span>

                                      {/* Seat Type Mini Tag */}
                                      <span className="text-[8px] text-slate-400 block scale-90 -mt-0.5">
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
                              <div className="w-8 sm:w-10 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest shrink-0 py-2 bg-slate-50 rounded-lg border border-slate-100">
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
                                            ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                                            : isSelected
                                            ? gender === "Female"
                                              ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30 scale-105 ring-2 ring-rose-300"
                                              : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105 ring-2 ring-blue-300"
                                            : "bg-white border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 active:scale-95"
                                        }
                                      `}
                                    >
                                      {isBooked ? (
                                        <Lock size={14} className="text-slate-400" />
                                      ) : isSelected ? (
                                        <span className="text-[12px] leading-none mb-0.5">
                                          {gender === "Female" ? "👩" : "👨"}
                                        </span>
                                      ) : (
                                        <Armchair size={15} />
                                      )}
                                      <span className="text-[11px] mt-0.5">{seat}</span>

                                      <span className="text-[8px] text-slate-400 block scale-90 -mt-0.5">
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
                      <div className="mb-4 flex items-center justify-between px-2 bg-purple-50/70 py-2 rounded-xl border border-purple-100">
                        <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs">
                          <BedDouble size={15} className="text-purple-600" />
                          <span>UPPER DECK • LUXURY SLEEPER BERTHS</span>
                        </div>
                        <span className="text-xs font-black text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-200">
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
                                            ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                                            : isSelected
                                            ? gender === "Female"
                                              ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30 scale-105 ring-2 ring-rose-300"
                                              : "bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-500/30 scale-105 ring-2 ring-purple-300"
                                            : "bg-white border-2 border-purple-200/80 hover:border-purple-500 hover:text-purple-700 text-slate-800 active:scale-95"
                                        }
                                      `}
                                    >
                                      {isBooked ? (
                                        <Lock size={14} className="text-slate-400" />
                                      ) : isSelected ? (
                                        <span className="text-[12px] leading-none mb-0.5">
                                          {gender === "Female" ? "👩" : "👨"}
                                        </span>
                                      ) : (
                                        <BedDouble size={16} className="text-purple-600" />
                                      )}
                                      <span className="text-[11px] mt-0.5 font-black">{seat}</span>

                                      <span className="text-[8px] text-purple-600 font-semibold block scale-90 -mt-0.5">
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

                              {/* Gangway */}
                              <div className="w-8 sm:w-10 text-center text-[10px] font-bold text-purple-400 uppercase tracking-widest shrink-0 py-2 bg-purple-50 rounded-lg border border-purple-100">
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
                                            ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                                            : isSelected
                                            ? gender === "Female"
                                              ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30 scale-105 ring-2 ring-rose-300"
                                              : "bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-500/30 scale-105 ring-2 ring-purple-300"
                                            : "bg-white border-2 border-purple-200/80 hover:border-purple-500 hover:text-purple-700 text-slate-800 active:scale-95"
                                        }
                                      `}
                                    >
                                      {isBooked ? (
                                        <Lock size={14} className="text-slate-400" />
                                      ) : isSelected ? (
                                        <span className="text-[12px] leading-none mb-0.5">
                                          {gender === "Female" ? "👩" : "👨"}
                                        </span>
                                      ) : (
                                        <BedDouble size={16} className="text-purple-600" />
                                      )}
                                      <span className="text-[11px] mt-0.5 font-black">{seat}</span>

                                      <span className="text-[8px] text-purple-600 font-semibold block scale-90 -mt-0.5">
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
                  <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
                    Rear of the Coach
                  </div>
                </div>

                {/* 2. HIGHWAY CATERING & REFRESHMENTS SECTION (450+ KM ADDONS) */}
                {enableAddons && (
                  <div className="bg-white rounded-3xl shadow-sm border border-orange-200/80 p-6 sm:p-7 relative overflow-hidden animate-fade-in">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                          <Coffee size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-slate-900 text-base">
                              Highway Catering & Travel Add-ons
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                              450+ KM Route Special
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
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
                                ? "bg-orange-50/60 border-orange-300 ring-1 ring-orange-300"
                                : "bg-slate-50/80 border-slate-200/80 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2.5">
                                <span className="text-2xl mt-0.5">{item.icon}</span>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
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
                                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                                    {item.desc}
                                  </p>
                                  <span className="text-xs font-black text-slate-900 block mt-1.5">
                                    ₹{item.price}
                                  </span>
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs shrink-0 self-center">
                                <button
                                  type="button"
                                  onClick={() => updateAddon(item.id, -1)}
                                  disabled={count === 0}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition ${
                                    count === 0
                                      ? "text-slate-300 cursor-not-allowed"
                                      : "bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-700"
                                  }`}
                                >
                                  <Minus size={12} />
                                </button>

                                <span className="w-5 text-center font-bold text-xs font-mono text-slate-800">
                                  {count}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => updateAddon(item.id, 1)}
                                  className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs transition"
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
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-7">
                  <h3 className="text-xl font-black text-slate-900 mb-5">
                    Journey Summary
                  </h3>

                  {/* Trip Details Card */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Route:</span>
                      <span className="font-bold text-slate-900 capitalize">
                        {bus?.source_city || bus?.route?.source_city || "Jaipur"} → {bus?.destination_city || bus?.route?.distance_city || "Delhi"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Distance:</span>
                      <span className="font-bold text-slate-900">
                        {routeDistanceRaw || (distanceKm ? `${distanceKm} km` : "280 km Direct")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Departure:</span>
                      <span className="font-bold text-slate-900">
                        {bus?.departure_time || "09:00 PM"}
                      </span>
                    </div>

                    {bus?.trip_date && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-medium">Travel Date:</span>
                        <span className="font-bold text-slate-900">
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
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
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
                                isSleeper
                                  ? "bg-purple-50 border-purple-200 text-purple-800"
                                  : "bg-blue-50 border-blue-200 text-blue-800"
                              }`}
                            >
                              <span>{isSleeper ? "🛏️" : "💺"}</span>
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
                      <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 text-center font-medium">
                        Click on available seats on the layout to select
                      </div>
                    )}
                  </div>

                  {/* Passenger Gender Details */}
                  {selected.length > 0 && (
                    <div className="mb-6 border-t border-slate-100 pt-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                          Passenger Gender Assignment
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {maleCount} Male, {femaleCount} Female
                        </span>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {selected.map((seat) => {
                          const currentGender = seatGenders[seat] || "Male";
                          const isSleeper = isSleeperSeat(seat);
                          return (
                            <div
                              key={seat}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                    isSleeper ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {seat}
                                </div>
                                <div className="text-left">
                                  <span className="text-xs font-bold text-slate-800 block">
                                    Seat {seat}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {isSleeper ? "Sleeper Berth" : "Seater Chair"} • ₹{getSeatFare(seat)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => setGenderForSeat(seat, "Male")}
                                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                    currentGender === "Male"
                                      ? "bg-blue-600 text-white"
                                      : "text-slate-500 hover:text-slate-800"
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
                                      : "text-slate-500 hover:text-slate-800"
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
                  <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm">
                    {seaterSelected.length > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Lower Seater ({seaterSelected.length} × ₹{seaterFare})</span>
                        <span className="font-semibold text-slate-900">
                          ₹{seaterSelected.length * seaterFare}
                        </span>
                      </div>
                    )}

                    {sleeperSelected.length > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Upper Sleeper ({sleeperSelected.length} × ₹{sleeperFare})</span>
                        <span className="font-semibold text-slate-900">
                          ₹{sleeperSelected.length * sleeperFare}
                        </span>
                      </div>
                    )}

                    {addonsTotal > 0 && (
                      <div className="flex justify-between text-orange-600 font-medium">
                        <span>Highway Catering ({addonsCount} items)</span>
                        <span className="font-bold text-orange-600">
                          +₹{addonsTotal}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600">
                      <span>GST & Highway Taxes</span>
                      <span className="font-semibold text-emerald-600">
                        ₹0 (Waived)
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs uppercase font-bold text-slate-400 block">
                          Total Amount
                        </span>
                        <span className="text-2xl font-black text-slate-900">
                          ₹{grandTotal}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Best Fare Guaranteed
                      </span>
                    </div>
                  </div>

                  {/* Proceed Button */}
                  <button
                    type="button"
                    onClick={handleProceed}
                    disabled={selected.length === 0}
                    className={`
                      w-full mt-6 py-4 rounded-2xl font-bold text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-98
                      ${
                        selected.length === 0
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                          : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25"
                      }
                    `}
                  >
                    <CreditCard size={18} />
                    <span>
                      {selected.length === 0
                        ? "Select Seats to Proceed"
                        : `Proceed to Pay ₹${grandTotal} (${maleCount}M, ${femaleCount}F)`}
                    </span>
                  </button>

                  {/* Safe checkout notice */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                    <ShieldCheck size={15} className="text-emerald-500" />
                    <span>256-Bit SSL Encrypted & 100% Safe Checkout</span>
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
