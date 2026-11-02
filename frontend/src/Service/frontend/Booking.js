import axios from "axios";
import { API_url } from "../../Config/config";


// ================= SEAT SELECTION =================

export const SeatSelection = async (data) => {

    const res = await axios.post(
        `${API_url}/frontend/booking/seat-selection`,
        data
    );

    return res.data;
};


// ================= CREATE BOOKING =================

export const CreateBooking = async (data) => {
    const token = localStorage.getItem("usertoken") || localStorage.getItem("token") || "";
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await axios.post(
        `${API_url}/frontend/booking/create`,
        data,
        { headers }
    );

    return res.data;
};


// ================= BOOKING HISTORY =================

export const BookingHistory = async (explicitUserId, explicitEmail) => {
    const token = localStorage.getItem("usertoken") || localStorage.getItem("token") || "";
    let userId = (typeof explicitUserId === "string" && explicitUserId !== "[object Object]") ? explicitUserId : "";
    let userEmail = (typeof explicitEmail === "string" && explicitEmail !== "[object Object]") ? explicitEmail : "";

    if (!userId || !userEmail) {
        try {
            const userData = JSON.parse(localStorage.getItem("userdata") || "{}");
            if (!userId) userId = userData?._id || userData?.id || userData?.user_id || localStorage.getItem("user_id") || "";
            if (!userEmail) userEmail = userData?.email || userData?.user_email || localStorage.getItem("user_email") || "";
        } catch (e) {
            // ignore parse error
        }
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const params = new URLSearchParams();
    if (userId && userId !== "[object Object]") params.append("user_id", userId);
    if (userEmail && userEmail !== "[object Object]") params.append("email", userEmail);

    const queryString = params.toString();
    const url = queryString
        ? `${API_url}/frontend/booking/history?${queryString}`
        : `${API_url}/frontend/booking/history`;

    const res = await axios.get(url, { headers });
    return res.data;
};


// ================= BOOKING DETAILS =================

export const BookingDetails = async (id) => {
    const token = localStorage.getItem("usertoken") || localStorage.getItem("token") || "";
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await axios.get(
        `${API_url}/frontend/booking/details/${id}`,
        { headers }
    );

    return res.data;
};


// ================= CANCEL BOOKING =================

export const CancelBooking = async (id) => {
    const token = localStorage.getItem("usertoken") || localStorage.getItem("token") || "";
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await axios.put(
        `${API_url}/frontend/booking/cancel/${id}`,
        {},
        { headers }
    );

    return res.data;
};


// ================= GET LIVE BOOKED SEATS (AUTO-FREED WHEN TRIP COMPLETES) =================

export const GetLiveBookedSeats = async (scheduleId, journeyDate) => {
    try {
        let url = `${API_url}/frontend/booking/booked-seats/${scheduleId || ""}`;
        if (journeyDate) {
            url += `?date=${encodeURIComponent(journeyDate)}`;
        }
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error("GetLiveBookedSeats error:", error);
        return { success: false, bookedSeats: [], isCompleted: false };
    }
};
