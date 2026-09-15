import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AddBusType } from '../../../Service/admin/Bustype';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Add() {

    const validationSchema = Yup.object({

        bus_type: Yup.string()
            .required("Bus Type is required"),

    })

    const navigate = useNavigate()

    const AddBusTypes = async (values, { resetForm }) => {

        try {
            const res = await AddBusType(values);

            if (res) {

                Swal.fire({
                    title: "Success!",
                    text: "Bustype Added Successfully",
                    icon: "success",
                    confirmButtonText: "OK"
                });
                resetForm();
                navigate("/admin/bustype");

            }

        } catch (error) {

            const message = error?.response?.data?.message || "Something went wrong";

            Swal.fire({
                title: "Error!",
                text: message,
                icon: "error",
                confirmButtonText: "OK"
            });

        }

    };

    return (


        <div>

            {/* Add BusType */}
            <div id="view-add-bus" className="space-y-6">


                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                        <h2 className="text-3xl font-bold text-slate-800">
                            Add Bustype
                        </h2>

                    </div>

                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 w-full">

                    <Formik
                        initialValues={{

                            bus_type: "",

                        }}
                        validationSchema={validationSchema}
                        onSubmit={AddBusTypes}
                    >
                        {({ isSubmitting }) => (
                            <Form>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">


                                    {/* Bus Type */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Bus Type
                                        </label>

                                        <Field
                                            name="bus_type"
                                            placeholder="Enter Bustype"
                                            className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                                        >
                                        </Field>

                                        <ErrorMessage
                                            name="bus_type"
                                            component="p"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>




                                </div>

                                {/* Divider */}
                                <div className="border-t border-slate-200 my-8"></div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-4">

                                    <button
                                        type="button"
                                        onClick={() => navigate("/admin/bustype")}
                                        className="px-8 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
                                    >
                                        Back
                                    </button>

                                    <button
                                        type="submit"
                                        className="px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md transition"
                                    >
                                        Submit
                                    </button>

                                </div>

                            </Form>
                        )}
                    </Formik>
                </div>

            </div>
        </div>
    )
}
