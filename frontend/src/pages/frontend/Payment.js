import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Payment() {

  const navigate = useNavigate();
  const location = useLocation();

  const booking = location.state?.booking;

  const [paymentMethod, setPaymentMethod] = useState("UPI");

  // ==========================================
  // NO BOOKING
  // ==========================================

  if (!booking) {
    return (
      <>
        <Header />

        <div className="min-h-screen flex items-center justify-center">

          <h2 className="text-3xl font-bold text-red-600">
            No Booking Found
          </h2>

        </div>

        <Footer />
      </>
    );
  }


  // ==========================================
  // PAYMENT
  // ==========================================

  const handlePayment = () => {

    // ==========================================
    // PAYMENT SUCCESS
    // ==========================================

    const paidBooking = {
      ...booking,

      paymentStatus: "Paid",

      paymentMethod: paymentMethod,

      bookingStatus: "Confirmed",

      bookedAt: new Date().toISOString(),
    };


    // ==========================================
    // GET OLD BOOKING HISTORY
    // ==========================================

    const oldHistory =
      JSON.parse(
        localStorage.getItem("bookingHistory")
      ) || [];


    // ==========================================
    // ADD NEW BOOKING
    // ==========================================

    const updatedHistory = [
      paidBooking,
      ...oldHistory,
    ];


    // ==========================================
    // SAVE BOOKING HISTORY
    // ==========================================

    localStorage.setItem(
      "bookingHistory",
      JSON.stringify(updatedHistory)
    );


    console.log(
      "BOOKING HISTORY:",
      updatedHistory
    );


    alert("Payment Successful!");


    // ==========================================
    // GO TO TICKET
    // ==========================================

    navigate("/ticket", {
      state: paidBooking,
    });

  };


  return (
    <>

      <Header />

      <div className="min-h-screen bg-gray-100 py-10">

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">


          {/* ==========================================
              TITLE
          ========================================== */}

          <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">

            Payment

          </h1>


          {/* ==========================================
              BOOKING SUMMARY
          ========================================== */}

          <div className="border rounded-lg p-6 mb-8">

            <h2 className="text-xl font-semibold mb-5">

              Booking Summary

            </h2>


            <div className="grid grid-cols-2 gap-4">


              <p>
                <strong>Booking ID :</strong>
              </p>

              <p>
                {booking.bookingId}
              </p>


              <p>
                <strong>Bus Name :</strong>
              </p>

              <p>
                {booking.busName}
              </p>


              <p>
                <strong>Route :</strong>
              </p>

              <p>
                {booking.route}
              </p>


              <p>
                <strong>Journey Date :</strong>
              </p>

              <p>
                {booking.journeyDate}
              </p>


              <p>
                <strong>Departure :</strong>
              </p>

              <p>
                {booking.departure}
              </p>


              <p>
                <strong>Arrival :</strong>
              </p>

              <p>
                {booking.arrival}
              </p>


              <p>
                <strong>Seats :</strong>
              </p>

              <p>
                {booking.seats?.join(", ")}
              </p>


              <p>
                <strong>Passengers :</strong>
              </p>

              <p>
                {booking.passengers}
              </p>


              <p>
                <strong>Fare :</strong>
              </p>

              <p>
                ₹ {booking.fare}
              </p>

            </div>


            <hr className="my-5" />


            <div className="flex justify-between text-2xl font-bold">

              <span>
                Total Amount
              </span>

              <span className="text-green-600">

                ₹ {booking.total}

              </span>

            </div>

          </div>


          {/* ==========================================
              PAYMENT METHOD
          ========================================== */}

          <div className="border rounded-lg p-6">

            <h2 className="text-xl font-semibold mb-4">

              Select Payment Method

            </h2>


            <div className="space-y-3">


              {/* UPI */}

              <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">

                <input
                  type="radio"
                  checked={paymentMethod === "UPI"}
                  onChange={() =>
                    setPaymentMethod("UPI")
                  }
                />

                UPI

              </label>


              {/* CARD */}

              <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">

                <input
                  type="radio"
                  checked={paymentMethod === "Card"}
                  onChange={() =>
                    setPaymentMethod("Card")
                  }
                />

                Credit / Debit Card

              </label>


              {/* NET BANKING */}

              <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">

                <input
                  type="radio"
                  checked={
                    paymentMethod === "Net Banking"
                  }
                  onChange={() =>
                    setPaymentMethod("Net Banking")
                  }
                />

                Net Banking

              </label>


              {/* WALLET */}

              <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">

                <input
                  type="radio"
                  checked={
                    paymentMethod === "Wallet"
                  }
                  onChange={() =>
                    setPaymentMethod("Wallet")
                  }
                />

                Wallet

              </label>

            </div>

          </div>


          {/* ==========================================
              BUTTONS
          ========================================== */}

          <div className="flex justify-between mt-8">


            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
            >

              Back

            </button>


            <button
              onClick={handlePayment}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg"
            >

              Pay ₹ {booking.total}

            </button>

          </div>

        </div>

      </div>

      <Footer />

    </>
  );
}