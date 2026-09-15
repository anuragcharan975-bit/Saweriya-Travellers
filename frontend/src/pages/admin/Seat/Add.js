import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AddSeat, ViewAllSeat } from "../../../Service/admin/Seat";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ViewBusDropdown } from "../../../Service/admin/Bus";
import { ViewBustypeDropdown } from "../../../Service/admin/Bustype";



export default function Add() {
  const navigate = useNavigate();
  const [dataList, setDataList] = useState([]);
  const [bustypeList, setBustypeList] = useState([]);
  const [busList, setBusList] = useState([]);

  const fetchData = async () => {
    try {
      const res = await ViewAllSeat();
      setDataList(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const validationSchema = Yup.object({
    bus: Yup.string().required("Bus is required"),
    seat_number: Yup.string().required("Seat Number is required"),
    bus_type: Yup.string().required("Bus Type is required"),
    fare: Yup.string().required("Price is required"),
  });

  const AddSeats = async (values, { resetForm }) => {

    try {
      const res = await AddSeat(values);

      if (res) {
        Swal.fire({
          title: "Success!",
          text: "Seat Added Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });

        resetForm();
        navigate("/admin/seat");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    }
  }




  return (
    <div>
      <div id="view-add-bus" className="space-y-6">

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-800">
            Add Seat
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 w-full">

          <Formik
            initialValues={{
              bus: "",
              seat_number: "",
              bus_type: "",
              fare: null,
            }}
            validationSchema={validationSchema}
            onSubmit={AddSeats}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form>

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
                      name="fare"
                      placeholder="Enter price"
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
                    onClick={() => navigate("/admin/seat")}
                    className="px-8 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md transition"
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