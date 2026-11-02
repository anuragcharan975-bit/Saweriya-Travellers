
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Bus, MapPin, Users, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <div className="pt-32 pb-20 bg-gradient-to-r from-slate-900 to-blue-950">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold text-white">
            About <span className="text-orange-500">Saweriya Travellers</span>
          </h1>

          <p className="mt-6 text-gray-300 text-lg max-w-3xl mx-auto">
            Saweriya Travellers is a trusted online bus booking platform that connects
            passengers with comfortable and affordable bus services across India.
            Book buses easily, check routes, track availability and enjoy a
            smooth travel experience.
          </p>

        </div>
      </div>


      {/* About Content */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                Making Bus Travel
                <span className="text-orange-500"> Simple & Reliable</span>
              </h2>

              <p className="mt-5 text-gray-600 leading-relaxed">
                At Saweriya Travellers, our mission is to make bus booking fast and
                convenient. Users can search buses, compare prices, choose
                seats and book tickets online from anywhere.
              </p>

              <p className="mt-4 text-gray-600 leading-relaxed">
                We work with trusted bus operators to provide safe,
                comfortable and on-time journeys for every passenger.
              </p>
            </div>


            <div className="bg-slate-50 rounded-3xl p-8 shadow-lg">

              <div className="flex items-center gap-4 mb-6">
                <Bus className="text-orange-500" size={35} />
                <div>
                  <h3 className="font-bold text-xl">
                    Multiple Bus Services
                  </h3>
                  <p className="text-gray-500">
                    Different operators and routes
                  </p>
                </div>
              </div>


              <div className="flex items-center gap-4 mb-6">
                <MapPin className="text-orange-500" size={35} />
                <div>
                  <h3 className="font-bold text-xl">
                    Wide Route Network
                  </h3>
                  <p className="text-gray-500">
                    Connecting major cities
                  </p>
                </div>
              </div>


              <div className="flex items-center gap-4 mb-6">
                <Users className="text-orange-500" size={35} />
                <div>
                  <h3 className="font-bold text-xl">
                    Happy Passengers
                  </h3>
                  <p className="text-gray-500">
                    Comfortable travel experience
                  </p>
                </div>
              </div>


              <div className="flex items-center gap-4">
                <ShieldCheck className="text-orange-500" size={35} />
                <div>
                  <h3 className="font-bold text-xl">
                    Safe & Secure
                  </h3>
                  <p className="text-gray-500">
                    Trusted booking system
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>


      {/* Stats */}
      <div className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-6 text-center">

          <div>
            <h2 className="text-4xl font-bold text-orange-500">
              500+
            </h2>
            <p className="text-gray-300">
              Bus Operators
            </p>
          </div>


          <div>
            <h2 className="text-4xl font-bold text-orange-500">
              1000+
            </h2>
            <p className="text-gray-300">
              Routes
            </p>
          </div>


          <div>
            <h2 className="text-4xl font-bold text-orange-500">
              1M+
            </h2>
            <p className="text-gray-300">
              Happy Customers
            </p>
          </div>


          <div>
            <h2 className="text-4xl font-bold text-orange-500">
              24/7
            </h2>
            <p className="text-gray-300">
              Support
            </p>
          </div>

        </div>
      </div>


      <Footer />

    </div>
  );
}

