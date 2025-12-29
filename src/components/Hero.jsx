import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center text-white">
        {/* Headline */}
        <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
          Trusted Home Construction & Renovation Services
        </h1>

        {/* Location line (VERY important for local trust) */}
        <p className="text-lg md:text-xl text-gray-200 mb-3">
          Serving homeowners across <span className="font-semibold">Bihar</span>
        </p>

        {/* Services clarity */}
        <p className="text-base md:text-lg text-gray-300 mb-8">
          New House Construction · Renovation · Interior & Civil Works
        </p>

        {/* CTA */}
        <div className="flex gap-4 justify-center flex-col md:flex-row">
          <a
            href="tel:+91XXXXXXXXXX"
            className="bg-yellow-500 text-black px-6 py-3 rounded font-semibold shadow-lg hover:bg-yellow-400 transition flex justify-between gap-2"
          >
            <FaWhatsapp size={18} className="mt-1" />
            <span>Call for Free Consultation</span>
          </a>

          <a
            href="https://wa.me/91XXXXXXXXXX"
            target="_blank"
            className="bg-green-500 px-6 py-3 rounded font-semibold shadow-lg hover:bg-green-600 transition flex justify-between gap-2"
          >
            <FaWhatsapp size={18} className="mt-1" />
            <span> WhatsApp the Owner</span>
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-8 text-sm text-gray-300 font-semibold">
          ✔ Quality Materials &nbsp; • &nbsp; ✔ Experienced Team &nbsp; • &nbsp;
          ✔ On-Time Delivery
        </div>
      </div>
    </section>
  );
};

export default Hero;
