import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AddSchedule } from "../../../Service/admin/Schedule";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ViewBusDropdown } from "../../../Service/admin/Bus";
import { ViewRouteDropdown } from "../../../Service/admin/Route";

export default function Add() {

  const navigate = useNavigate();

  const [dataList, setDataList] = useState([]);
  const [routeList, setRouteList] = useState([]);

  // =====================================================
  // FETCH BUS
  // =====================================================

  const fetchData = async () => {

    try {

      const res = await ViewBusDropdown();

      setDataList(res);

    } catch (error) {

      console.log(error);

    }
  };

  // =====================================================
  // FETCH ROUTE
  // =====================================================

  const fetchRouteData = async () => {

    try {

      const res = await ViewRouteDropdown();

      setRouteList(res);

    } catch (error) {

      console.log(error);

    }
  };

  // =====================================================
  // USE EFFECT
  // =====================================================

  useEffect(() => {

    fetchData();
    fetchRouteData();

  }, []);

  // =====================================================
  // VALIDATION
  // =====================================================

  const validationSchema = Yup.object({

    bus: Yup.string()
      .required("Bus is required"),

    route: Yup.string()
      .required("Route is required"),

    departure_time: Yup.string()
      .required("Departure Time is required"),

    arrival_time: Yup.string()
      .required("Arrival Time is required"),

    trip_date: Yup.string()
      .required("Trip Date is required"),

  });

  // =====================================================
  // ADD SCHEDULE
  // =====================================================

  const AddSchedules = async (values, { resetForm }) => {

    try {

      const res = await AddSchedule(values);

      if (res) {

        Swal.fire({

          title: "Success!",

          text: "Schedule added successfully",

          icon: "success",

          confirmButtonText: "OK",

        });

        resetForm();

        navigate("/admin/schedule");

      }

    } catch (error) {

      Swal.fire({

        title: "Error!",

        text:
          error?.response?.data?.message ||
          "Something went wrong",

        icon: "error",

      });

    }

  };

  // =====================================================
  // TIME OPTIONS
  // =====================================================

  const timeOptions = [];

  for (let hour = 1; hour <= 12; hour++) {

    for (let minute = 0; minute < 60; minute += 5) {

      const formattedHour =
        hour.toString().padStart(2, "0");

      const formattedMinute =
        minute.toString().padStart(2, "0");

      timeOptions.push(
        `${formattedHour}:${formattedMinute} AM`
      );

      timeOptions.push(
        `${formattedHour}:${formattedMinute} PM`
      );

    }

  }

  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div>

      <div
        id="view-add-bus"
        className="space-y-6"
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-center justify-between">

          <h2 className="text-3xl font-bold text-slate-800">

            Add Schedule

          </h2>

        </div>

        {/* =====================================================
            FORM CARD
        ===================================================== */}

        <div
          className="
            bg-white
            rounded-3xl
            border
            border-slate-200
            shadow-sm
            p-8
            w-full
          "
        >

          <Formik

            initialValues={{

              bus: "",

              route: "",

              departure_time: "",

              arrival_time: "",

              trip_date: "",

            }}

            validationSchema={validationSchema}

            onSubmit={AddSchedules}

          >

            {({ isSubmitting }) => (

              <Form>

                {/* =====================================================
                    FORM GRID
                ===================================================== */}

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-6
                  "
                >

                  {/* =====================================================
                      BUS
                  ===================================================== */}

                  <div>

                    <label
                      className="
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                        mb-2
                      "
                    >

                      Bus

                    </label>

                    <Field
                      as="select"
                      name="bus"
                      className="
                        w-full
                        h-12
                        px-4
                        rounded-xl
                        border
                        border-slate-300
                        focus:border-violet-600
                        focus:ring-2
                        focus:ring-violet-100
                        outline-none
                      "
                    >

                      <option value="">

                        Select Bus

                      </option>

                      {dataList &&
                        dataList.map((e) => {

                          if (e.status === true) {

                            return (

                              <option
                                value={e._id}
                                key={e._id}
                              >

                                {e?.bus_name}

                              </option>

                            );

                          }

                          return null;

                        })}

                    </Field>

                    <ErrorMessage
                      name="bus"
                      component="p"
                      className="
                        text-red-500
                        text-sm
                        mt-1
                      "
                    />

                  </div>

                  {/* =====================================================
                      ROUTE
                  ===================================================== */}

                  <div>

                    <label
                      className="
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                        mb-2
                      "
                    >

                      Route

                    </label>

                    <Field
                      as="select"
                      name="route"
                      className="
                        w-full
                        h-12
                        px-4
                        rounded-xl
                        border
                        border-slate-300
                        focus:border-violet-600
                        focus:ring-2
                        focus:ring-violet-100
                        outline-none
                      "
                    >

                      <option value="">

                        Select Route

                      </option>

                      {routeList &&
                        routeList.map((e) => {

                          if (e.status === true) {

                            return (

                              <option
                                value={e._id}
                                key={e._id}
                              >

                                {e?.route_name}

                              </option>

                            );

                          }

                          return null;

                        })}

                    </Field>

                    <ErrorMessage
                      name="route"
                      component="p"
                      className="
                        text-red-500
                        text-sm
                        mt-1
                      "
                    />

                  </div>

                  {/* =====================================================
                      DEPARTURE TIME
                  ===================================================== */}

                  <div>

                    <label
                      className="
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                        mb-2
                      "
                    >

                      Departure Time

                    </label>

                    <Field
                      as="select"
                      name="departure_time"
                      className="
                        w-full
                        h-12
                        px-4
                        rounded-xl
                        border
                        border-slate-300
                        focus:border-violet-600
                        focus:ring-2
                        focus:ring-violet-100
                        outline-none
                      "
                    >

                      <option value="">

                        Select Departure Time

                      </option>

                      {timeOptions.map((time) => (

                        <option
                          value={time}
                          key={`departure-${time}`}
                        >

                          {time}

                        </option>

                      ))}

                    </Field>

                    <ErrorMessage
                      name="departure_time"
                      component="p"
                      className="
                        text-red-500
                        text-sm
                        mt-1
                      "
                    />

                  </div>

                  {/* =====================================================
                      ARRIVAL TIME
                  ===================================================== */}

                  <div>

                    <label
                      className="
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                        mb-2
                      "
                    >

                      Arrival Time

                    </label>

                    <Field
                      as="select"
                      name="arrival_time"
                      className="
                        w-full
                        h-12
                        px-4
                        rounded-xl
                        border
                        border-slate-300
                        focus:border-violet-600
                        focus:ring-2
                        focus:ring-violet-100
                        outline-none
                      "
                    >

                      <option value="">

                        Select Arrival Time

                      </option>

                      {timeOptions.map((time) => (

                        <option
                          value={time}
                          key={`arrival-${time}`}
                        >

                          {time}

                        </option>

                      ))}

                    </Field>

                    <ErrorMessage
                      name="arrival_time"
                      component="p"
                      className="
                        text-red-500
                        text-sm
                        mt-1
                      "
                    />

                  </div>

                  {/* =====================================================
                      TRIP DATE
                  ===================================================== */}

                  <div>

                    <label
                      className="
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                        mb-2
                      "
                    >

                      Trip Date

                    </label>

                    <Field
                      type="date"
                      name="trip_date"
                      className="
                        w-full
                        h-12
                        px-4
                        rounded-xl
                        border
                        border-slate-300
                        focus:border-violet-600
                        focus:ring-2
                        focus:ring-violet-100
                        outline-none
                      "
                    />

                    <ErrorMessage
                      name="trip_date"
                      component="p"
                      className="
                        text-red-500
                        text-sm
                        mt-1
                      "
                    />

                  </div>

                </div>

                {/* =====================================================
                    DIVIDER
                ===================================================== */}

                <div
                  className="
                    border-t
                    border-slate-200
                    my-8
                  "
                ></div>

                {/* =====================================================
                    BUTTONS
                ===================================================== */}

                <div
                  className="
                    flex
                    justify-end
                    gap-4
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/admin/schedule")
                    }
                    className="
                      px-8
                      py-3
                      rounded-xl
                      border
                      border-slate-300
                      text-slate-700
                      font-semibold
                      hover:bg-slate-100
                      transition
                    "
                  >

                    Back

                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      px-8
                      py-3
                      rounded-xl
                      bg-violet-600
                      hover:bg-violet-700
                      text-white
                      font-semibold
                      shadow-md
                      transition
                    "
                  >

                    {isSubmitting
                      ? "Submitting..."
                      : "Submit"}

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