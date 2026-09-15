import React from "react";

export default function OfferModel({ open, onClose, offer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Offer Information</h2>

          <button
            onClick={onClose}
            className="text-2xl font-bold"
          >
            ×
          </button>
        </div>


      <div className="space-y-3">
          <p>
            <strong>Title:</strong> {offer.title}
          </p>

          <p>
            <strong>Description:</strong> {offer.description}
          </p>

          <p>
            <strong>Discount:</strong> {offer.discount}
          </p>
    
          <p>
            <strong>Status:</strong>{" "}
            {offer.status ? "Active" : "Inactive"}
          </p>
        </div>

      </div>
    </div>
  );
}