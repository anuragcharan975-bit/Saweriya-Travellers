import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { Update, ViewFaq } from "../../../Service/admin/Faq"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"


const validationSchema = Yup.object({

  question: Yup.string(),
  answer: Yup.string()

})

export default function Edit() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [initialValues, setInitialValues] = useState({
    question: "",
    answer: "",
  })

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await ViewFaq(id)

        setInitialValues({
          question: res.question || "",
          answer: res.answer || "",
        })
      } catch (error) {
        console.log(error)
      }
    }

    fetchFaq()
  }, [id])

  const UpdateFaqs = async (values) => {

    try {
      const res = await Update(id, values);

      if (res) {

        Swal.fire({
          title: "Success!",
          text: "Faq Updated Successfully",
          icon: "success",
          confirmButtonText: "OK"
        });

        navigate("/admin/faq");

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

      {/* Edit Faq */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">
          Update Faq
        </h2>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={UpdateFaqs}
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

                {/* Question */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Question
                  </label>

                  <Field
                    type="text"
                    name="question"
                    placeholder="Enter Question"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                  />

                  <ErrorMessage
                    name="question"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>


                {/* answer */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Answer
                  </label>

                  <Field
                    type="text"
                    name="answer"
                    placeholder="Enter Answer"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                  />

                  <ErrorMessage
                    name="answer"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>



              </div>

              <hr className="my-10" />

              <div className="flex justify-end gap-5">
                <button
                  type="button"
                  onClick={() => navigate("/admin/faq")}
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
