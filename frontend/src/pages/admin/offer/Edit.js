
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { Update, ViewOffer } from "../../../Service/admin/Offer"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"


const validationSchema = Yup.object({

  title: Yup.string(),
  description: Yup.string(),
  discount: Yup.string(),

})

export default function Edit() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    discount: "",
  })

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await ViewOffer(id)

        setInitialValues({
          title: res.title || "",
          description: res.description || "",
          discount: res.discount || "",
        })
      } catch (error) {
        console.log(error)
      }
    }

    fetchOffer()
  }, [id])

  const UpdateOffers = async (values) => {

    try {
      const res = await Update(id, values);

      if (res) {

        Swal.fire({
          title: "Success!",
          text: "Offer Updated Successfully",
          icon: "success",
          confirmButtonText: "OK"
        });

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

      {/* Edit Offer */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">
          Update Offer
        </h2>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={UpdateOffers}
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

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                {/* title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Title
                  </label>

                  <Field
                    type="text"
                    name="title"
                    placeholder="Enter title"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                  />

                  <ErrorMessage
                    name="title"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>


                {/* description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>

                  <Field
                    type="text"
                    name="description"
                    placeholder="Enter description"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                  />

                  <ErrorMessage
                    name="description"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* discount */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Discount
                  </label>

                  <Field
                    type="text"
                    name="discount"
                    placeholder="Enter discount"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                  />

                  <ErrorMessage
                    name="discount"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>




              </div>

              <hr className="my-10" />

              <div className="flex justify-end gap-5">
                <button
                  type="button"
                  onClick={() => navigate("/admin/offer")}
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

    </div>
  )
}
