import axios from "axios";
import {API_url} from "../../Config/config";

export const AddBus = async data => {
  const res = await axios.post(`${API_url}/bus/add`, data);
  return res;
};

export const ViewAllBus = async (page, limit, body) => {
  const res = await axios.get(
    `${API_url}/bus/viewAll?page=${page}&limit=${limit}`,
    body
  );

  return res.data;
};

export const SearchData = async (page, limit, body) => {
  const res = await axios.post(
    `${API_url}/bus/Seach?page=${page}&limit=${limit}`,
    body
  );

  return res.data;
};

export const ViewBusDropdown = async () => {
  const res = await axios.get(`${API_url}/bus/viewAll`);

  return res.data.data;
};

export const ViewBusStaff = async () => {
  const res = await axios.get(`${API_url}/bus/viewAllStaff`);

  return res.data.data;
};

export const AssignBus = async data => {
  const res = await axios.post(`${API_url}/bus/assign`, data);

  return res.data;
};

export const Delete = async id => {
  const res = await axios.delete(`${API_url}/bus/delete/${id}`);

  return res;
};

export const Update = async (id, updateData) => {
  const res = await axios.put(
    `${API_url}/bus/update/${id}`,
    updateData
  );

  return res;
};

export const ViewBus = async id => {
  const res = await axios.get(`${API_url}/bus/view/${id}`);

  return res.data.data;
};

export const StatusUpdate = async (id, updateData) => {
  const res = await axios.put(
    `${API_url}/bus/statusUpdate/${id}`,
    updateData
  );

  return res;
};