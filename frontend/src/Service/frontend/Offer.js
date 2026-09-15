import axios from "axios";
import { API_url } from "../../Config/config";

export const ViewAllOffers = async () => {
  const res = await axios.get(`${API_url}/frontend/offer/viewAll`);
  return res.data;
};