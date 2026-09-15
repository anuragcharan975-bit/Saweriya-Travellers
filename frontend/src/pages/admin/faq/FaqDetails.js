import React from "react";

export default function FaqModel({ open, onClose, faq }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Faq Information</h2>

          <button
            onClick={onClose}
            className="text-2xl font-bold"
          >
            ×
          </button>
        </div>


      <div className="space-y-3">
          <p>
            <strong>Question:</strong> {faq.question}
          </p>

          <p>
            <strong>Answer:</strong> {faq.answer}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {faq.status ? "Active" : "Inactive"}
          </p>
        </div>

      </div>
    </div>
  );
}