// import React, { useEffect, useState } from "react"
// import { Link } from "react-router-dom"
// import { ViewAllReport, Delete, StatusUpdate } from "../../../Service/admin/Report"
// import Swal from "sweetalert2";
// import { ToggleRight, ToggleLeft, Pencil, Trash2 } from 'lucide-react';

// export default function ReportList() {

//   const [dataList, setDataList] = useState([])


//   const fetchData = async () => {
//     try {
//       const res = await ViewAllReport()
//       setDataList(res)
//     }
//     catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => { fetchData() }, [])


//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to recover this report!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#7c3aed",
//       cancelButtonColor: "#ef4444",
//       confirmButtonText: "Yes, Delete",
//       cancelButtonText: "Cancel",
//     })

//     if (result.isConfirmed) {
//       try {
//         await Delete(id);

//         Swal.fire({
//           icon: "success",
//           title: "Report Deleted!",
//           text: "The report has been deleted Successfully.",
//           confirmButtonColor: "#7c3aed",
//           confirmButtonText: "OK"
//         });

//         fetchData(); // Refresh list

//       } catch (error) {

//         Swal.fire({
//           icon: "error",
//           title: "Deletion Failed",
//           text: error?.response?.data?.message || "Something went wrong. Please try again.",
//           confirmButtonColor: "#dc2626",
//           confirmButtonText: "OK"
//         });

//       }
//     }
//   }

//   const handleUpdateStatus = async (id, updateStatus) => {
//     try {

//       const body = { status: updateStatus }
//       await StatusUpdate(id, body);

//       Swal.fire({
//         icon: "success",
//         title: "Success!",
//         text: "Status Updated Successfully",
//         timer: 1500,
//         showConfirmButton: false,
//       })

//       fetchData()

//     } catch (error) {
//       console.log(error)
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.response?.data?.message || "Something went wrong",
//       })
//     }
//   }


//   return (
//     <div>
//       <div className="space-y-6">

//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold text-slate-800">
//             Report Management
//           </h2>

//           <Link
//             to="/admin/report/add"
//             className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
//           >
//             <span>Add New Report</span>
//           </Link>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">

//             <table className="w-full text-left">

//               <thead className="bg-slate-50 border-b border-slate-200">
//                 <tr className="text-sm text-slate-500 font-semibold">
//                   <th className="px-6 py-4">Report </th>
//                   <th className="px-6 py-4">From Date </th>
//                   <th className="px-6 py-4">To Date </th>
//                   <th className="px-6 py-4">Bus </th>
//                   <th className="px-6 py-4">Route </th>
//                   <th className="px-6 py-4">Driver</th>
//                   <th className="px-6 py-4">Booking Status</th>
//                   <th className="px-6 py-4">Payment Status</th>
//                   <th className="px-6 py-4 text-center">Status</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-200">

//                 {dataList.length > 0 ? (
//                   dataList.map((report) => (
//                     <tr key={report._id} className="hover:bg-slate-50">

//                       <td className="px-6 py-4 font-semibold">
//                         {report.route_name}

//                       </td>


//                       <td className="px-6 py-4 ">
//                         {report.source_city}
//                       </td>



//                       <td className="px-6 py-4">
//                         {report.distance_city}
//                       </td>

//                       <td className="px-6 py-4">
//                         {report.boarding_point}
//                       </td>

//                       <td className="px-6 py-4">
//                         {report.dropping_point}
//                       </td>

//                       <td className="px-6 py-4">
//                         {report.distance}
//                       </td>

//                       <td className="px-6 py-4">
//                         {report.duration}
//                       </td>

//                       <td className="px-6 py-4">
//                         {report.fare}
//                       </td>

//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-semibold ${report.status === true
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                             }`}
//                         >
//                           {report.status ? "Active" : "Inactive"}
//                         </span>
//                       </td>

//                       {/* <td className="px-6 py-4">
//                         {new Date(route.createdAt).toLocaleDateString()}
//                       </td> */}

//                       <td className="px-6 py-4">
//                         <div className="flex justify-center gap-2">
//                           <div
//                             onClick={() => {
//                               const status = !report.status;
//                               handleUpdateStatus(report?._id, status)
//                             }


//                             }
//                             className={`px-3 py-2 rounded-lg cursor-pointer transition-all ${report?.status
//                               ? "bg-green-100 text-green-700 hover:bg-green-200"
//                               : "bg-red-100 text-red-700 hover:bg-red-200"
//                               }`}
//                           >
//                             {report?.status ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
//                           </div>
//                           <Link
//                             to={`/admin/report/edit/${report._id}`}
//                             className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
//                             title="Edit"
//                           >
//                             <Pencil size={20} strokeWidth={2.5} />
//                           </Link>

//                           <button
//                             onClick={() => handleDelete(report._id)}
//                             className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
//                             title="Delete"
//                           >
//                             <Trash2 size={20} strokeWidth={2.5} />
//                           </button>

//                         </div>
//                       </td>

//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="7"
//                       className="text-center py-8 text-slate-500"
//                     >
//                       No route Found
//                     </td>
//                   </tr>
//                 )}

//               </tbody>

//             </table>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }