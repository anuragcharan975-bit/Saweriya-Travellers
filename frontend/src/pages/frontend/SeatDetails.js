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
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { ViewSchedule } from "../../Service/admin/Schedule";

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

  const seatFare = Number(bus?.fare || bus?.route?.fare || 500);

  const seatLetters = ["A", "B", "C", "D"];

  const seats = Array.from({ length: totalSeats }, (_, index) => {
    const row = Math.floor(index / 4) + 1;
    const column = index % 4;
    return `${row}${seatLetters[column]}`;
  });

  const initialBookedSeats = ["1C", "2B", "4D", "6A"];

  const getBookedSeats = () => {
    try {
      const savedSeats = localStorage.getItem("bookedSeats");
      if (savedSeats) {
        const parsedSeats = JSON.parse(savedSeats);
        if (Array.isArray(parsedSeats)) {
          return [
            ...new Set([...initialBookedSeats, ...parsedSeats]),
          ];
        }
      }
    } catch (error) {
      console.log("Error reading booked seats:", error);
    }
    return initialBookedSeats;
  };

  const [selected, setSelected] = useState([]);
  const [seatGenders, setSeatGenders] = useState({});
  const [bookedSeats, setBookedSeats] = useState(getBookedSeats);

  // Calculate live male & female counts
  const maleCount = selected.filter(
    (s) => (seatGenders[s] || "Male") === "Male"
  ).length;

  const femaleCount = selected.filter(
    (s) => seatGenders[s] === "Female"
  ).length;

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
      [seat]: "Male", // Default new seat to Male
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

    const token = localStorage.getItem("usertoken");
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

    const oldBookedSeats = JSON.parse(
      localStorage.getItem("bookedSeats") || "[]"
    );

    const updatedBookedSeats = [
      ...new Set([...oldBookedSeats, ...initialBookedSeats, ...selected]),
    ];

    setBookedSeats(updatedBookedSeats);
    localStorage.setItem("bookedSeats", JSON.stringify(updatedBookedSeats));

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
          seatGenders: seatGenders,
          maleCount: maleCount,
          femaleCount: femaleCount,
          genderSummary: `${maleCount} Male, ${femaleCount} Female`,
          passengers: selected.length,
          fare: seatFare,
          total: selected.length * seatFare,
          total_amount: selected.length * seatFare,
          busId: activeBusObj?._id || bus?._id || null,
          scheduleId: bus?._id || bus?.schedule_id || id || null,
        },
      },
    });
  };

  const rowCount = Math.ceil(seats.length / 4);

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
                  Step 2 of 3: Seat Selection
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-2">
                  Choose Your Preferred Seats
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                  Select window or aisle seats & configure passenger gender
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

            {/* LIVE PASSENGER GENDER COUNTER STRIP */}
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
                      {selected.length} {selected.length === 1 ? "Seat Selected" : "Seats Selected"}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold text-xs sm:text-sm">
                    <span className="text-base">👨</span>
                    <span>Male: <strong className="text-white text-base font-mono">{maleCount}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-300 font-bold text-xs sm:text-sm">
                    <span className="text-base">👩</span>
                    <span>Female: <strong className="text-white text-base font-mono">{femaleCount}</strong></span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ================= LEFT SIDE: CABIN LAYOUT ================= */}
              <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8">
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
                <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent rounded-full mb-8"></div>

                {/* 2+2 Bus Layout Cabin */}
                <div className="space-y-3.5 max-w-md mx-auto">
                  {Array.from({ length: rowCount }, (_, row) => {
                    const rowSeats = seats.slice(row * 4, row * 4 + 4);
                    const leftSeats = rowSeats.slice(0, 2); // A, B
                    const rightSeats = rowSeats.slice(2, 4); // C, D

                    return (
                      <div key={row} className="flex items-center justify-between gap-3 sm:gap-6">
                        {/* Left Pair (Window A, Aisle B) */}
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
                                      : "bg-white border-2 border-slate-200 hover:border-orange-400 hover:text-orange-600 text-slate-700 active:scale-95"
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

                                {/* Gender Tag badge in corner */}
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

                        {/* Gangway / Aisle Walkway */}
                        <div className="w-8 sm:w-10 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest shrink-0 py-2 bg-slate-50 rounded-lg border border-slate-100">
                          {row + 1}
                        </div>

                        {/* Right Pair (Aisle C, Window D) */}
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
                                      : "bg-white border-2 border-slate-200 hover:border-orange-400 hover:text-orange-600 text-slate-700 active:scale-95"
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

                                {/* Gender Tag badge in corner */}
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

                {/* Back Rear indicator */}
                <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
                  Rear of the Coach
                </div>
              </div>

              {/* ================= RIGHT SIDE: STICKY SUMMARY CARD ================= */}
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
                          return (
                            <span
                              key={seat}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border ${
                                gender === "Female"
                                  ? "bg-rose-50 border-rose-200 text-rose-700"
                                  : "bg-blue-50 border-blue-200 text-blue-700"
                              }`}
                            >
                              <span>{gender === "Female" ? "👩" : "👨"}</span>
                              <span>Seat {seat} ({gender})</span>
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

                  {/* ================= PASSENGER GENDER DETAILS SECTION ================= */}
                  <div className="mb-6 border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                          Passenger Gender Details
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Specify Male or Female for each seat
                        </span>
                      </div>
                    </div>

                    {selected.length > 0 ? (
                      <div className="space-y-3">
                        {/* Visual Live Counters */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200/90 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">👨</span>
                              <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
                                  Male
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">
                                  Passengers
                                </span>
                              </div>
                            </div>
                            <span className="text-2xl font-black text-blue-700 font-mono">
                              {maleCount}
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200/90 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">👩</span>
                              <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block">
                                  Female
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">
                                  Passengers
                                </span>
                              </div>
                            </div>
                            <span className="text-2xl font-black text-rose-700 font-mono">
                              {femaleCount}
                            </span>
                          </div>
                        </div>

                        {/* Per-seat toggle selector */}
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {selected.map((seat) => {
                            const currentGender = seatGenders[seat] || "Male";
                            return (
                              <div
                                key={seat}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition"
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                      currentGender === "Female"
                                        ? "bg-rose-100 text-rose-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                                  >
                                    {seat}
                                  </div>
                                  <span className="text-xs font-bold text-slate-800">
                                    Seat {seat}
                                  </span>
                                </div>

                                {/* Toggle Buttons */}
                                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => setGenderForSeat(seat, "Male")}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                      currentGender === "Male"
                                        ? "bg-blue-600 text-white shadow-xs"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                    }`}
                                  >
                                    <span>👨</span>
                                    <span>Male</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setGenderForSeat(seat, "Female")}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                      currentGender === "Female"
                                        ? "bg-rose-500 text-white shadow-xs"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                    }`}
                                  >
                                    <span>👩</span>
                                    <span>Female</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 text-center font-medium">
                        Select seats to specify passenger gender
                      </div>
                    )}
                  </div>

                  {/* Price Calculation Breakdown */}
                  <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Fare ({selected.length} × ₹{seatFare})</span>
                      <span className="font-semibold text-slate-900">
                        ₹{selected.length * seatFare}
                      </span>
                    </div>

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
                          ₹{selected.length * seatFare}
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
                        : `Proceed to Pay ₹${selected.length * seatFare} (${maleCount}M, ${femaleCount}F)`}
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
