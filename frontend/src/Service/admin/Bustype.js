import axios from "axios";
import { API_url } from "../../Config/config";



export const AddBusType = async (data) => {
    const res = await axios.post(`${API_url}/bustype/add`, data)
    return res
}

export const ViewAllBusType = async (page, limit) => {
    const res = await axios.get(
        `${API_url}/bustype/viewAll?page=${page}&limit=${limit}`
    );
    return res.data;
};

export const ViewBustypeDropdown = async () => {
    const res = await axios.get(`${API_url}/bustype/viewAll`);
    return res.data.data;
};

export const Delete = async (id) => {
    const res = await axios.delete(`${API_url}/bustype/delete/${id}`)
    return res
}

export const Update = async (id, updateData) => {
    const res = await axios.put(`${API_url}/bustype/update/${id}`, updateData,)
    return res
}

export const ViewBusType = async (id) => {
    const res = await axios.get(`${API_url}/bustype/view/${id}`)
    return res.data.data;
}

export const StatusUpdate = async (id, updateData) => {
    const res = await axios.put(`${API_url}/bustype/statusUpdate/${id}`, updateData)
    return res
}