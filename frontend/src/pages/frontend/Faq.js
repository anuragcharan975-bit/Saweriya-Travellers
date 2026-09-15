import React, { useEffect, useState } from "react";
import { ViewActiveFaq } from "../../Service/frontend/Faq";

export default function Faq() {

    const [faqList, setFaqList] = useState([]);

    const fetchFaq = async () => {
        try {
            const data = await ViewActiveFaq();
            setFaqList(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchFaq();
    }, []);

    return (
        <div>
            <section className="py-24 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-4xl mx-auto px-6">

                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-600 rounded-full text-sm font-semibold mb-4">
                            FAQ
                        </span>

                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                            Frequently Asked <span className="text-orange-500">Questions</span>
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Find answers to common questions
                        </p>
                    </div>

                    <div className="space-y-4">

                        {faqList.map((faq, index) => (

                            <div
                                key={faq._id}
                                className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition-all duration-300"
                            >

                                <h3 className="font-bold text-gray-900 flex items-center gap-2">

                                    <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-sm font-bold">
                                        {index + 1}
                                    </span>

                                    {faq.question}

                                </h3>

                                <p className="text-gray-500 mt-3 pl-8">
                                    {faq.answer}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>
            </section>
        </div>
    );
}