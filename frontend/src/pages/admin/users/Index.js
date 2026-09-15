import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2";
import { ToggleRight, ToggleLeft, Pencil, Trash2 } from 'lucide-react';
import { Image_url } from "../../../Config/config";
import { Eye } from "lucide-react";
import { ViewAllUser, Delete, StatusUpdate, SearchUser } from "../../../Service/frontend/User";
import UserModal from "./UserDetails";


export default function UserList() {

  const [dataList, setDataList] = useState([])
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(3)
  const [totalPages, setTotalPages] = useState(1)


  const [Email, setEmail] = useState("");


  const fetchData = async () => {
    try {
      const res = await ViewAllUser(page, limit);

      setDataList(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this User!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      try {
        await Delete(id);

        Swal.fire({
          icon: "success",
          title: "User Deleted!",
          text: "The User has been deleted Successfully.",
          confirmButtonColor: "#7c3aed",
          confirmButtonText: "OK"
        });

        fetchData(); // Refresh list

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
  }
  const handleSearch = async (e) => {
    e.preventDefault();

    const body = {
      email: Email,
    };

    const res = await SearchUser(page, limit, body);

    console.log(res);

    setDataList(res.data);
    setTotalPages(res.totalPages);
  };

  const handleUpdateStatus = async (id, updateStatus) => {
    try {

      const body = { status: updateStatus }
      await StatusUpdate(id, body);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Status updated successfully",
        timer: 1500,
        showConfirmButton: false,
      })

      fetchData()

    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      })
    }
  }


  return (
    <div>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            User Management
          </h2>
        </div>

        <div>
          <form
            onSubmit={handleSearch}
            className="flex items-end gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6"
          >
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>

              <input
                type="text"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email..."
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none"
              />
            </div>

                

            <button
              type="submit"
              className="h-12 px-8 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition"
            >
              Search
            </button>
          </form>



        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-sm text-slate-500 font-semibold">
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">

                {dataList.length > 0 ? (
                  dataList.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50">

                      <td className="px-6 py-4">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === true
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {user.status ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setUserDetails(user);
                            setOpen(true);
                          }}
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                          title="View User"
                        >
                          <Eye size={18} />
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <div
                            onClick={() => {
                              const status = !user.status;
                              handleUpdateStatus(user?._id, status)
                            }


                            }
                            className={`px-3 py-2 rounded-lg cursor-pointer transition-all ${user?.status
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                          >
                            {user?.status ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                          </div>


                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                            title="Delete"
                          >
                            <Trash2 size={20} strokeWidth={2.5} />
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
                      No User Found
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

        <UserModal
          open={open}
          onClose={() => setOpen(false)}
          user={userDetails}
        />

      </div>
    </div>
  );
}