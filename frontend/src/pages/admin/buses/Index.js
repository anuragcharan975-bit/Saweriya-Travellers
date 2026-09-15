import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import { ViewAllBus, Delete, StatusUpdate, ViewBusStaff, AssignBus, SearchData, } from "../../../Service/admin/Bus";
import { ToggleRight, ToggleLeft, Pencil, Trash2 } from 'lucide-react'
import { Image_url } from "../../../Config/config"
import BusModal from "./BusDetails"
import { Eye } from "lucide-react";
import { BusFront } from "lucide-react";
import AssignBusModal from "./Assign"
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function BusList() {

  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);
  const [busDetails, setBusDetails] = useState(null);
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(3)
  const [totalPages, setTotalPages] = useState(1)

  const [Isbusopen, setIsBusOpen] = useState(false);

  const [staffList, setStaffList] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [RegisterNumber, setRegisterNumber] = useState(null);
  const [BusName, setBusName] = useState(null);


  const handleAssignBus = async (data) => {
    try {
      const res = await AssignBus(data);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.message || "Bus assigned successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      setIsBusOpen(false);

      fetchData();
      fetchViewBusStaff();

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: error.response?.data?.message || "Unable to assign the bus. Please try again.",
      });
    }
  };

  const fetchViewBusStaff = async () => {
    try {
      const res = await ViewBusStaff();
      setStaffList(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await ViewAllBus(page, limit);
      setDataList(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.log(error);

    }
  };

  useEffect(() => {
    fetchData();
    fetchViewBusStaff()
  }, [page, limit]);


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this bus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await Delete(id);

        Swal.fire({
          icon: "success",
          title: "Bus Deleted!",
          text: "The bus has been deleted successfully",
          confirmButtonColor: "#7c3aed",
          confirmButtonText: "OK"
        });

        fetchData();

      } catch (error) {

        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: error?.response?.data?.message || "Something went wrong. Please try again.",
          confirmButtonColor: "#dc2626",
          confirmButtonText: "OK"
        });

      }
    }
  };

  const handleUpdateStatus = async (id, updateStatus) => {
    try {

      const body = {
        status: updateStatus
      }
      await StatusUpdate(id, body);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Status Updated Successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      // Reload Bus List
      fetchData();

    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    }


  };





  const handleSearch = async (e) => {
    try {
      e.preventDefault()
      const body = {
        RegisterNumber: RegisterNumber,
        BusName: BusName,
      }
      const res = await SearchData(page, limit, body);
      setDataList(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {

    }
  };




  const downloadExcel = () => {
    const data = [
      {
        RegisterNumber: "RJ14AB1234",
        BusName: "Volvo AC",
        BusType: "Sleeper",
        TotalSeats: 40,
      },
      {
        RegisterNumber: "RJ14CD5678",
        BusName: "Scania",
        BusType: "Seater",
        TotalSeats: 45,
      },

    ];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Buses");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(file, "Bus_List.xlsx");
  };

  return (
    <div>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Bus Management
          </h2>

          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download Excel
          </button>
          <Link
            to="/admin/bus/add"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
          >
            <span>Add New Bus</span>
          </Link>

        </div>

        <div id="view-add-bus" className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 w-full">
            <form onSubmit={handleSearch}>



              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Register Number
                  </label>

                  <input
                    type="text"
                    name="register_number"
                    placeholder="Enter Register Number"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
                    value={RegisterNumber}

                    onChange={((e) => {
                      setRegisterNumber(e.target.value)
                    })}

                  />

                </div>


                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bus Name
                  </label>

                  <input
                    type="text"
                    name="register_number"
                    placeholder="Enter Register Number"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"

                    value={BusName}
                    onChange={((e) => {
                      setBusName(e.target.value)
                    })}

                  />

                </div>

                <div className=" flex justify-end gap-4 mt-4">

                  <button
                    type="submit"
                    className="px-6 h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition"
                  >
                    Search
                  </button>

                  <button
                    type="button"
                    className="px-6 h-11 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
                  >
                    Reset
                  </button>

                </div>
              </div>
            </form>
          </div>
        </div>


        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-sm text-slate-500 font-semibold">
                  <th className="px-6 py-4">Register Number</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">

                {dataList.length > 0 ? (
                  dataList.map((bus) => (
                    <tr key={bus._id} className="hover:bg-slate-50">

                      <td className="px-6 py-4">
                        {bus.register_number}
                      </td>

                      <td className="px-6 py-4">
                        {bus.bus_name}
                        <button
                          onClick={() => {
                            setBusDetails(bus);
                            setOpen(true);
                          }}
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                          title="View Bus"
                        >
                          <Eye size={18} />
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${bus.status === true
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {bus.status ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {new Date(bus.createdAt).toLocaleDateString()}
                      </td>



                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <div
                            onClick={() => {
                              const status = !bus.status;
                              handleUpdateStatus(bus?._id, status)
                            }


                            }
                            className={`px-3 py-2 rounded-lg cursor-pointer transition-all ${bus?.status
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                          >
                            {bus?.status ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                          </div>
                          <Link
                            to={`/admin/bus/edit/${bus._id}`}
                            className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                            title="Edit"
                          >
                            <Pencil size={20} strokeWidth={2.5} />
                          </Link>

                          <button
                            onClick={() => handleDelete(bus._id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                            title="Delete"
                          >
                            <Trash2 size={20} strokeWidth={2.5} />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedBus(bus);
                              setIsBusOpen(true);
                            }}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                            title="Assign Bus"
                          >
                            <BusFront size={20} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-8 text-slate-500"
                    >
                      No Bus Found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

            <div className="flex justify-end border-t border-slate-200 px-6 py-4">
              <nav
                aria-label="Pagination"
                className="flex items-center gap-2"
              >
                {/* Previous */}
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg border ${page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-violet-50"
                    }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`w-10 h-10 rounded-lg font-semibold ${page === pageNumber
                        ? "bg-violet-600 text-white"
                        : "border hover:bg-violet-50"
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Next */}
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-lg border ${page === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-violet-50"
                    }`}
                >
                  Next
                </button>
              </nav>
            </div>


          </div>
        </div>
        <BusModal
          open={open}
          onClose={() => setOpen(false)}
          bus={busDetails}
        />


        <AssignBusModal
          isOpen={Isbusopen}
          onClose={() => setIsBusOpen(false)}
          bus={selectedBus}
          staffList={staffList}
          onAssign={handleAssignBus}
        />
      </div>
    </div>
  );
}