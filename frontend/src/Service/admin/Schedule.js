import axios from "axios";
import { API_url } from "../../Config/config";

// =====================================================
// ADD SCHEDULE
// =====================================================

export const AddSchedule = async (data) => {

  const res = await axios.post(
    `${API_url}/schedule/add`,
    data
  );

  return res;

};


// =====================================================
// VIEW ALL SCHEDULE
// =====================================================

export const ViewAllSchedule = async (page, limit) => {

  const res = await axios.get(
    `${API_url}/schedule/viewAll?page=${page}&limit=${limit}`
  );

  return res.data;

};


// =====================================================
// SCHEDULE DROPDOWN
// =====================================================

export const ViewScheduleDropdown = async () => {

  const res = await axios.get(
    `${API_url}/schedule/viewAll`
  );

  return res.data.data;

};


// =====================================================
// DELETE
// =====================================================

export const Delete = async (id) => {

  const res = await axios.delete(
    `${API_url}/schedule/delete/${id}`
  );

  return res;

};


// =====================================================
// UPDATE
// =====================================================

export const Update = async (id, updateData) => {

  const res = await axios.put(
    `${API_url}/schedule/update/${id}`,
    updateData
  );

  return res;

};


// =====================================================
// VIEW SINGLE SCHEDULE
// =====================================================

export const ViewSchedule = async (id) => {

  const res = await axios.get(
    `${API_url}/schedule/view/${id}`
  );

  return res.data.data;

};


// =====================================================
// STATUS UPDATE
// =====================================================

export const StatusUpdate = async (id, updateData) => {

  const res = await axios.put(
    `${API_url}/schedule/statusUpdate/${id}`,
    updateData
  );

  return res;

};


// =====================================================
// VIEW SCHEDULE BY ROUTE
// =====================================================

export const ViewScheduleByRoute = async (id) => {

  const res = await axios.get(
    `${API_url}/schedule/viewByRoute/${id}`
  );

  return res.data;

};


// =====================================================
// SEARCH SCHEDULE
// =====================================================

export const SearchSchedule = async (data) => {

  const res = await axios.post(
    `${API_url}/schedule/search`,
    data
  );

  return res.data;

};