import { Image_url } from "../../../Config/config";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Update, ViewStaff } from "../../../Service/admin/Staff";
import { ViewBusDropdown } from "../../../Service/admin/Bus";


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

    mobile_number: Yup.string()
    .required("Mobile Number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

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

export default function Edit() {

    const [dataList, setDataList] = useState([]);

    const fetchData = async () => {
        try {
            const res = await ViewBusDropdown();
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

    const [currentPhoto, setCurrentPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [initialValues, setInitialValues] = useState({
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
    })

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await ViewStaff(id);

                setInitialValues({
                    role_id: res.role_id || "",
                    full_name: res.full_name || "",
                    gender: res.gender || "",
                    email: res.email || "",
                    password: res.password || "",
                    mobile_number: res.mobile_number || "",
                    date_of_birth: res.date_of_birth
                        ? res.date_of_birth.split("T")[0]
                        : "",
                    address: res.address || "",
                    city: res.city || "",
                    state: res.state || "",
                    pincode: res.pincode || "",
                    license_number: res.license_number || "",
                    joining_date: res.joining_date
                        ? res.joining_date.split("T")[0]
                        : "", experience: res.experience || "",
                    salary: res.salary || "",
                    bus: res.bus?._id || "",
                });
                if (res.photo) {
                    setCurrentPhoto(res.photo);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchStaff();
    }, [id]);

    const UpdateStaffs = async (values) => {
        try {

            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                if (key === "bus") {
                    if (values.bus) {
                        formData.append("bus", values.bus);
                    }
                } else if (key === "photo") {
                    if (values.photo && typeof values.photo !== "string") {
                        formData.append("photo", values.photo);
                    }
                } else {
                    formData.append(key, values[key]);
                }
            });

            await Update(id, formData);

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Staff Updated Successfully",
            });

            navigate("/admin/staff");

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
                Update Staff
            </h2>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={UpdateStaffs}
            >
                {({
                    values,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    touched,
                    errors,
                    setFieldValue,

                }) => (
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
                                    type="text"
                                    name="password"
                                    minLength={6}
                                    placeholder="Enter Password (min 6 characters)"
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
                                    type="tel"
                                    maxLength={10}
                                    name="mobile_number"
                                    placeholder="Enter 10-digit Mobile Number"
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

                                {photoPreview ? (
                                    <div className="mt-3 flex items-center gap-3">
                                        <img
                                            src={photoPreview}
                                            alt="Staff Preview"
                                            className="w-16 h-16 rounded-full object-cover border-2 border-violet-500 shadow-md"
                                        />
                                        <p className="text-xs text-slate-500">New photo selected</p>
                                    </div>
                                ) : currentPhoto ? (
                                    <div className="mt-3 flex items-center gap-3">
                                        <img
                                            src={`${Image_url}/${currentPhoto}`}
                                            alt="Current Staff"
                                            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                                        />
                                        <p className="text-xs text-slate-500">Current photo</p>
                                    </div>
                                ) : null}

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
                                Update
                            </button>

                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
}