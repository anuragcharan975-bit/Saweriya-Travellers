import React from "react";

export default function ScheduleModel({ open, onClose, schedule }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Schedule Information</h2>

                    <button
                        onClick={onClose}
                        className="text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>


                <div className="space-y-3">
                    <p>
                        <strong>Bus:</strong> {schedule.bus?.bus_name}
                    </p>

                    <p>
                        <strong>Route:</strong> {schedule.route?.route_name}
                    </p>

                    <p>
                        <strong>Departure Time:</strong> {schedule.departure_time}
                    </p>

                    <p>
                        <strong>Arrival Time:</strong> {schedule.arrival_time}
                    </p>

                    <p>
                        <strong>Trip Date:</strong>{" "}
                        {schedule.trip_date
                            ? new Date(schedule.trip_date).toLocaleDateString()
                            : "N/A"}
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        {schedule.status ? "Active" : "Inactive"}
                    </p>
                </div>

            </div>
        </div >
    );
}