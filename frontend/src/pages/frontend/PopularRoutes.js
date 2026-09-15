import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ViewPopularRoutes } from "../../Service/admin/Route";

export default function PopularRoutes() {
    const [routes, setRoutes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getRoutes = async () => {
            try {
                const res = await ViewPopularRoutes();

                console.log("POPULAR RESPONSE:", res.data);

                setRoutes(res.data);
            } catch (error) {
                console.log("POPULAR ERROR:", error);
            }
        };

        getRoutes();
    }, []);

    return (
        <section className="py-16 bg-gray-50">

            <div className="max-w-7xl mx-auto px-4">

                <h2 className="text-4xl font-bold text-center text-gray-800">
                    Popular Bus Routes
                </h2>

                <p className="text-center text-gray-500 mt-3 mb-10">
                    Most Booked Routes
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {routes.length > 0 ? (
                        routes.map((route) => (

                            <div
                                key={route._id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
                            >

                                <h3 className="text-xl font-bold text-violet-700 text-center">
                                    {route.route_name}
                                </h3>

                                <div className="flex items-center justify-between mt-6">

                                    <div className="text-center">
                                        <h4 className="font-semibold text-lg">
                                            {route.source_city}
                                        </h4>
                                    </div>

                                    <div className="text-orange-500 text-3xl">
                                        →
                                    </div>

                                    <div className="text-center">
                                        <h4 className="font-semibold text-lg">
                                            {route.distance_city}
                                        </h4>
                                    </div>

                                </div>

                                <hr className="my-5" />

                                <div className="space-y-3 text-gray-600">

                                    <div className="flex justify-between">
                                        <span>Distance</span>
                                        <span className="font-semibold">
                                            {route.distance}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Duration</span>
                                        <span className="font-semibold">
                                            {route.duration}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Starting From</span>
                                        <span className="text-green-600 font-bold text-lg">
                                            ₹{route.fare}
                                        </span>
                                    </div>

                                </div>

                                <Link
                                    to={`/view-buses/${route._id}`}
                                    className="block mt-6 text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition"
                                >
                                    Book Now
                                </Link>
                            </div>

                        ))
                    ) : (
                        <div className="col-span-4 text-center text-gray-500 py-10">
                            No Popular Routes Found
                        </div>
                    )}

                </div>

            </div>

        </section>
    );
}