import axios from "axios";
import { API_url } from "../../Config/config";


export const ViewAllSubscription = async (page = 1, limit = 5) => {
  const res = await axios.get(`${API_url}/subscribe/viewAll?page=${page}&limit=${limit}`);
  return res.data;
};