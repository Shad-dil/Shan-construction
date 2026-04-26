import "./App.css";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import TrustStrip from "./components/TrustStrip";
import Reviews from "./components/Reviews";

import { useState, useEffect, useRef } from "react";
import Chatbot from "./components/ChatBot";

const COLORS = {
  red: "#C8102E",
  darkRed: "#8B0000",
  orange: "#F5A623",
  yellow: "#FFD700",
  dark: "#111111",
  charcoal: "#1E1E1E",
  steel: "#5A6478",
  cream: "#FDF8F2",
  white: "#FFFFFF",
};

const brands = [
  {
    name: "ACC",
    sub: "Gold · Water Shield",
    color: "#C8102E",
    icon: "🔴",
    grades: ["PPC", "OPC 53", "Water Shield"],
  },
  {
    name: "UltraTech",
    sub: "Weather Plus · India's No.1",
    color: "#003580",
    icon: "🔵",
    grades: ["PPC", "OPC 43", "OPC 53"],
  },
  {
    name: "Ambuja",
    sub: "Kawach · Plus",
    color: "#E65C00",
    icon: "🟠",
    grades: ["PPC", "Composite"],
  },
  {
    name: "JSW",
    sub: "The Leaders' Choice",
    color: "#006400",
    icon: "🟢",
    grades: ["PPC", "OPC", "GGBS"],
  },
  {
    name: "Nuvoco",
    sub: "Shaping A New World",
    color: "#555",
    icon: "⚫",
    grades: ["Concreto", "Duraguard"],
  },
  {
    name: "Prism",
    sub: "Think Ahead",
    color: "#8B6914",
    icon: "🟡",
    grades: ["PPC", "OPC"],
  },
  {
    name: "Dalmia",
    sub: "Bharat",
    color: "#5c1a1a",
    icon: "🔶",
    grades: ["PPC", "OPC 53"],
  },
  {
    name: "Shree / Bangur",
    sub: "Strong & Reliable",
    color: "#333",
    icon: "🟣",
    grades: ["PPC", "OPC"],
  },
];

const products = [
  {
    icon: "🧱",
    name: "Cement",
    desc: "All major brands — ACC, UltraTech, Ambuja, JSW, Prism, Dalmia & more. Available in 50kg bags, wholesale & retail.",
    tag: "cement",
    cta: "Enquire Now",
  },
  {
    icon: "🏖️",
    name: "Sand (Ballu)",
    desc: "River sand & M-Sand for construction and plastering. Direct truck delivery to your site anywhere in Darbhanga.",
    tag: "sand",
    cta: "Get Quote",
  },
  {
    icon: "🪨",
    name: "Stone Aggregate (Gitti)",
    desc: "6mm–40mm graded aggregate, available from rack point. Ideal for RCC, concrete & foundation work.",
    tag: "gravel",
    cta: "Get Quote",
  },
  {
    icon: "⚙️",
    name: "TMT Steel Bar (Chhard)",
    desc: "Fe-500/500D TMT bars from 8mm to 32mm. Best for columns, slabs & structural frames.",
    tag: "steel",
    cta: "Get Quote",
  },
  {
    icon: "🏗️",
    name: "Bricks (Eent)",
    desc: "Fired clay bricks & fly ash bricks of superior quality. Bulk orders welcome with special discounts.",
    tag: "brick",
    cta: "Order Bulk",
  },
  {
    icon: "🌿",
    name: "Filling Soil (Mitti)",
    desc: "Earthfill soil delivered by hyva (heavy vehicle). Perfect for foundation filling & land leveling.",
    tag: "soil",
    cta: "Get Quote",
  },
  {
    icon: "🚛",
    name: "Transport Service",
    desc: "Freight & logistics across Darbhanga and surrounding districts. Reliable, on-time delivery guaranteed.",
    tag: "transport",
    cta: "Book Now",
  },
];

