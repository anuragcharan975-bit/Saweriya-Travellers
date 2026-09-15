import axios from "axios";
import { API_url } from "../../Config/config";



export const AddReport = async (data) => {
    const res = await axios.post(`${API_url}/report/add`, data)
    return res
}

export const ViewAllReport = async () => {
    const res = await axios.get(`${API_url}/report/viewall`)
    return res.data.data
}

export const Delete = async (id) => {
    const res = await axios.delete(`${API_url}/report/delete/${id}`)
    return res
}

export const Update = async (id, updateData) => {
    const res = await axios.put(`${API_url}/report/update/${id}`, updateData,)
    return res
}



export const StatusUpdate = async (id, updateData) => {
    const res = await axios.put(`${API_url}/report/statusUpdate/${id}`, updateData)
    return res
}

export const ViewReport = async (id) => {
    const res = await axios.get(`${API_url}/report/view/${id}`)
    return res
}