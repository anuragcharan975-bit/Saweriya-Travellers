import axios from "axios";
import { API_url } from "../../Config/config";

export const AddContact = async (data) => {
  const res = await axios.post(`${API_url}/contact/add`, data);
  return res.data;
};

export const ViewAllContact = async (page = 1, limit = 5) => {
  const res = await axios.get(
    `${API_url}/contact/viewAll?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const Delete = async (id) => {
  const res = await axios.delete(`${API_url}/contact/delete/${id}`);
  return res.data;
};