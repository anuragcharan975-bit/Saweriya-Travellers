import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Ticket() {

  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state;

  if (!booking) {
    return (
      <>
        <Header />

        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600">
              No Ticket Found
            </h2>

            <button
              onClick={() => navigate("/")}
              className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Go Home
            </button>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 py-10">

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">

          <h1 className="text-3xl font-bold text-center text-green-600 mb-8">
            🎉 Booking Confirmed
          </h1>

          <div className="border rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-5">
              E-Ticket
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <p><strong>Booking ID :</strong></p>
              <p>{booking.bookingId}</p>

              <p><strong>Bus Name :</strong></p>
              <p>{booking.busName}</p>

              <p><strong>Route :</strong></p>
              <p>{booking.route}</p>

              <p><strong>Journey Date :</strong></p>
              <p>{booking.date || booking.journeyDate}</p>

              <p><strong>Departure :</strong></p>
              <p>{booking.departure}</p>

              <p><strong>Arrival :</strong></p>
              <p>{booking.arrival}</p>

              <p><strong>Seats :</strong></p>
              <p>{booking.seats.join(", ")}</p>

              <p><strong>Passengers :</strong></p>
              <p>{booking.passengers}</p>

              <p><strong>Total Fare :</strong></p>
              <p>₹ {booking.total}</p>

              <p><strong>Payment Status :</strong></p>
              <p className="text-green-600 font-bold">
                {booking.paymentStatus}
              </p>

            </div>

          </div>

          <div className="flex justify-center gap-5 mt-8">

            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Print Ticket
            </button>

            <button
              onClick={() => navigate("/")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
            >
              Back Home
            </button>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}