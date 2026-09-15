import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AddOffer } from '../../../Service/admin/Offer';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Add() {

  const validationSchema = Yup.object({

    title: Yup.string()
      .required("Title is required"),
    description: Yup.string()
      .required("Description is required"),
    discount: Yup.string()
      .required("Discount is required")

  })

  const navigate = useNavigate()

  const AddOffers = async (values, { resetForm }) => {

    try {
      const res = await AddOffer(values);

      if (res) {

        Swal.fire({
          title: "Success!",
          text: "Offer Added Successfully",
          icon: "success",
          confirmButtonText: "OK"
        });
        resetForm();
        navigate("/admin/offer");

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

      {/* Add Offer */}
      <div id="view-add-bus" className="space-y-6">


        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <h2 className="text-3xl font-bold text-slate-800">
              Add Offer
            </h2>

          </div>

        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 w-full">

          <Formik
            initialValues={{

              title: "",
              description: "",
              discount: "",

            }}
            validationSchema={validationSchema}
            onSubmit={AddOffers}
          >
            {({ isSubmitting }) => (
              <Form>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Title
                    </label>

                    <Field
                      name="title"
                      placeholder="Enter Title"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    >
                    </Field>

                    <ErrorMessage
                      name="title"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </label>

                    <Field
                      name="description"
                      placeholder="Enter Description"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    >
                    </Field>

                    <ErrorMessage
                      name="description"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Discount
                    </label>

                    <Field
                      name="discount"
                      placeholder="Enter Discount"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    >
                    </Field>

                    <ErrorMessage
                      name="discount"
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
                    onClick={() => navigate("/admin/offer")}
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
