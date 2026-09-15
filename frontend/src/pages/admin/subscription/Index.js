import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2";
import { ToggleRight, ToggleLeft, Pencil, Trash2 } from 'lucide-react';
import { Image_url } from "../../../Config/config";
import { Eye } from "lucide-react";
import { ViewAllSubscription } from "../../../Service/admin/Subscribe";

export default function UserList() {

  const [dataList, setDataList] = useState([])
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(3)
  const [totalPages, setTotalPages] = useState(1)

  const fetchData = async () => {
    try {
      const res = await ViewAllSubscription(page, limit);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDataList(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);


  return (
    <div>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Subscription Management
          </h2>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-sm text-slate-500 font-semibold">
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Created</th>
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
                        {new Date(user.createdAt).toLocaleDateString()}
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


      </div>
    </div>
  );
}