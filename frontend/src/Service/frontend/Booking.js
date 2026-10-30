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

export const BookingHistory = async () => {
    const token = localStorage.getItem("usertoken") || localStorage.getItem("token") || "";
    let userId = "";
    try {
        const userData = JSON.parse(localStorage.getItem("userdata") || "{}");
        userId = userData?._id || userData?.id || localStorage.getItem("user_id") || "";
    } catch (e) {
        // ignore parse error
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const url = userId
        ? `${API_url}/frontend/booking/history?user_id=${userId}`
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
