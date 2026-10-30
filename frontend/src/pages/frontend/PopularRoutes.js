import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ViewPopularRoutes } from "../../Service/admin/Route";
import { Clock, Navigation, ArrowRight, Bus, Sparkles, MapPin } from "lucide-react";

export default function PopularRoutes() {
  const [routes, setRoutes] = useState([]);

  // Fallback demo routes if database has none
  const defaultRoutes = [
    {
      _id: "demo-1",
      route_name: "Jaipur - Delhi Superfast Express",
      source_city: "Jaipur",
      distance_city: "Delhi",
      distance: "280 km",
      duration: "5h 30m",
      fare: 450,
      badge: "Most Booked",
    },
    {
      _id: "demo-2",
      route_name: "Delhi - Jaipur Highway Cruiser",
      source_city: "Delhi",
      distance_city: "Jaipur",
      distance: "280 km",
      duration: "5h 15m",
      fare: 480,
      badge: "Express Service",
    },
    {
      _id: "demo-3",
      route_name: "Mumbai - Pune Deccan Expressway",
      source_city: "Mumbai",
      distance_city: "Pune",
      distance: "150 km",
      duration: "3h 00m",
      fare: 350,
      badge: "Daily Frequent",
    },
    {
      _id: "demo-4",
      route_name: "Bangalore - Goa Coastal Sleeper",
      source_city: "Bangalore",
      distance_city: "Goa",
      distance: "560 km",
      duration: "11h 30m",
      fare: 950,
      badge: "Luxury AC",
    },
  ];

  useEffect(() => {
    const getRoutes = async () => {
      try {
        const res = await ViewPopularRoutes();
        const data = Array.isArray(res?.data) ? res.data : [];
        if (data.length > 0) {
          setRoutes(data);
        } else {
          setRoutes(defaultRoutes);
        }
      } catch (error) {
        console.log("POPULAR ROUTES ERROR:", error);
        setRoutes(defaultRoutes);
      }
    };

    getRoutes();
  }, []);

  const displayRoutes = routes.length > 0 ? routes : defaultRoutes;

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4 border border-orange-200">
            <Sparkles size={14} />
            <span>Popular Destinations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Top Booked <span className="text-orange-500">Bus Routes</span>
          </h2>
          <p className="text-slate-500 mt-3 text-base sm:text-lg">
            Guaranteed comfort on our highest-rated intercity routes with reliable schedules
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayRoutes.map((route, idx) => (
            <div
              key={route._id || idx}
              className="group relative bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden p-6"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 opacity-80 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Badge & Route Name */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60 uppercase tracking-wider">
                    {route.badge || "Verified Route"}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Daily Service</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {route.route_name || `${route.source_city} to ${route.distance_city}`}
                </h3>

                {/* Cities Timeline */}
                <div className="my-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    {/* From */}
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-[11px] font-semibold uppercase text-slate-400 flex items-center gap-1">
                        <MapPin size={11} className="text-orange-500" />
                        From
                      </div>
                      <div className="text-base font-bold text-slate-800 truncate capitalize">
                        {route.source_city}
                      </div>
                    </div>

                    {/* Timeline Bus Indicator */}
                    <div className="flex flex-col items-center px-2 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
                        <Bus size={15} />
                      </div>
                      <div className="w-16 border-t-2 border-dashed border-orange-300 my-1"></div>
                    </div>

                    {/* To */}
                    <div className="text-right flex-1 min-w-0">
                      <div className="text-[11px] font-semibold uppercase text-slate-400 flex items-center justify-end gap-1">
                        <MapPin size={11} className="text-blue-500" />
                        To
                      </div>
                      <div className="text-base font-bold text-slate-800 truncate capitalize">
                        {route.distance_city}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Distance & Duration Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-6">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    <Navigation size={14} className="text-slate-400" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Distance</span>
                      <span className="font-bold text-slate-700">{route.distance || "250 km"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    <Clock size={14} className="text-slate-400" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                      <span className="font-bold text-slate-700">{route.duration || "4h 30m"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Fares From</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">
                      ₹{route.fare || 499}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/seat</span>
                  </div>
                </div>

                <Link
                  to={`/view-buses/${route._id}`}
                  className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-orange-500/20 transition-all duration-200 group-hover:gap-2.5 active:scale-95"
                >
                  <span>Book</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
