import React from "react";
import { Image_url } from "../../../Config/config";

export default function BusModal({ open, onClose, bus }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <div className="relative z-[10000] bg-white rounded-lg shadow-2xl w-full max-w-md p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Bus Information</h2>

          <button
            onClick={onClose}
            className="text-2xl font-bold hover:text-red-500"
          >
            ×
          </button>
        </div>

        <img
          src={`${Image_url}/${bus.bus_image}`}
          alt={bus.bus_name}
          className="w-full h-48 object-cover rounded"
        />

        <div className="mt-4 space-y-2">
          <p><strong>Register No:</strong> {bus.register_number}</p>
          <p><strong>Bus Name:</strong> {bus.bus_name}</p>
          <p><strong>Bus Type:</strong> {bus.bus_type?.bus_type}</p>
          <p><strong>Model:</strong> {bus.model}</p>
          <p><strong>Total Seats:</strong> {bus.total_seats}</p>
          <p>
            <strong>Status:</strong>{" "}
            {bus.status ? "Active" : "Inactive"}
          </p>
        </div>

      </div>
    </div>
  );
}