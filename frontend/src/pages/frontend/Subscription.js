import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { AddSubscribe } from "../../Service/frontend/Subscribe";

export default function Subscription() {

    const [email, setEmail] = useState("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-fade-in-up");
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll(".animate-on-scroll").forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);



    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!email) {
            Swal.fire({
                icon: "warning",
                title: "Email Required",
                text: "Please enter your email.",
            });
            return;
        }

        try {
            const res = await AddSubscribe({ email });

            Swal.fire({
                icon: "success",
                title: "Success",
                text: res.message,
            });

            setEmail("");

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "Something went wrong.",
            });
        }
    };
    return (
        <div>

            {/* ========== NEWSLETTER ========== */}
            <section className="py-24 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="animate-on-scroll">
                        <span className="inline-block px-4 py-1.5 bg-white/20 text-white rounded-full text-sm font-semibold mb-4 backdrop-blur-sm border border-white/20">
                            Newsletter
                        </span>

                        <h2 className="text-4xl lg:text-5xl font-bold text-white">
                            Subscribe to Our <span className="text-yellow-300">Newsletter</span>
                        </h2>

                        <p className="text-orange-100 mt-3 text-lg">
                            Get latest offers and updates directly in your inbox
                        </p>

                        <form
                            onSubmit={handleSubscribe}
                            className="flex flex-col sm:flex-row gap-4 mt-8 max-w-lg mx-auto"
                        >
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-white/50"
                            />

                            <button
                                type="submit"
                                className="bg-white text-orange-500 px-8 py-4 rounded-xl font-bold hover:bg-orange-50 transition whitespace-nowrap"
                            >
                                Subscribe Now
                            </button>
                        </form>

                        <p className="text-orange-200 text-sm mt-4">
                            We respect your privacy. No spam ever.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
