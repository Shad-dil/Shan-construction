import { useEffect, useRef, useState } from "react";
import { trustData } from "../data/TrustStrip";
import { useCountUp } from "../hooks/useCount";

export default function TrustStrip() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative bg-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="flex justify-center items-center text-4xl font-bold pb-2">
          Why Us
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustData.map((item, i) => (
            <TrustCard key={i} {...item} start={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustCard({ icon: Icon, value, label, suffix, start }) {
  const count = useCountUp(value, start);

  return (
    <div className="bg-gray-50 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
      <Icon className="mx-auto mb-3 text-yellow-500" size={32} />

      <p className="text-3xl font-extrabold text-gray-900">
        {count}
        {suffix}
      </p>

      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}
