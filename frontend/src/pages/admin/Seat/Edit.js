import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Update, ViewSeat } from "../../../Service/admin/Seat";
import { ViewBusDropdown } from "../../../Service/admin/Bus";
import { ViewBustypeDropdown } from "../../../Service/admin/Bustype";


const validationSchema = Yup.object({

    bus: Yup.string()
        .required("Bus Name is required"),

    seat_number: Yup.string()
        .required("Seat Number is required"),

    bus_type: Yup.string()
        .required("Seat Type is required"),

    fare: Yup.number()
        .required("Price is required")

});

export default function Edit() {
    const [busList, setBusList] = useState([]);
    const [bustypeList, setBustypeList] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState({
        bus: "",
        seat_number: "",
        bus_type: "",
        fare: "",
    })

    useEffect(() => {
        const fetchSeat = async () => {
            try {
                const res = await ViewSeat(id);

                setInitialValues({
                    bus: res.bus || "",
                    seat_number: res.seat_number || "",
                    bus_type: res.bus_type || "",
                    fare: res.fare || "",
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchSeat();
    }, [id])

    const fetchBusData = async () => {
        try {
            const res = await ViewBusDropdown();
            setBusList(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBusData();
    }, []);

    const fetchBustypeData = async () => {
        try {
            const res = await ViewBustypeDropdown();
            setBustypeList(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBustypeData();
    }, []);

    const UpdateSeats = async (values) => {
        try {
            await Update(id, values);

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Seat Updated Successfully",
            });

            navigate("/admin/seat");
        } catch (error) {
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
                Update Seat
            </h2>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={UpdateSeats}
            >
                {({
                    values,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    touched,
                    errors,
                }) => (
                    <form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                            {/* Bus */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Bus Name
                                </label>

                                <Field
                                    as="select"
                                    name="bus"
                                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"                    >
                                    <option value="">Select Bus</option>
                                    {
                                        busList && busList.map((e) => {
                                            if (e.status === true) {
                                                return (
                                                    <option value={e._id} key={e._id}>{e?.bus_name}</option>
                                                )
                                            } else {
                                                return null
                                            }
                                        })
                                    }
                                </Field>

                                <ErrorMessage
                                    name="bus"
                                    component="p"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Seat Number */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Seat Number
                                </label>

                                <Field
                                    type="text"
                                    name="seat_number"
                                    placeholder="Enter Seat Number"
                                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                                />

                                <ErrorMessage
                                    name="seat_number"
                                    component="p"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Bus Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Bus Type
                                </label>

                                <Field
                                    as="select"
                                    name="bus_type"
                                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                                >
                                    <option value="">Select Bus Type</option>

                                    {
                                        bustypeList && bustypeList.map((e) => {
                                            if (e.status === true) {
                                                return (
                                                    <option value={e._id} key={e._id}>{e?.bus_type}</option>
                                                )
                                            } else {
                                                return null
                                            }
                                        })
                                    }
                                </Field>

                                <ErrorMessage
                                    name="bus_type"
                                    component="p"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Fare */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Price
                                </label>

                                <Field
                                    type="number"
                                    name="fare"
                                    placeholder="Enter Price"
                                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                                />

                                <ErrorMessage
                                    name="fare"
                                    component="p"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                        </div>

                        <hr className="my-10" />

                        <div className="flex justify-end gap-5">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/seat")}
                                className="px-8 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 transition"
                            >
                                Back
                            </button>

                            <button
                                type="submit"
                                className="px-8 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-lg transition"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
}