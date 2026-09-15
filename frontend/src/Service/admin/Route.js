import axios from "axios";
import { API_url } from "../../Config/config";



export const AddRoute = async (data) => {
    const res = await axios.post(`${API_url}/route/add`, data)
    return res
}

export const ViewAllRoute = async (page, limit) => {
    const res = await axios.get(
        `${API_url}/route/viewAll?page=${page}&limit=${limit}`
    );
    return res.data;
};

export const ViewRouteDropdown = async () => {
    const res = await axios.get(`${API_url}/route/viewAll`);
    return res.data.data;
};



export const Delete = async (id) => {
    const res = await axios.delete(`${API_url}/route/delete/${id}`)
    return res
}


export const Update = async (id,updateData) => {
    const res = await axios.put(`${API_url}/route/update/${id}`,updateData)
    return res
}

export const ViewRoute = async (id) => {
  const res = await axios.get(`${API_url}/route/view/${id}`);
  return res.data.data;
}


export const StatusUpdate = async (id,updateData) => {
    const res = await axios.put(`${API_url}/route/statusUpdate/${id}`,updateData)
    return res
}

export const ViewPopularRoutes = async()=>{

    const res = await axios.get(`${API_url}/route/popularRoutes`);

    return res.data;

}