import React from "react";

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Trusted Construction & Civil Works
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Residential · Commercial · Renovation
        </p>

        <div className="flex gap-4 justify-center">
          <a className="bg-yellow-500 text-black px-6 py-3 rounded font-semibold cursor-pointer">
            Call Now
          </a>
          <a className="bg-green-500 px-6 py-3 rounded font-semibold cursor-pointer">
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
