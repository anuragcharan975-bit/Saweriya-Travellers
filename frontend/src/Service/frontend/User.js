import axios from "axios";
import { API_url } from "../../Config/config";



export const ViewAllUser = async (page = 1, limit = 5) => {
    const res = await axios.get(
        `${API_url}/user/viewAll?page=${page}&limit=${limit}`
    );
    return res.data;
};

export const ViewUserDropdown = async () => {
    const res = await axios.get(`${API_url}/user/viewAll`);
    return res.data.data;
};

export const ViewUser = async (id) => {
    const res = await axios.get(`${API_url}/user/view/${id}`);
    return res.data;
};


export const Delete = async (id) => {
    const res = await axios.delete(`${API_url}/user/delete/${id}`);
    return res.data;
};

export const StatusUpdate = async (id, updateData) => {
    const res = await axios.put(`${API_url}/user/statusUpdate/${id}`, updateData);
    return res.data;
};

export const SearchUser = async (page = 1, limit = 5,body) => {
    const res = await axios.post(
        `${API_url}/user/search?page=${page}&limit=${limit}`,
        body
    );
    return res.data;
};