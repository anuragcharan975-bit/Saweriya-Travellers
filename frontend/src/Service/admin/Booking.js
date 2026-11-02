import axios from "axios";
import { API_url } from "../../Config/config";

export const ViewAllBookings = async () => {
    const token = localStorage.getItem("admintoken") || localStorage.getItem("token") || "";
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await axios.get(`${API_url}/booking/viewall`, { headers });
    return res.data;
};

export const UpdateBookingStatus = async (id, status) => {
    const token = localStorage.getItem("admintoken") || localStorage.getItem("token") || "";
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await axios.put(`${API_url}/booking/status/${id}`, { status }, { headers });
    return res.data;
};
