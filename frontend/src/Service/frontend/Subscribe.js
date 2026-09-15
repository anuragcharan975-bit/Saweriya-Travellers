import axios from "axios";
import { API_url } from "../../Config/config";

export const AddSubscribe = async (data) => {
  const res = await axios.post(`${API_url}/frontend/subscribe/add`, data);
  return res.data;
};