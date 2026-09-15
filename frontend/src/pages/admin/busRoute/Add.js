import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AddRoute } from "../../../Service/admin/Route";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({

  route_name: Yup.string()
    .required("Route Name is required"),

  source_city: Yup.string()
    .required("Source City is required"),

  distance_city: Yup.string()
    .required("Distance City is required"),

  boarding_point: Yup.string()
    .required("Boarding Point is required"),

  dropping_point: Yup.string()
    .required("Dropping Point is required"),

  distance: Yup.string()
    .required("Distance is required"),

  duration: Yup.string()
    .required("Duration is required"),

  fare: Yup.number()
    .required("Fare is required")

});

export default function Add() {

  const navigate = useNavigate();

  const AddRoutes = async (values, { resetForm }) => {

    try {
      const res = await AddRoute(values);

      if (res) {
        Swal.fire({
          title: "Success!",
          text: "Route Added Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });

        resetForm();
        navigate("/admin/bus-route");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <div id="view-add-bus" className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-800">
            Add Route
          </h2>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 w-full">

          <Formik
            initialValues={{
              route_name: "",
              source_city: "",
              distance_city: "",
              boarding_point: "",
              dropping_point: "",
              distance: "",
              duration: "",
              fare: "",
            }}
            validationSchema={validationSchema}
            onSubmit={AddRoutes}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                  {/* Route Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Route Name
                    </label>

                    <Field
                      type="text"
                      name="route_name"
                      placeholder="Enter Route Name"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    />

                    <ErrorMessage
                      name="route_name"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Source City */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Source City
                    </label>

                    <Field
                      type="text"
                      name="source_city"
                      placeholder="Enter Source City"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    />

                    <ErrorMessage
                      name="source_city"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Distance City */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Distance City
                    </label>

                    <Field
                      type="text"
                      name="distance_city"
                      placeholder="Enter Distance City"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    />

                    <ErrorMessage
                      name="distance_city"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Boarding Point */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Boarding Point
                    </label>

                    <Field
                      type="text"
                      name="boarding_point"
                      placeholder="Enter Boarding Point"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    />

                    <ErrorMessage
                      name="boarding_point"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Dropping Point */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Dropping Point
                    </label>

                    <Field
                      type="text"
                      name="dropping_point"
                      placeholder="Enter Dropping Point"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    />

                    <ErrorMessage
                      name="dropping_point"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Distance */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Distance
                    </label>

                    <Field
                      type="text"
                      name="distance"
                      placeholder="Enter Distance"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    />

                    <ErrorMessage
                      name="distance"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Duration
                    </label>

                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Hours"
                        min="0"
                        className="w-1/2 h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                        onChange={(e) => {
                          const hours = e.target.value || 0;
                          const minutes =
                            values.duration.match(/(\d+)\s*min/)?.[1] || 0;

                          setFieldValue("duration", `${hours} hrs ${minutes} min`);
                        }}
                      />

                      <input
                        type="number"
                        placeholder="Minutes"
                        min="0"
                        max="59"
                        className="w-1/2 h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                        onChange={(e) => {
                          const minutes = e.target.value || 0;
                          const hours =
                            values.duration.match(/(\d+)\s*hrs/)?.[1] || 0;

                          setFieldValue("duration", `${hours} hrs ${minutes} min`);
                        }}
                      />
                    </div>

                    <ErrorMessage
                      name="duration"
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

                <div className="border-t border-slate-200 my-8"></div>

                <div className="flex justify-end gap-4">

                  <button
                    type="button"
                    onClick={() => navigate("/admin/bus-route")}
                    className="px-8 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>

                </div>

              </Form>
            )}
          </Formik>

        </div>

      </div>
    </div>
  );
}