import axios from "axios";
import { API_url } from "../../Config/config";


// ================= SEAT SELECTION =================

export const SeatSelection = async (data) => {

    const res = await axios.post(
        `${API_url}/booking/seat-selection`,
        data
    );

    return res.data;
};


// ================= CREATE BOOKING =================

export const CreateBooking = async (data) => {

    const token = localStorage.getItem("usertoken");

    const res = await axios.post(
        `${API_url}/booking/add`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
};


// ================= BOOKING HISTORY =================

export const BookingHistory = async () => {

    const token = localStorage.getItem("usertoken");

    const res = await axios.get(
        `${API_url}/booking/history`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
};


// ================= BOOKING DETAILS =================

export const BookingDetails = async (id) => {

    const token = localStorage.getItem("usertoken");

    const res = await axios.get(
        `${API_url}/booking/details/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
};


// ================= CANCEL BOOKING =================

export const CancelBooking = async (id) => {

    const token = localStorage.getItem("usertoken");

    const res = await axios.put(
        `${API_url}/booking/cancel/${id}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
};