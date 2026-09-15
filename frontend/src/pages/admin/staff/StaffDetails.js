import React from "react";
import { Image_url } from "../../../Config/config";

export default function StaffModal({ open, onClose, staff }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="bg-violet-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Staff Information</h2>

                    <button
                        onClick={onClose}
                        className="text-3xl hover:text-red-200"
                    >
                        ×
                    </button>
                </div>

                {/* Profile Image */}
                <div className="flex justify-center -mt-14">
                    {staff.photo ? (
                        <img
                            src={`${Image_url}/${staff.photo}`}
                            alt={staff.full_name}
                            className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                    ) : (
                        <div className="w-36 h-36 rounded-full border-4 border-white shadow-lg bg-violet-600 text-white flex items-center justify-center text-5xl font-bold uppercase">
                            {staff.full_name?.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Name */}
                <div className="text-center mt-4">
                    <h3 className="text-2xl font-bold">{staff.full_name}</h3>
                    <p className="text-gray-500">
                        {staff.role_id === 1
                            ? "Admin"
                            : staff.role_id === 2
                                ? "Driver"
                                : "Conductor"}
                    </p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-8">

                    <p><strong>Email:</strong> {staff.email}</p>

                    <p><strong>Mobile:</strong> {staff.mobile_number}</p>

                    <p><strong>Gender:</strong> {staff.gender}</p>

                    <p>
                        <strong>Date Of Birth:</strong>{" "}
                        {new Date(staff.date_of_birth).toLocaleDateString("en-GB")}
                    </p>

                    <p><strong>Address:</strong> {staff.address}</p>

                    <p><strong>City:</strong> {staff.city}</p>

                    <p><strong>State:</strong> {staff.state}</p>

                    <p><strong>Pincode:</strong> {staff.pincode}</p>

                    <p><strong>License:</strong> {staff.license_number}</p>

                    <p>
                        <strong>Joining:</strong>{" "}
                        {new Date(staff.joining_date).toLocaleDateString("en-GB")}
                    </p>

                    <p><strong>Experience:</strong> {staff.experience}</p>

                    <p><strong>Salary:</strong> ₹{staff.salary}</p>

                    <p><strong>Bus:</strong> {staff.bus?.bus_name}</p>

                    <p>
                        <strong>Status:</strong>
                        <span
                            className={`ml-2 px-2 py-1 rounded-full text-sm ${staff.status
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {staff.status ? "Active" : "Inactive"}
                        </span>
                    </p>

                </div>

            </div>
        </div>
    );
}