import axios from "axios";
import { API_url } from "../../Config/config";

export const AddSeat = async (data) => {
  return await axios.post(`${API_url}/seat/add`, data);
};

export const ViewAllSeat = async () => {
  const res = await axios.get(`${API_url}/seat/viewAll`);
  return res.data;
};

export const ViewSeatDropdown = async () => {
  const res = await axios.get(`${API_url}/seat/viewAll`);
  return res.data.data;
};

export const ViewSeat = async (id) => {
  const res = await axios.get(`${API_url}/seat/view/${id}`);
  return res.data.data;
};

export const ViewSeatByBus = async (busId) => {
  const res = await axios.get(`${API_url}/seat/bus/${busId}`);
  return res.data;
};

export const Update = async (id, updateData) => {
  return await axios.put(`${API_url}/seat/update/${id}`, updateData);
};

export const Delete = async (id) => {
  return await axios.delete(`${API_url}/seat/delete/${id}`);
};

export const StatusUpdate = async (id, updateData) => {
  return await axios.put(`${API_url}/seat/updateStatus/${id}`, updateData);
};