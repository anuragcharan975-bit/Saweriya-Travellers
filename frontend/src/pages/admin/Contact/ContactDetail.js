import React from "react";

export default function ContactModel({ open, onClose, contact }) {
    if (!open || !contact) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Contact Information</h2>

                    <button
                        onClick={onClose}
                        className="text-2xl font-bold text-gray-600 hover:text-red-600"
                    >
                        ×
                    </button>
                </div>

                {/* Contact Details */}
                <div className="space-y-3">

                    <p>
                        <strong>Full Name:</strong> {contact.full_name}
                    </p>

                    <p>
                        <strong>Email:</strong> {contact.email}
                    </p>

                    <p>
                        <strong>Mobile No:</strong> {contact.mobile_no}
                    </p>

                    <p>
                        <strong>Subject:</strong> {contact.subject}
                    </p>

                    <div>
                        <strong>Message:</strong>{contact.message}
                    </div>



                </div>

            </div>
        </div>
    );
}