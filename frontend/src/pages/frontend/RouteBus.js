import Header from "./Header";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ViewAllRoute } from "../../Service/admin/Route";

export default function RouteBus() {
  const [routes, setRoutes] = useState([]);

  const getRoutes = async () => {
    try {
      const res = await ViewAllRoute();
      setRoutes(res.data || []);
    } catch (error) {
      console.log(error);
      setRoutes([]);
    }
  };

  useEffect(() => {
    getRoutes();
  }, []);

  return (
    <div>
      <Header />

      <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">

          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              Available <span className="text-orange-500">Routes</span>
            </h2>

            <p className="text-gray-500 mt-2">
              Choose your destination
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-6">

              {routes.length > 0 ? (
                routes.map((route) => (
                  <div
                    key={route._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6"
                  >
                    {/* From */}
                    <div className="flex-1 min-w-[100px]">
                      <p className="text-gray-400 text-sm">From</p>
                      <h3 className="text-2xl font-bold">
                        {route.source_city}
                      </h3>
                    </div>

                    {/* Route */}
                    <div className="flex flex-col items-center min-w-[140px]">
                      <span className="text-gray-500 text-sm">
                        {route.duration}
                      </span>

                      <div className="w-full border-t-2 border-dashed border-orange-400 relative my-2">
                        <span className="absolute -right-2 -top-3 mt-2 text-orange-500 text-xl">
                          ➜
                        </span>
                      </div>

                      <span className="text-green-600 text-sm">
                        {route.distance}
                      </span>
                    </div>

                    {/* To */}
                    <div className="flex-1 min-w-[100px]">
                      <p className="text-gray-400 text-sm">To</p>
                      <h3 className="text-2xl font-bold">
                        {route.distance_city}
                      </h3>
                    </div>

                    {/* Fare */}
                    <div className="text-center min-w-[120px]">
                      <p className="text-gray-500 text-sm">
                        Starting From
                      </p>
                      <h2 className="text-3xl font-bold text-orange-500">
                        ₹{route.fare}
                      </h2>
                    </div>

                    {/* Button */}
                    <Link
                      to={`/view-buses/${route._id}`}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                      View Buses
                    </Link>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl p-10 text-center">
                  <h3 className="text-2xl font-semibold text-gray-700">
                    No Routes Available
                  </h3>

                  <p className="text-gray-500 mt-2">
                    There are currently no routes available.
                  </p>
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