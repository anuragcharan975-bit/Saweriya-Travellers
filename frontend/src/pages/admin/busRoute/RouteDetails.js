import React from "react";

export default function RouteModel({ open, onClose, route }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Route Information</h2>

          <button
            onClick={onClose}
            className="text-2xl font-bold"
          >
            ×
          </button>
        </div>


      <div className="space-y-3">
          <p>
            <strong>Route Name:</strong> {route.route_name}
          </p>

          <p>
            <strong>Source City:</strong> {route.source_city}
          </p>

          <p>
            <strong>Distance City:</strong> {route.distance_city}
          </p>

          <p>
            <strong>Boarding Point:</strong> {route.boarding_point}
          </p>

          <p>
            <strong>Dropping Point:</strong> {route.dropping_point}
          </p>

          <p>
            <strong>Distance:</strong> {route.distance}
          </p>

          <p>
            <strong>Duration:</strong> {route.duration}
          </p>

          <p>
            <strong>Price:</strong> ₹{route.fare}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {route.status ? "Active" : "Inactive"}
          </p>
        </div>

      </div>
    </div>
  );
}