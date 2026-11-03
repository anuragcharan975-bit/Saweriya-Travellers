import Header from "./Header";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ViewAllRoute } from "../../Service/admin/Route";
import { getRouteImage } from "../../utils/routeImages";
import {
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BusFront,
} from "lucide-react";

export default function RouteBus() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRoutes = async () => {
    try {
      setLoading(true);
      const res = await ViewAllRoute();
      let data = [];
      if (Array.isArray(res)) data = res;
      else if (Array.isArray(res?.data)) data = res.data;
      else if (Array.isArray(res?.data?.data)) data = res.data.data;
      setRoutes(data);
    } catch (error) {
      console.log(error);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoutes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header />

        <section className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            {/* Header Badge & Title */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-bold text-xs uppercase tracking-wider mb-4 border border-orange-200">
                <Sparkles size={14} className="text-orange-500" />
                <span>Verified Intercity Network</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Explore Available{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                  Routes
                </span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg mt-3">
                Connecting India's top cities & spiritual destinations with premium AC Sleeper & Volvo coaches
              </p>
            </div>

            {/* Routes Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 animate-pulse h-96"
                  >
                    <div className="h-48 bg-slate-200"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                      <div className="h-10 bg-slate-200 rounded-xl mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : routes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {routes.map((route, idx) => {
                  const imageSrc = getRouteImage(route);
                  const isSaweriya = /saw|seth|sanw/i.test(
                    `${route.distance_city || ""} ${route.route_name || ""}`
                  );

                  return (
                    <div
                      key={route._id || idx}
                      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200/80 flex flex-col justify-between hover:-translate-y-1.5"
                    >
                      {/* Image Banner with Badge */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={imageSrc}
                          alt={route.distance_city || "Destination"}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          {isSaweriya ? (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg flex items-center gap-1">
                              <Sparkles size={12} /> Flagship Route
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-md">
                              Daily Express
                            </span>
                          )}
                        </div>

                        <div className="absolute top-4 right-4">
                          <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-400/30 flex items-center gap-1">
                            <ShieldCheck size={13} /> GPS Live
                          </span>
                        </div>

                        {/* Floating destination name at bottom of image */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-xs font-semibold text-orange-300 uppercase tracking-wider flex items-center gap-1">
                            <MapPin size={13} /> Destination
                          </p>
                          <h3 className="text-2xl font-black text-white capitalize drop-shadow-md">
                            {route.distance_city}
                          </h3>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Route Flow (From -> To) */}
                          <div className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Departure
                              </p>
                              <p className="text-base font-bold text-slate-800 capitalize">
                                {route.source_city}
                              </p>
                            </div>

                            <div className="flex flex-col items-center px-2">
                              <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-xs mb-1">
                                {route.distance || "Direct"}
                              </span>
                              <div className="flex items-center text-orange-500 gap-1">
                                <div className="w-6 border-t-2 border-dashed border-orange-400"></div>
                                <ArrowRight size={14} />
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Arrival
                              </p>
                              <p className="text-base font-bold text-slate-800 capitalize">
                                {route.distance_city}
                              </p>
                            </div>
                          </div>

                          {/* Highlights Info */}
                          <div className="flex items-center justify-between text-xs text-slate-600 mb-5 px-1">
                            <span className="flex items-center gap-1 font-semibold">
                              <Clock size={14} className="text-orange-500" />
                              {route.duration || "Express"}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-slate-500">
                              <BusFront size={14} className="text-blue-500" />
                              AC Sleeper / Seater
                            </span>
                          </div>
                        </div>

                        {/* Bottom CTA & Price */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[11px] font-semibold text-slate-400 block">
                              Starting from
                            </span>
                            <span className="text-2xl font-black text-orange-600">
                              ₹{route.fare || 450}
                            </span>
                          </div>

                          <Link
                            to={`/view-buses/${route._id}`}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all duration-200 active:scale-95 group-hover:shadow-lg"
                          >
                            <span>View Buses</span>
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center max-w-lg mx-auto shadow-sm border border-slate-200">
                <BusFront size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800">
                  No Routes Available
                </h3>
                <p className="text-slate-500 mt-2 text-sm">
                  There are currently no active routes found in the system.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
