import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { Update, ViewBusType } from "../../../Service/admin/Bustype"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"


const validationSchema = Yup.object({

  bus_type: Yup.string()
    .required("Bus Type is required"),

})

export default function Edit() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [initialValues, setInitialValues] = useState({
    bus_type: ""
  })

  useEffect(() => {
    const fetchBusType = async () => {
      try {
        const res = await ViewBusType(id)

        setInitialValues({
          bus_type: res.bus_type || ""
        })
      } catch (error) {
        console.log(error)
      }
    }

    fetchBusType()
  }, [id])

  const UpdateBusTypes = async (values) => {

    try {
      const res = await Update(id,values);

      if (res) {

        Swal.fire({
          title: "Success!",
          text: "Bustype Updated Successfully",
          icon: "success",
          confirmButtonText: "OK"
        });

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

      {/* Edit BusType */}
       <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
           <h2 className="text-3xl font-bold text-slate-800 mb-8">
             Update Bustype
           </h2>
     
           <Formik
             enableReinitialize
             initialValues={initialValues}
             validationSchema={validationSchema}
             onSubmit={UpdateBusTypes}
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
     
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                
                                  {/* Bus Type */}
                                  <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                      Bus Type
                                    </label>
                
                                    <Field
                                      type="text"
                                      name="bus_type"
                                      placeholder="Enter Bus Type"
                                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                                    />
                
                                    <ErrorMessage
                                      name="bus_type"
                                      component="p"
                                      className="text-red-500 text-sm mt-1"
                                    />
                                  </div>
                
                                 
                
                                </div>
     
                 <hr className="my-10" />
     
                 <div className="flex justify-end gap-5">
                   <button
                     type="button"
                     onClick={() => navigate("/admin/bustype")}
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
