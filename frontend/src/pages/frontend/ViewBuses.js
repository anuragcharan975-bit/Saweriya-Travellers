import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
  BusFront,
  Clock,
  MapPin,
  Armchair,
  ArrowRight,
} from "lucide-react";

import Header from "./Header";
import Footer from "./Footer";

import { ViewScheduleByRoute } from "../../Service/admin/Schedule";

export default function ViewBusesList() {

  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  // ==========================================
  // SEARCH DATA
  // ==========================================

  const routeFromSearch =
    location.state?.route || {};

  const searchData =
    location.state?.searchData || {};

  const searchDate =
    location.state?.searchDate || "";

  // ==========================================
  // STATES
  // ==========================================

  const [buses, setBuses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // GET ALL BUSES FOR ROUTE
  // ==========================================

  useEffect(() => {

    const getBuses = async () => {

      try {

        setLoading(true);

        setError("");

        console.log(
          "VIEW BUSES ROUTE ID:",
          id
        );

        if (!id) {

          setError("Route ID is missing.");

          setLoading(false);

          return;
        }

        // ==========================================
        // GET ALL SCHEDULES / BUSES
        // ==========================================

        const response =
          await ViewScheduleByRoute(id);

        console.log(
          "VIEW BUS API RESPONSE:",
          response
        );

        // ==========================================
        // API RESPONSE HANDLE
        // ==========================================

        let result = [];

        if (Array.isArray(response)) {

          result = response;

        } else if (
          Array.isArray(response?.data)
        ) {

          result = response.data;

        } else if (
          Array.isArray(response?.data?.data)
        ) {

          result = response.data.data;

        } else if (
          Array.isArray(response?.schedules)
        ) {

          result = response.schedules;

        } else if (
          Array.isArray(response?.results)
        ) {

          result = response.results;

        }

        console.log(
          "ALL BUSES:",
          result
        );

        // ==========================================
        // SET ALL BUSES
        // ==========================================

        setBuses(result);

        if (result.length === 0) {

          setError(
            "No buses are available for this route."
          );

        }

      } catch (err) {

        console.log(
          "VIEW BUS ERROR:",
          err
        );

        console.log(
          "VIEW BUS ERROR RESPONSE:",
          err?.response?.data
        );

        setError(
          err?.response?.data?.message ||
          "Unable to load buses."
        );

      } finally {

        setLoading(false);

      }

    };

    getBuses();

  }, [id]);

  // ==========================================
  // SELECT SEATS
  // ==========================================

  const handleBookNow = (schedule) => {

    console.log(
      "SELECTED BUS:",
      schedule
    );

    navigate(
      `/view-seat/${schedule?._id}`,
      {
        state: {

          bus: schedule,

          route: routeFromSearch,

          searchData: searchData,

          searchDate: searchDate,

        },
      }
    );

  };

  // ==========================================
  // RETURN
  // ==========================================

  return (

    <div className="min-h-screen bg-slate-100">

      <Header />

      <section className="pt-28 pb-16">

        <div className="max-w-7xl mx-auto px-6">

          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="mb-8">

            <h1 className="text-4xl font-bold">

              Available

              <span className="text-orange-500">
                {" "}Buses
              </span>

            </h1>

            <div className="flex flex-wrap gap-6 mt-4 text-gray-600">

              {/* SOURCE */}

              <div className="flex items-center gap-2">

                <MapPin size={20} />

                <span>

                  {routeFromSearch?.source_city ||
                    searchData?.source_city ||
                    "Source"}

                </span>

              </div>

              {/* ARROW */}

              <ArrowRight size={20} />

              {/* DESTINATION */}

              <div className="flex items-center gap-2">

                <MapPin size={20} />

                <span>

                  {routeFromSearch?.distance_city ||
                    searchData?.distance_city ||
                    "Destination"}

                </span>

              </div>

              {/* DATE */}

              {searchDate && (

                <div className="flex items-center gap-2">

                  <Clock size={20} />

                  <span>

                    {searchDate}

                  </span>

                </div>

              )}

            </div>

          </div>


          {/* ==========================================
              LOADING
          ========================================== */}

          {loading && (

            <div className="bg-white rounded-2xl shadow p-12 text-center">

              <div className="text-xl font-semibold">

                Loading buses...

              </div>

            </div>

          )}


          {/* ==========================================
              ERROR
          ========================================== */}

          {!loading && error && (

            <div className="bg-white rounded-2xl shadow p-12 text-center">

              <BusFront
                size={60}
                className="mx-auto text-gray-400 mb-4"
              />

              <h2 className="text-2xl font-bold mb-2">

                No Buses Found

              </h2>

              <p className="text-gray-500">

                {error}

              </p>

              <button
                onClick={() =>
                  navigate("/search-bus")
                }
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
              >

                Search Again

              </button>

            </div>

          )}


          {/* ==========================================
              ALL BUSES
          ========================================== */}

          {!loading && buses.length > 0 && (

            <div className="space-y-6">

              {buses.map(
                (schedule, index) => {

                  // ==========================================
                  // BUS DATA
                  // ==========================================

                  const bus =
                    schedule?.bus ||
                    schedule;


                  // ==========================================
                  // ROUTE DATA
                  // ==========================================

                  const route =
                    schedule?.route ||
                    routeFromSearch ||
                    {};


                  // ==========================================
                  // BUS NAME
                  // ==========================================

                  const busName =
                    bus?.bus_name ||
                    schedule?.bus_name ||
                    "Bus";


                  // ==========================================
                  // DEPARTURE
                  // ==========================================

                  const departure =
                    schedule?.departure_time ||
                    schedule?.departure ||
                    "09:00 AM";


                  // ==========================================
                  // ARRIVAL
                  // ==========================================

                  const arrival =
                    schedule?.arrival_time ||
                    schedule?.arrival ||
                    "03:00 PM";


                  // ==========================================
                  // SOURCE
                  // ==========================================

                  const source =
                    route?.source_city ||
                    routeFromSearch?.source_city ||
                    searchData?.source_city ||
                    "Source";


                  // ==========================================
                  // DESTINATION
                  // ==========================================

                  const destination =
                    route?.distance_city ||
                    routeFromSearch?.distance_city ||
                    searchData?.distance_city ||
                    "Destination";


                  // ==========================================
                  // FARE
                  // ==========================================

                  const fare =
                    route?.fare ||
                    schedule?.fare ||
                    500;


                  // ==========================================
                  // TOTAL SEATS
                  // ==========================================

                  const totalSeats =
                    bus?.total_seats || 0;


                  return (

                    <div
                      key={
                        schedule?._id ||
                        bus?._id ||
                        index
                      }
                      className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6"
                    >

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">


                        {/* ==================================
                            BUS ICON
                        ================================== */}

                        <div className="lg:col-span-1">

                          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">

                            <BusFront
                              size={35}
                              className="text-orange-500"
                            />

                          </div>

                        </div>


                        {/* ==================================
                            BUS INFO
                            NO BUS ID / BUS TYPE ID
                        ================================== */}

                        <div className="lg:col-span-3">

                          <h2 className="text-2xl font-bold">

                            {busName}

                          </h2>


                          {/* BUS NUMBER ONLY */}

                          {bus?.register_number && (

                            <p className="text-sm text-gray-400 mt-2">

                              Bus No:{" "}

                              {bus.register_number}

                            </p>

                          )}

                        </div>


                        {/* ==================================
                            TIME
                        ================================== */}

                        <div className="lg:col-span-3">

                          <div className="flex items-center gap-4">


                            {/* DEPARTURE */}

                            <div>

                              <p className="text-2xl font-bold">

                                {departure}

                              </p>

                              <p className="text-gray-500">

                                {source}

                              </p>

                            </div>


                            {/* JOURNEY */}

                            <div className="flex-1">

                              <div className="border-t-2 border-dashed border-orange-400"></div>

                              <p className="text-center text-sm text-gray-400 mt-2">

                                {route?.duration ||
                                  "Journey"}

                              </p>

                            </div>


                            {/* ARRIVAL */}

                            <div>

                              <p className="text-2xl font-bold">

                                {arrival}

                              </p>

                              <p className="text-gray-500">

                                {destination}

                              </p>

                            </div>


                          </div>

                        </div>


                        {/* ==================================
                            SEATS
                        ================================== */}

                        <div className="lg:col-span-2">

                          <div className="flex items-center gap-2">

                            <Armchair
                              size={22}
                              className="text-green-500"
                            />

                            <div>

                              <p className="font-semibold">

                                {totalSeats} Seats

                              </p>

                              <p className="text-sm text-gray-500">

                                Available

                              </p>

                            </div>

                          </div>

                        </div>


                        {/* ==================================
                            FARE + BUTTON
                        ================================== */}

                        <div className="lg:col-span-3 text-right">

                          <p className="text-gray-500">

                            Starting from

                          </p>


                          <p className="text-3xl font-bold text-orange-500">

                            ₹{fare}

                          </p>


                          <button
                            onClick={() =>
                              handleBookNow(schedule)
                            }
                            className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-xl font-semibold"
                          >

                            Select Seats

                          </button>

                        </div>


                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </div>

      </section>


      <Footer />

    </div>

  );
}