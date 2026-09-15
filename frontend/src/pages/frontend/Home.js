import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import PopularRoutes from "./PopularRoutes";
import {
  Bus,
  MapPin,
  CalendarDays,
  Users,
  Search,
  CheckCircle,
  ArrowRight,
  Shield,
  Headphones,
  Clock,
  Truck,
  Gift,
  ChevronRight,
  Phone,
  Mail,
  Map,
  PlayCircle,
  CreditCard,
  Wallet,
  Ticket,
  BusFront,
  Route,
  Building2,
  Crown,
  Star,
  Sparkles,
  Award,
  ThumbsUp,
  Globe,
} from "lucide-react";
import BusLogo from "../../assets/logo.png"
import Swal from "sweetalert2";
import Header from "./Header";
import Footer from "./Footer";
import Subscription from "./Subscription";
import HeroSection from "./HeroSection";
import Faq from "./Faq";
import Offer from "./Offer";

export default function Home() {

  return (
    <div className="overflow-x-hidden">
      {/* ========== NAVBAR ========== */}
      <Header />
      {/* ========== HERO SECTION ========== */}

      <HeroSection />
      {/* ========== POPULAR ROUTES ========== */}
      <PopularRoutes />



      {/* ========== WHY CHOOSE US ========== */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              We Make Travel <span className="text-orange-500">Better</span>
            </h2>
            <p className="text-gray-500 mt-3">Experience the difference with our premium services</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Safe Travel", desc: "GPS tracked & sanitized buses", color: "from-green-500 to-emerald-500" },
              { icon: Headphones, title: "24/7 Support", desc: "Live chat and call support", color: "from-blue-500 to-indigo-500" },
              { icon: Wallet, title: "Best Price", desc: "No hidden charges", color: "from-purple-500 to-pink-500" },
              { icon: Clock, title: "On-Time", desc: "Punctual departure & arrival", color: "from-orange-500 to-red-500" },
            ].map((item, i) => (
              <div
                key={i}
                className="group text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-on-scroll"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-500 shadow-lg`}>
                  <item.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-6">{item.title}</h3>
                <p className="text-gray-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BUS CATEGORIES ========== */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block px-4 py-1.5 bg-orange-500/20 text-orange-300 rounded-full text-sm font-semibold mb-4 border border-orange-500/30">
              Bus Categories
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold">Choose Your <span className="text-orange-400">Ride</span></h2>
            <p className="text-gray-400 mt-3">Select from our wide range of premium buses</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Crown, title: "Luxury", desc: "Premium comfort & style", color: "from-yellow-400 to-orange-500" },
              { icon: BusFront, title: "AC Sleeper", desc: "Reclining seats & AC", color: "from-blue-400 to-indigo-500" },
              { icon: Truck, title: "Volvo", desc: "Scania & Volvo buses", color: "from-green-400 to-emerald-500" },
              { icon: Bus, title: "Express", desc: "Budget friendly travel", color: "from-orange-400 to-red-500" },
            ].map((cat, i) => (
              <div
                key={i}
                className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/10 hover:border-orange-500/30 transition-all duration-500 hover:-translate-y-2 animate-on-scroll"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${cat.color} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-${cat.color.split(' ')[0]}/30`}>
                  <cat.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold mt-6">{cat.title}</h3>
                <p className="text-gray-400 mt-2">{cat.desc}</p>
                <div className="mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-orange-500 to-transparent transition-all duration-500 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== POPULAR OPERATORS ========== */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4">
              Trusted Operators
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">Popular <span className="text-orange-500">Operators</span></h2>
            <p className="text-gray-500 mt-3">Travel with India's most trusted bus operators</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Neeta Travels", "VRL Travels", "SRS Travels", "Orange Travels"].map((op, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-on-scroll"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Building2 className="text-orange-500" size={40} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-4">{op}</h3>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="text-yellow-400 fill-yellow-400" size={16} />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">4.8 ★ (2K+ reviews)</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TOP DESTINATIONS ========== */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
              Top Destinations
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">Explore <span className="text-orange-500">India</span></h2>
            <p className="text-gray-500 mt-3">Most visited cities by our travelers</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { city: "Delhi", color: "from-red-500 to-orange-500" },
              { city: "Mumbai", color: "from-blue-500 to-indigo-500" },
              { city: "Jaipur", color: "from-orange-500 to-yellow-500" },
              { city: "Goa", color: "from-green-500 to-emerald-500" },
              { city: "Kerala", color: "from-purple-500 to-pink-500" },
              { city: "Varanasi", color: "from-yellow-500 to-orange-500" },
            ].map((dest, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 text-center shadow hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-on-scroll"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${dest.color} rounded-full flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-500`}>
                  <MapPin className="text-white" size={24} />
                </div>
                <p className="font-bold text-gray-900 mt-3">{dest.city}</p>
                <p className="text-xs text-gray-500">Popular</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SPECIAL OFFERS ========== */}
   <Offer/>

      {/* ========== SERVICES ========== */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
              Our Services
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              What We <span className="text-orange-500">Offer</span>
            </h2>
            <p className="text-gray-500 mt-3">Making your journey smooth and memorable</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Ticket, title: "Easy Booking", desc: "Book in 2 minutes", color: "from-blue-500 to-indigo-500" },
              { icon: CreditCard, title: "Secure Payment", desc: "100% safe transactions", color: "from-green-500 to-emerald-500" },
              { icon: Route, title: "Live Tracking", desc: "Real-time bus location", color: "from-purple-500 to-pink-500" },
              { icon: Headphones, title: "24/7 Support", desc: "Dedicated help", color: "from-orange-500 to-red-500" },
            ].map((service, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-on-scroll"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500`}>
                  <service.icon className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-4">{service.title}</h3>
                <p className="text-gray-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== STATISTICS ========== */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Happy Travelers", icon: Users, color: "from-blue-500 to-indigo-500" },
              { number: "500+", label: "Bus Fleet", icon: Bus, color: "from-green-500 to-emerald-500" },
              { number: "120+", label: "Destinations", icon: Globe, color: "from-purple-500 to-pink-500" },
              { number: "4.9★", label: "Average Rating", icon: Star, color: "from-yellow-400 to-orange-500" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center group animate-on-scroll"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-500 shadow-lg`}>
                  <stat.icon className="text-white" size={32} />
                </div>
                <h3 className="text-5xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                  {stat.number}
                </h3>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              What Our <span className="text-orange-500">Customers Say</span>
            </h2>
            <p className="text-gray-500 mt-3">Thousands of happy travelers trust us every day</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { name: "Rahul Sharma", city: "Jaipur", text: "Very comfortable journey and clean buses. Booking process was simple and quick.", image: "https://i.pravatar.cc/100?img=1" },
              { name: "Priya Verma", city: "Delhi", text: "Excellent service with live tracking. I will definitely book again.", image: "https://i.pravatar.cc/100?img=5" },
              { name: "Amit Singh", city: "Udaipur", text: "Premium buses at affordable prices. Highly recommended.", image: "https://i.pravatar.cc/100?img=3" },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-on-scroll"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <img src={review.image} alt={review.name} className="w-14 h-14 rounded-full" />
                  <div>
                    <h3 className="font-bold text-gray-900">{review.name}</h3>
                    <span className="text-gray-500 text-sm">{review.city}</span>
                  </div>
                </div>
                <div className="text-yellow-400 text-xl mt-4">★★★★★</div>
                <p className="mt-4 text-gray-600 leading-relaxed">"{review.text}"</p>
                <div className="mt-4 flex items-center gap-1 text-orange-500">
                  <ThumbsUp size={16} />
                  <span className="text-sm">Helpful</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ========== DOWNLOAD APP ========== */}
      <section className="py-24 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 items-center gap-12">
          <div className="animate-on-scroll">
            <span className="inline-block px-4 py-1.5 bg-white/20 text-white rounded-full text-sm font-semibold mb-4 backdrop-blur-sm border border-white/20">
              Mobile App
            </span>
            <h2 className="text-5xl lg:text-6xl font-bold text-white">
              Download Our <br />
              <span className="text-orange-400">Mobile App</span>
            </h2>
            <p className="mt-6 text-gray-300 text-lg leading-relaxed">
              Book tickets faster, track your bus live, and receive instant
              notifications on your phone.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <button className="group bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center gap-3 shadow-xl">
                <PlayCircle size={28} />
                <div className="text-left">
                  <p className="text-xs">GET IT ON</p>
                  <p className="font-bold">Google Play</p>
                </div>
              </button>
              <button className="group bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 flex items-center gap-3 shadow-xl shadow-orange-500/30">
                <PlayCircle size={28} />
                <div className="text-left">
                  <p className="text-xs">Download on</p>
                  <p className="font-bold">App Store</p>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-6 mt-6 text-gray-300">
              <div className="flex items-center gap-1">
                <CheckCircle className="text-green-400" size={16} />
                <span className="text-sm">4.9 Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="text-blue-400" size={16} />
                <span className="text-sm">1M+ Downloads</span>
              </div>
            </div>
          </div>
          <div className="relative animate-on-scroll">
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent rounded-3xl blur-2xl"></div>
            <img
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=700"
              alt="Mobile App"
              className="rounded-3xl shadow-2xl w-full hover:scale-105 transition-transform duration-700 relative z-10"
            />
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <Faq />

      <Subscription />

      {/* ========== CTA BANNER ========== */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="animate-on-scroll">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/30">
              <Bus className="text-white" size={40} />
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-white">
              Ready to <span className="text-orange-400">Travel</span>?
            </h2>
            <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
              Book your bus ticket now and enjoy a comfortable journey with India's most trusted bus booking platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-10 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/30 flex items-center gap-2">
                Book Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button className="group border border-white/30 hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 backdrop-blur-sm flex items-center gap-2">
                Learn More
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      {/* <footer className="bg-slate-950 text-gray-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3">
                <Bus className="text-orange-500" size={34} />
                <h2 className="text-2xl font-bold text-white">
                  Drive<span className="text-orange-500">Bus</span>
                </h2>
              </div>
              <p className="mt-4 leading-relaxed">India's trusted online bus booking platform. Making travel comfortable since 2020.</p>
              <div className="flex gap-3 mt-6">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-orange-500 cursor-pointer transition-all duration-300 hover:scale-110">
                  <span className="text-white">f</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-orange-500 cursor-pointer transition-all duration-300 hover:scale-110">
                  <span className="text-white">🐦</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-orange-500 cursor-pointer transition-all duration-300 hover:scale-110">
                  <span className="text-white">📷</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-orange-500 cursor-pointer transition-all duration-300 hover:scale-110">
                  <span className="text-white">▶</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg text-white font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                <li className="hover:text-orange-400 cursor-pointer transition-colors hover:translate-x-1 transform duration-300">About Us</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors hover:translate-x-1 transform duration-300">Careers</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors hover:translate-x-1 transform duration-300">Blog</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors hover:translate-x-1 transform duration-300">Contact</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg text-white font-bold mb-4">Services</h3>
              <ul className="space-y-3">
                <li className="hover:text-orange-400 cursor-pointer transition-colors hover:translate-x-1 transform duration-300">Bus Booking</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors hover:translate-x-1 transform duration-300">Live Tracking</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors hover:translate-x-1 transform duration-300">Offers</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors hover:translate-x-1 transform duration-300">Support</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg text-white font-bold mb-4">Contact</h3>
              <p className="flex items-center gap-2"><Mail size={16} className="text-orange-400" /> info@drivebus.com</p>
              <p className="flex items-center gap-2 mt-2"><Phone size={16} className="text-orange-400" /> +91 9876543210</p>
              <p className="flex items-center gap-2 mt-2"><Map size={16} className="text-orange-400" /> Jaipur, Rajasthan</p>
              <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <p className="text-sm text-gray-500">Working Hours</p>
                <p className="text-white">24/7 Available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
            <p>© 2026 DriveBus. All Rights Reserved.</p>
            <div className="flex gap-6 mt-2 md:mt-0">
              <span className="hover:text-orange-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-orange-400 cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-orange-400 cursor-pointer transition-colors">Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer> */}
      <Footer />
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 3s ease-in-out infinite 1.5s;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-on-scroll {
          opacity: 0;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}