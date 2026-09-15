import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Armchair, BusFront } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

export default function BusSeat() {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================================
  // BUS DATA
  // =========================================

  const bus = location.state?.bus;

  // =========================================
  // TOTAL SEATS
  // =========================================

  const totalSeats =
    Number(bus?.total_seats) ||
    Number(bus?.bus?.total_seats) ||
    50;

  // =========================================
  // GENERATE SEAT NUMBERS
  // =========================================
  // Example for 50 seats:
  //
  // 1A  1B  1C  1D
  // 2A  2B  2C  2D
  // ...
  // 12A 12B 12C 12D
  // 13A 13B
  //
  // Total = 50

  const seatLetters = ["A", "B", "C", "D"];

  const seats = Array.from(
    { length: totalSeats },
    (_, index) => {
      const row = Math.floor(index / 4) + 1;
      const column = index % 4;

      return `${row}${seatLetters[column]}`;
    }
  );

  // =========================================
  // DEFAULT BOOKED SEATS
  // =========================================
  // Ye sirf demo/testing ke liye hain.
  // Baad mein MongoDB se booked seats aayengi.

  const initialBookedSeats = [
    "1C",
    "2B",
    "4D",
    "6A",
  ];

  // =========================================
  // LOAD BOOKED SEATS FROM LOCAL STORAGE
  // =========================================

  const getBookedSeats = () => {
    try {
      const savedSeats =
        localStorage.getItem("bookedSeats");

      if (savedSeats) {
        const parsedSeats =
          JSON.parse(savedSeats);

        if (Array.isArray(parsedSeats)) {
          return [
            ...new Set([
              ...initialBookedSeats,
              ...parsedSeats,
            ]),
          ];
        }
      }
    } catch (error) {
      console.log(
        "Error reading booked seats:",
        error
      );
    }

    return initialBookedSeats;
  };

  // =========================================
  // STATES
  // =========================================

  const [selected, setSelected] = useState([]);

  const [bookedSeats, setBookedSeats] =
    useState(getBookedSeats);

  // =========================================
  // HANDLE SEAT
  // =========================================

  const handleSeat = (seat) => {
    // Agar seat already booked hai
    // to kuch nahi karna
    if (bookedSeats.includes(seat)) {
      return;
    }

    // Agar seat already selected hai
    // to unselect karo
    if (selected.includes(seat)) {
      setSelected(
        selected.filter(
          (item) => item !== seat
        )
      );

      return;
    }

    // Seat select karo
    setSelected([
      ...selected,
      seat,
    ]);
  };

  // =========================================
  // PROCEED TO PAY
  // =========================================

  const handleProceed = () => {
    // -----------------------------------------
    // Check seat selected
    // -----------------------------------------

    if (selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Select Seat",
        text: "Please select at least one seat.",
      });

      return;
    }

    // -----------------------------------------
    // Check login
    // -----------------------------------------

    const token =
      localStorage.getItem("usertoken");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first.",
      }).then(() => {
        navigate("/login");
      });

      return;
    }

    // -----------------------------------------
    // Existing booked seats
    // -----------------------------------------

    const oldBookedSeats =
      JSON.parse(
        localStorage.getItem(
          "bookedSeats"
        ) || "[]"
      );

    // -----------------------------------------
    // Add selected seats
    // -----------------------------------------

    const updatedBookedSeats = [
      ...new Set([
        ...oldBookedSeats,
        ...initialBookedSeats,
        ...selected,
      ]),
    ];

    // -----------------------------------------
    // Update state
    // -----------------------------------------

    setBookedSeats(
      updatedBookedSeats
    );

    // -----------------------------------------
    // Save in localStorage
    // -----------------------------------------

    localStorage.setItem(
      "bookedSeats",
      JSON.stringify(
        updatedBookedSeats
      )
    );

    // -----------------------------------------
    // Console check
    // -----------------------------------------

    console.log(
      "Selected Seats:",
      selected
    );

    console.log(
      "All Booked Seats:",
      updatedBookedSeats
    );

    // -----------------------------------------
    // Navigate to Payment
    // -----------------------------------------

    navigate("/payment", {
      state: {
        booking: {
          bookingId:
            `BK${Date.now()}`,

          // Bus name
          busName:
            bus?.bus_name ||
            bus?.bus?.bus_name ||
            "Volvo AC Sleeper",

          // Route
          route:
            `${bus?.source_city || "Jaipur"} → ${bus?.destination_city ||
            "Delhi"
            }`,

          // Date
          journeyDate: bus?.trip_date || null,

          // Departure
          departure:
            bus?.departure_time ||
            "09:00 AM",

          // Arrival
          arrival:
            bus?.arrival_time ||
            "03:00 PM",

          // Selected seats
          seats: selected,

          // Number of passengers
          passengers:
            selected.length,

          // Fare per seat
          fare: 500,

          // Total
          total:
            selected.length * 500,

          // Bus ID
          busId:
            bus?._id ||
            bus?.bus?._id ||
            null,
        },
      },
    });
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <>
      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <Header />

      <div className="min-h-screen bg-slate-100 pt-24 pb-10">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

          {/* ================================= */}
          {/* LEFT SIDE - SEAT */}
          {/* ================================= */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            {/* ================================= */}
            {/* TITLE */}
            {/* ================================= */}

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Select Seat
              </h2>

              <BusFront
                size={35}
                className="text-blue-600"
              />

            </div>

            {/* ================================= */}
            {/* BUS INFORMATION */}
            {/* ================================= */}

            <div className="bg-slate-100 rounded-xl p-4 mb-6">

              <p>
                <b>Bus :</b>{" "}
                {bus?.bus_name ||
                  bus?.bus?.bus_name ||
                  "Volvo AC Sleeper"}
              </p>

              <p>
                <b>Route :</b>{" "}
                {bus?.source_city ||
                  bus?.route?.source_city ||
                  "Jaipur"}{" "}
                →{" "}
                {bus?.destination_city ||
                  bus?.route?.distance_city ||
                  "Delhi"}
              </p>

              <p>
                <b>Date :</b>{" "}
                {bus?.trip_date
                  ? new Date(bus.trip_date).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>

              <p>
                <b>Total Seats :</b>{" "}
                {totalSeats}
              </p>

            </div>

            {/* ================================= */}
            {/* DRIVER */}
            {/* ================================= */}

            <div className="flex justify-end mb-6">

              <div className="bg-black text-white px-5 py-2 rounded-xl">
                Driver
              </div>

            </div>

            {/* ================================= */}
            {/* SEAT LAYOUT */}
            {/* ================================= */}

            <div className="space-y-4">

              {Array.from(
                {
                  length:
                    Math.ceil(
                      seats.length / 4
                    ),
                },
                (_, row) => {

                  return (
                    <div
                      key={row}
                      className="grid grid-cols-4 gap-4"
                    >

                      {seats
                        .slice(
                          row * 4,
                          row * 4 + 4
                        )
                        .map((seat) => {

                          // Check booked
                          const isBooked =
                            bookedSeats.includes(
                              seat
                            );

                          // Check selected
                          const isSelected =
                            selected.includes(
                              seat
                            );

                          return (
                            <button
                              key={seat}
                              type="button"
                              disabled={
                                isBooked
                              }
                              onClick={() =>
                                handleSeat(
                                  seat
                                )
                              }
                              className={`
                                h-14
                                rounded-xl
                                flex
                                flex-col
                                justify-center
                                items-center
                                transition

                                ${isBooked
                                  ? "bg-red-500 text-white cursor-not-allowed"
                                  : isSelected
                                    ? "bg-yellow-400 text-black"
                                    : "bg-green-500 text-white hover:bg-green-600"
                                }
                              `}
                            >

                              <Armchair
                                size={20}
                              />

                              <span>
                                {seat}
                              </span>

                            </button>
                          );
                        })}

                    </div>
                  );
                }
              )}

            </div>

            {/* ================================= */}
            {/* SEAT STATUS */}
            {/* ================================= */}

            <div className="flex justify-between mt-8 text-sm">

              {/* Available */}

              <div className="flex items-center gap-2">

                <span className="w-4 h-4 bg-green-500 rounded"></span>

                Available

              </div>

              {/* Booked */}

              <div className="flex items-center gap-2">

                <span className="w-4 h-4 bg-red-500 rounded"></span>

                Booked

              </div>

              {/* Selected */}

              <div className="flex items-center gap-2">

                <span className="w-4 h-4 bg-yellow-400 rounded"></span>

                Selected

              </div>

            </div>

          </div>

          {/* ================================= */}
          {/* RIGHT SIDE - BOOKING SUMMARY */}
          {/* ================================= */}

          <div className="bg-white rounded-3xl shadow-xl p-8 h-fit">

            {/* Title */}

            <h2 className="text-2xl font-bold mb-6">
              Booking Summary
            </h2>

            {/* Selected Seats */}

            <div className="bg-slate-100 rounded-xl p-5">

              <p className="text-gray-500">
                Selected Seats
              </p>

              <h3 className="text-xl font-bold text-blue-600 mt-2">

                {selected.length > 0
                  ? selected.join(", ")
                  : "No Seat Selected"}

              </h3>

            </div>

            {/* ================================= */}
            {/* PRICE */}
            {/* ================================= */}

            <div className="mt-6 space-y-3">

              {/* Seat Fare */}

              <div className="flex justify-between">

                <span>
                  Seat Fare
                </span>

                <span>
                  ₹500
                </span>

              </div>

              {/* Total Seats */}

              <div className="flex justify-between">

                <span>
                  Total Seats
                </span>

                <span>
                  {selected.length}
                </span>

              </div>

              {/* Divider */}

              <hr />

              {/* Total */}

              <div className="flex justify-between text-xl font-bold">

                <span>
                  Total
                </span>

                <span>
                  ₹
                  {selected.length * 500}
                </span>

              </div>

            </div>

            {/* ================================= */}
            {/* PROCEED BUTTON */}
            {/* ================================= */}

            <button
              type="button"
              onClick={handleProceed}
              disabled={
                selected.length === 0
              }
              className={`
                w-full
                mt-6
                py-3
                rounded-xl
                font-semibold
                transition

                ${selected.length === 0
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                }
              `}
            >
              Proceed To Pay
            </button>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* FOOTER */}
      {/* ===================================== */}

      <Footer />
    </>
  );
}