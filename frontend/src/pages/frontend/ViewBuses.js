import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import {
  BusFront,
  Clock,
  Armchair,
  ArrowRight,
  Star,
  Wifi,
  Zap,
  Droplets,
  Wind,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { ViewScheduleByRoute } from "../../Service/admin/Schedule";

export default function ViewBusesList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const routeFromSearch = location.state?.route || {};
  const searchData = location.state?.searchData || {};
  const searchDate = location.state?.searchDate || "";
  const allMatchedRoutes = location.state?.allMatchedRoutes || [];

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getBuses = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          setError("Route ID is missing.");
          setLoading(false);
          return;
        }

        const response = await ViewScheduleByRoute(id);

        let result = [];
        if (Array.isArray(response)) {
          result = response;
        } else if (Array.isArray(response?.data)) {
          result = response.data;
        } else if (Array.isArray(response?.data?.data)) {
          result = response.data.data;
        } else if (Array.isArray(response?.schedules)) {
          result = response.schedules;
        } else if (Array.isArray(response?.results)) {
          result = response.results;
        }

        setBuses(result);

        if (result.length === 0) {
          setError("No buses are currently scheduled for this route.");
        }
      } catch (err) {
        console.log("VIEW BUS ERROR:", err);
        setError(
          err?.response?.data?.message ||
          "Unable to load buses for this route."
        );
      } finally {
        setLoading(false);
      }
    };

    getBuses();
  }, [id]);

  const handleBookNow = (schedule) => {
    navigate(`/view-seat/${schedule?._id}`, {
      state: {
        bus: schedule,
        route: routeFromSearch,
        searchData: searchData,
        searchDate: searchDate,
      },
    });
  };

  const sourceCity =
    routeFromSearch?.source_city ||
    searchData?.source_city ||
    "Source";

  const destinationCity =
    routeFromSearch?.distance_city ||
    searchData?.distance_city ||
    "Destination";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      <div>
        <Header />

        <section className="pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            {/* ================= ROUTE HEADER SUMMARY CARD ================= */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 mb-3">
                    <span>Available Trips</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black capitalize tracking-tight flex items-center gap-3">
                    <span>{sourceCity}</span>
                    <ArrowRight size={24} className="text-orange-400 shrink-0" />
                    <span>{destinationCity}</span>
                  </h1>
                  <p className="text-slate-300 text-sm mt-2 flex items-center gap-4 flex-wrap">
                    {searchDate && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock size={16} className="text-orange-400" />
                        Travel Date: {searchDate}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <ShieldCheck size={16} /> GPS Enabled Fleet
                    </span>
                  </p>

                  {allMatchedRoutes.length > 1 && (
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-300 font-medium">Matching Routes:</span>
                      {allMatchedRoutes.map((mr) => {
                        const isCurrent = String(mr._id) === String(id);
                        return (
                          <button
                            key={mr._id}
                            type="button"
                            onClick={() => {
                              navigate(`/view-buses/${mr._id}`, {
                                state: {
                                  route: mr,
                                  searchData,
                                  searchDate,
                                  allMatchedRoutes,
                                },
                              });
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                              isCurrent
                                ? "bg-orange-500 text-white shadow-sm ring-1 ring-white/30"
                                : "bg-white/10 hover:bg-white/20 text-slate-200"
                            }`}
                          >
                            {mr.source_city} ➔ {mr.distance_city}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/search-bus"
                    className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>Modify Search</span>
                  </Link>
                  <span className="px-4 py-2.5 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-md">
                    {loading ? "Searching..." : `${buses.length} Buses Found`}
                  </span>
                </div>
              </div>
            </div>

            {/* ================= LOADING STATE ================= */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 animate-pulse flex flex-col md:flex-row justify-between items-center gap-6"
                  >
                    <div className="w-full md:w-1/3 space-y-3">
                      <div className="h-6 bg-slate-200 rounded-lg w-3/4"></div>
                      <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
                    </div>
                    <div className="w-full md:w-1/3 h-12 bg-slate-100 rounded-xl"></div>
                    <div className="w-full md:w-1/4 h-12 bg-slate-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            )}

            {/* ================= ERROR / NO BUSES ================= */}
            {!loading && error && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <BusFront size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  No Direct Buses Scheduled
                </h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                  {error}
                </p>
                <div className="flex justify-center gap-3">
                  <Link
                    to="/"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-2xl font-bold transition text-sm"
                  >
                    Back to Home
                  </Link>
                  <Link
                    to="/search-bus"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold transition shadow-lg shadow-orange-500/25 text-sm"
                  >
                    Search All Routes
                  </Link>
                </div>
              </div>
            )}

            {/* ================= BUS LIST CARDS ================= */}
            {!loading && buses.length > 0 && (
              <div className="space-y-6">
                {buses.map((schedule, index) => {
                  const bus = schedule?.bus || schedule;
                  const route = schedule?.route || routeFromSearch || {};
                  const busName = bus?.bus_name || schedule?.bus_name || "Express Luxury Liner";
                  const departure = schedule?.departure_time || schedule?.departure || "09:00 PM";
                  const arrival = schedule?.arrival_time || schedule?.arrival || "06:00 AM";
                  const source = route?.source_city || sourceCity;
                  const destination = route?.distance_city || destinationCity;
                  const fare = route?.fare || schedule?.fare || 550;
                  const totalSeats = bus?.total_seats || 40;

                  return (
                    <div
                      key={schedule?._id || bus?._id || index}
                      className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-7 relative overflow-hidden"
                    >
                      {/* Top Accent Strip */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400 opacity-80" />

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Bus Operator & Type Details */}
                        <div className="lg:col-span-4">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center shrink-0 shadow-xs">
                              <BusFront size={28} />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <Star size={11} className="fill-emerald-600" /> 4.8
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {bus?.bus_type || "AC Sleeper 2+2"}
                                </span>
                              </div>

                              <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                                {busName}
                              </h3>

                              {bus?.register_number && (
                                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                                  Coach No: <span className="text-slate-600 uppercase">{bus.register_number}</span>
                                </p>
                              )}

                              {/* Amenities badges */}
                              <div className="flex items-center gap-3 mt-3 text-slate-400 text-xs">
                                <span title="Air Conditioned" className="flex items-center gap-1 text-slate-600 font-medium">
                                  <Wind size={13} className="text-blue-500" /> AC
                                </span>
                                <span title="High Speed WiFi" className="flex items-center gap-1 text-slate-600 font-medium">
                                  <Wifi size={13} className="text-emerald-500" /> WiFi
                                </span>
                                <span title="Charging Port" className="flex items-center gap-1 text-slate-600 font-medium">
                                  <Zap size={13} className="text-amber-500" /> USB
                                </span>
                                <span title="Water Bottle" className="flex items-center gap-1 text-slate-600 font-medium">
                                  <Droplets size={13} className="text-cyan-500" /> Water
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Journey Timeline */}
                        <div className="lg:col-span-5 bg-slate-50/70 rounded-2xl p-4 border border-slate-100">
                          <div className="flex items-center justify-between gap-4">
                            {/* Departure */}
                            <div className="text-left">
                              <span className="text-xl sm:text-2xl font-black text-slate-900 block tracking-tight">
                                {departure}
                              </span>
                              <span className="text-xs font-bold uppercase text-slate-700 tracking-wider block mt-0.5 capitalize">
                                {source}
                              </span>
                              <span className="text-[11px] text-slate-400">Boarding</span>
                            </div>

                            {/* Journey Duration Bar */}
                            <div className="flex-1 flex flex-col items-center px-2">
                              <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-xs mb-1">
                                {route?.duration || "Express"}
                              </span>
                              <div className="w-full flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-orange-500 shrink-0"></div>
                                <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                                <BusFront size={14} className="text-orange-500 shrink-0" />
                                <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                                <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0"></div>
                              </div>
                              <span className="text-[10px] text-slate-400 mt-1">Direct Trip</span>
                            </div>

                            {/* Arrival */}
                            <div className="text-right">
                              <span className="text-xl sm:text-2xl font-black text-slate-900 block tracking-tight">
                                {arrival}
                              </span>
                              <span className="text-xs font-bold uppercase text-slate-700 tracking-wider block mt-0.5 capitalize">
                                {destination}
                              </span>
                              <span className="text-[11px] text-slate-400">Dropping</span>
                            </div>
                          </div>
                        </div>

                        {/* Price, Seats & Booking Action */}
                        <div className="lg:col-span-3 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                          {/* Seat count & Fare */}
                          <div className="text-left lg:text-right">
                            <div className="flex items-center lg:justify-end gap-1.5 text-xs font-bold text-emerald-600 mb-1">
                              <Armchair size={15} />
                              <span>{totalSeats} Seats Capacity</span>
                            </div>
                            <div className="flex items-baseline lg:justify-end gap-1.5">
                              <span className="text-xs text-slate-400 line-through">
                                ₹{fare + 150}
                              </span>
                              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                                ₹{fare}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">/seat</span>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <button
                            type="button"
                            onClick={() => handleBookNow(schedule)}
                            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/25 transition-all duration-200 flex items-center gap-2 group-hover:bg-orange-600"
                          >
                            <span>Select Seats</span>
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
