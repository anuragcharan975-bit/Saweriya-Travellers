import React from "react";
import { Image_url } from "../../../Config/config";

export default function UserModal({ open, onClose, user }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="bg-violet-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                    <h2 className="text-2xl font-bold">User Information</h2>

                    <button
                        onClick={onClose}
                        className="text-3xl hover:text-red-200"
                    >
                        ×
                    </button>
                </div>

                {/* Profile Image */}
                <div className="flex justify-center -mt-14">
                    {user.photo ? (
                        <img
                            src={`${Image_url}/${user.photo}`}
                            alt={user.full_name}
                            className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                    ) : (
                        <div className="w-36 h-36 rounded-full border-4 border-white shadow-lg bg-violet-600 text-white flex items-center justify-center text-5xl font-bold uppercase">
                            {user.full_name?.charAt(0)}
                        </div>
                    )}
                </div>


                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-8">

                    <p><strong>Email:</strong> {user.email}</p>

                    <p><strong>Mobile:</strong> {user.mobile_no}</p>
                    
                    <p>
                        <strong>Status:</strong>
                        <span
                            className={`ml-2 px-2 py-1 rounded-full text-sm ${user.status
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {user.status ? "Active" : "Inactive"}
                        </span>
                    </p>

                </div>

            </div>
        </div>
    );
}