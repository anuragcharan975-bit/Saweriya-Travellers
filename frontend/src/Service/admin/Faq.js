import axios from "axios";
import { API_url } from "../../Config/config";


export const AddFaq = async (data) => {
    const res = await axios.post(`${API_url}/faq/add`, data)
    return res
}

export const ViewAllFaq = async (page, limit) => {
    const res = await axios.get(
        `${API_url}/faq/viewAll?page=${page}&limit=${limit}`
    );
    return res.data;
};

export const Delete = async (id) => {
    const res = await axios.delete(`${API_url}/faq/delete/${id}`)
    return res
}

export const Update = async (id, updateData) => {
    const res = await axios.put(`${API_url}/faq/update/${id}`, updateData,)
    return res
}

export const ViewFaq = async (id) => {
    const res = await axios.get(`${API_url}/faq/view/${id}`)
    return res.data.data;
}

export const StatusUpdate = async (id, updateData) => {
    const res = await axios.put(`${API_url}/faq/statusUpdate/${id}`, updateData)
    return res
}