import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ViewAllSchedule, Delete, StatusUpdate } from "../../../Service/admin/Schedule"
import Swal from "sweetalert2";
import { ToggleRight, ToggleLeft, Pencil, Trash2 } from 'lucide-react';
import Moment from "react-moment";
import { Eye } from "lucide-react";
import ScheduleModel from "./ScheduleDetails";




export default function ScheduleList() {

  const [dataList, setDataList] = useState([])
  const [open, setOpen] = useState(false);
  const [scheduleDetails, setScheduleDetails] = useState(null);
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(3)
  const [totalPages, setTotalPages] = useState(1)


  const fetchData = async () => {
    try {
      const res = await ViewAllSchedule(page, limit);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDataList(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.log(error);

    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this Schedule!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      try {
        await Delete(id);

        Swal.fire({
          icon: "success",
          title: "Bus Deleted!",
          text: "The Schedule has been deleted Successfully.",
          confirmButtonColor: "#7c3aed",
          confirmButtonText: "OK"
        });

        fetchData(); // Refresh list

      } catch (error) {

        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: error?.response?.data?.message || "Something went wrong. Please try again.",
          confirmButtonColor: "#dc2626",
          confirmButtonText: "OK"
        });

      }
    }
  }

  const handleUpdateStatus = async (id, updateStatus) => {
    try {

      const body = { status: updateStatus }
      await StatusUpdate(id, body);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Status Updated Successfully",
        timer: 1500,
        showConfirmButton: false,
      })

      fetchData()

    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      })
    }
  }


  return (
    <div>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Schedule Management
          </h2>

          <Link
            to="/admin/schedule/add"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
          >
            <span>Add New Schedule</span>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-sm text-slate-500 font-semibold">
                  <th className="px-6 py-4">Departure Time</th>
                  <th className="px-6 py-4">Arrival Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Schedule Details</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">

                {dataList.length > 0 ? (
                  dataList.map((schedule) => (
                    <tr key={schedule._id} className="hover:bg-slate-50">


                      <td className="px-6 py-4">
                        {schedule.departure_time}
                      </td>

                      <td className="px-6 py-4">
                        {schedule.arrival_time}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${schedule.status === true
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {schedule.status ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <Moment format="DD-MM-YYYY">
                          {schedule.createdAt}
                        </Moment>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setScheduleDetails(schedule);
                            setOpen(true);
                          }}
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                          title="View Schedule"
                        >
                          <Eye size={18} />
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <div
                            onClick={() => {
                              const status = !schedule.status;
                              handleUpdateStatus(schedule?._id, status)
                            }


                            }
                            className={`px-3 py-2 rounded-lg cursor-pointer transition-all ${schedule?.status
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                          >
                            {schedule?.status ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                          </div>
                          <Link
                            to={`/admin/schedule/edit/${schedule._id}`}
                            className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                            title="Edit"
                          >
                            <Pencil size={20} strokeWidth={2.5} />
                          </Link>

                          <button
                            onClick={() => handleDelete(schedule._id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                            title="Delete"
                          >
                            <Trash2 size={20} strokeWidth={2.5} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-8 text-slate-500"
                    >
                      No schedule Found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

            <div className="flex justify-end border-t border-slate-200 px-6 py-4">
              <nav
                aria-label="Pagination"
                className="flex items-center gap-2"
              >
                {/* Previous */}
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg border ${page === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-violet-50"
                    }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`w-10 h-10 rounded-lg font-semibold ${page === pageNumber
                          ? "bg-violet-600 text-white"
                          : "border hover:bg-violet-50"
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Next */}
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-lg border ${page === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-violet-50"
                    }`}
                >
                  Next
                </button>
              </nav>
            </div>

          </div>
        </div>
        <ScheduleModel
          open={open}
          onClose={() => setOpen(false)}
          schedule={scheduleDetails}
        />
      </div>
    </div>
  );
}