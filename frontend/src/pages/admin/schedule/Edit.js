import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Update, ViewSchedule } from "../../../Service/admin/Schedule"
import { ViewBusDropdown } from "../../../Service/admin/Bus";
import { ViewRouteDropdown } from "../../../Service/admin/Route";

export default function Edit() {
    const [dataList, setDataList] = useState([]);
    const [routeList, setRouteList] = useState([]);

    const { id } = useParams()
    const navigate = useNavigate()

    const [Bus, setBus] = useState('')
    const [Route, setRoute] = useState('')
    const [DepartureTime, setDepartureTime] = useState('')
    const [ArrivalTime, setArrivalTime] = useState('')
    const [TripDate, setTripDate] = useState('')

    const fetchData = async () => {
        try {
            const res = await ViewBusDropdown()
            setDataList(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchRouteData = async () => {
        try {
            const res = await ViewRouteDropdown();
            setRouteList(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchRouteData();
    }, []);


    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await ViewSchedule(id);

                setBus(res.bus?._id || res.bus);
                setRoute(res.route?._id || res.route);
                setDepartureTime(res.departure_time);
                setArrivalTime(res.arrival_time);
                setTripDate(res.trip_date);
            } catch (error) {
                console.log(error);
            }
        };

        fetchSchedule();
    }, [id]);

    const UpdateSchedules = async (e) => {
        e.preventDefault();

        try {
            const data = {
                bus: Bus,
                route: Route,
                departure_time: DepartureTime,
                arrival_time: ArrivalTime,
                trip_date: TripDate,
            };

            await Update(id, data);

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Schedule Updated Successfully",
            })

            navigate("/admin/schedule");
        } catch (error) {
            console.log(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Something went wrong",
            });
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">
                Update Schedule
            </h2>

            <form onSubmit={UpdateSchedules}>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Bus
                        </label>

                        <select
                            value={Bus}
                            onChange={(e) => setBus(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        >
                            <option value="">Select Bus</option>

                            {dataList.map((e) =>
                                e.status ? (
                                    <option key={e._id} value={e._id}>
                                        {e?.bus_name}
                                    </option>
                                ) : null
                            )}
                        </select>
                    </div>



                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Route
                        </label>

                        <select
                            value={Route}
                            onChange={(e) => setRoute(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                        >
                            <option value="">Select Route</option>

                            {routeList.map((e) =>
                                e.status ? (
                                    <option key={e._id} value={e._id}>
                                        {e?.route_name}
                                    </option>
                                ) : null
                            )}
                        </select>
                    </div>


                    {/* Departure Time */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Departure Time
                        </label>

                        <input
                            type="time"
                            value={DepartureTime}
                            onChange={(e) => setDepartureTime(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                        />
                    </div>

                    {/* Arrival Time */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Arrival Time
                        </label>

                        <input
                            type="time"
                            value={ArrivalTime}
                            onChange={(e) => setArrivalTime(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                        />
                    </div>

                    {/* Trip Date */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Trip Date
                        </label>

                        <input
                            type="date"
                            value={TripDate}
                            onChange={(e) => setTripDate(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                        />
                    </div>



                </div>

                <div className="border-t border-slate-200 my-8"></div>

                <div className="flex justify-end gap-4">

                    <button
                        type="button"
                        onClick={() => navigate("/admin/schedule")}
                        className="px-8 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
                    >
                        Back
                    </button>

                    <button
                        type="submit"
                        className="px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md transition"
                    >
                        Update
                    </button>

                </div>

            </form>
        </div>
    );
}