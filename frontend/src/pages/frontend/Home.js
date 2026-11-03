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
      <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-orange-200">
              <Sparkles size={13} />
              <span>Top Destinations</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Explore <span className="text-orange-500">India</span>
            </h2>
            <p className="text-gray-500 mt-3 text-base">
              Most visited cities with guaranteed daily Volvo & luxury sleeper buses
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              {
                city: "Delhi",
                tagline: "India Gate & Red Fort",
                image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
                buses: "40+ Buses",
                fare: "₹450",
                badge: "Most Booked",
                routeId: "6a86d0e1799407248ea06fc9",
              },
              {
                city: "Jaipur",
                tagline: "Pink City & Hawa Mahal",
                image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
                buses: "50+ Buses",
                fare: "₹200",
                badge: "Heritage",
                routeId: "6ae86e457b369fafc905aaeb",
              },
              {
                city: "Mumbai",
                tagline: "Marine Drive & Gateway",
                image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
                buses: "60+ Buses",
                fare: "₹350",
                badge: "Expressway",
                routeId: "6ae86e457b369fafc905aaed",
              },
              {
                city: "Goa",
                tagline: "Beaches & Sunsets",
                image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
                buses: "20+ Buses",
                fare: "₹950",
                badge: "Luxury AC",
                routeId: "6ae86e457b369fafc905aaef",
              },
              {
                city: "Pune",
                tagline: "Hills & Deccan Vibe",
                image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
                buses: "30+ Buses",
                fare: "₹350",
                badge: "Fast Trip",
                routeId: "6ae86e457b369fafc905aaed",
              },
              {
                city: "Surat",
                tagline: "Diamond & Riverfront",
                image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80",
                buses: "25+ Buses",
                fare: "₹420",
                badge: "Intercity",
                routeId: "6ae86e467b369fafc905aaf1",
              },
            ].map((dest, i) => (
              <Link
                key={i}
                to={`/view-buses/${dest.routeId}`}
                className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2.5 flex flex-col justify-end min-h-[300px] border border-slate-200/60"
              >
                {/* Background Destination Photo with Ken-Burns Zoom */}
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 group-hover:scale-120 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay for Crisp Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/90 text-white backdrop-blur-md shadow-sm uppercase tracking-wider">
                    {dest.badge}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-200 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                    {dest.buses}
                  </span>
                </div>

                {/* Content at Bottom */}
                <div className="relative z-10 p-4 text-white">
                  <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider block">
                    Starting from {dest.fare}
                  </span>
                  <h3 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors mt-0.5">
                    {dest.city}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                    {dest.tagline}
                  </p>

                  <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold text-orange-300 group-hover:text-white transition-colors">
                    <span>View Buses</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
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
                  Saweriya <span className="text-orange-500">Travellers</span>
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
              <p className="flex items-center gap-2"><Mail size={16} className="text-orange-400" /> info@saweriyatravellers.com</p>
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
            <p>© 2026 Saweriya Travellers. All Rights Reserved.</p>
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