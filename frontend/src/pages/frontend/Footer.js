import React from 'react'
import { Bus, Phone, Mail, Map } from "lucide-react";
export default function Footer() {
    return (
        <div>

            <footer className="bg-slate-950 text-gray-400 border-t border-slate-800">
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
                            <p className="flex items-center gap-2 mt-2"><Phone size={16} className="text-orange-400" /> +91 9664366393</p>
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
            </footer>

        </div>
    )
}
