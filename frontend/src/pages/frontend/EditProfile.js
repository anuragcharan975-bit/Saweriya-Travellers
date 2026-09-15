import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

import {
    GetProfile,
    UpdateProfile
} from "../../Service/frontend/Auth";

import { API_url } from "../../Config/config";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


export default function EditProfile() {

    const navigate = useNavigate();


    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({

        full_name: "",
        email: "",
        mobile_no: "",
        profile_image: ""

    });


    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);


    // =====================================================
    // GET PROFILE
    // =====================================================

    useEffect(() => {

        fetchProfile();

    }, []);


    const fetchProfile = async () => {

        try {

            const res = await GetProfile();

            console.log(
                "EDIT PROFILE RESPONSE:",
                res
            );


            const user =
                res?.data?.data ||
                res?.data ||
                res ||
                {};


            console.log(
                "EDIT PROFILE USER:",
                user
            );


            setFormData({

                full_name:
                    user?.full_name || "",

                email:
                    user?.email || "",

                mobile_no:
                    user?.mobile_no || "",

                profile_image:
                    user?.profile_image || ""

            });


            // =================================================
            // EXISTING IMAGE
            // =================================================

            if (user?.profile_image) {

                let imageUrl =
                    user.profile_image;


                if (
                    !imageUrl.startsWith("http")
                ) {

                    imageUrl =
                        `${API_url}/${imageUrl.replace(
                            /^\/+/,
                            ""
                        )}`;

                }


                console.log(
                    "PROFILE IMAGE URL:",
                    imageUrl
                );


                setPreview(imageUrl);

            }

        } catch (error) {

            console.log(
                "Get Profile Error:",
                error.response?.data || error
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // IMAGE SELECT
    // =====================================================

    const handleImageChange = (e) => {

        const file =
            e.target.files?.[0];


        if (!file) {
            return;
        }


        // =================================================
        // IMAGE TYPE
        // =================================================

        if (
            !file.type.startsWith("image/")
        ) {

            Swal.fire({

                icon: "error",

                title: "Invalid File",

                text:
                    "Please select an image file."

            });

            return;

        }


        // =================================================
        // IMAGE SIZE
        // =================================================

        if (
            file.size >
            2 * 1024 * 1024
        ) {

            Swal.fire({

                icon: "error",

                title: "File Too Large",

                text:
                    "Profile image must be less than 2 MB."

            });

            return;

        }


        setImage(file);


        // =================================================
        // PREVIEW
        // =================================================

        const imageUrl =
            URL.createObjectURL(file);


        setPreview(imageUrl);

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            const data =
                new FormData();


            data.append(
                "full_name",
                formData.full_name
            );


            data.append(
                "mobile_no",
                formData.mobile_no
            );


            if (image) {

                data.append(
                    "profile_image",
                    image
                );

            }


            console.log(
                "FORM DATA IMAGE:",
                image
            );


            const res =
                await UpdateProfile(data);


            console.log(
                "UPDATE PROFILE RESPONSE:",
                res
            );


            Swal.fire({

                icon: "success",

                title: "Profile Updated",

                text:
                    res?.data?.message ||
                    res?.message ||
                    "Profile updated successfully",

                confirmButtonColor:
                    "#7c3aed"

            }).then(() => {

                navigate("/profile");

            });


        } catch (error) {

            console.log(
                "Update Profile Error:",
                error.response?.data ||
                error
            );


            Swal.fire({

                icon: "error",

                title: "Update Failed",

                text:
                    error.response?.data?.message ||
                    "Something went wrong"

            });

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <>

                <Header />

                <div
                    className="
                        min-h-screen
                        bg-slate-100
                        flex
                        items-center
                        justify-center
                    "
                >

                    <div className="text-center">

                        <div
                            className="
                                animate-spin
                                rounded-full
                                h-12
                                w-12
                                border-b-4
                                border-violet-600
                                mx-auto
                            "
                        />

                        <p className="mt-4 text-gray-600">
                            Loading Profile...
                        </p>

                    </div>

                </div>

                <Footer />

            </>

        );

    }


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <>

            <Header />


            <div
                className="
                    min-h-screen
                    bg-slate-100
                    py-10
                "
            >

                <div
                    className="
                        max-w-6xl
                        mx-auto
                        px-4
                    "
                >

                    <div
                        className="
                            grid
                            md:grid-cols-2
                            gap-8
                        "
                    >


                        {/* =================================================
                            LEFT SIDE
                        ================================================= */}

                        <div
                            className="
                                bg-gradient-to-br
                                from-violet-600
                                to-indigo-600
                                rounded-3xl
                                p-10
                                text-white
                                flex
                                flex-col
                                justify-center
                            "
                        >

                            <h2
                                className="
                                    text-4xl
                                    font-bold
                                    mb-4
                                "
                            >
                                Edit Profile
                            </h2>


                            <p
                                className="
                                    text-violet-100
                                    leading-8
                                "
                            >
                                Keep your personal information updated to
                                enjoy a seamless booking experience with
                                DriveBus.
                            </p>


                            <div
                                className="
                                    mt-10
                                    space-y-5
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <span className="text-2xl">
                                        ✅
                                    </span>

                                    <span>
                                        Secure Account Information
                                    </span>

                                </div>


                                <div className="flex items-center gap-3">

                                    <span className="text-2xl">
                                        🚌
                                    </span>

                                    <span>
                                        Fast Bus Booking
                                    </span>

                                </div>


                                <div className="flex items-center gap-3">

                                    <span className="text-2xl">
                                        🎫
                                    </span>

                                    <span>
                                        Easy Ticket Management
                                    </span>

                                </div>


                                <div className="flex items-center gap-3">

                                    <span className="text-2xl">
                                        🔔
                                    </span>

                                    <span>
                                        Receive Booking Notifications
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            RIGHT SIDE
                        ================================================= */}

                        <div
                            className="
                                bg-white
                                rounded-3xl
                                shadow-xl
                                p-10
                            "
                        >

                            <h2
                                className="
                                    text-3xl
                                    font-bold
                                "
                            >
                                Personal Information
                            </h2>


                            <p
                                className="
                                    text-gray-500
                                    mt-2
                                    mb-8
                                "
                            >
                                Update your account details below.
                            </p>


                            <form onSubmit={handleSubmit}>


                                {/* =================================================
                                    PROFILE IMAGE
                                ================================================= */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        items-center
                                        mb-8
                                    "
                                >

                                    <div className="relative">

                                        {preview ? (

                                            <img
                                                src={preview}
                                                alt="Profile"
                                                className="
                                                    w-32
                                                    h-32
                                                    rounded-full
                                                    object-cover
                                                    border-4
                                                    border-violet-500
                                                    shadow-lg
                                                "
                                                onError={(e) => {

                                                    console.log(
                                                        "Edit image failed:",
                                                        e.target.src
                                                    );

                                                    e.target.style.display =
                                                        "none";

                                                }}
                                            />

                                        ) : (

                                            <div
                                                className="
                                                    w-32
                                                    h-32
                                                    rounded-full
                                                    bg-violet-100
                                                    flex
                                                    items-center
                                                    justify-center
                                                    border-4
                                                    border-violet-500
                                                "
                                            >

                                                <span className="text-5xl">
                                                    👤
                                                </span>

                                            </div>

                                        )}

                                    </div>


                                    <label
                                        htmlFor="profile_image"
                                        className="
                                            mt-4
                                            bg-violet-600
                                            hover:bg-violet-700
                                            text-white
                                            px-5
                                            py-2
                                            rounded-xl
                                            cursor-pointer
                                            font-semibold
                                        "
                                    >
                                        Change Photo
                                    </label>


                                    <input
                                        id="profile_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleImageChange
                                        }
                                        className="hidden"
                                    />


                                    <p
                                        className="
                                            text-gray-400
                                            text-sm
                                            mt-2
                                        "
                                    >
                                        JPG, PNG or JPEG — Max 2MB
                                    </p>

                                </div>


                                {/* =================================================
                                    FULL NAME
                                ================================================= */}

                                <div className="mb-5">

                                    <label
                                        className="
                                            block
                                            font-semibold
                                            mb-2
                                        "
                                    >
                                        Full Name
                                    </label>


                                    <input
                                        type="text"
                                        value={
                                            formData.full_name
                                        }
                                        onChange={(e) =>
                                            setFormData({

                                                ...formData,

                                                full_name:
                                                    e.target.value

                                            })
                                        }
                                        className="
                                            w-full
                                            border
                                            rounded-xl
                                            p-3
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-violet-500
                                        "
                                        placeholder="Enter full name"
                                    />

                                </div>


                                {/* =================================================
                                    EMAIL
                                ================================================= */}

                                <div className="mb-5">

                                    <label
                                        className="
                                            block
                                            font-semibold
                                            mb-2
                                        "
                                    >
                                        Email Address
                                    </label>


                                    <input
                                        type="email"
                                        value={
                                            formData.email
                                        }
                                        readOnly
                                        className="
                                            w-full
                                            border
                                            rounded-xl
                                            p-3
                                            bg-gray-100
                                            cursor-not-allowed
                                        "
                                    />

                                </div>


                                {/* =================================================
                                    MOBILE
                                ================================================= */}

                                <div className="mb-8">

                                    <label
                                        className="
                                            block
                                            font-semibold
                                            mb-2
                                        "
                                    >
                                        Mobile Number
                                    </label>


                                    <input
                                        type="text"
                                        value={
                                            formData.mobile_no
                                        }
                                        onChange={(e) =>
                                            setFormData({

                                                ...formData,

                                                mobile_no:
                                                    e.target.value

                                            })
                                        }
                                        className="
                                            w-full
                                            border
                                            rounded-xl
                                            p-3
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-violet-500
                                        "
                                        placeholder="Enter mobile number"
                                    />

                                </div>


                                {/* =================================================
                                    BUTTONS
                                ================================================= */}

                                <div className="flex gap-4">

                                    <button
                                        type="submit"
                                        className="
                                            bg-violet-600
                                            hover:bg-violet-700
                                            text-white
                                            px-8
                                            py-3
                                            rounded-xl
                                            font-semibold
                                        "
                                    >
                                        Save Changes
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/profile")
                                        }
                                        className="
                                            border
                                            border-gray-300
                                            px-8
                                            py-3
                                            rounded-xl
                                            hover:bg-gray-100
                                        "
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>


            <Footer />

        </>

    );

}