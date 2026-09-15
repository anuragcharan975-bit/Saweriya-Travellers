import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  MapPin,
  ArrowRightLeft,
  CalendarDays,
  Bus,
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

  // ==========================================
  // GET BUS IMAGES
  // ==========================================

  useEffect(() => {

    const getBusImages = async () => {

      try {

        const response = await ViewAllBus();

        console.log("========== BUS RESPONSE ==========");
        console.log(response);

        const buses = Array.isArray(response?.data)
          ? response.data
          : [];

        console.log("TOTAL BUSES:", buses.length);

        const images = buses
          .filter((bus) => bus?.bus_image)
          .map((bus) => ({
            id: bus._id,
            title: bus.bus_name || "Bus",
            url: `http://localhost:4000/uploads/${bus.bus_image}`,
          }));

        console.log("BUS IMAGES:", images);

        setBackgroundImages(images);
        setCurrentImage(0);

      } catch (error) {

        console.log("BUS IMAGE ERROR:", error);

      }

    };

    getBusImages();

  }, []);

  // ==========================================
  // BUS IMAGE SLIDER
  // EVERY 3 SECONDS
  // ==========================================

  useEffect(() => {

    if (backgroundImages.length < 2) {
      return;
    }

    const interval = setInterval(() => {

      setCurrentImage((previous) => {

        const next =
          (previous + 1) % backgroundImages.length;

        console.log(
          "IMAGE CHANGE:",
          previous,
          "=>",
          next
        );

        return next;

      });

    }, 3000);

    return () => {
      clearInterval(interval);
    };

  }, [backgroundImages.length]);

  // ==========================================
  // SEARCH BUS
  // DATE OPTIONAL
  // ==========================================
  const handleSearch = async () => {
    setSearchError("");

    if (!from.trim()) {
      setSearchError("Please enter source city");
      return;
    }

    if (!to.trim()) {
      setSearchError("Please enter destination city");
      return;
    }

    try {
      setSearchLoading(true);

      const searchData = {
        source_city: from.trim().toLowerCase(),
        distance_city: to.trim().toLowerCase(),
        trip_date: date ? date : null,
      };

      const data = await SearchSchedule(searchData);

      const results = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      console.log("SEARCH RESULTS:", results);

      if (results.length === 0) {
        setSearchError("No buses found for this route.");
        return;
      }

      // First result se route ID nikalo
      const firstResult = results[0];

      const routeId =
        firstResult?.route?._id ||
        firstResult?.route_id ||
        firstResult?._id;

      if (!routeId) {
        setSearchError("Route ID not found.");
        return;
      }

      // View Buses page par jao
      navigate(`/view-buses/${routeId}`, {
        state: {
          route: firstResult?.route || {
            source_city: from.trim(),
            distance_city: to.trim(),
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
        "Something went wrong while searching."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  // ==========================================
  // SWAP FROM / TO
  // ==========================================

  const swapCities = () => {

    const oldFrom = from;

    setFrom(to);
    setTo(oldFrom);

  };

  // ==========================================
  // CURRENT BUS IMAGE
  // ==========================================

  const currentBus =
    backgroundImages[currentImage];

  // ==========================================
  // IMAGE ERROR
  // ==========================================

  const handleImageError = (event) => {

    console.log(
      "IMAGE NOT FOUND:",
      event.currentTarget.src
    );

    event.currentTarget.style.display = "none";

  };

  // ==========================================
  // RETURN
  // ==========================================

  return (

    <div className="w-full">

      {/* ==================================================
          HERO SECTION
      ================================================== */}

      <section className="relative min-h-[680px] w-full overflow-hidden">

        {/* ================================================
            BACKGROUND BUS IMAGE
        ================================================ */}

        {currentBus ? (

          <img
            key={currentBus.id}
            src={currentBus.url}
            alt={currentBus.title}
            onError={handleImageError}
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000"
          />

        ) : (

          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

        )}

        {/* ================================================
            LIGHT OVERLAY
        ================================================ */}

        <div className="absolute inset-0 bg-black/20" />

        {/* ================================================
            LEFT GRADIENT
        ================================================ */}

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

        {/* ================================================
            TOP GRADIENT
        ================================================ */}

        <div className="absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />

        {/* ================================================
            CONTENT
        ================================================ */}

        <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl items-center px-5 py-16 sm:px-8 lg:px-10">

          <div className="w-full">

            {/* ============================================
                BADGE
            ============================================ */}

            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/25 bg-black/30 px-5 py-2.5 text-sm font-bold text-white shadow-xl backdrop-blur-sm">

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500">

                <Bus size={15} />

              </span>

              Safe & Comfortable Bus Travel

            </div>

            {/* ============================================
                HEADING
            ============================================ */}

            <div className="max-w-4xl">

              <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white drop-shadow-2xl sm:text-6xl lg:text-7xl">

                Travel More.

                <br />

                <span className="text-green-400">
                  Worry Less.
                </span>

              </h1>

              <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white drop-shadow-lg sm:text-lg">

                Book your bus tickets quickly and easily.
                Find comfortable buses, compare routes and
                travel to your destination with confidence.

              </p>

            </div>

            {/* ============================================
                SEARCH CARD
            ============================================ */}

            <div className="mt-10 max-w-6xl rounded-3xl border border-white/20 bg-white p-4 shadow-2xl sm:p-6">

              {/* SEARCH HEADER */}

              <div className="mb-5">

                <h2 className="text-2xl font-black text-gray-900">
                  Search Buses
                </h2>

                <p className="mt-1 text-sm font-medium text-gray-500">
                  Search by route. Date is optional.
                </p>

              </div>

              {/* ==========================================
                  SEARCH INPUTS
              ========================================== */}

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_1fr_1fr_auto]">

                {/* FROM */}

                <div className="relative">

                  <MapPin
                    size={21}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                  />

                  <input
                    type="text"
                    value={from}
                    onChange={(e) =>
                      setFrom(e.target.value)
                    }
                    placeholder="From"
                    className="h-14 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 font-semibold text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />

                </div>

                {/* SWAP */}

                <button
                  type="button"
                  onClick={swapCities}
                  className="flex h-14 w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 transition hover:border-green-500 hover:bg-green-50 hover:text-green-600 lg:w-14"
                  title="Swap cities"
                >

                  <ArrowRightLeft size={20} />

                </button>

                {/* TO */}

                <div className="relative">

                  <MapPin
                    size={21}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
                  />

                  <input
                    type="text"
                    value={to}
                    onChange={(e) =>
                      setTo(e.target.value)
                    }
                    placeholder="To"
                    className="h-14 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 font-semibold text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />

                </div>

                {/* DATE */}

                <div className="relative">

                  <CalendarDays
                    size={21}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                  />

                  <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                      setDate(e.target.value)
                    }
                    className="h-14 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 font-semibold text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />

                </div>

                {/* SEARCH BUTTON */}

                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="flex h-14 items-center justify-center gap-2 rounded-xl bg-green-600 px-8 font-black text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >

                  <Search size={21} />

                  {searchLoading
                    ? "Searching..."
                    : "Search"}

                </button>

              </div>

              {/* ERROR */}

              {searchError && (

                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">

                  {searchError}

                </div>

              )}

            </div>

            {/* CURRENT BUS */}

            {currentBus?.title && (

              <div className="mt-5 flex items-center gap-3">

                <span className="rounded-full bg-black/50 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">

                  Currently showing

                </span>

                <span className="text-base font-black text-white drop-shadow-lg">

                  {currentBus.title}

                </span>

              </div>

            )}

          </div>

        </div>

        {/* SLIDER DOTS */}

        {backgroundImages.length > 1 && (

          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">

            {backgroundImages.map((bus, index) => (

              <button
                key={bus.id || index}
                type="button"
                onClick={() =>
                  setCurrentImage(index)
                }
                className={`h-2.5 rounded-full transition-all duration-300 ${index === currentImage
                  ? "w-9 bg-green-400"
                  : "w-2.5 bg-white/60 hover:bg-white"
                  }`}
              />

            ))}

          </div>

        )}

        {/* IMAGE COUNTER */}

        {backgroundImages.length > 0 && (

          <div className="absolute bottom-8 right-8 z-20 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">

            {currentImage + 1} /{" "}
            {backgroundImages.length}

          </div>

        )}

      </section>

    </div>

  );

};

export default HeroSection;