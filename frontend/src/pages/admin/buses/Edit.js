import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Update, ViewBus } from "../../../Service/admin/Bus";
import { ViewBustypeDropdown } from "../../../Service/admin/Bustype";



const validationSchema = Yup.object({

  register_number: Yup.string()
    .required("Register Number is required"),

  bus_name: Yup.string()
    .required("Bus Name is required"),

  bus_type: Yup.string()
    .required("Please select Bus Type"),

  model: Yup.string()
    .required("Model is required"),

  total_seats: Yup.number()
    .required("Total Seats is required")

})

export default function Edit() {

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

  const { id } = useParams()
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    register_number: "",
    bus_name: "",
    bus_type: "",
    bus_image: "",
    model: "",
    total_seats: ""
  })

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await ViewBus(id);

        setInitialValues({
          register_number: res.register_number || "",
          bus_name: res.bus_name || "",
          bus_type: res.bus_type?._id || "",
          model: res.model || "",
          total_seats: res.total_seats || "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchBus();
  }, [id]);

  const UpdateBuses = async (values) => {
    try {

      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      await Update(id, formData);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Bus Updated Successfully",
      });

      navigate("/admin/bus");

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
        Update Bus
      </h2>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={UpdateBuses}
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

            </div>

            <hr className="my-10" />

            <div className="flex justify-end gap-5">
              <button
                type="button"
                onClick={() => navigate("/admin/bus")}
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