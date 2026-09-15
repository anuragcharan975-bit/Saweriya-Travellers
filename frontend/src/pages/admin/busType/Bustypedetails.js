import React from "react";

export default function BustypeModel({ open, onClose, bustype }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Bustype Information</h2>

          <button
            onClick={onClose}
            className="text-2xl font-bold"
          >
            ×
          </button>
        </div>


      <div className="space-y-3">
          <p>
            <strong>Bustype:</strong> {bustype.bus_type}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {bustype.status ? "Active" : "Inactive"}
          </p>
        </div>

      </div>
    </div>
  );
}