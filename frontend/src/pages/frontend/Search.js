import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

import { SearchSchedule } from "../../Service/admin/Schedule";
import { ViewAllRoute } from "../../Service/admin/Route";
import { getRouteImage } from "../../utils/routeImages";

export default function Search() {

  const navigate = useNavigate();
  const location = useLocation();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const [filteredRoutes, setFilteredRoutes] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // =====================================================
  // PAGE LOAD: CHECK STATE / QUERY PARAMS / ALL ROUTES
  // =====================================================

  useEffect(() => {

    // 1. If state was passed with searchResults from HeroSection
    if (location.state?.searchResults && location.state.searchResults.length > 0) {
      if (location.state.from) setFrom(location.state.from);
      if (location.state.to) setTo(location.state.to);
      if (location.state.date) setDate(location.state.date);
      setFilteredRoutes(location.state.searchResults);
      return;
    }

    // 2. Check query params (?from=...&to=...&date=...)
    const params = new URLSearchParams(location.search);
    const qFrom = params.get("from");
    const qTo = params.get("to");
    const qDate = params.get("date");

    if (qFrom || qTo) {
      if (qFrom) setFrom(qFrom);
      if (qTo) setTo(qTo);
      if (qDate) setDate(qDate);

      const doParamSearch = async () => {
        try {
          setLoading(true);
          setError("");
          const data = await SearchSchedule({
            ...(qFrom ? { source_city: qFrom.trim().toLowerCase() } : {}),
            ...(qTo ? { distance_city: qTo.trim().toLowerCase() } : {}),
            ...(qDate ? { trip_date: qDate } : {})
          });

          let result = [];
          if (Array.isArray(data)) result = data;
          else if (Array.isArray(data?.data)) result = data.data;
          else if (Array.isArray(data?.data?.data)) result = data.data.data;

          if (result.length === 0) {
            setError("No buses found for this route.");
          } else {
            setFilteredRoutes(result);
          }
        } catch (err) {
          setError(err?.response?.data?.message || "No buses found for this route.");
        } finally {
          setLoading(false);
        }
      };

      doParamSearch();
      return;
    }

    // 3. Default: Load all routes
    const getAllRoutes = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await ViewAllRoute();

        console.log("ALL ROUTES RESPONSE:", data);

        let result = [];

        if (Array.isArray(data)) {

          result = data;

        } else if (Array.isArray(data?.data)) {

          result = data.data;

        } else if (Array.isArray(data?.data?.data)) {

          result = data.data.data;

        }

        console.log("ALL ROUTES:", result);

        setFilteredRoutes(result);

      } catch (err) {

        console.log("ALL ROUTES ERROR:", err);

        console.log(
          "ERROR RESPONSE:",
          err?.response?.data
        );

        setError(
          err?.response?.data?.message ||
          "Unable to load routes."
        );

      } finally {

        setLoading(false);

      }

    };

    getAllRoutes();

  }, [location.search, location.state]);


  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = async (e) => {

    e.preventDefault();

    setError("");

    if (!from.trim() && !to.trim()) {

      return;

    }

    try {

      setLoading(true);

      const searchData = {
        ...(from.trim() ? { source_city: from.trim().toLowerCase() } : {}),
        ...(to.trim() ? { distance_city: to.trim().toLowerCase() } : {}),
        ...(date ? { trip_date: date } : {}),
      };


      console.log(
        "SEARCH DATA:",
        searchData
      );


      const data =
        await SearchSchedule(searchData);


      console.log(
        "SEARCH RESPONSE:",
        data
      );

      console.log(
        "SEARCH RESPONSE TYPE:",
        typeof data
      );


      let result = [];


      // =================================================
      // API RESPONSE HANDLE
      // =================================================

      if (Array.isArray(data)) {

        result = data;

      } else if (
        Array.isArray(data?.data)
      ) {

        result = data.data;

      } else if (
        Array.isArray(data?.data?.data)
      ) {

        result = data.data.data;

      }


      console.log(
        "FINAL SEARCH RESULT:",
        result
      );


      if (result.length === 0) {

        setFilteredRoutes([]);

        setError(
          "No buses found for this route."
        );

        return;

      }


      setFilteredRoutes(result);

    } catch (err) {

      console.log(
        "SEARCH ERROR:",
        err
      );

      console.log(
        "ERROR RESPONSE:",
        err?.response?.data
      );


      setError(
        err?.response?.data?.message ||
        "Something went wrong while searching buses."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // ROUTE ID
  // =====================================================

  const getRouteId = (item) => {

    return (

      item?.route?._id ||

      item?.route?.id ||

      item?.route_id ||

      item?._id ||

      item?.id

    );

  };


  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const handleClearSearch = async () => {

    setFrom("");
    setTo("");
    setDate("");
    setError("");

    try {

      setLoading(true);

      const data =
        await ViewAllRoute();

      let result = [];

      if (Array.isArray(data)) {

        result = data;

      } else if (
        Array.isArray(data?.data)
      ) {

        result = data.data;

      } else if (
        Array.isArray(data?.data?.data)
      ) {

        result = data.data.data;

      }

      setFilteredRoutes(result);

    } catch (err) {

      console.log(
        "CLEAR SEARCH ERROR:",
        err
      );

      setError(
        "Unable to load all routes."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-gray-50">

      <Header />


      <section className="pt-32 pb-20">

        <div className="max-w-7xl mx-auto px-6">


          {/* ============================================
              HEADING
          ============================================ */}

          <div className="text-center mb-12">

            <h2 className="text-4xl font-bold">

              Search Bus

              <span className="text-orange-500">
                {" "}By Routes
              </span>

            </h2>

            <p className="text-gray-500 mt-2">

              Choose your favorite destination

            </p>

          </div>


          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">


            {/* ==========================================
                SEARCH BOX
            ========================================== */}

            <div className="lg:col-span-4">

              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">


                <h3 className="text-3xl font-bold mb-6">

                  Search

                  <span className="text-orange-500">
                    {" "}Buses
                  </span>

                </h3>


                <form
                  onSubmit={handleSearch}
                  className="space-y-5"
                >


                  {/* ==================================
                      FROM
                  ================================== */}

                  <div>

                    <label className="block mb-2 font-medium">

                      From

                    </label>


                    <input
                      type="text"
                      value={from}
                      onChange={(e) =>
                        setFrom(e.target.value)
                      }
                      placeholder="Enter source city (e.g., Jaipur)"
                      list="search-from-cities"
                      className="w-full h-14 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <datalist id="search-from-cities">
                      <option value="Jaipur" />
                      <option value="Delhi" />
                      <option value="Mumbai" />
                      <option value="Bangalore" />
                      <option value="Ahmedabad" />
                    </datalist>

                  </div>


                  {/* ==================================
                      TO
                  ================================== */}

                  <div>

                    <label className="block mb-2 font-medium">

                      To

                    </label>


                    <input
                      type="text"
                      value={to}
                      onChange={(e) =>
                        setTo(e.target.value)
                      }
                      placeholder="Enter destination city (e.g., Saweriya Seth)"
                      list="search-to-cities"
                      className="w-full h-14 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <datalist id="search-to-cities">
                      <option value="Salasar" />
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

                  </div>


                  {/* ==================================
                      DATE
                  ================================== */}

                  <div>

                    <label className="block mb-2 font-medium">

                      Date (Optional)

                    </label>


                    <input
                      type="date"
                      value={date}
                      onChange={(e) =>
                        setDate(e.target.value)
                      }
                      className="w-full h-14 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    />

                  </div>


                  {/* ==================================
                      ERROR
                  ================================== */}

                  {error && (

                    <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl">

                      {error}

                    </div>

                  )}


                  {/* ==================================
                      SEARCH BUTTON
                  ================================== */}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-14 text-white rounded-xl font-semibold ${
                      loading
                        ? "bg-gray-400"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >

                    {loading
                      ? "Searching..."
                      : "Search Buses"}

                  </button>


                  {/* ==================================
                      CLEAR BUTTON
                  ================================== */}

                  {(from || to || date) && (

                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="w-full h-12 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100"
                    >

                      Show All Buses

                    </button>

                  )}

                </form>

              </div>

            </div>


            {/* ==========================================
                RESULTS
            ========================================== */}

            <div className="lg:col-span-8">


              {/* ========================================
                  LOADING
              ======================================== */}

              {loading && (

                <div className="bg-white rounded-2xl shadow p-10 text-center">

                  <p className="text-xl">

                    Loading buses...

                  </p>

                </div>

              )}


              {/* ========================================
                  NO DATA
              ======================================== */}

              {!loading &&
                filteredRoutes.length === 0 &&
                !error && (

                  <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">

                    No buses available.

                  </div>

                )}


              {/* ========================================
                  ROUTES / BUSES
              ======================================== */}

              {!loading &&
                filteredRoutes.length > 0 && (

                  <div className="space-y-6">


                    {filteredRoutes.map(
                      (item, index) => {

                        const route =
                          item?.route ||
                          item;

                        const routeId =
                          getRouteId(item);


                        return (

                          <div
                            key={
                              routeId ||
                              index
                            }
                            className="group w-full bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-5 sm:p-6 border border-slate-200/80 hover:border-orange-200"
                          >
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                              {/* Destination Photo Thumbnail */}
                              <div className="relative w-full sm:w-36 h-36 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                                <img
                                  src={getRouteImage(route)}
                                  alt={route?.distance_city || "Destination"}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent sm:hidden" />
                                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs sm:hidden">
                                  {route?.distance_city}
                                </span>
                              </div>

                              {/* Route Info */}
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                {/* From */}
                                <div>
                                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                    From
                                  </p>
                                  <h3 className="text-xl sm:text-2xl font-black capitalize text-slate-900">
                                    {route?.source_city || "Source"}
                                  </h3>
                                </div>

                                {/* Flow / Duration */}
                                <div className="text-center">
                                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full inline-block">
                                    {route?.duration || "Express"}
                                  </span>
                                  <div className="relative my-2">
                                    <div className="border-t-2 border-dashed border-orange-400"></div>
                                    <span className="absolute right-0 -top-3 text-lg text-orange-500">
                                      ➜
                                    </span>
                                  </div>
                                  <p className="text-emerald-600 font-bold text-xs">
                                    {route?.distance || ""}
                                  </p>
                                </div>

                                {/* To */}
                                <div>
                                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                    To
                                  </p>
                                  <h3 className="text-xl sm:text-2xl font-black capitalize text-slate-900">
                                    {route?.distance_city || "Destination"}
                                  </h3>
                                </div>

                                {/* Fare */}
                                <div className="flex flex-col sm:items-end justify-center">
                                  <p className="text-gray-400 text-xs font-medium">
                                    Starting From
                                  </p>
                                  <h2 className="text-2xl sm:text-3xl font-black text-orange-500">
                                    ₹{route?.fare || 500}
                                  </h2>
                                </div>
                              </div>

                              {/* Action Button */}
                              <div className="shrink-0 flex items-center justify-end">
                                {routeId ? (
                                  <button
                                    onClick={() => {
                                      console.log("VIEW BUS ROUTE ID:", routeId);
                                      navigate(`/view-buses/${routeId}`, {
                                        state: {
                                          route: route,
                                          searchData: item,
                                          searchDate: date,
                                        },
                                      });
                                    }}
                                    className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3.5 rounded-2xl font-bold transition shadow-md shadow-orange-500/20 active:scale-95"
                                  >
                                    View Buses
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="w-full sm:w-auto bg-gray-300 text-gray-500 px-6 py-3.5 rounded-2xl font-bold cursor-not-allowed"
                                  >
                                    Unavailable
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                        );

                      }
                    )}

                  </div>

                )}

            </div>

          </div>

        </div>

      </section>


      <Footer />

    </div>

  );

}