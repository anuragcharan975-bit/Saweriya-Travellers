import axios from "axios";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

import {
    GetProfile,
    ChangePassword
} from "../../Service/frontend/Auth";

import {
    BookingHistory,
    CancelBooking
} from "../../Service/frontend/Booking";

import { API_url } from "../../Config/config";

import {
    Phone,
    Calendar,
    MapPin,
    Ticket,
    Lock,
    X,
    Mail,
    User,
    Bus,
    Clock,
    Map
} from "lucide-react";


export default function Profile() {

    const [profile, setProfile] = useState({});
    const [bookings, setBookings] = useState([]);

    const [showPassword, setShowPassword] = useState(false);

    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: ""
    });

    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(true);

    const navigate = useNavigate();


    // =====================================================
    // GET PROFILE
    // =====================================================

    const fetchProfile = async () => {

        try {

            const res = await GetProfile();

            console.log(
                "========== PROFILE RESPONSE =========="
            );

            console.log(res);

            console.log(
                "======================================"
            );


            let profileData = {};


            if (res?.data?.data) {

                profileData = res.data.data;

            } else if (res?.data) {

                profileData = res.data;

            } else {

                profileData = res || {};

            }


            console.log(
                "PROFILE DATA:",
                profileData
            );


            console.log(
                "PROFILE IMAGE:",
                profileData?.profile_image
            );


            setProfile(profileData);


        } catch (error) {

            console.log(
                "Profile Error:",
                error.response?.data || error
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // GET BOOKING HISTORY (API + LocalStorage Merged)
    // =====================================================

    const fetchBookings = async () => {
        try {
            setBookingLoading(true);
            let apiBookings = [];

            try {
                const res = await BookingHistory();
                if (Array.isArray(res?.data?.data)) {
                    apiBookings = res.data.data;
                } else if (Array.isArray(res?.data)) {
                    apiBookings = res.data;
                } else if (Array.isArray(res)) {
                    apiBookings = res;
                }
            } catch (apiErr) {
                console.log("API Booking History note:", apiErr.response?.data || apiErr.message);
                try {
                    const fallbackRes = await axios.get(`${API_url}/frontend/booking/history`);
                    if (Array.isArray(fallbackRes?.data?.data)) {
                        apiBookings = fallbackRes.data.data;
                    } else if (Array.isArray(fallbackRes?.data)) {
                        apiBookings = fallbackRes.data;
                    }
                } catch (fbErr) {
                    console.log("Fallback history fetch note:", fbErr.message);
                }
            }

            // Also check localStorage booking history
            let localBookings = [];
            try {
                const saved = localStorage.getItem("bookingHistory");
                if (saved) {
                    localBookings = JSON.parse(saved);
                    if (!Array.isArray(localBookings)) localBookings = [];
                }
            } catch (locErr) {
                console.log("Local booking history read error:", locErr);
            }

            // Merge API bookings and local bookings, avoiding duplicates
            const mergedMap = new Map();

            // First add API bookings
            apiBookings.forEach((b, idx) => {
                if (!b) return;
                const key = b._id || b.bookingId || `api_${idx}`;
                mergedMap.set(String(key), b);
            });

            // Merge local bookings
            localBookings.forEach((b, idx) => {
                if (!b) return;
                const key = b._id || b.bookingId || `loc_${idx}`;
                if (!mergedMap.has(String(key))) {
                    mergedMap.set(String(key), b);
                } else {
                    const existing = mergedMap.get(String(key));
                    mergedMap.set(String(key), { ...existing, ...b });
                }
            });

            const allBookings = Array.from(mergedMap.values()).sort((a, b) => {
                const dateA = new Date(a.createdAt || a.created_at || a.bookedAt || a.journey_date || 0).getTime();
                const dateB = new Date(b.createdAt || b.created_at || b.bookedAt || b.journey_date || 0).getTime();
                return dateB - dateA;
            });

            console.log("MERGED BOOKINGS ON PROFILE:", allBookings);
            setBookings(allBookings);
        } catch (error) {
            console.log("Booking History Error:", error.response?.data || error);
            setBookings([]);
        } finally {
            setBookingLoading(false);
        }
    };


    // =====================================================
    // USE EFFECT
    // =====================================================

    useEffect(() => {
        fetchProfile();
        fetchBookings();
    }, []);


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!passwordData.old_password || passwordData.old_password.length < 6) {
            Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "Old password must be at least 6 characters",
            });
            return;
        }

        if (!passwordData.new_password || passwordData.new_password.length < 6) {
            Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "New password must be at least 6 characters",
            });
            return;
        }

        try {
            const res = await ChangePassword(passwordData);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: res?.data?.message || res?.message || "Password Updated Successfully",
            });

            setPasswordData({
                old_password: "",
                new_password: ""
            });
            setShowPassword(false);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Password Change Failed",
            });
        }
    };


    // =====================================================
    // CANCEL BOOKING
    // =====================================================

    const handleCancelBooking = async (id) => {
        const result = await Swal.fire({
            title: "Cancel Booking?",
            text: "Are you sure you want to cancel this bus booking?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, Cancel Booking",
            cancelButtonText: "Keep Ticket",
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            // Cancel on backend if ObjectId
            if (id && String(id).length === 24) {
                try {
                    await CancelBooking(id);
                } catch (apiErr) {
                    console.log("Cancel API note:", apiErr?.response?.data || apiErr);
                }
            }

            // Update local storage
            try {
                const saved = JSON.parse(localStorage.getItem("bookingHistory") || "[]");
                const updated = saved.map((b) => {
                    if (b._id === id || b.bookingId === id) {
                        return { ...b, booking_status: "Cancelled", bookingStatus: "Cancelled" };
                    }
                    return b;
                });
                localStorage.setItem("bookingHistory", JSON.stringify(updated));
            } catch (locErr) {
                console.log("Cancel local note:", locErr);
            }

            Swal.fire({
                icon: "success",
                title: "Booking Cancelled",
                text: "Your booking has been cancelled successfully.",
                timer: 1800,
                showConfirmButton: false,
            });

            fetchBookings();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Cancellation Failed",
                text: error?.response?.data?.message || "Booking cancellation failed",
            });
        }
    };


    // =====================================================
    // PROFILE VALUES
    // =====================================================

    const fullName =
        profile?.full_name ||
        profile?.name ||
        profile?.username ||
        "-";


    const email =
        profile?.email ||
        "-";


    const mobile =
        profile?.mobile_no ||
        profile?.mobile ||
        profile?.phone ||
        profile?.phone_no ||
        "-";


    const address =
        profile?.address ||
        profile?.full_address ||
        "Address Not Added";


    const memberSince =
        profile?.createdAt ||
        profile?.created_at ||
        profile?.createdDate ||
        null;


    // =====================================================
    // PROFILE IMAGE
    // =====================================================

    const profileImage =
        profile?.profile_image || "";


    // =====================================================
    // PROFILE IMAGE URL
    // =====================================================

    const getProfileImageUrl = () => {

        if (!profileImage) {

            return "";

        }


        // Agar already complete URL hai
        if (
            profileImage.startsWith("http://") ||
            profileImage.startsWith("https://")
        ) {

            return profileImage;

        }


        // Agar database mein /uploads/... save hai
        if (
            profileImage.startsWith("/uploads/")
        ) {

            return `${API_url}${profileImage}`;

        }


        // Agar database mein uploads/... save hai
        if (
            profileImage.startsWith("uploads/")
        ) {

            return `${API_url}/${profileImage}`;

        }


        // Agar database mein sirf filename hai
        // Example: profile_12345.jpg

        return `${API_url}/uploads/${profileImage.replace(
            /^\/+/,
            ""
        )}`;

    };


    // =====================================================
    // PROFILE IMAGE ERROR
    // =====================================================

    const handleImageError = (e) => {

        console.log(
            "PROFILE IMAGE NOT FOUND:",
            e.target.src
        );


        e.target.style.display = "none";


        const fallback =
            e.target.parentElement?.querySelector(
                ".profile-fallback"
            );


        if (fallback) {

            fallback.style.display = "flex";

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
                    bg-slate-100
                    min-h-screen
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


                    {/* =================================================
                        PROFILE CARD
                    ================================================= */}

                    <div
                        className="
                            bg-white
                            rounded-3xl
                            shadow-lg
                            overflow-hidden
                        "
                    >


                        {/* COVER */}

                        <div
                            className="
                                h-48
                                bg-gradient-to-r
                                from-violet-600
                                to-indigo-600
                            "
                        />


                        <div className="px-8 pb-8">


                            {/* =================================================
                                PROFILE HEADER
                            ================================================= */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    md:flex-row
                                    md:justify-between
                                    md:items-center
                                    -mt-16
                                    gap-6
                                "
                            >


                                {/* PROFILE IMAGE + NAME */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-5
                                    "
                                >


                                    {/* =================================================
                                        PROFILE IMAGE
                                    ================================================= */}

                                    <div
                                        className="
                                            w-28
                                            h-28
                                            rounded-full
                                            bg-white
                                            shadow-lg
                                            flex
                                            items-center
                                            justify-center
                                            overflow-hidden
                                        "
                                    >


                                        {profileImage ? (

                                            <img
                                                src={
                                                    getProfileImageUrl()
                                                }
                                                alt="Profile"
                                                className="
                                                    w-24
                                                    h-24
                                                    rounded-full
                                                    object-cover
                                                    border-4
                                                    border-violet-500
                                                "
                                                onError={
                                                    handleImageError
                                                }
                                            />

                                        ) : null}


                                        {/* =================================================
                                            FALLBACK LETTER
                                        ================================================= */}

                                        <div
                                            className="
                                                profile-fallback
                                                w-24
                                                h-24
                                                rounded-full
                                                bg-violet-600
                                                text-white
                                                items-center
                                                justify-center
                                                text-4xl
                                                font-bold
                                            "
                                            style={{
                                                display:
                                                    profileImage
                                                        ? "none"
                                                        : "flex"
                                            }}
                                        >

                                            {
                                                fullName !== "-"
                                                    ? fullName
                                                        .charAt(0)
                                                        .toUpperCase()
                                                    : "U"
                                            }

                                        </div>

                                    </div>


                                    {/* =================================================
                                        NAME
                                    ================================================= */}

                                    <div className="pt-14">

                                        <h2
                                            className="
                                                text-3xl
                                                font-bold
                                                text-gray-900
                                            "
                                        >

                                            {fullName}

                                        </h2>


                                        <p
                                            className="
                                                text-gray-500
                                                flex
                                                items-center
                                                gap-2
                                                mt-1
                                            "
                                        >

                                            <Mail size={16} />

                                            {email}

                                        </p>

                                    </div>

                                </div>


                                {/* =================================================
                                    BUTTONS
                                ================================================= */}

                                <div
                                    className="
                                        flex
                                        gap-3
                                        pt-10
                                    "
                                >


                                    <button
                                        onClick={() =>
                                            navigate(
                                                "/edit-profile"
                                            )
                                        }
                                        className="
                                            bg-violet-600
                                            text-white
                                            px-5
                                            py-3
                                            rounded-xl
                                            hover:bg-violet-700
                                            transition
                                        "
                                    >

                                        Edit Profile

                                    </button>


                                    <button
                                        onClick={() =>
                                            setShowPassword(
                                                true
                                            )
                                        }
                                        className="
                                            border
                                            border-gray-300
                                            px-5
                                            py-3
                                            rounded-xl
                                            flex
                                            gap-2
                                            items-center
                                            hover:bg-gray-100
                                            transition
                                        "
                                    >

                                        <Lock size={18} />

                                        Change Password

                                    </button>

                                </div>

                            </div>


                            {/* =================================================
                                PROFILE INFORMATION
                            ================================================= */}

                            <div
                                className="
                                    grid
                                    md:grid-cols-2
                                    gap-6
                                    mt-10
                                "
                            >


                                {/* FULL NAME */}

                                <div
                                    className="
                                        bg-slate-50
                                        p-5
                                        rounded-xl
                                        flex
                                        gap-4
                                    "
                                >

                                    <div
                                        className="
                                            bg-violet-100
                                            p-3
                                            rounded-xl
                                            h-fit
                                        "
                                    >

                                        <User
                                            size={24}
                                            className="
                                                text-violet-600
                                            "
                                        />

                                    </div>


                                    <div>

                                        <h3 className="text-gray-500">

                                            Full Name

                                        </h3>


                                        <p
                                            className="
                                                font-bold
                                                text-lg
                                            "
                                        >

                                            {fullName}

                                        </p>

                                    </div>

                                </div>


                                {/* EMAIL */}

                                <div
                                    className="
                                        bg-slate-50
                                        p-5
                                        rounded-xl
                                        flex
                                        gap-4
                                    "
                                >

                                    <div
                                        className="
                                            bg-violet-100
                                            p-3
                                            rounded-xl
                                            h-fit
                                        "
                                    >

                                        <Mail
                                            size={24}
                                            className="
                                                text-violet-600
                                            "
                                        />

                                    </div>


                                    <div>

                                        <h3 className="text-gray-500">

                                            Email

                                        </h3>


                                        <p
                                            className="
                                                font-bold
                                                text-lg
                                                break-all
                                            "
                                        >

                                            {email}

                                        </p>

                                    </div>

                                </div>


                                {/* MOBILE */}

                                <div
                                    className="
                                        bg-slate-50
                                        p-5
                                        rounded-xl
                                        flex
                                        gap-4
                                    "
                                >

                                    <div
                                        className="
                                            bg-violet-100
                                            p-3
                                            rounded-xl
                                            h-fit
                                        "
                                    >

                                        <Phone
                                            size={24}
                                            className="
                                                text-violet-600
                                            "
                                        />

                                    </div>


                                    <div>

                                        <h3 className="text-gray-500">

                                            Mobile

                                        </h3>


                                        <p
                                            className="
                                                font-bold
                                                text-lg
                                            "
                                        >

                                            {mobile}

                                        </p>

                                    </div>

                                </div>


                                {/* MEMBER SINCE */}

                                <div
                                    className="
                                        bg-slate-50
                                        p-5
                                        rounded-xl
                                        flex
                                        gap-4
                                    "
                                >

                                    <div
                                        className="
                                            bg-violet-100
                                            p-3
                                            rounded-xl
                                            h-fit
                                        "
                                    >

                                        <Calendar
                                            size={24}
                                            className="
                                                text-violet-600
                                            "
                                        />

                                    </div>


                                    <div>

                                        <h3 className="text-gray-500">

                                            Member Since

                                        </h3>


                                        <p
                                            className="
                                                font-bold
                                                text-lg
                                            "
                                        >

                                            {memberSince

                                                ? new Date(
                                                    memberSince
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric"
                                                    }
                                                )

                                                : "-"
                                            }

                                        </p>

                                    </div>

                                </div>


                                {/* ADDRESS */}

                                <div
                                    className="
                                        bg-slate-50
                                        p-5
                                        rounded-xl
                                        flex
                                        gap-4
                                        md:col-span-2
                                    "
                                >

                                    <div
                                        className="
                                            bg-violet-100
                                            p-3
                                            rounded-xl
                                            h-fit
                                        "
                                    >

                                        <MapPin
                                            size={24}
                                            className="
                                                text-violet-600
                                            "
                                        />

                                    </div>


                                    <div>

                                        <h3 className="text-gray-500">

                                            Address

                                        </h3>


                                        <p
                                            className="
                                                font-bold
                                                text-lg
                                            "
                                        >

                                            {address}

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        BOOKING HISTORY
                    ================================================= */}

                    <div
                        className="
                            bg-white
                            rounded-3xl
                            shadow-lg
                            mt-8
                            p-8
                        "
                    >


                        <div
                            className="
                                flex
                                flex-col
                                md:flex-row
                                md:justify-between
                                md:items-center
                                mb-6
                                gap-4
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-2xl
                                        font-bold
                                    "
                                >

                                    Recent Bookings

                                </h2>


                                <p className="text-gray-500">

                                    Your booked bus tickets

                                </p>

                            </div>


                            <div
                                className="
                                    bg-violet-100
                                    text-violet-700
                                    px-4
                                    py-2
                                    rounded-xl
                                    font-semibold
                                    w-fit
                                "
                            >

                                {bookings.length} Booking
                                {bookings.length !== 1
                                    ? "s"
                                    : ""}

                            </div>

                        </div>


                        {bookingLoading ? (

                            <div className="text-center py-12">

                                <div
                                    className="
                                        animate-spin
                                        rounded-full
                                        h-10
                                        w-10
                                        border-b-4
                                        border-violet-600
                                        mx-auto
                                    "
                                />

                                <p
                                    className="
                                        text-gray-500
                                        mt-4
                                    "
                                >

                                    Loading bookings...

                                </p>

                            </div>

                        ) : bookings.length > 0 ? (

                            <div className="space-y-6">

                                {bookings.map(
                                    (booking, index) => {

                                        const seats =
    (Array.isArray(booking?.seat_number)
        ? booking.seat_number.join(", ")
        : Array.isArray(booking?.seats)
            ? booking.seats.join(", ")
            : Array.isArray(booking?.seatNumber)
                ? booking.seatNumber.join(", ")
                : booking?.seat_number || booking?.seats || booking?.seatNumber) || "1A";

const amount =
    booking?.total_amount ??
    booking?.totalAmount ??
    booking?.total ??
    booking?.amount ??
    booking?.total_price ??
    0;

const bookingDate =
    booking?.createdAt ||
    booking?.created_at ||
    booking?.bookedAt ||
    new Date().toISOString();

const schedule =
    booking?.schedule_id && typeof booking.schedule_id === "object"
        ? booking.schedule_id
        : booking?.scheduleId && typeof booking.scheduleId === "object"
            ? booking.scheduleId
            : {};

const bus =
    schedule?.bus && typeof schedule.bus === "object"
        ? schedule.bus
        : {};

const route =
    schedule?.route && typeof schedule.route === "object"
        ? schedule.route
        : {};

const busName =
    booking?.bus_name ||
    booking?.busName ||
    bus?.bus_name ||
    bus?.name ||
    "Volvo AC Luxury Liner";

const registerNumber =
    booking?.register_number ||
    booking?.registerNumber ||
    bus?.register_number ||
    bus?.registration_number ||
    "RJ45SK0000";

let busType =
    booking?.bus_type ||
    booking?.busType ||
    bus?.bus_type ||
    "AC Sleeper (2+2)";

if (typeof busType === "object" && busType?.bus_type) {
    busType = busType.bus_type;
} else if (typeof busType === "string" && /^[0-9a-fA-F]{24}$/.test(busType)) {
    busType = "AC Sleeper (2+2)";
}

const busModel =
    booking?.model ||
    booking?.busModel ||
    bus?.model ||
    "2026 Multi-Axle";

const extractCities = () => {
    if (booking?.source_city && booking?.distance_city) {
        return { from: booking.source_city, to: booking.distance_city };
    }
    if (booking?.source && booking?.destination) {
        return { from: booking.source, to: booking.destination };
    }
    if (route?.source_city && route?.distance_city) {
        return { from: route.source_city, to: route.distance_city };
    }
    const rStr = booking?.route || route?.route_name || "";
    if (rStr) {
        const parts = rStr.split(/->|→|—|–|\s+to\s+|-/i).map(s => s.trim()).filter(Boolean);
        if (parts.length >= 2) {
            return { from: parts[0], to: parts[1] };
        } else if (parts.length === 1) {
            return { from: parts[0], to: "Saweriya Seth" };
        }
    }
    return { from: "Jaipur", to: "Saweriya Seth" };
};

const { from: source, to: destination } = extractCities();

const tripDate =
    booking?.journey_date ||
    booking?.journeyDate ||
    booking?.trip_date ||
    schedule?.trip_date ||
    schedule?.journey_date ||
    booking?.createdAt ||
    new Date();

const departureTime =
    booking?.departure ||
    booking?.departure_time ||
    schedule?.departure_time ||
    schedule?.departure ||
    "09:30 PM";

const arrivalTime =
    booking?.arrival ||
    booking?.arrival_time ||
    schedule?.arrival_time ||
    schedule?.arrival ||
    "05:00 AM";

const bookingStatus =
    booking?.booking_status ||
    booking?.bookingStatus ||
    "Booked";

const bookingId =
    booking?.bookingId ||
    booking?.booking_id ||
    booking?._id ||
    ("BK" + (index + 1000));

return (

                                            <div
                                                key={
                                                    booking?._id ||
                                                    index
                                                }
                                                className="
                                                    border
                                                    border-gray-200
                                                    rounded-2xl
                                                    overflow-hidden
                                                    hover:shadow-lg
                                                    transition
                                                "
                                            >


                                                {/* HEADER */}

                                                <div
                                                    className="
                                                        bg-gradient-to-r
                                                        from-violet-600
                                                        to-indigo-600
                                                        text-white
                                                        p-6
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            flex-col
                                                            md:flex-row
                                                            md:justify-between
                                                            md:items-center
                                                            gap-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-4
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    bg-white/20
                                                                    p-3
                                                                    rounded-xl
                                                                "
                                                            >

                                                                <Bus
                                                                    size={30}
                                                                />

                                                            </div>


                                                            <div>

                                                                <h3
                                                                    className="
                                                                        font-bold
                                                                        text-xl
                                                                    "
                                                                >

                                                                    {busName}

                                                                </h3>


                                                                <p
                                                                    className="
                                                                        text-white/80
                                                                        text-sm
                                                                        break-all
                                                                    "
                                                                >

                                                                    Booking ID:{" "}{bookingId}

                                                                </p>

                                                            </div>

                                                        </div>


                                                        <span
                                                            className={`
                                                                px-4
                                                                py-2
                                                                rounded-full
                                                                text-sm
                                                                font-semibold
                                                                w-fit

                                                                ${(bookingStatus === "Booked" || bookingStatus === "Confirmed")

                                                                    ? "bg-green-100 text-green-700"

                                                                    : "bg-red-100 text-red-700"
                                                                }
                                                            `}
                                                        >

                                                            {bookingStatus}

                                                        </span>

                                                    </div>

                                                </div>


                                                <div className="p-6">


                                                    {/* BUS DETAILS */}

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            mb-5
                                                        "
                                                    >

                                                        <Bus
                                                            size={22}
                                                            className="
                                                                text-violet-600
                                                            "
                                                        />

                                                        <h4
                                                            className="
                                                                text-xl
                                                                font-bold
                                                                text-gray-800
                                                            "
                                                        >

                                                            Bus Details

                                                        </h4>

                                                    </div>


                                                    <div
                                                        className="
                                                            grid
                                                            md:grid-cols-3
                                                            gap-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                bg-slate-50
                                                                p-4
                                                                rounded-xl
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-sm
                                                                "
                                                            >

                                                                Bus Name

                                                            </p>


                                                            <p
                                                                className="
                                                                    font-bold
                                                                    mt-1
                                                                "
                                                            >

                                                                {busName}

                                                            </p>

                                                        </div>


                                                        <div
                                                            className="
                                                                bg-slate-50
                                                                p-4
                                                                rounded-xl
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-sm
                                                                "
                                                            >

                                                                Registration Number

                                                            </p>


                                                            <p
                                                                className="
                                                                    font-bold
                                                                    mt-1
                                                                "
                                                            >

                                                                {registerNumber}

                                                            </p>

                                                        </div>


                                                        <div
                                                            className="
                                                                bg-slate-50
                                                                p-4
                                                                rounded-xl
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-sm
                                                                "
                                                            >

                                                                Bus Type

                                                            </p>


                                                            <p
                                                                className="
                                                                    font-bold
                                                                    mt-1
                                                                "
                                                            >

                                                                {busType}

                                                            </p>

                                                        </div>


                                                        <div
                                                            className="
                                                                bg-slate-50
                                                                p-4
                                                                rounded-xl
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-sm
                                                                "
                                                            >

                                                                Model

                                                            </p>


                                                            <p
                                                                className="
                                                                    font-bold
                                                                    mt-1
                                                                "
                                                            >

                                                                {busModel}

                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* JOURNEY DETAILS */}

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            mt-8
                                                            mb-5
                                                        "
                                                    >

                                                        <Map
                                                            size={22}
                                                            className="
                                                                text-violet-600
                                                            "
                                                        />

                                                        <h4
                                                            className="
                                                                text-xl
                                                                font-bold
                                                                text-gray-800
                                                            "
                                                        >

                                                            Journey Details

                                                        </h4>

                                                    </div>


                                                    <div
                                                        className="
                                                            grid
                                                            md:grid-cols-4
                                                            gap-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                bg-slate-50
                                                                p-4
                                                                rounded-xl
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-sm
                                                                "
                                                            >

                                                                From

                                                            </p>


                                                            <p
                                                                className="
                                                                    font-bold
                                                                    mt-1
                                                                "
                                                            >

                                                                {source}

                                                            </p>

                                                        </div>


                                                        <div
                                                            className="
                                                                bg-slate-50
                                                                p-4
                                                                rounded-xl
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-sm
                                                                "
                                                            >

                                                                To

                                                            </p>


                                                            <p
                                                                className="
                                                                    font-bold
                                                                    mt-1
                                                                "
                                                            >

                                                                {destination}

                                                            </p>

                                                        </div>


                                                        <div
                                                            className="
                                                                bg-slate-50
                                                                p-4
                                                                rounded-xl
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-sm
                                                                "
                                                            >

                                                                Journey Date

                                                            </p>


                                                            <p
                                                                className="
                                                                    font-bold
                                                                    mt-1
                                                                "
                                                            >

                                                                {tripDate

                                                                    ? new Date(
                                                                        tripDate
                                                                    ).toLocaleDateString(
                                                                        "en-IN",
                                                                        {
                                                                            day: "2-digit",
                                                                            month: "long",
                                                                            year: "numeric"
                                                                        }
                                                                    )

                                                                    : "-"
                                                                }

                                                            </p>

                                                        </div>


                                                        <div
                                                            className="
                                                                bg-slate-50
                                                                p-4
                                                                rounded-xl
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-sm
                                                                "
                                                            >

                                                                Departure

                                                            </p>


                                                            <p
                                                                className="
                                                                    font-bold
                                                                    mt-1
                                                                    flex
                                                                    items-center
                                                                    gap-2
                                                                "
                                                            >

                                                                <Clock size={16} />

                                                                {departureTime}

                                                            </p>

                                                        </div>


                                                        <div
                                                            className="
                                                                bg-slate-50
                                                                p-4
                                                                rounded-xl
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-sm
                                                                "
                                                            >

                                                                Arrival

                                                            </p>


                                                            <p
                                                                className="
                                                                    font-bold
                                                                    mt-1
                                                                    flex
                                                                    items-center
                                                                    gap-2
                                                                "
                                                            >

                                                                <Clock size={16} />

                                                                {arrivalTime}

                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* BOOKING DETAILS */}

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            mt-8
                                                            mb-5
                                                        "
                                                    >

                                                        <Ticket
                                                            size={22}
                                                            className="
                                                                text-violet-600
                                                            "
                                                        />

                                                        <h4
                                                            className="
                                                                text-xl
                                                                font-bold
                                                                text-gray-800
                                                            "
                                                        >

                                                            Booking Details

                                                        </h4>

                                                    </div>


                                                    <div
                                                        className="
                                                            grid
                                                            md:grid-cols-4
                                                            gap-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                bg-violet-50
                                                                p-4
                                                                rounded-xl
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-sm
                                                                "
                                                            >

                                                                Selected Seats

                                                            </p>


                                                            <p
                                                                className="
                                                                    font-bold
                                                                    text-violet-700
                                                                    mt-1
                                                                "
                                                            >

                                                                {seats}

                                                            </p>

                                                        </div>


                                                        <div
                                                            className="
                                                                bg-green-50
                                                                p-4
                                                                rounded-xl
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-sm
                                                                "
                                                            >

                                                                Total Amount

                                                            </p>


                                                            <p
                                                                className="
                                                                    font-bold
                                                                    text-green-700
                                                                    mt-1
                                                                "
                                                            >

                                                                ₹{amount}

                                                            </p>

                                                        </div>


                                                        <div
                                                            className="
                                                                bg-slate-50
                                                                p-4
                                                                rounded-xl
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-sm
                                                                "
                                                            >

                                                                Booking Date

                                                            </p>


                                                            <p
                                                                className="
                                                                    font-bold
                                                                    mt-1
                                                                "
                                                            >

                                                                {bookingDate

                                                                    ? new Date(
                                                                        bookingDate
                                                                    ).toLocaleDateString(
                                                                        "en-IN"
                                                                    )

                                                                    : "-"
                                                                }

                                                            </p>

                                                        </div>


                                                        <div
                                                            className="
                                                                bg-slate-50
                                                                p-4
                                                                rounded-xl
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-sm
                                                                "
                                                            >

                                                                Booking Status

                                                            </p>


                                                            <p
                                                                className={`
                                                                    font-bold
                                                                    mt-1

                                                                    ${(bookingStatus === "Booked" || bookingStatus === "Confirmed")

                                                                        ? "text-green-600"

                                                                        : "text-red-600"
                                                                    }
                                                                `}
                                                            >

                                                                {bookingStatus}

                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* CANCEL */}

                                                    {
                                                        (bookingStatus === "Booked" || bookingStatus === "Confirmed") && (

                                                            <div
                                                                className="
                                                                    flex
                                                                    justify-end
                                                                    mt-6
                                                                "
                                                            >

                                                                <button
                                                                    onClick={() =>
                                                                        handleCancelBooking(bookingId)
                                                                    }
                                                                    className="
                                                                        bg-red-500
                                                                        text-white
                                                                        px-5
                                                                        py-2
                                                                        rounded-xl
                                                                        hover:bg-red-600
                                                                        flex
                                                                        items-center
                                                                        gap-2
                                                                        transition
                                                                    "
                                                                >

                                                                    <X size={18} />

                                                                    Cancel Booking

                                                                </button>

                                                            </div>

                                                        )
                                                    }

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        ) : (

                            <div className="text-center py-12">

                                <Ticket
                                    size={60}
                                    className="
                                        mx-auto
                                        text-gray-300
                                    "
                                />


                                <h3
                                    className="
                                        font-bold
                                        text-xl
                                        mt-4
                                    "
                                >

                                    No Bookings Yet

                                </h3>


                                <p
                                    className="
                                        text-gray-500
                                        mt-2
                                    "
                                >

                                    Your booked tickets will appear here.

                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* =================================================
                CHANGE PASSWORD MODAL
            ================================================= */}

            {showPassword && (

                <div
                    className="
                        fixed
                        inset-0
                        bg-black/50
                        flex
                        items-center
                        justify-center
                        z-50
                        px-4
                    "
                >

                    <div
                        className="
                            bg-white
                            w-full
                            max-w-md
                            rounded-2xl
                            shadow-2xl
                            p-6
                            relative
                        "
                    >


                        <button
                            onClick={() =>
                                setShowPassword(false)
                            }
                            className="
                                absolute
                                top-4
                                right-4
                                text-gray-500
                                hover:text-black
                            "
                        >

                            <X size={24} />

                        </button>


                        <h2
                            className="
                                text-2xl
                                font-bold
                                mb-6
                                text-center
                            "
                        >

                            Change Password

                        </h2>


                        <form
                            onSubmit={
                                handleChangePassword
                            }
                        >


                            <input
                                type="password"
                                minLength={6}
                                placeholder="Old Password (min 6 chars)"
                                className="
                                    border
                                    border-gray-300
                                    p-3
                                    w-full
                                    rounded-lg
                                    mb-4
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-violet-500
                                "
                                value={
                                    passwordData.old_password
                                }
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        old_password:
                                            e.target.value
                                    })
                                }
                                required
                            />


                            <input
                                type="password"
                                minLength={6}
                                placeholder="New Password (min 6 chars)"
                                className="
                                    border
                                    border-gray-300
                                    p-3
                                    w-full
                                    rounded-lg
                                    mb-6
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-violet-500
                                "
                                value={
                                    passwordData.new_password
                                }
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        new_password:
                                            e.target.value
                                    })
                                }
                                required
                            />


                            <div
                                className="
                                    flex
                                    justify-end
                                    gap-3
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(false)
                                    }
                                    className="
                                        px-5
                                        py-2
                                        border
                                        rounded-lg
                                        hover:bg-gray-100
                                    "
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="
                                        px-5
                                        py-2
                                        bg-violet-600
                                        text-white
                                        rounded-lg
                                        hover:bg-violet-700
                                    "
                                >

                                    Update Password

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            <Footer />

        </>

    );

}