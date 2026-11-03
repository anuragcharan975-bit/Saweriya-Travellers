import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ViewPopularRoutes } from "../../Service/admin/Route";
import { getRouteImage } from "../../utils/routeImages";
import {
  Clock,
  Navigation,
  ArrowRight,
  Bus,
  Sparkles,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const getDestinationImage = getRouteImage;

// The canonical popular routes with verified DB fallback values
const DEFAULT_POPULAR_ROUTES = [
  {
    _id: "6ae1d5966c3983675d02ac46",
    route_name: "Jaipur - Saweriya Seth Royal Sleeper",
    source_city: "Jaipur",
    distance_city: "Saweriya Seth",
    distance: "390 km",
    duration: "7 hrs 30 min",
    fare: 600,
    badge: "Flagship Divine Express",
    image: getRouteImage("saweriya"),
  },
  {
    _id: "6a86d0e1799407248ea06fc9",
    route_name: "Jaipur - Delhi Superfast Express",
    source_city: "Jaipur",
    distance_city: "Delhi",
    distance: "280 km",
    duration: "5 hrs 00 min",
    fare: 450,
    badge: "Most Booked",
    image: getRouteImage("delhi"),
  },
  {
    _id: "6ae86e457b369fafc905aaeb",
    route_name: "Delhi - Jaipur Highway Cruiser",
    source_city: "Delhi",
    distance_city: "Jaipur",
    distance: "280 km",
    duration: "5 hrs 00 min",
    fare: 480,
    badge: "Express Service",
    image: getRouteImage("jaipur"),
  },
  {
    _id: "6ae86e457b369fafc905aaed",
    route_name: "Mumbai - Pune Deccan Expressway",
    source_city: "Mumbai",
    distance_city: "Pune",
    distance: "150 km",
    duration: "3 hrs 00 min",
    fare: 350,
    badge: "Deccan Cruiser",
    image: getRouteImage("pune"),
  },
  {
    _id: "6ae86e457b369fafc905aaef",
    route_name: "Bangalore - Goa Coastal Sleeper",
    source_city: "Bangalore",
    distance_city: "Goa",
    distance: "560 km",
    duration: "11 hrs 30 min",
    fare: 950,
    badge: "Luxury Sleeper",
    image: getRouteImage("goa"),
  },
  {
    _id: "6ae86e467b369fafc905aaf1",
    route_name: "Ahmedabad - Surat Intercity Express",
    source_city: "Ahmedabad",
    distance_city: "Surat",
    distance: "265 km",
    duration: "4 hrs 30 min",
    fare: 420,
    badge: "Fastest Trip",
    image: getRouteImage("surat"),
  },
];

export default function PopularRoutes() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const getRoutes = async () => {
      try {
        const res = await ViewPopularRoutes();
        const data = Array.isArray(res?.data) ? res.data : [];

        if (data.length > 0) {
          const priorityKeys = [
            "jaipur-saweriya seth",
            "jaipur-delhi",
            "delhi-jaipur",
            "mumbai-pune",
            "bangalore-goa",
            "ahmedabad-surat",
          ];

          const badgeMap = {
            "jaipur-saweriya seth": "Flagship Divine Express",
            "jaipur-delhi": "Most Booked",
            "delhi-jaipur": "Express Service",
            "mumbai-pune": "Deccan Cruiser",
            "bangalore-goa": "Luxury Sleeper",
            "ahmedabad-surat": "Fastest Trip",
          };

          const matched = [];
          const others = [];

          priorityKeys.forEach((key) => {
            const [src, dst] = key.split("-");
            const found = data.find(
              (r) =>
                (r.source_city || "").trim().toLowerCase() === src &&
                (r.distance_city || "").trim().toLowerCase().includes(dst)
            );
            if (found) {
              matched.push({
                ...found,
                badge: badgeMap[key] || "Verified Route",
                image: getRouteImage(found),
              });
            } else {
              const fb = DEFAULT_POPULAR_ROUTES.find(
                (d) =>
                  d.source_city.toLowerCase() === src &&
                  d.distance_city.toLowerCase() === dst
              );
              if (fb) matched.push(fb);
            }
          });

          data.forEach((r) => {
            const key = `${(r.source_city || "").trim().toLowerCase()}-${(
              r.distance_city || ""
            )
              .trim()
              .toLowerCase()}`;
            if (!priorityKeys.includes(key)) {
              others.push({
                ...r,
                badge: "Active Route",
                image: getDestinationImage(r.distance_city),
              });
            }
          });

          setRoutes([...matched, ...others].slice(0, 5));
        } else {
          setRoutes(DEFAULT_POPULAR_ROUTES);
        }
      } catch (error) {
        console.log("POPULAR ROUTES ERROR:", error);
        setRoutes(DEFAULT_POPULAR_ROUTES);
      }
    };

    getRoutes();
  }, []);

  const displayRoutes = routes.length > 0 ? routes : DEFAULT_POPULAR_ROUTES;

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Guaranteed comfort on our highest-rated intercity routes with verified daily schedules
          </p>
        </div>

        {/* Routes Grid: 5 columns on desktop with motion & destination images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {displayRoutes.map((route, idx) => (
            <div
              key={route._id || idx}
              className="group relative bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2.5 flex flex-col justify-between overflow-hidden"
            >
              {/* Destination Photo Header with Motion Zoom */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={route.image || getDestinationImage(route.distance_city)}
                  alt={route.distance_city}
                  className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-115 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Gradient Overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent opacity-85 group-hover:opacity-70 transition-opacity duration-300" />

                {/* Floating Badge & Bus Indicator */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md uppercase tracking-wider flex items-center gap-1 group-hover:scale-105 transition-transform duration-300">
                    <Sparkles size={11} />
                    <span>{route.badge || "Popular"}</span>
                  </span>
                  <span className="text-[10px] font-semibold text-white/95 bg-slate-950/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                    Daily AC
                  </span>
                </div>

                {/* Destination Name Banner over Image */}
                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                      <MapPin size={11} />
                      <span>Destination</span>
                    </span>
                    <h3 className="text-lg font-black text-white leading-tight drop-shadow-md capitalize">
                      {route.distance_city}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                    <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 line-clamp-1">
                    {route.route_name || `${route.source_city} to ${route.distance_city}`}
                  </h4>

                  {/* Cities Timeline with interactive bus motion on hover */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 group-hover:border-orange-200/80 group-hover:bg-orange-50/20 transition-all duration-300 mb-4">
                    <div className="flex items-center justify-between gap-1">
                      {/* From */}
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1">
                          <MapPin size={10} className="text-orange-500 shrink-0" />
                          <span>From</span>
                        </div>
                        <div className="text-sm font-bold text-slate-800 truncate capitalize mt-0.5">
                          {route.source_city}
                        </div>
                      </div>

                      {/* Timeline Bus Indicator with forward motion on hover */}
                      <div className="flex flex-col items-center px-1 shrink-0">
                        <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs group-hover:translate-x-1.5 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                          <Bus size={13} />
                        </div>
                        <div className="w-10 border-t-2 border-dashed border-orange-300 my-1 group-hover:border-orange-500 transition-colors"></div>
                      </div>

                      {/* To */}
                      <div className="text-right flex-1 min-w-0">
                        <div className="text-[10px] font-semibold uppercase text-slate-400 flex items-center justify-end gap-1">
                          <MapPin size={10} className="text-blue-500 shrink-0" />
                          <span>To</span>
                        </div>
                        <div className="text-sm font-bold text-slate-800 truncate capitalize mt-0.5">
                          {route.distance_city}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Distance & Duration Pills */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                      <Navigation size={12} className="text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Distance</span>
                        <span className="font-bold text-slate-700 text-[11px] truncate block">{route.distance || "250 km"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                      <Clock size={12} className="text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Duration</span>
                        <span className="font-bold text-slate-700 text-[11px] truncate block">{route.duration || "4h 30m"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Fares From</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                        ₹{route.fare || 450}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">/seat</span>
                    </div>
                  </div>

                  <Link
                    to={`/view-buses/${route._id}`}
                    state={{ route }}
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 transition-all duration-300 group-hover:gap-2.5 group-hover:shadow-orange-500/35 active:scale-95"
                  >
                    <span>Book</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
