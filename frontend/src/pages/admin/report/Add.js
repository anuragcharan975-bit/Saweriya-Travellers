// import React from "react";
// import Moment from "react-moment";
// import { X } from "lucide-react";

// export default function ReportModel({ open, onClose, report }) {
//   if (!open || !report) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-4">

//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b">
//           <h2 className="text-2xl font-bold text-slate-800">
//             Report Details
//           </h2>

//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg hover:bg-slate-100"
//           >
//             <X size={22} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 grid grid-cols-2 gap-5">

//           <div>
//             <p className="text-slate-500 text-sm">Report Type</p>
//             <h3 className="font-semibold">
//               {report.report_type}
//             </h3>
//           </div>

//           <div>
//             <p className="text-slate-500 text-sm">Bus</p>
//             <h3 className="font-semibold">
//               {report.bus?.bus_name || "All"}
//             </h3>
//           </div>

//           <div>
//             <p className="text-slate-500 text-sm">Route</p>
//             <h3 className="font-semibold">
//               {report.route?.route_name || "All"}
//             </h3>
//           </div>

//           <div>
//             <p className="text-slate-500 text-sm">Driver</p>
//             <h3 className="font-semibold">
//               {report.driver?.driver_name || "All"}
//             </h3>
//           </div>

//           <div>
//             <p className="text-slate-500 text-sm">Booking Status</p>
//             <h3 className="font-semibold">
//               {report.booking_status}
//             </h3>
//           </div>

//           <div>
//             <p className="text-slate-500 text-sm">Payment Status</p>
//             <h3 className="font-semibold">
//               {report.payment_status}
//             </h3>
//           </div>

//           <div>
//             <p className="text-slate-500 text-sm">From Date</p>
//             <h3 className="font-semibold">
//               <Moment format="DD-MM-YYYY">
//                 {report.from_date}
//               </Moment>
//             </h3>
//           </div>

//           <div>
//             <p className="text-slate-500 text-sm">To Date</p>
//             <h3 className="font-semibold">
//               <Moment format="DD-MM-YYYY">
//                 {report.to_date}
//               </Moment>
//             </h3>
//           </div>

//           <div>
//             <p className="text-slate-500 text-sm">Created Date</p>
//             <h3 className="font-semibold">
//               <Moment format="DD-MM-YYYY">
//                 {report.createdAt}
//               </Moment>
//             </h3>
//           </div>

//           <div>
//             <p className="text-slate-500 text-sm">Updated Date</p>
//             <h3 className="font-semibold">
//               <Moment format="DD-MM-YYYY">
//                 {report.updatedAt}
//               </Moment>
//             </h3>
//           </div>

//         </div>

//         {/* Footer */}
//         <div className="flex justify-end border-t px-6 py-4">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold"
//           >
//             Close
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }