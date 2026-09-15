import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Update, ViewRoute } from "../../../Service/admin/Route";

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

export default function Edit() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    route_name: "",
    source_city: "",
    distance_city: "",
    boarding_point: "",
    dropping_point: "",
    distance: "",
    duration: "",
    fare: "",
  })

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await ViewRoute(id);

        setInitialValues({
          route_name: res.route_name || "",
          source_city: res.source_city || "",
          distance_city: res.distance_city || "",
          boarding_point: res.boarding_point || "",
          dropping_point: res.dropping_point || "",
          distance: res.distance || "",
          duration: res.duration || "",
          fare: res.fare || "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoute();
  }, [id])

  const UpdateRoutes = async (values) => {
    try {
      await Update(id, values);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Route Updated Successfully",
      });

      navigate("/admin/bus-route");
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
        Update Route
      </h2>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={UpdateRoutes}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          errors,
          setFieldValue 
        }) => (
          <form onSubmit={handleSubmit}>

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

            <hr className="my-10" />

            <div className="flex justify-end gap-5">
              <button
                type="button"
                onClick={() => navigate("/admin/bus-route")}
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