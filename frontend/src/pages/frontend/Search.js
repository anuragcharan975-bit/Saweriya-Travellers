import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

import { SearchSchedule } from "../../Service/admin/Schedule";
import { ViewAllRoute } from "../../Service/admin/Route";

export default function Search() {

  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const [filteredRoutes, setFilteredRoutes] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // =====================================================
  // PAGE OPEN HOTE HI SAARE ROUTES LOAD KARO
  // =====================================================

  useEffect(() => {

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

  }, []);


  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = async (e) => {

    e.preventDefault();

    setError("");

    /*
      Agar From aur To dono empty hain,
      to saari routes already show ho rahi hain.
    */

    if (!from.trim() && !to.trim()) {

      return;

    }

    /*
      Agar sirf From ya sirf To dala hai
    */

    if (!from.trim() || !to.trim()) {

      setError(
        "Please enter both From and To city."
      );

      return;

    }

    try {

      setLoading(true);

      const searchData = {

        source_city:
          from.trim().toLowerCase(),

        distance_city:
          to.trim().toLowerCase(),

        ...(date
          ? { trip_date: date }
          : {}),

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
                      placeholder="Enter source city"
                      className="w-full h-14 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    />

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
                      placeholder="Enter destination city"
                      className="w-full h-14 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    />

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
                            className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition p-7"
                          >


                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">


                              {/* ==================================
                                  FROM
                              ================================== */}

                              <div>

                                <p className="text-gray-400 text-sm">

                                  From

                                </p>


                                <h3 className="text-2xl font-bold capitalize">

                                  {route?.source_city ||
                                    "Source"}

                                </h3>

                              </div>


                              {/* ==================================
                                  ROUTE
                              ================================== */}

                              <div className="text-center">

                                <p className="text-gray-500">

                                  {route?.duration ||
                                    "Journey"}

                                </p>


                                <div className="relative my-3">

                                  <div className="border-t-2 border-dashed border-orange-400"></div>


                                  <span className="absolute right-0 -top-3 text-2xl text-orange-500">

                                    ➜

                                  </span>

                                </div>


                                <p className="text-green-600 font-medium">

                                  {route?.distance ||
                                    ""}

                                </p>

                              </div>


                              {/* ==================================
                                  TO
                              ================================== */}

                              <div>

                                <p className="text-gray-400 text-sm">

                                  To

                                </p>


                                <h3 className="text-2xl font-bold capitalize">

                                  {route?.distance_city ||
                                    "Destination"}

                                </h3>

                              </div>


                              {/* ==================================
                                  FARE
                              ================================== */}

                              <div className="text-center">

                                <p className="text-gray-500">

                                  Starting From

                                </p>


                                <h2 className="text-3xl font-bold text-orange-500">

                                  ₹
                                  {route?.fare ||
                                    500}

                                </h2>

                              </div>


                              {/* ==================================
                                  VIEW BUSES
                              ================================== */}

                              <div>

                                {routeId ? (

                                  <button
                                    onClick={() => {

                                      console.log(
                                        "VIEW BUS ROUTE ID:",
                                        routeId
                                      );


                                      navigate(
                                        `/view-buses/${routeId}`,
                                        {
                                          state: {

                                            route:
                                              route,

                                            searchData:
                                              item,

                                            searchDate:
                                              date,

                                          },

                                        }
                                      );

                                    }}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-5 py-4 rounded-xl font-semibold"
                                  >

                                    View Buses

                                  </button>

                                ) : (

                                  <button
                                    disabled
                                    className="w-full bg-gray-400 text-white px-5 py-4 rounded-xl font-semibold"
                                  >

                                    Route ID Missing

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