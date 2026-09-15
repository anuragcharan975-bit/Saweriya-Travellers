import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AddBus } from '../../../Service/admin/Bus';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ViewBustypeDropdown } from "../../../Service/admin/Bustype";
import * as Yup from "yup";

export default function Add() {

  const [dataList, setDataList] = useState([]);

  const fetchData = async () => {
    try {
      const res = await ViewBustypeDropdown();
      setDataList(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const validationSchema = Yup.object({

    register_number: Yup.string()
      .required("Register Number is required"),

    bus_name: Yup.string()
      .required("Bus Name is required"),

    bus_type: Yup.string()
      .required("Please Select Bus Type"),

    model: Yup.string()
      .required("Model is required"),

    total_seats: Yup.number()
      .required("Total Seats is required")

  })

  const navigate = useNavigate()

  const AddBuses = async (values, { resetForm }) => {

    try {
      const formData = new FormData();

      formData.append("register_number", values.register_number);
      formData.append("bus_name", values.bus_name);
      formData.append("bus_type", values.bus_type);
      formData.append("bus_image", values.bus_image);
      formData.append("model", values.model);
      formData.append("total_seats", values.total_seats);

      const res = await AddBus(formData);

      if (res) {

        Swal.fire({
          title: "Success!",
          text: "Bus Added Successfully",
          icon: "success",
          confirmButtonText: "OK"
        });

        navigate("/admin/bus");

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

      {/* Add Bus */}
      <div id="view-add-bus" className="space-y-6">


        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <h2 className="text-3xl font-bold text-slate-800">
              Add Bus
            </h2>

          </div>

        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 w-full">

          <Formik
            initialValues={{
              register_number: "",
              bus_name: "",
              bus_type: "",
              bus_image: null,
              model: "",
              total_seats: ""
            }}
            validationSchema={validationSchema}
            onSubmit={AddBuses}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                  {/* Register Number */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Register Number
                    </label>

                    <Field
                      type="text"
                      name="register_number"
                      placeholder="Enter Register Number"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    />

                    <ErrorMessage
                      name="register_number"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Bus Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bus Name
                    </label>

                    <Field
                      type="text"
                      name="bus_name"
                      placeholder="Enter Bus Name"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    />

                    <ErrorMessage
                      name="bus_name"
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
                        dataList && dataList.map((e) => {
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

                  {/* Bus Image */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bus Image
                    </label>

                    <input
                      type="file"
                      name="bus_image"
                      accept="image/*"
                      onChange={(e) => {
                        setFieldValue("bus_image", e.currentTarget.files[0]);
                      }}
                      className="w-full h-12 px-4 py-2 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    />

                    <ErrorMessage
                      name="bus_image"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Model
                    </label>

                    <Field
                      name="model"
                      placeholder="Enter Model"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    />

                    <ErrorMessage
                      name="model"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Total Seats */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Total Seats
                    </label>

                    <Field
                      name="total_seats"
                      placeholder="Enter Total Seats"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    />

                    <ErrorMessage
                      name="total_seats"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <label className="block text-sm font-semibold mb-3">
                    Bus Facilities
                  </label>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="facilities" value="AC" />
                      AC
                    </label>

                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="facilities" value="WiFi" />
                      WiFi
                    </label>

                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="facilities" value="Charging Point" />
                      Charging Point
                    </label>

                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="facilities" value="Water Bottle" />
                      Water Bottle
                    </label>

                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="facilities" value="Blanket" />
                      Blanket
                    </label>

                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="facilities" value="Pillow" />
                      Pillow
                    </label>

                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="facilities" value="TV" />
                      TV
                    </label>

                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="facilities" value="GPS Tracking" />
                      GPS Tracking
                    </label>

                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="facilities" value="Emergency Exit" />
                      Emergency Exit
                    </label>

                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="facilities" value="Fire Extinguisher" />
                      Fire Extinguisher
                    </label>

                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="facilities" value="First Aid Kit" />
                      First Aid Kit
                    </label>

                    <label className="flex items-center gap-2">
                      <Field type="checkbox" name="facilities" value="CCTV Camera" />
                      CCTV Camera
                    </label>

                  </div>

                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 my-8"></div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">

                  <button
                    type="button"
                    onClick={() => navigate("/admin/bus")}
                    className="px-8 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
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
  )
}
