import React, { useEffect, useState } from "react";
import { Clock, Users, Gift } from "lucide-react";
import { ViewAllOffers } from "../../Service/frontend/Offer";

export default function Offer() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await ViewAllOffers();
      setOffers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const icons = [Clock, Users, Gift];

  const colors = [
    "from-orange-400 to-red-500",
    "from-green-400 to-emerald-600",
    "from-purple-400 to-pink-600",
  ];

  return (
    <div>
      <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Heading */}
          <div className="text-center mb-16">

            <div className="inline-flex items-center gap-2 px-5 py-2 bg-orange-500/20 backdrop-blur-md rounded-full border border-orange-400/30 text-orange-300 font-semibold">
              Special Offers
            </div>

            <h2 className="mt-6 text-4xl lg:text-6xl font-extrabold text-white">
              Grab Exciting
              <span className="text-orange-400"> Deals</span>
            </h2>

            <p className="mt-4 text-gray-400 text-lg">
              Book your bus tickets and enjoy amazing discounts on every journey.
            </p>

          </div>

          {/* Offer Cards */}
          <div className="grid md:grid-cols-3 gap-8">

            {offers.map((offer, index) => {
              const Icon = icons[index % icons.length];
              const color = colors[index % colors.length];

              return (
                <div
                  key={offer._id}
                  className="
                    group
                    relative
                    bg-white/10
                    backdrop-blur-xl
                    rounded-3xl
                    p-8
                    border
                    border-white/20
                    shadow-xl
                    hover:bg-white/20
                    hover:-translate-y-3
                    transition-all
                    duration-500
                  "
                >

                  {/* Discount Badge */}
                  <div
                    className="
                      absolute
                      top-5
                      right-5
                      bg-orange-400
                      text-slate-900
                      px-4
                      py-1
                      rounded-full
                      text-sm
                      font-bold
                    "
                  >
                    {offer.discount}
                  </div>

                  {/* Icon */}
                  <div
                    className={`
                      w-20
                      h-20
                      rounded-3xl
                      bg-gradient-to-r
                      ${color}
                      flex
                      items-center
                      justify-center
                      shadow-lg
                      mb-6
                      group-hover:scale-110
                      group-hover:rotate-6
                      transition-all
                      duration-500
                    `}
                  >
                    <Icon size={38} className="text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    {offer.title}
                  </h3>

                  <p className="mt-3 text-gray-300 leading-relaxed">
                    {offer.description}
                  </p>

                  <button
                    className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lgshadow-orange-500/30">
                    Claim Offer
                  </button>

                </div>
              );
            })}

          </div>

        </div>
      </section>
    </div>
  );
}