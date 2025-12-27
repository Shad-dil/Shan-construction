import { useEffect, useState } from "react";

export default function Navbar({ companyName, phone }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-6 text-white">
        <img
          src="/logo.png"
          alt="Shan Construction"
          className="h-16 md:h-20 object-contain"
        />

        <a
          href="tel:+91..."
          className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold shadow"
        >
          Call Now
        </a>
      </div>
    </nav>
  );
}
