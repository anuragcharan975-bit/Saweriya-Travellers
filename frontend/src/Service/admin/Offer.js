import axios from "axios";
import { API_url } from "../../Config/config";

export const AddOffer = async (data) => {
    const res = await axios.post(`${API_url}/offer/add`, data);
    return res;
};

export const ViewAllOffer = async (page, limit) => {
    const res = await axios.get(`${API_url}/offer/viewAll?page=${page}&limit=${limit}`);
    return res.data;
};

export const Delete = async (id) => {
    const res = await axios.delete(`${API_url}/offer/delete/${id}`);
    return res;
};

export const Update = async (id, updateData) => {
    const res = await axios.put(`${API_url}/offer/update/${id}`, updateData);
    return res;
};

export const ViewOffer = async (id) => {
    const res = await axios.get(`${API_url}/offer/view/${id}`);
    return res.data.data;
};

export const StatusUpdate = async (id, updateData) => {
    const res = await axios.put(`${API_url}/offer/statusUpdate/${id}`, updateData);
    return res;
};