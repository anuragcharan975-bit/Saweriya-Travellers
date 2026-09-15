import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ViewAllRoute,
  Delete,
  StatusUpdate
} from "../../../Service/admin/Route";

import Swal from "sweetalert2";

import {
  ToggleRight,
  ToggleLeft,
  Pencil,
  Trash2,
  Eye
} from "lucide-react";

import RouteModel from "./RouteDetails";


export default function RouteList() {

  // =====================================================
  // STATES
  // =====================================================

  const [dataList, setDataList] = useState([]);

  const [open, setOpen] = useState(false);

  const [routeDetails, setRouteDetails] = useState(null);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(3);

  const [totalPages, setTotalPages] = useState(1);

  // Loader
  const [loading, setLoading] = useState(true);


  // =====================================================
  // FETCH ROUTES
  // =====================================================

  const fetchData = async () => {

    try {

      // Loader start
      setLoading(true);

      const res = await ViewAllRoute(page, limit);

      setDataList(res.data || []);

      setTotalPages(res.totalPages || 1);

    } catch (error) {

      console.log("Route Fetch Error:", error);

    } finally {

      // Loader stop
      setLoading(false);

    }
  };


  // =====================================================
  // USE EFFECT
  // =====================================================

  useEffect(() => {

    fetchData();

  }, [page, limit]);


  // =====================================================
  // DELETE ROUTE
  // =====================================================

  const handleDelete = async (id) => {

    const result = await Swal.fire({

      title: "Are you sure?",

      text: "You won't be able to recover this route!",

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

          title: "Route Deleted!",

          text: "The Route has been deleted Successfully.",

          confirmButtonColor: "#7c3aed",

          confirmButtonText: "OK"

        });


        // Refresh data
        fetchData();


      } catch (error) {

        Swal.fire({

          icon: "error",

          title: "Deletion Failed",

          text:
            error?.response?.data?.message ||
            "Something went wrong. Please try again.",

          confirmButtonColor: "#dc2626",

          confirmButtonText: "OK"

        });

      }

    }

  };


  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const handleUpdateStatus = async (id, updateStatus) => {

    try {

      const body = {
        status: updateStatus
      };


      await StatusUpdate(id, body);


      Swal.fire({

        icon: "success",

        title: "Success!",

        text: "Status Updated Successfully",

        timer: 1500,

        showConfirmButton: false,

      });


      // Refresh data
      fetchData();


    } catch (error) {

      console.log(error);


      Swal.fire({

        icon: "error",

        title: "Error",

        text:
          error.response?.data?.message ||
          "Something went wrong",

      });

    }

  };


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div>

      <div className="space-y-6">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-slate-800">

            Route Management

          </h2>


          <Link
            to="/admin/bus-route/add"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
          >

            <span>
              Add New Route
            </span>

          </Link>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left">


              {/* =================================================
                  TABLE HEADER
              ================================================= */}

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr className="text-sm text-slate-500 font-semibold">

                  <th className="px-6 py-4">
                    Route Name
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Created
                  </th>

                  <th className="px-6 py-4">
                    Route Details
                  </th>

                  <th className="px-6 py-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>


              {/* =================================================
                  TABLE BODY
              ================================================= */}

              <tbody className="divide-y divide-slate-200">


                {/* =================================================
                    LOADER
                ================================================= */}

                {loading ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="py-12"
                    >

                      <div className="flex justify-center items-center">

                        <div
                          className="
                            w-12
                            h-12
                            border-4
                            border-violet-200
                            border-t-violet-600
                            rounded-full
                            animate-spin
                          "
                        >
                        </div>

                      </div>

                    </td>

                  </tr>


                ) : dataList.length > 0 ? (


                  /* =================================================
                      ROUTE DATA
                  ================================================= */

                  dataList.map((route) => (

                    <tr
                      key={route._id}
                      className="hover:bg-slate-50 transition"
                    >


                      {/* =================================================
                          ROUTE NAME
                      ================================================= */}

                      <td className="px-6 py-4">

                        {route.route_name}

                      </td>


                      {/* =================================================
                          STATUS
                      ================================================= */}

                      <td className="px-6 py-4">

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-semibold

                            ${
                              route.status === true
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                          `}
                        >

                          {route.status
                            ? "Active"
                            : "Inactive"
                          }

                        </span>

                      </td>


                      {/* =================================================
                          CREATED
                      ================================================= */}

                      <td className="px-6 py-4">

                        {new Date(
                          route.createdAt
                        ).toLocaleDateString()}

                      </td>


                      {/* =================================================
                          ROUTE DETAILS
                      ================================================= */}

                      <td className="px-6 py-4">

                        <button
                          onClick={() => {

                            setRouteDetails(route);

                            setOpen(true);

                          }}

                          className="
                            p-2
                            rounded-lg
                            bg-blue-100
                            text-blue-600
                            hover:bg-blue-600
                            hover:text-white
                            transition-all
                            duration-300
                          "

                          title="View Route"
                        >

                          <Eye size={18} />

                        </button>

                      </td>


                      {/* =================================================
                          ACTIONS
                      ================================================= */}

                      <td className="px-6 py-4">

                        <div className="flex justify-center gap-2">


                          {/* =================================================
                              STATUS TOGGLE
                          ================================================= */}

                          <div
                            onClick={() => {

                              const status =
                                !route.status;

                              handleUpdateStatus(
                                route._id,
                                status
                              );

                            }}

                            className={`
                              px-3
                              py-2
                              rounded-lg
                              cursor-pointer
                              transition-all

                              ${
                                route.status

                                  ? "bg-green-100 text-green-700 hover:bg-green-200"

                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }
                            `}
                          >

                            {route.status

                              ? (
                                <ToggleRight
                                  size={22}
                                />
                              )

                              : (
                                <ToggleLeft
                                  size={22}
                                />
                              )

                            }

                          </div>


                          {/* =================================================
                              EDIT
                          ================================================= */}

                          <Link
                            to={`/admin/bus-route/edit/${route._id}`}

                            className="
                              p-2
                              rounded-lg
                              bg-yellow-100
                              text-yellow-700
                              hover:bg-yellow-200
                              transition
                            "

                            title="Edit"
                          >

                            <Pencil
                              size={20}
                              strokeWidth={2.5}
                            />

                          </Link>


                          {/* =================================================
                              DELETE
                          ================================================= */}

                          <button

                            onClick={() =>
                              handleDelete(route._id)
                            }

                            className="
                              p-2
                              rounded-lg
                              bg-red-100
                              text-red-600
                              hover:bg-red-200
                              transition
                            "

                            title="Delete"
                          >

                            <Trash2
                              size={20}
                              strokeWidth={2.5}
                            />

                          </button>


                        </div>

                      </td>


                    </tr>

                  ))


                ) : (


                  /* =================================================
                      NO DATA
                  ================================================= */

                  <tr>

                    <td
                      colSpan="5"
                      className="
                        text-center
                        py-8
                        text-slate-500
                      "
                    >

                      No Route Found

                    </td>

                  </tr>

                )}

              </tbody>

            </table>


            {/* =================================================
                PAGINATION
            ================================================= */}

            <div className="flex justify-end border-t border-slate-200 px-6 py-4">

              <nav
                aria-label="Pagination"
                className="flex items-center gap-2"
              >


                {/* =================================================
                    PREVIOUS
                ================================================= */}

                <button

                  onClick={() =>
                    setPage((prev) =>
                      Math.max(prev - 1, 1)
                    )
                  }

                  disabled={
                    page === 1 || loading
                  }

                  className={`
                    px-4
                    py-2
                    rounded-lg
                    border

                    ${
                      page === 1 || loading

                        ? "opacity-50 cursor-not-allowed"

                        : "hover:bg-violet-50"
                    }
                  `}
                >

                  Previous

                </button>


                {/* =================================================
                    PAGE NUMBERS
                ================================================= */}

                {[...Array(totalPages)].map(
                  (_, index) => {

                    const pageNumber =
                      index + 1;

                    return (

                      <button

                        key={pageNumber}

                        onClick={() =>
                          setPage(pageNumber)
                        }

                        disabled={loading}

                        className={`
                          w-10
                          h-10
                          rounded-lg
                          font-semibold

                          ${
                            page === pageNumber

                              ? "bg-violet-600 text-white"

                              : "border hover:bg-violet-50"
                          }

                          ${
                            loading
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        `}
                      >

                        {pageNumber}

                      </button>

                    );

                  }
                )}


                {/* =================================================
                    NEXT
                ================================================= */}

                <button

                  onClick={() =>
                    setPage((prev) =>
                      Math.min(
                        prev + 1,
                        totalPages
                      )
                    )
                  }

                  disabled={
                    page === totalPages ||
                    loading
                  }

                  className={`
                    px-4
                    py-2
                    rounded-lg
                    border

                    ${
                      page === totalPages ||
                      loading

                        ? "opacity-50 cursor-not-allowed"

                        : "hover:bg-violet-50"
                    }
                  `}
                >

                  Next

                </button>


              </nav>

            </div>


          </div>

        </div>


        {/* =================================================
            ROUTE DETAILS MODAL
        ================================================= */}

        <RouteModel

          open={open}

          onClose={() =>
            setOpen(false)
          }

          route={routeDetails}

        />


      </div>

    </div>

  );

}