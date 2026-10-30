import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ViewAllRoute,
  Delete,
  StatusUpdate,
} from "../../../Service/admin/Route";
import Swal from "sweetalert2";
import {
  ToggleRight,
  ToggleLeft,
  Pencil,
  Trash2,
  Eye,
  Route as RouteIcon,
  Plus,
  Navigation,
} from "lucide-react";
import RouteModel from "./RouteDetails";

export default function RouteList() {
  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);
  const [routeDetails, setRouteDetails] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await ViewAllRoute(page, limit);
      setDataList(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.log("Route Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this route!",
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
          title: "Route Deleted!",
          text: "The route has been deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: error?.response?.data?.message || "Something went wrong. Please try again.",
        });
      }
    }
  };

  const handleUpdateStatus = async (id, updateStatus) => {
    try {
      const body = { status: updateStatus };
      await StatusUpdate(id, body);
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Route is now ${updateStatus ? "Active" : "Inactive"}`,
        timer: 1500,
        showConfirmButton: false,
      });
      fetchData();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-xs">
            <RouteIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Route Network
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage intercity corridors, stopover points, and distance durations
            </p>
          </div>
        </div>

        <Link
          to="/admin/bus-route/add"
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-violet-500/20 transition active:scale-95"
        >
          <Plus size={16} />
          <span>Add New Route</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Route Name & Corridor</th>
                <th className="px-6 py-4">Fare & Distance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-16">
                    <div className="flex justify-center items-center">
                      <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : dataList.length > 0 ? (
                dataList.map((route) => (
                  <tr key={route._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Route Corridor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0">
                          <Navigation size={18} />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {route.route_name}
                          </span>
                          <span className="text-xs text-slate-500 font-medium capitalize">
                            {route.source_city} → {route.distance_city}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Fare & Distance */}
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">
                          ₹{route.fare || 0}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {route.distance || "N/A"} • {route.duration || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          route.status
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            route.status ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                          }`}
                        ></span>
                        <span>{route.status ? "Active" : "Inactive"}</span>
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {new Date(route.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Status Toggle */}
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(route._id, !route.status)}
                          className={`p-1.5 rounded-xl border transition ${
                            route.status
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                              : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200"
                          }`}
                          title={route.status ? "Deactivate Route" : "Activate Route"}
                        >
                          {route.status ? (
                            <ToggleRight size={20} />
                          ) : (
                            <ToggleLeft size={20} />
                          )}
                        </button>

                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => {
                            setRouteDetails(route);
                            setOpen(true);
                          }}
                          className="p-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          title="View Route Details"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit */}
                        <Link
                          to={`/admin/bus-route/edit/${route._id}`}
                          className="p-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
                          title="Edit Route"
                        >
                          <Pencil size={16} />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(route._id)}
                          className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                          title="Delete Route"
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
                    <RouteIcon size={36} className="mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-sm">No Routes Found</p>
                    <p className="text-xs text-slate-400">Add a route to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-200/80 px-6 py-4 bg-slate-50/50">
          <span className="text-xs text-slate-500 font-medium">
            Page {page} of {totalPages}
          </span>

          <nav aria-label="Pagination" className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || loading}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                page === 1 || loading
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
              disabled={page === totalPages || loading}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                page === totalPages || loading
                  ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400"
                  : "border-slate-300 text-slate-700 hover:bg-white"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      </div>

      <RouteModel
        open={open}
        onClose={() => setOpen(false)}
        route={routeDetails}
      />
    </div>
  );
}
