import Header from "./Header";
import Footer from "./Footer";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { AddContact } from "../../Service/frontend/Contact";
import {
  User,
  Mail,
  Phone,
  FileText,
  MessageSquare,
  Send,
} from "lucide-react";
export default function Contact() {

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile_no: "",
    subject: "",
    message: "",
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await AddContact(formData);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.message,
      });

      setFormData({
        full_name: "",
        email: "",
        mobile_no: "",
        subject: "",
        message: "",
      });

    } catch (err) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          "Something went wrong",
      });

    }
  };
  return (
    <div>
      <Header />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 min-h-screen items-start">
          {/* Left Content */}
          <div className="flex flex-col justify-start pt-16 px-8 lg:px-12">
            <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-semibold w-fit">
              Contact Us
            </span>

            <h2 className="text-5xl font-bold mt-6 leading-tight">
              Need Help With Your
              <span className="text-orange-500"> Bus Booking?</span>
            </h2>

            <p className="text-gray-600 mt-6 text-lg leading-8">
              We're here to assist you with bus booking, cancellations,
              refunds and travel information. Fill out the form and our
              support team will contact you shortly.
            </p>

            <div className="mt-8 space-y-5">
              {/* Your Fast Response & Customer Support cards */}
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

            <h2 className="text-3xl font-bold text-slate-900">
              Send Message
            </h2>

            <p className="text-gray-500 mt-2 mb-6">
              We'd love to hear from you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-base font-semibold text-slate-800 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={20}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-semibold text-slate-800 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-base font-semibold text-slate-800 mb-2">
                  Mobile Number
                </label>

                <div className="relative">
                  <Phone
                    size={20}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="mobile_no"
                    value={formData.mobile_no}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-base font-semibold text-slate-800 mb-2">
                  Subject
                </label>

                <div className="relative">
                  <FileText
                    size={20}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Write subject"
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-base font-semibold text-slate-800 mb-2">
                  Message
                </label>

                <div className="relative">
                  <MessageSquare
                    size={20}
                    className="absolute left-5 top-4 text-gray-400"
                  />

                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    className="w-full pl-12 pr-4 pt-4 pb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>
      </section>


      <Footer />

    </div>
  );
}