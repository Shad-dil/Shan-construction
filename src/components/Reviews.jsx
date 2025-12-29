import React from "react";
import { reviews } from "../data/reviews";

const Reviews = () => {
  return (
    <section className="py-16 bg-white" id="students">
      <h2 className="text-3xl font-bold text-center mb-10">
        What Our Clients Say
      </h2>

      <div className="flex gap-6 overflow-x-auto px-4 max-w-6xl mx-auto scrollbar-hide">
        {reviews.map((r, idx) => (
          <div
            key={idx}
            className="min-w-70 bg-gray-50 p-6 rounded-lg shadow-sm"
          >
            <img
              src={r.image}
              alt={r.name}
              width={100}
              height={80}
              className="w-16 h-16 rounded-full mx-auto object-cover"
            />
            <h4 className="font-semibold text-center mt-3">{r.name}</h4>
            <p className="text-sm text-gray-500 text-center">{r.project}</p>

            <Stars count={r.rating} />

            <p className="text-sm text-gray-700 mt-3 text-center">
              “{r.review}”
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;

const Stars = ({ count }) => (
  <div className="flex justify-center gap-1 mt-2">
    {[...Array(5)].map((_, i) => (
      <span key={i}>{i < count ? "⭐" : "☆"}</span>
    ))}
  </div>
);
