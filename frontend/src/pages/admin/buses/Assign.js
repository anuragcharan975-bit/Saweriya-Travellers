import React, { useState } from "react";

export default function AssignBusModal({
  isOpen,
  onClose,
  bus,
  staffList,
  onAssign,
}) {
  const [formData, setFormData] = useState({
    driver: "",
    conductor: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAssign({
      bus: bus?._id,
      driver: formData.driver,
      conductor: formData.conductor,
    });

    setFormData({
      driver: "",
      conductor: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

        {/* Header */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Assign Bus
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-500"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Bus */}
          <div>
            <label className="block mb-2 font-semibold">
              Bus
            </label>

            <input
              type="text"
              value={`${bus?.register_number || ""} - ${bus?.bus_name || ""}`}
              readOnly
              className="w-full border rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          {/* Driver */}
          <div>
            <label className="block mb-2 font-semibold">
              Driver
            </label>

            <select
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select Driver</option>

              {staffList
                ?.filter((item) => item.role_id === 2)
                .map((driver) => (
                  <option
                    key={driver._id}
                    value={driver._id}
                  >
                    {driver.full_name}
                  </option>
                ))}
            </select>
          </div>

          {/* Conductor */}
          <div>
            <label className="block mb-2 font-semibold">
              Conductor
            </label>

            <select
              name="conductor"
              value={formData.conductor}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select Conductor</option>

              {staffList
                ?.filter((item) => item.role_id === 3)
                .map((conductor) => (
                  <option
                    key={conductor._id}
                    value={conductor._id}
                  >
                    {conductor.full_name}
                  </option>
                ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
            >
              Assign Bus
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}