const whyUs = [
  {
    icon: "💰",
    title: "Lowest Market Price",
    desc: "We buy wholesale and pass on the savings directly — guaranteed cheaper than the local market.",
  },
  {
    icon: "🏭",
    title: "9+ Cement Brands",
    desc: "From ACC to Dalmia — every major Indian cement brand available under one roof.",
  },
  {
    icon: "🚛",
    title: "Doorstep Delivery",
    desc: "Sand & aggregate by truck, cement from rack point — delivered straight to your construction site.",
  },
  {
    icon: "✅",
    title: "100% Genuine Products",
    desc: "Sourced exclusively through authorized channels. No adulteration, no fakes — ever.",
  },
  {
    icon: "📋",
    title: "GST Invoice",
    desc: "Full GST billing on every purchase. GSTIN: 10EOYPS9835H1Z4. Zero hassle for contractors.",
  },
  {
    icon: "📞",
    title: "Always Reachable",
    desc: "Our team is available 6 days a week for orders, quotes, or any assistance. Call anytime.",
  },
];

const stats = [
  { number: "9+", label: "Cement Brands" },
  { number: "50kg", label: "Per Bag Net Wt." },
  { number: "Wholesale", label: "Best Rates" },
  { number: "6 Days", label: "A Week Service" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function AnimatedSection({ children, className = "", style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CementBag({ brand, variant, delay = 0 }) {
  const styles = {
    orange: {
      background: "linear-gradient(145deg,#e05a00,#c44200)",
      color: "#fff",
    },
    dark: { background: "linear-gradient(145deg,#2a2a2a,#111)", color: "#fff" },
    yellow: {
      background: "linear-gradient(145deg,#e8c800,#c8a200)",
      color: "#1a1a1a",
    },
  };
  return (
    <div
      style={{
        ...styles[variant],
        width: 120,
        minHeight: 160,
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "18px 12px",
        textAlign: "center",
        boxShadow: "0 20px 50px rgba(0,0,0,0.55)",
        animation: `floatBag 3.2s ease-in-out ${delay}s infinite`,
        cursor: "default",
        transition: "transform 0.3s",
        fontFamily: "'Rajdhani', sans-serif",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-12px) scale(1.05)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0) scale(1)")
      }
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>🏗️</div>
      <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 1 }}>
        {brand}
      </div>
      <div
        style={{
          fontSize: 10,
          opacity: 0.8,
          marginTop: 4,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        50kg Bag
      </div>
    </div>
  );
}

function NavLink({ href, children, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        color: hov || active ? COLORS.yellow : "#ddd",
        textDecoration: "none",
        padding: "14px 18px",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        borderBottom: `3px solid ${hov || active ? COLORS.yellow : "transparent"}`,
        transition: "all 0.2s",
        fontFamily: "'Rajdhani', sans-serif",
        background: hov ? "rgba(200,16,46,0.7)" : "transparent",
      }}
    >
      {children}
    </a>
  );
}

function ProductCard({ icon, name, desc, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: COLORS.white,
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${hov ? COLORS.red : "#eee"}`,
        boxShadow: hov
          ? `0 20px 50px rgba(200,16,46,0.15)`
          : "0 4px 20px rgba(0,0,0,0.07)",
        transform: hov ? "translateY(-8px)" : "translateY(0)",
        transition: "all 0.3s ease",
        animationDelay: `${delay}s`,
      }}
    >
      <div
        style={{
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 60,
          background: "linear-gradient(135deg,#fff5ee,#ffe4cc)",
          position: "relative",
        }}
      >
        {icon}
      </div>
      <div style={{ padding: "20px 22px 16px" }}>
        <div
          style={{
            fontSize: 19,
            fontWeight: 800,
            color: COLORS.dark,
            marginBottom: 8,
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: 0.5,
          }}
        >
          {name}
        </div>
        <div style={{ color: COLORS.steel, fontSize: 13.5, lineHeight: 1.75 }}>
          {desc}
        </div>
      </div>
      <div
        style={{
          padding: "12px 22px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: COLORS.steel,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: 1,
          }}
        >
          RATE ON CALL
        </span>
        <a
          href="tel:9110031847"
          style={{
            background: hov ? COLORS.red : COLORS.dark,
            color: "#fff",
            padding: "6px 16px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            textDecoration: "none",
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: 1,
            textTransform: "uppercase",
            transition: "background 0.2s",
          }}
        >
          📞 Call
        </a>
      </div>
    </div>
  );
}

function BrandCard({ brand, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#2a2a2a" : "#1c1c1c",
        borderRadius: 14,
        padding: "28px 20px",
        textAlign: "center",
        border: `1px solid ${hov ? COLORS.red : "rgba(255,255,255,0.07)"}`,
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.3s ease",
        boxShadow: hov ? `0 12px 36px rgba(200,16,46,0.25)` : "none",
        animationDelay: `${delay}s`,
      }}
    >
      <div style={{ fontSize: 42, marginBottom: 12 }}>{brand.icon}</div>
      <div
        style={{
          fontSize: 21,
          fontWeight: 800,
          color: "#fff",
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: 1,
        }}
      >
        {brand.name}
      </div>
      <div
        style={{
          color: "#777",
          fontSize: 11,
          marginTop: 4,
          letterSpacing: 1,
          fontFamily: "'Rajdhani', sans-serif",
        }}
      >
        {brand.sub}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 6,
          marginTop: 14,
        }}
      >
        {brand.grades.map((g) => (
          <span
            key={g}
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#999",
              fontSize: 10,
              padding: "3px 10px",
              borderRadius: 12,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            {g}
          </span>
        ))}
      </div>
    </div>
  );
}

function WhyCard({ icon, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: COLORS.white,
        borderRadius: 14,
        padding: "30px 26px",
        borderLeft: `5px solid ${hov ? COLORS.orange : COLORS.red}`,
        boxShadow: hov
          ? "0 12px 36px rgba(200,16,46,0.12)"
          : "0 2px 14px rgba(0,0,0,0.06)",
        transform: hov ? "translateX(8px)" : "translateX(0)",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ fontSize: 38, marginBottom: 14 }}>{icon}</div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: COLORS.dark,
          marginBottom: 10,
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </div>
      <div style={{ color: COLORS.steel, fontSize: 14, lineHeight: 1.75 }}>
        {desc}
      </div>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    product: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
    setActiveSection(id);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone)
      return alert("Please enter your name and phone number.");
    setSubmitted(true);
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "products", label: "Products" },
    { id: "brands", label: "Brands" },
    { id: "why-us", label: "Why Us" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div
      style={{
        fontFamily: "'Lato', sans-serif",
        background: COLORS.cream,
        color: COLORS.dark,
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Lato:wght@300;400;700;900&family=Playfair+Display:wght@700;900&display=swap');
        @keyframes floatBag {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-14px)}
        }
        @keyframes ticker {
          0%{transform:translateX(0)}
          100%{transform:translateX(-50%)}
        }
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(30px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes pulse {
          0%,100%{box-shadow:0 8px 28px rgba(200,16,46,0.5)}
          50%{box-shadow:0 8px 44px rgba(200,16,46,0.85),0 0 0 16px rgba(200,16,46,0.1)}
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#111}
        ::-webkit-scrollbar-thumb{background:${COLORS.red};border-radius:6px}
      `}</style>

      {/* Floating Call Button */}
      <a
        href="tel:9110031847"
        title="Call Now"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 9999,
          background: `linear-gradient(135deg,${COLORS.red},${COLORS.darkRed})`,
          color: "#fff",
          width: 64,
          height: 64,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          textDecoration: "none",
          animation: "pulse 2.5s infinite",
        }}
      >
        📞
      </a>
      {/* <Chatbot /> */}

      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: `linear-gradient(135deg,${COLORS.red} 0%,${COLORS.darkRed} 100%)`,
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
          transition: "box-shadow 0.3s",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            background: COLORS.dark,
            padding: "7px 5vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
            fontSize: 13,
          }}
        >
          <span style={{ color: COLORS.orange }}>
            📍 Ekmighat Road, Laheriyasarai, Darbhanga, Bihar
          </span>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a
              href="tel:9110031847"
              style={{
                color: COLORS.orange,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              📞 9110031847
            </a>
            <span style={{ color: "#555", fontSize: 12 }}>
              GSTIN: 10EOYPS9835H1Z4
            </span>
          </div>
        </div>

        {/* Brand Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 5vw",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 66,
                height: 66,
                background: "#fff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 10,
                fontWeight: 800,
                color: COLORS.red,
                textAlign: "center",
                lineHeight: 1.2,
                border: `3px solid ${COLORS.orange}`,
                boxShadow: `0 0 0 5px rgba(245,166,35,0.25)`,
                flexShrink: 0,
              }}
            >
              SUFYAN
              <br />
              TRADERS
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "clamp(20px,4vw,38px)",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.1,
                  letterSpacing: 1,
                  textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                Sufyan Traders <span style={{ color: COLORS.yellow }}>&</span>{" "}
                Transport
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 12,
                  letterSpacing: 2,
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                DARBHANGA'S TRUSTED BUILDING MATERIAL SUPPLIER
              </div>
            </div>
          </div>
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 28,
              cursor: "pointer",
              display: "none",
            }}
            className="hamburger"
          >
            ☰
          </button>
        </div>

        {/* Nav */}
        <nav
          style={{
            background: COLORS.charcoal,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {navLinks.map((l) => (
            <NavLink
              key={l.id}
              href={`#${l.id}`}
              active={activeSection === l.id}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(l.id);
              }}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Ticker */}
      <div
        style={{
          background: COLORS.orange,
          padding: "10px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            display: "inline-block",
            animation: "ticker 22s linear infinite",
          }}
        >
          {[...Array(2)].map((_, i) => (
            <span
              key={i}
              style={{
                fontWeight: 700,
                fontSize: 13.5,
                color: COLORS.dark,
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: 1,
              }}
            >
              &nbsp;&nbsp;&nbsp;🏗️ WHOLESALE RATES ON ALL PRODUCTS &nbsp;|&nbsp;
              🚛 TRUCK DELIVERY OF SAND & AGGREGATE &nbsp;|&nbsp; 🏭 9+ CEMENT
              BRANDS AVAILABLE &nbsp;|&nbsp; ✅ GST BILLING ON ALL PURCHASES
              &nbsp;|&nbsp; 📞 CALL: 9110031847 &nbsp;|&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section
        id="home"
        style={{
          background:
            "linear-gradient(155deg,#1a0a00 0%,#2e1000 45%,#4a2000 100%)",
          minHeight: "88vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: 40,
          padding: "70px 6vw",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
            pointerEvents: "none",
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "40%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,16,46,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            animation: "fadeUp 0.8s ease both",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: COLORS.orange,
              color: COLORS.dark,
              fontSize: 11,
              fontWeight: 800,
              padding: "5px 18px",
              borderRadius: 20,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 22,
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            🏆 Darbhanga's #1 Building Materials
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(30px,4.5vw,60px)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.12,
              marginBottom: 14,
            }}
          >
            Your Dream Home,
            <br />
            <span style={{ color: COLORS.orange }}>Our Strong Cement!</span>
          </h1>

          <p
            style={{
              color: "#ccc",
              fontSize: 16,
              lineHeight: 1.85,
              marginBottom: 36,
              maxWidth: 520,
            }}
          >
            Cement, Sand, Aggregate, TMT Bars, Bricks & Soil — all at wholesale
            prices. ACC, UltraTech, Ambuja, JSW and more. Home delivery across
            Darbhanga & surrounding areas.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href="tel:9110031847"
              style={{
                background: `linear-gradient(135deg,${COLORS.red},${COLORS.darkRed})`,
                color: "#fff",
                padding: "15px 34px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 800,
                textDecoration: "none",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                boxShadow: "0 8px 24px rgba(200,16,46,0.45)",
                transition: "all 0.3s",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              📞 Order Now
            </a>
            <button
              onClick={() => scrollTo("products")}
              style={{
                background: "transparent",
                color: "#fff",
                padding: "15px 34px",
                borderRadius: 8,
                border: "2px solid rgba(255,255,255,0.35)",
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                transition: "all 0.3s",
              }}
            >
              📦 Our Products
            </button>
          </div>
        </div>

        {/* Cement Bags */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 18,
            position: "relative",
            zIndex: 2,
            animation: "fadeUp 0.9s 0.2s ease both",
          }}
        >
          <CementBag brand="ACC GOLD" variant="dark" delay={0} />
          <CementBag brand="UltraTech" variant="yellow" delay={0.7} />
          <CementBag brand="Ambuja" variant="orange" delay={1.4} />
        </div>
      </section>

      {/* Brand Strip */}
      <div
        style={{
          background: COLORS.white,
          padding: "30px 5vw",
          borderTop: `4px solid ${COLORS.red}`,
          borderBottom: `4px solid ${COLORS.red}`,
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: 11,
            letterSpacing: 3,
            fontWeight: 700,
            color: COLORS.steel,
            marginBottom: 20,
            fontFamily: "'Rajdhani', sans-serif",
            textTransform: "uppercase",
          }}
        >
          Authorized Dealer of All Major Cement Brands
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {[
            "ACC",
            "UltraTech",
            "Ambuja",
            "JSW",
            "Nuvoco",
            "Prism",
            "Dalmia",
            "Shree",
            "Bangur",
          ].map((b) => (
            <div
              key={b}
              style={{
                background: COLORS.cream,
                border: `2px solid #e0d0c0`,
                borderRadius: 8,
                padding: "9px 22px",
                fontSize: 15,
                fontWeight: 800,
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: 1,
                color: COLORS.charcoal,
                cursor: "default",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.red;
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = COLORS.red;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = COLORS.cream;
                e.currentTarget.style.color = COLORS.charcoal;
                e.currentTarget.style.borderColor = "#e0d0c0";
              }}
            >
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          background: `linear-gradient(135deg,${COLORS.red},${COLORS.darkRed})`,
          padding: "56px 6vw",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
          gap: 24,
          textAlign: "center",
        }}
      >
        {stats.map((s) => (
          <AnimatedSection key={s.label}>
            <div
              style={{
                fontSize: 50,
                fontWeight: 900,
                color: COLORS.yellow,
                lineHeight: 1,
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              {s.number}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 14,
                marginTop: 8,
              }}
            >
              {s.label}
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Products */}
      <section
        id="products"
        style={{ padding: "90px 6vw", background: COLORS.cream }}
      >
        <AnimatedSection style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              display: "inline-block",
              background: COLORS.red,
              color: "#fff",
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              padding: "4px 18px",
              borderRadius: 20,
              marginBottom: 14,
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
            }}
          >
            Our Products
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px,4vw,46px)",
              fontWeight: 900,
              lineHeight: 1.2,
            }}
          >
            Everything You Need to{" "}
            <span style={{ color: COLORS.red }}>Build</span>
          </h2>
          <p style={{ color: COLORS.steel, fontSize: 16, marginTop: 12 }}>
            Wholesale & retail — under one roof in Darbhanga
          </p>
          <div
            style={{
              width: 56,
              height: 4,
              background: `linear-gradient(90deg,${COLORS.red},${COLORS.orange})`,
              margin: "18px auto 0",
              borderRadius: 4,
            }}
          />
        </AnimatedSection>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))",
            gap: 26,
          }}
        >
          {products.map((p, i) => (
            <AnimatedSection
              key={p.name}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <ProductCard {...p} delay={i * 0.07} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section
        id="brands"
        style={{ background: COLORS.dark, padding: "90px 6vw" }}
      >
        <AnimatedSection style={{ textAlign: "center", marginBottom: 52 }}>
          <div
            style={{
              display: "inline-block",
              background: COLORS.red,
              color: "#fff",
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              padding: "4px 18px",
              borderRadius: 20,
              marginBottom: 14,
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
            }}
          >
            Cement Brands
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px,4vw,46px)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            India's Top{" "}
            <span style={{ color: COLORS.orange }}>Cement Brands</span>
          </h2>
          <p style={{ color: "#888", fontSize: 16, marginTop: 12 }}>
            All available at Sufyan Traders, Darbhanga
          </p>
          <div
            style={{
              width: 56,
              height: 4,
              background: `linear-gradient(90deg,${COLORS.red},${COLORS.orange})`,
              margin: "18px auto 0",
              borderRadius: 4,
            }}
          />
        </AnimatedSection>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {brands.map((b, i) => (
            <AnimatedSection key={b.name}>
              <BrandCard brand={b} delay={i * 0.06} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section
        id="why-us"
        style={{ background: COLORS.cream, padding: "90px 6vw" }}
      >
        <AnimatedSection style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              display: "inline-block",
              background: COLORS.red,
              color: "#fff",
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              padding: "4px 18px",
              borderRadius: 20,
              marginBottom: 14,
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
            }}
          >
            Why Choose Us
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px,4vw,46px)",
              fontWeight: 900,
              lineHeight: 1.2,
            }}
          >
            Darbhanga's Most{" "}
            <span style={{ color: COLORS.red }}>Trusted Supplier</span>
          </h2>
          <p style={{ color: COLORS.steel, fontSize: 16, marginTop: 12 }}>
            Years of experience. Thousands of satisfied customers.
          </p>
          <div
            style={{
              width: 56,
              height: 4,
              background: `linear-gradient(90deg,${COLORS.red},${COLORS.orange})`,
              margin: "18px auto 0",
              borderRadius: 4,
            }}
          />
        </AnimatedSection>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 24,
          }}
        >
          {whyUs.map((w, i) => (
            <AnimatedSection key={w.title}>
              <WhyCard {...w} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        style={{
          background: "linear-gradient(155deg,#1a0a00,#2e1200)",
          padding: "90px 6vw",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "start",
        }}
      >
        <AnimatedSection>
          <div
            style={{
              color: COLORS.orange,
              fontSize: 11,
              letterSpacing: 3,
              fontWeight: 700,
              fontFamily: "'Rajdhani', sans-serif",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            GET IN TOUCH
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px,3.5vw,44px)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: 10,
              lineHeight: 1.2,
            }}
          >
            Contact <span style={{ color: COLORS.orange }}>Us</span>
          </h2>
          <p
            style={{
              color: "#999",
              fontSize: 15,
              marginBottom: 36,
              lineHeight: 1.8,
            }}
          >
            Place an order, ask for rates, or get any assistance — we're here to
            help.
          </p>

          {[
            {
              icon: "📞",
              label: "Phone",
              value: "9110031847",
              href: "tel:9110031847",
            },
            {
              icon: "📍",
              label: "Address",
              value: "Ekmighat Road, Laheriyasarai,\nDarbhanga, Bihar",
            },
            { icon: "🧾", label: "GSTIN", value: "10EOYPS9835H1Z4" },
            {
              icon: "🕐",
              label: "Working Hours",
              value: "Monday – Saturday: 7 AM – 8 PM",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                marginBottom: 20,
                padding: 18,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  background: COLORS.red,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <div
                  style={{
                    color: COLORS.orange,
                    fontSize: 11,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 4,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {item.label}
                </div>
                {item.href ? (
                  <a
                    href={item.href}
                    style={{
                      color: "#fff",
                      fontSize: 17,
                      fontWeight: 700,
                      textDecoration: "none",
                      fontFamily: "'Rajdhani', sans-serif",
                    }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 15,
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 600,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item.value}
                  </div>
                )}
              </div>
            </div>
          ))}
        </AnimatedSection>

        {/* Form */}
        <AnimatedSection>
          <div
            style={{
              background: COLORS.white,
              borderRadius: 20,
              padding: "38px 36px",
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 26,
                    fontWeight: 900,
                    marginBottom: 10,
                  }}
                >
                  Thank You!
                </h3>
                <p style={{ color: COLORS.steel, lineHeight: 1.8 }}>
                  We've received your enquiry. Our team will call you shortly.
                  <br />
                  📞 9110031847
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      phone: "",
                      product: "",
                      message: "",
                    });
                  }}
                  style={{
                    marginTop: 24,
                    background: COLORS.red,
                    color: "#fff",
                    padding: "12px 28px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: 14,
                    letterSpacing: 1,
                  }}
                >
                  New Enquiry
                </button>
              </div>
            ) : (
              <>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 24,
                    fontWeight: 900,
                    marginBottom: 26,
                    color: COLORS.dark,
                  }}
                >
                  📋 Order / Enquiry Form
                </h3>
                {[
                  {
                    key: "name",
                    label: "Your Full Name",
                    placeholder: "e.g. Rameshwar Prasad",
                    type: "text",
                  },
                  {
                    key: "phone",
                    label: "Mobile Number",
                    placeholder: "10-digit number",
                    type: "tel",
                  },
                ].map((f) => (
                  <div key={f.key} style={{ marginBottom: 18 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        color: COLORS.steel,
                        textTransform: "uppercase",
                        marginBottom: 7,
                        fontFamily: "'Rajdhani', sans-serif",
                      }}
                    >
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={formData[f.key]}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, [f.key]: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: `2px solid ${formData[f.key] ? COLORS.red : "#e0e0e0"}`,
                        borderRadius: 8,
                        fontSize: 15,
                        fontFamily: "'Lato', sans-serif",
                        outline: "none",
                        background: "#fafafa",
                        color: COLORS.dark,
                        transition: "border-color 0.2s",
                      }}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      color: COLORS.steel,
                      textTransform: "uppercase",
                      marginBottom: 7,
                      fontFamily: "'Rajdhani', sans-serif",
                    }}
                  >
                    Select Product
                  </label>
                  <select
                    value={formData.product}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, product: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `2px solid ${formData.product ? COLORS.red : "#e0e0e0"}`,
                      borderRadius: 8,
                      fontSize: 15,
                      fontFamily: "'Lato', sans-serif",
                      outline: "none",
                      background: "#fafafa",
                      color: COLORS.dark,
                    }}
                  >
                    <option value="">-- Select a Product --</option>
                    {[
                      "Cement",
                      "Sand (Ballu)",
                      "Aggregate (Gitti)",
                      "TMT Bar (Chhard)",
                      "Bricks (Eent)",
                      "Soil (Mitti)",
                      "Transport Service",
                      "Other",
                    ].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 22 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      color: COLORS.steel,
                      textTransform: "uppercase",
                      marginBottom: 7,
                      fontFamily: "'Rajdhani', sans-serif",
                    }}
                  >
                    Quantity / Message
                  </label>
                  <textarea
                    placeholder="e.g. Need 200 bags of ACC Cement, delivery in Darbhanga city..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, message: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `2px solid ${formData.message ? COLORS.red : "#e0e0e0"}`,
                      borderRadius: 8,
                      fontSize: 15,
                      fontFamily: "'Lato', sans-serif",
                      outline: "none",
                      background: "#fafafa",
                      color: COLORS.dark,
                      resize: "vertical",
                      minHeight: 90,
                    }}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  style={{
                    width: "100%",
                    padding: 16,
                    background: `linear-gradient(135deg,${COLORS.red},${COLORS.darkRed})`,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 900,
                    cursor: "pointer",
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = COLORS.orange;
                    e.currentTarget.style.color = COLORS.dark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg,${COLORS.red},${COLORS.darkRed})`;
                    e.currentTarget.style.color = "#fff";
                  }}
                >
                  📤 Submit Enquiry
                </button>
              </>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: COLORS.dark,
          padding: "22px 6vw",
          borderTop: `4px solid ${COLORS.red}`,
          textAlign: "center",
        }}
      >
        <p style={{ color: "#555", fontSize: 13 }}>
          © 2025{" "}
          <span style={{ color: COLORS.orange, fontWeight: 700 }}>
            Sufyan Traders & Transport
          </span>{" "}
          &nbsp;|&nbsp; Ekmighat Road, Laheriyasarai, Darbhanga &nbsp;|&nbsp;
          GSTIN: 10EOYPS9835H1Z4 &nbsp;|&nbsp; 📞{" "}
          <span style={{ color: COLORS.orange }}>9110031847</span>
        </p>
        <p style={{ color: "#333", fontSize: 11, marginTop: 8 }}>
          Cement · Sand · Aggregate · TMT Bars · Bricks · Soil · Transport
          &nbsp;|&nbsp; Cement Darbhanga &nbsp;|&nbsp; Building Material Bihar
          &nbsp;|&nbsp; Wholesale Cement Laheriyasarai
        </p>
      </footer>
    </div>
  );
}
