import axios from "axios";
import { API_url } from "../../Config/config";

export const ViewActiveFaq = async () => {
    const res = await axios.get(`${API_url}/frontend/faq/active`);
    return res.data.data;
};