import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Ticket,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Bus,
  MapPin,
  Calendar,
  Eye,
  RefreshCw,
  Printer,
  X
} from "lucide-react";
import { ViewAllBookings, UpdateBookingStatus } from "../../../Service/admin/Booking";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await ViewAllBookings();
      if (Array.isArray(res?.data)) {
        setBookings(res.data);
      } else if (Array.isArray(res)) {
        setBookings(res);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Fetch bookings error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load bookings list."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const result = await Swal.fire({
      title: `Update status to ${newStatus}?`,
      text: `Are you sure you want to mark this booking as ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "Cancelled" ? "#ef4444" : "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Yes, Mark as ${newStatus}`
    });

    if (result.isConfirmed) {
      try {
        await UpdateBookingStatus(id, newStatus);
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: `Booking status changed to ${newStatus}`,
          timer: 1500,
          showConfirmButton: false
        });
        fetchBookings();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Failed to update booking status"
        });
      }
    }
  };

  // Stats calculation
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(
    (b) => b.booking_status === "Booked" || b.booking_status === "Confirmed"
  ).length;
  const cancelledBookings = bookings.filter(
    (b) => b.booking_status === "Cancelled"
  ).length;
  const totalRevenue = bookings
    .filter((b) => b.booking_status !== "Cancelled")
    .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const statusMatch =
      statusFilter === "All" ||
      b.booking_status?.toLowerCase() === statusFilter.toLowerCase();

    const searchLower = searchTerm.toLowerCase();
    const pnr = String(b.bookingId || b.booking_id || b._id || "").toLowerCase();
    const email = String(b.user_email || b.user_id?.email || "").toLowerCase();
    const name = String(b.user_id?.full_name || b.bus_name || "").toLowerCase();
    const busName = String(b.bus_name || "").toLowerCase();
    const route = String(b.route || `${b.source_city || ""} ${b.distance_city || ""}`).toLowerCase();

    const searchMatch =
      !searchTerm ||
      pnr.includes(searchLower) ||
      email.includes(searchLower) ||
      name.includes(searchLower) ||
      busName.includes(searchLower) ||
      route.includes(searchLower);

    return statusMatch && searchMatch;
  });

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Ticket className="text-orange-500" size={32} />
            <span>Bookings Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time passenger bookings, seat allocations, and revenue tracking
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Bookings
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalBookings}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Ticket size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Confirmed Trips
            </span>
            <p className="text-3xl font-black text-emerald-600 mt-1">{activeBookings}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Cancelled
            </span>
            <p className="text-3xl font-black text-rose-600 mt-1">{cancelledBookings}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Ticket Revenue
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">₹{totalRevenue.toLocaleString("en-IN")}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by PNR, passenger, email, bus, route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={16} className="text-slate-400 hidden sm:block" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:block">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:border-orange-500 transition w-full md:w-auto"
          >
            <option value="All">All Bookings</option>
            <option value="Booked">Booked</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">PNR / Booking ID</th>
                <th className="py-4 px-6">Passenger / User</th>
                <th className="py-4 px-6">Bus & Route</th>
                <th className="py-4 px-6">Seats</th>
                <th className="py-4 px-6">Journey Date</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2" />
                    Loading bookings data...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <Ticket size={40} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-700">No Bookings Found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchTerm || statusFilter !== "All"
                        ? "Try adjusting your search filters"
                        : "Booked passenger tickets will appear here"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const pnr = b.bookingId || b.booking_id || String(b._id).slice(-8).toUpperCase();
                  const userName = b.user_id?.full_name || "Passenger";
                  const userEmail = b.user_email || b.user_id?.email || "-";
                  const busName = b.bus_name || b.schedule_id?.bus?.bus_name || "Volvo AC Luxury";
                  const routeStr =
                    b.route ||
                    (b.source_city && b.distance_city ? `${b.source_city} → ${b.distance_city}` : "-");
                  const seats = Array.isArray(b.seat_number)
                    ? b.seat_number.join(", ")
                    : Array.isArray(b.seats)
                    ? b.seats.join(", ")
                    : b.seat_number || b.seats || "-";
                  const dateStr = b.journey_date
                    ? new Date(b.journey_date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })
                    : "-";
                  const amount = Number(b.total_amount) || 0;
                  const isCancelled = b.booking_status === "Cancelled";

                  return (
                    <tr key={b._id} className="hover:bg-slate-50/60 transition">
                      {/* PNR */}
                      <td className="py-4 px-6 font-bold text-slate-900 font-mono text-xs">
                        #{pnr}
                      </td>

                      {/* PASSENGER */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800 text-sm">{userName}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[180px]">
                          {userEmail}
                        </div>
                      </td>

                      {/* BUS & ROUTE */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                          <Bus size={14} className="text-orange-500" />
                          <span>{busName}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="text-slate-400" />
                          <span>{routeStr}</span>
                        </div>
                      </td>

                      {/* SEATS */}
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200/80 text-orange-700 font-bold text-xs">
                          {seats}
                        </span>
                      </td>

                      {/* JOURNEY DATE */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{dateStr}</span>
                        </div>
                        {b.departure && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock size={11} />
                            <span>{b.departure}</span>
                          </div>
                        )}
                      </td>

                      {/* AMOUNT */}
                      <td className="py-4 px-6 font-black text-slate-900">
                        ₹{amount.toLocaleString("en-IN")}
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isCancelled
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {isCancelled ? <XCircle size={13} /> : <CheckCircle size={13} />}
                          <span>{b.booking_status || "Booked"}</span>
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedTicket(b)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition"
                            title="View E-Ticket"
                          >
                            <Eye size={16} />
                          </button>

                          {!isCancelled && (
                            <button
                              onClick={() => handleStatusChange(b._id, "Cancelled")}
                              className="px-2.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW TICKET MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X size={20} />
            </button>

            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                E-Ticket Inspection
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Booking #{selectedTicket.bookingId || selectedTicket._id}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Saweriya Travellers Bus Reservation
              </p>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Passenger Email</span>
                <span className="font-bold text-slate-800">{selectedTicket.user_email || "-"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Bus Service</span>
                <span className="font-bold text-slate-800">{selectedTicket.bus_name || "-"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Route</span>
                <span className="font-bold text-slate-800">
                  {selectedTicket.route || `${selectedTicket.source_city || ""} → ${selectedTicket.distance_city || ""}`}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Seat Numbers</span>
                <span className="font-black text-orange-600">
                  {Array.isArray(selectedTicket.seat_number)
                    ? selectedTicket.seat_number.join(", ")
                    : selectedTicket.seat_number || "-"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Journey Date</span>
                <span className="font-bold text-slate-800">
                  {selectedTicket.journey_date
                    ? new Date(selectedTicket.journey_date).toLocaleDateString("en-IN")
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Timings</span>
                <span className="font-bold text-slate-800">
                  {selectedTicket.departure || "09:30 PM"} → {selectedTicket.arrival || "05:00 AM"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Total Paid Fare</span>
                <span className="font-black text-slate-900 text-sm">
                  ₹{Number(selectedTicket.total_amount || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="font-bold text-emerald-600">
                  {selectedTicket.booking_status || "Booked"}
                </span>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Printer size={15} />
                <span>Print Ticket</span>
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
