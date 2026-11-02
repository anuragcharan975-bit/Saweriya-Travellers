import axios from "axios";
import { API_url } from "../../Config/config";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
    };
};

export const LoginApi = async (data) => {
    const res = await axios.post(`${API_url}/admin/login`, data);
    return res;
};

export const GetAdminProfile = async () => {
    const res = await axios.get(`${API_url}/admin/profile`, {
        headers: getHeaders(),
    });
    return res;
};

export const UpdateAdminProfile = async (formData) => {
    const res = await axios.put(`${API_url}/admin/profile`, formData, {
        headers: {
            ...getHeaders(),
            "Content-Type": "multipart/form-data",
        },
    });
    return res;
};

export const ChangeAdminPassword = async (data) => {
    const res = await axios.put(`${API_url}/admin/change-password`, data, {
        headers: getHeaders(),
    });
    return res;
};
