import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ViewAllBus,
  Delete,
  StatusUpdate,
  ViewBusStaff,
  AssignBus,
  SearchData,
} from "../../../Service/admin/Bus";
import {
  ToggleRight,
  ToggleLeft,
  Pencil,
  Trash2,
  Eye,
  BusFront,
  Search,
  RotateCcw,
  FileSpreadsheet,
  Plus,
  Bus,
} from "lucide-react";
import { Image_url } from "../../../Config/config";
import BusModal from "./BusDetails";
import AssignBusModal from "./Assign";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function BusList() {
  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);
  const [busDetails, setBusDetails] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [Isbusopen, setIsBusOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [RegisterNumber, setRegisterNumber] = useState("");
  const [BusName, setBusName] = useState("");

  const handleAssignBus = async (data) => {
    try {
      const res = await AssignBus(data);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.message || "Bus assigned successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      setIsBusOpen(false);
      fetchData();
      fetchViewBusStaff();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: error.response?.data?.message || "Unable to assign the bus. Please try again.",
      });
    }
  };

  const fetchViewBusStaff = async () => {
    try {
      const res = await ViewBusStaff();
      setStaffList(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await ViewAllBus(page, limit);
      setDataList(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchViewBusStaff();
  }, [page, limit]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this bus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await Delete(id);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Bus deleted successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: error.response?.data?.message || "Something went wrong",
        });
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await StatusUpdate(id, status);
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Bus is now ${status ? "Active" : "Inactive"}`,
        timer: 1500,
        showConfirmButton: false,
      });
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update status",
      });
    }
  };

  const handleSearch = async (e) => {
    try {
      e?.preventDefault();
      const body = {
        RegisterNumber: RegisterNumber,
        BusName: BusName,
      };
      const res = await SearchData(page, limit, body);
      setDataList(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetSearch = () => {
    setRegisterNumber("");
    setBusName("");
    fetchData();
  };

  const downloadExcel = () => {
    const exportData = dataList.map((bus) => ({
      RegisterNumber: bus.register_number,
      BusName: bus.bus_name,
      BusType: bus.bus_type || "N/A",
      TotalSeats: bus.total_seats || "N/A",
      Status: bus.status ? "Active" : "Inactive",
      Created: new Date(bus.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Buses");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(file, "Saweriya_Travellers_Fleet.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-xs">
            <Bus size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Fleet Management
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Oversee and configure all company buses, coaches, and vehicle assignments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={downloadExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition active:scale-95 shadow-xs"
          >
            <FileSpreadsheet size={16} />
            <span>Export Excel</span>
          </button>

          <Link
            to="/admin/bus/add"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-violet-500/20 transition active:scale-95"
          >
            <Plus size={16} />
            <span>Add New Bus</span>
          </Link>
        </div>
      </div>

      {/* Filter / Search Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Register Number
              </label>
              <input
                type="text"
                placeholder="e.g. RJ14AB1234"
                className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none text-sm font-semibold uppercase"
                value={RegisterNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Bus Name
              </label>
              <input
                type="text"
                placeholder="e.g. Volvo Multi-Axle"
                className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none text-sm font-semibold"
                value={BusName}
                onChange={(e) => setBusName(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm active:scale-95"
              >
                <Search size={16} />
                <span>Filter</span>
              </button>

              <button
                type="button"
                onClick={handleResetSearch}
                className="h-11 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition active:scale-95"
                title="Reset filters"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Coach</th>
                <th className="px-6 py-4">Register Plate</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4 text-center">Manage Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {dataList.length > 0 ? (
                dataList.map((bus) => (
                  <tr key={bus._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Bus Name & Quick View */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0">
                          {bus?.bus_image ? (
                            <img
                              src={`${Image_url}/${bus.bus_image}`}
                              alt={bus.bus_name}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <BusFront size={20} />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {bus.bus_name}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {bus.total_seats || 40} Seats Capacity
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setBusDetails(bus);
                            setOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>

                    {/* Register Number */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 uppercase">
                        {bus.register_number}
                      </span>
                    </td>

                    {/* Status with pulsating dot */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          bus.status
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            bus.status ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                          }`}
                        ></span>
                        <span>{bus.status ? "Active Fleet" : "Inactive"}</span>
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {new Date(bus.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Toggle Status */}
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(bus?._id, !bus?.status)}
                          className={`p-1.5 rounded-xl border transition ${
                            bus?.status
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                              : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200"
                          }`}
                          title={bus?.status ? "Deactivate Bus" : "Activate Bus"}
                        >
                          {bus?.status ? (
                            <ToggleRight size={20} />
                          ) : (
                            <ToggleLeft size={20} />
                          )}
                        </button>

                        {/* Assign Staff */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBus(bus);
                            setIsBusOpen(true);
                          }}
                          className="p-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          title="Assign Staff / Driver"
                        >
                          <BusFront size={16} />
                        </button>

                        {/* Edit */}
                        <Link
                          to={`/admin/bus/edit/${bus._id}`}
                          className="p-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
                          title="Edit Bus Details"
                        >
                          <Pencil size={16} />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(bus._id)}
                          className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                          title="Delete Bus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">
                    <Bus size={36} className="mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-sm">No Buses Found</p>
                    <p className="text-xs text-slate-400">Try adjusting your search criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between border-t border-slate-200/80 px-6 py-4 bg-slate-50/50">
          <span className="text-xs text-slate-500 font-medium">
            Page {page} of {totalPages}
          </span>

          <nav aria-label="Pagination" className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                page === 1
                  ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400"
                  : "border-slate-300 text-slate-700 hover:bg-white"
              }`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                    page === pageNumber
                      ? "bg-violet-600 text-white shadow-xs"
                      : "border border-slate-200 hover:bg-white text-slate-700"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                page === totalPages
                  ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400"
                  : "border-slate-300 text-slate-700 hover:bg-white"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      </div>

      <BusModal
        open={open}
        onClose={() => setOpen(false)}
        bus={busDetails}
      />

      <AssignBusModal
        isOpen={Isbusopen}
        onClose={() => setIsBusOpen(false)}
        bus={selectedBus}
        staffList={staffList}
        onAssign={handleAssignBus}
      />
    </div>
  );
}
