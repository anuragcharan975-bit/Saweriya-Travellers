import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AddStaff } from '../../../Service/admin/Staff';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ViewBusDropdown } from '../../../Service/admin/Bus';


const validationSchema = Yup.object({

  role_id: Yup.number()
    .required("Role Id is required"),

  full_name: Yup.string()
    .required("Full Name is required"),

  gender: Yup.string()
    .required("Gender is required"),

  email: Yup.string()
    .email("Invalid Email")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  mobile_number: Yup.number()
    .typeError("Mobile number must be numeric")
    .required("Mobile Number is required")
    .test(
      "len",
      "Mobile number must be exactly 10 digits",
      (value) => value && value.toString().length === 10
    ),

  date_of_birth: Yup.date()
    .required("Date of Birth is required"),

  address: Yup.string()
    .required("Address is required"),

  city: Yup.string()
    .required("City is required"),

  state: Yup.string()
    .required("State is required"),

  pincode: Yup.number()
    .required("Pincode is required"),

  license_number: Yup.string()
    .required("License Number is required"),

  joining_date: Yup.date()
    .required("Joining Date is required"),

  experience: Yup.string()
    .required("Experience is required"),

  salary: Yup.string()
    .required("Salary is required"),


});

export default function Add() {

  const navigate = useNavigate();
  const [dataList, setDataList] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);

  const fetchData = async () => {
    try {
      const res = await ViewBusDropdown();
      console.log(res);

      setDataList(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  const AddStaffs = async (values, { resetForm }) => {

    try {
      const formData = new FormData();

      formData.append("role_id", values.role_id);
      formData.append("full_name", values.full_name);
      formData.append("gender", values.gender);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("mobile_number", values.mobile_number);
      formData.append("date_of_birth", values.date_of_birth);
      formData.append("address", values.address);
      formData.append("city", values.city);
      formData.append("state", values.state);
      formData.append("pincode", values.pincode);
      formData.append("license_number", values.license_number);
      formData.append("joining_date", values.joining_date);
      formData.append("experience", values.experience);
      formData.append("salary", values.salary);
      if (values.bus) {
        formData.append("bus", values.bus);
      }
      if (values.photo) {
        formData.append("photo", values.photo);
      }

      const res = await AddStaff(formData);

      if (res) {
        Swal.fire({
          title: "Success!",
          text: "Staff Added Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });

        setPhotoPreview(null);
        resetForm();
        navigate("/admin/staff");
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

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-800">
            Add Staff
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 w-full">

          <Formik
            initialValues={{
              role_id: "",
              full_name: "",
              gender: "",
              email: "",
              password: "",
              mobile_number: "",
              date_of_birth: "",
              address: "",
              city: "",
              state: "",
              pincode: "",
              license_number: "",
              joining_date: "",
              experience: "",
              salary: "",
              bus: "",
              photo: null,
            }}
            validationSchema={validationSchema}
            onSubmit={AddStaffs}
          >
            {({ setFieldValue }) => (
              <Form>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Role
                    </label>

                    <Field
                      as="select"
                      name="role_id"
                      className="w-full h-12 px-4 rounded-xl border"
                    >
                      <option value="">Select Role</option>
                      <option value="2">Driver</option>
                      <option value="3">Conductor</option>
                    </Field>
                    <ErrorMessage
                      name="role_id"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Full Name
                    </label>

                    <Field
                      name="full_name"
                      placeholder="Enter Full Name"
                      className="w-full h-12 px-4 rounded-xl border"
                    />

                    <ErrorMessage name="full_name" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Gender
                    </label>

                    <Field as="select" name="gender" className="w-full h-12 px-4 rounded-xl border">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Field>

                    <ErrorMessage name="gender" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email
                    </label>

                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      className="w-full h-12 px-4 rounded-xl border"
                    />

                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Password
                    </label>

                    <Field
                      name="password"
                      placeholder="Enter Password"
                      className="w-full h-12 px-4 rounded-xl border"
                    />

                    <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Mobile Number
                    </label>

                    <Field
                      name="mobile_number"
                      placeholder="Enter Mobile Number"
                      className="w-full h-12 px-4 rounded-xl border"
                    />

                    <ErrorMessage name="mobile_number" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Date of Birth
                    </label>

                    <Field
                      type="date"
                      name="date_of_birth"
                      className="w-full h-12 px-4 rounded-xl border"
                    />

                    <ErrorMessage
                      name="date_of_birth"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  
                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Address
                    </label>

                    <Field
                      name="address"
                      placeholder="Enter Address"
                      className="w-full h-12 px-4 rounded-xl border"
                    />

                    <ErrorMessage name="address" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      City
                    </label>

                    <Field
                      name="city"
                      placeholder="Enter City"
                      className="w-full h-12 px-4 rounded-xl border"
                    />

                    <ErrorMessage name="city" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      State
                    </label>

                    <Field
                      name="state"
                      placeholder="Enter State"
                      className="w-full h-12 px-4 rounded-xl border"
                    />

                    <ErrorMessage name="state" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Pincode
                    </label>

                    <Field
                      name="pincode"
                      placeholder="Enter Pincode"
                      className="w-full h-12 px-4 rounded-xl border"
                    />

                    <ErrorMessage name="pincode" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* License */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      License Number
                    </label>

                    <Field
                      name="license_number"
                      placeholder="Enter License Number"
                      className="w-full h-12 px-4 rounded-xl border"
                    />

                    <ErrorMessage name="license_number" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Joining Date */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Joining Date
                    </label>

                    <Field
                      type="date"
                      name="joining_date"
                      className="w-full h-12 px-4 rounded-xl border"
                    />

                    <ErrorMessage
                      name="joining_date"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Experience
                    </label>

                    <Field
                      name="experience"
                      placeholder="Enter Experience"
                      className="w-full h-12 px-4 rounded-xl border"
                    />

                    <ErrorMessage name="experience" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Salary */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Salary
                    </label>

                    <Field
                      name="salary"
                      placeholder="Enter Salary"
                      className="w-full h-12 px-4 rounded-xl border"
                    />

                    <ErrorMessage name="salary" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Bus */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Bus
                    </label>

                    <Field
                      as="select"
                      name="bus"
                      className="w-full h-12 px-4 rounded-xl border"
                    >
                      <option value="">Select Bus</option>
                      {
                        dataList && dataList.map((e) => {
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

                    <ErrorMessage name="bus" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Photo */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Staff Photo
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.currentTarget.files[0];
                        setFieldValue("photo", file);
                        if (file) {
                          setPhotoPreview(URL.createObjectURL(file));
                        } else {
                          setPhotoPreview(null);
                        }
                      }}
                      className="w-full h-12 px-4 py-2 rounded-xl border border-slate-300 focus:border-violet-600 outline-none"
                    />

                    {photoPreview && (
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={photoPreview}
                          alt="Staff Preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-violet-500 shadow-md"
                        />
                        <div>
                          <p className="text-xs text-slate-500">Selected photo preview</p>
                          <button
                            type="button"
                            onClick={() => {
                              setFieldValue("photo", null);
                              setPhotoPreview(null);
                            }}
                            className="text-xs text-red-500 hover:underline font-medium"
                          >
                            Remove Photo
                          </button>
                        </div>
                      </div>
                    )}

                    <ErrorMessage name="photo" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                </div>

                <div className="border-t my-8"></div>

                <div className="flex justify-end gap-4">

                  <button
                    type="button"
                    onClick={() => navigate("/admin/staff")}
                    className="px-8 py-3 rounded-xl border"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-violet-600 text-white"
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
