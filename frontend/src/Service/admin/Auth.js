import axios from "axios";
import { API_url } from "../../Config/config";



export const LoginApi = async (data) => {
    const res = await axios.post(`${API_url}/admin/login`, data)
    return res
}
