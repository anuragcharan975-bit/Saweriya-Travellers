import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  ArrowRightLeft,
  CalendarDays,
  Bus,
  ShieldCheck,
  Zap,
  CreditCard,
  Star,
  Sparkles,
} from "lucide-react";
import { SearchSchedule } from "../../Service/admin/Schedule";
import { ViewAllBus } from "../../Service/admin/Bus";

const HeroSection = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Default fallback image if DB has no buses with photos
  const fallbackImages = [
    {
      id: "fallback-1",
      title: "Luxury Express Liner",
      url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: "fallback-2",
      title: "Intercity Highway Cruiser",
      url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1920&q=80",
    },
  ];

  // ==========================================
  // GET BUS IMAGES
  // ==========================================
  useEffect(() => {
    const getBusImages = async () => {
      try {
        const response = await ViewAllBus();
        const buses = Array.isArray(response?.data) ? response.data : [];

        const images = buses
          .filter((bus) => bus?.bus_image)
          .map((bus) => ({
            id: bus._id,
            title: bus.bus_name || "Bus",
            url: `http://localhost:4000/uploads/${bus.bus_image}`,
          }));

        if (images.length > 0) {
          setBackgroundImages(images);
        } else {
          setBackgroundImages(fallbackImages);
        }
        setCurrentImage(0);
      } catch (error) {
        console.log("BUS IMAGE ERROR:", error);
        setBackgroundImages(fallbackImages);
      }
    };

    getBusImages();
  }, []);

  // ==========================================
  // BUS IMAGE SLIDER
  // ==========================================
  useEffect(() => {
    if (backgroundImages.length < 2) return;

    const interval = setInterval(() => {
      setCurrentImage((previous) => (previous + 1) % backgroundImages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // ==========================================
  // SEARCH BUS
  // ==========================================
  const handleSearch = async (overrideFrom, overrideTo) => {
    setSearchError("");
    const srcVal = (typeof overrideFrom === "string" ? overrideFrom : from).trim();
    const dstVal = (typeof overrideTo === "string" ? overrideTo : to).trim();

    if (!srcVal) {
      setSearchError("Please enter source city");
      return;
    }

    if (!dstVal) {
      setSearchError("Please enter destination city");
      return;
    }

    try {
      setSearchLoading(true);

      const searchData = {
        source_city: srcVal.toLowerCase(),
        distance_city: dstVal.toLowerCase(),
        trip_date: date ? date : null,
      };

      const data = await SearchSchedule(searchData);

      const results = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      if (results.length === 0) {
        setSearchError("No buses found for this route. Please try another route or date.");
        return;
      }

      // If multiple routes match (e.g. typing 's' or 'd' matching several destinations), take user to Search page to see all
      if (results.length > 1) {
        navigate(`/search?from=${encodeURIComponent(srcVal)}&to=${encodeURIComponent(dstVal)}${date ? `&date=${date}` : ""}`, {
          state: {
            from: srcVal,
            to: dstVal,
            date: date,
            searchResults: results,
          },
        });
        return;
      }

      const firstResult = results[0];
      const routeId =
        firstResult?.route?._id ||
        firstResult?.route_id ||
        firstResult?._id;

      if (!routeId) {
        setSearchError("Route details could not be loaded.");
        return;
      }

      navigate(`/view-buses/${routeId}`, {
        state: {
          route: firstResult?.route || {
            source_city: srcVal,
            distance_city: dstVal,
          },
          searchData: searchData,
          searchDate: date,
          searchResults: results,
        },
      });
    } catch (error) {
      console.log("SEARCH ERROR:", error);
      setSearchError(
        error?.response?.data?.message ||
        "Something went wrong while searching. Please check your connection."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  // ==========================================
  // SWAP CITIES
  // ==========================================
  const swapCities = () => {
    const oldFrom = from;
    setFrom(to);
    setTo(oldFrom);
  };

  // Quick route fill helper
  const selectQuickRoute = (src, dst) => {
    const isAlreadySelected =
      from.trim().toLowerCase() === src.toLowerCase() &&
      to.trim().toLowerCase() === dst.toLowerCase();

    setFrom(src);
    setTo(dst);
    setSearchError("");

    if (isAlreadySelected) {
      handleSearch(src, dst);
    }
  };

  return (
    <div className="w-full">
      <section className="relative min-h-[720px] w-full overflow-hidden flex items-center justify-center pt-24 pb-16">
        {/* ================= BACKGROUND IMAGE WITH CROSSFADE ================= */}
        {backgroundImages.map((bus, idx) => (
          <img
            key={bus.id || idx}
            src={bus.url}
            alt={bus.title}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-1000 transform scale-105 ${
              idx === currentImage ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        ))}

        {/* Ambient Dark Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />

        {/* Decorative ambient glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* ================= CONTENT CONTAINER ================= */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 w-full py-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold shadow-xl mb-6">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm text-white">
                <Bus size={13} />
              </span>
              <span>India's Premier Smart Bus Booking Network</span>
              <span className="flex items-center gap-1 text-amber-300 font-bold ml-1">
                <Sparkles size={13} /> 500+ Routes
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] drop-shadow-2xl">
              Travel More.{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                Worry Less.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-xl font-medium text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow">
              Instant e-tickets, guaranteed comfortable seats, and 24/7 live GPS tracking for your perfect journey.
            </p>
          </div>

          {/* ================= SEARCH CARD ================= */}
          <div className="mt-10 max-w-5xl mx-auto">
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/40 ring-1 ring-black/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Book Your Bus Journey
                  </h2>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Zero Booking Fees
                </span>
              </div>

              {/* Input Form Fields Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_1fr_auto] gap-3 items-center">
                {/* FROM */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-orange-600 transition-colors group-focus-within:bg-orange-500 group-focus-within:text-white">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="From City (e.g., Jaipur)"
                    list="hero-from-cities"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-14 pr-4 font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />
                  <datalist id="hero-from-cities">
                    <option value="Jaipur" />
                    <option value="Delhi" />
                    <option value="Mumbai" />
                    <option value="Bangalore" />
                    <option value="Ahmedabad" />
                  </datalist>
                  <span className="absolute -top-2.5 left-4 bg-white px-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 rounded">
                    Departure
                  </span>
                </div>

                {/* SWAP BUTTON */}
                <button
                  type="button"
                  onClick={swapCities}
                  className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 hover:rotate-180 active:scale-95"
                  title="Swap Departure and Destination"
                >
                  <ArrowRightLeft size={18} />
                </button>

                {/* TO */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 transition-colors group-focus-within:bg-blue-500 group-focus-within:text-white">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="To City (e.g., Saweriya Seth)"
                    list="hero-to-cities"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-14 pr-4 font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />
                  <datalist id="hero-to-cities">
                    <option value="Saweriya Seth" />
                    <option value="Surat" />
                    <option value="Delhi" />
                    <option value="Jaipur" />
                    <option value="Goa" />
                    <option value="Pune" />
                    <option value="Bhopal" />
                    <option value="Udaipur" />
                    <option value="Ajmer" />
                    <option value="Bikaner" />
                    <option value="Dehradun" />
                  </datalist>
                  <span className="absolute -top-2.5 left-4 bg-white px-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 rounded">
                    Destination
                  </span>
                </div>

                {/* DATE */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-focus-within:bg-emerald-500 group-focus-within:text-white">
                    <CalendarDays size={18} />
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-14 pr-4 font-semibold text-slate-900 outline-none transition-all duration-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />
                  <span className="absolute -top-2.5 left-4 bg-white px-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 rounded">
                    Travel Date (Optional)
                  </span>
                </div>

                {/* SEARCH CTA */}
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="flex h-14 w-full lg:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 text-base"
                >
                  <Search size={20} className={searchLoading ? "animate-spin" : ""} />
                  <span>{searchLoading ? "Searching..." : "Find Buses"}</span>
                </button>
              </div>

              {/* QUICK ROUTE CHIPS */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={13} className="text-orange-500" />
                  Popular:
                </span>
                {[
                  { from: "Jaipur", to: "Delhi" },
                  { from: "Delhi", to: "Jaipur" },
                  { from: "Mumbai", to: "Pune" },
                  { from: "Bangalore", to: "Goa" },
                  { from: "Ahmedabad", to: "Surat" },
                ].map((item, idx) => {
                  const isSelected =
                    from.trim().toLowerCase() === item.from.toLowerCase() &&
                    to.trim().toLowerCase() === item.to.toLowerCase();

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectQuickRoute(item.from, item.to)}
                      title={isSelected ? "Click again to search this route" : `Select ${item.from} → ${item.to}`}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 border active:scale-95 ${
                        isSelected
                          ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20 font-bold scale-[1.03]"
                          : "bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 border-slate-200 hover:border-orange-200"
                      }`}
                    >
                      <span>{item.from}</span>
                      <span className={isSelected ? "text-orange-100" : "text-slate-400"}>→</span>
                      <span>{item.to}</span>
                    </button>
                  );
                })}
              </div>

              {/* SEARCH ERROR NOTIFICATION */}
              {searchError && (
                <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200/80 px-4 py-3 text-sm font-semibold text-rose-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  {searchError}
                </div>
              )}
            </div>

            {/* TRUST AND FEATURE METRICS BAR */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-white">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">GPS Tracked</div>
                  <div className="text-xs font-medium text-slate-200">100% Safe Rides</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Instant Confirm</div>
                  <div className="text-xs font-medium text-slate-200">E-Ticket on Mobile</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Secure Payments</div>
                  <div className="text-xs font-medium text-slate-200">UPI, Cards, Wallets</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Star size={20} className="fill-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Rated 4.9 / 5</div>
                  <div className="text-xs font-medium text-slate-200">20,000+ Happy Riders</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SLIDER DOTS */}
        {backgroundImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {backgroundImages.map((bus, index) => (
              <button
                key={bus.id || index}
                type="button"
                onClick={() => setCurrentImage(index)}
                aria-label={`Show slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentImage
                    ? "w-8 bg-orange-500"
                    : "w-2 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HeroSection;
