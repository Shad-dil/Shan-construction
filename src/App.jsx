import { useState, useEffect, useRef } from "react";
import "./App.css";

const WA_PHONE = "919110031847";

/* ═══════════════════════════════════════════════════════
   CHATBOT DATA
═══════════════════════════════════════════════════════ */
const CHAT_STEPS = [
  {
    id: "product",
    key: "product",
    type: "chips",
    bot: "👋 Hi! Welcome to *Sufyan Traders*.\nWhat would you like to order today?",
    options: [
      { label: "🧱 Cement", value: "Cement" },
      { label: "🏖️ Sand (Ballu)", value: "Sand" },
      { label: "🪨 Stone Aggregate", value: "Stone Aggregate" },
      { label: "⚙️ TMT Steel Bar", value: "TMT Steel Bar" },
      { label: "🏗️ Bricks (Eent)", value: "Bricks" },
      { label: "🌿 Filling Soil", value: "Filling Soil" },
      { label: "🚛 Transport", value: "Transport Service" },
    ],
  },
  {
    id: "brand",
    key: "brand",
    type: "chips",
    bot: "Which cement brand do you prefer?",
    showIf: (a) => a.product === "Cement",
    options: [
      { label: "ACC", value: "ACC" },
      { label: "UltraTech", value: "UltraTech" },
      { label: "Ambuja", value: "Ambuja" },
      { label: "JSW", value: "JSW" },
      { label: "Prism", value: "Prism" },
      { label: "Dalmia", value: "Dalmia" },
      { label: "Any Brand", value: "Any Brand" },
    ],
  },
  {
    id: "quantity",
    key: "quantity",
    type: "chips",
    bot: "How much quantity do you need?",
    optionsFn: (a) => {
      if (a.product === "Cement")
        return [
          { label: "10–50 Bags", value: "10–50 Bags" },
          { label: "50–200 Bags", value: "50–200 Bags" },
          { label: "200–500 Bags", value: "200–500 Bags" },
          { label: "500+ Bags (Bulk)", value: "500+ Bags" },
        ];
      if (["Sand", "Stone Aggregate"].includes(a.product))
        return [
          { label: "1 Truck", value: "1 Truck" },
          { label: "2–5 Trucks", value: "2–5 Trucks" },
          { label: "5+ Trucks", value: "5+ Trucks" },
        ];
      return [
        { label: "Small", value: "Small Qty" },
        { label: "Medium", value: "Medium Qty" },
        { label: "Large / Bulk", value: "Large / Bulk" },
      ];
    },
  },
  {
    id: "delivery",
    key: "delivery",
    type: "chips",
    bot: "Do you need delivery to your site?",
    options: [
      { label: "🚛 Yes, Deliver to Site", value: "Yes, home delivery needed" },
      { label: "🏪 I'll Pick Up", value: "Self pickup from store" },
    ],
  },
  {
    id: "location",
    key: "location",
    type: "input",
    bot: "📍 Your delivery area / mohalla in Darbhanga?",
    placeholder: "e.g. Laheriasarai, Benta, Minapur…",
    showIf: (a) => a.delivery === "Yes, home delivery needed",
  },
  {
    id: "name",
    key: "name",
    type: "input",
    bot: "Almost done! 😊 What's your *name*?",
    placeholder: "Your full name",
  },
  {
    id: "phone",
    key: "phone",
    type: "input",
    bot: "Your *mobile number* for order confirmation?",
    placeholder: "10-digit mobile number",
    inputType: "tel",
  },
  { id: "confirm", key: null, type: "confirm", bot: null },
];

function getVisibleSteps(ans) {
  return CHAT_STEPS.filter((s) => !s.showIf || s.showIf(ans));
}

function buildWAMessage(a) {
  return encodeURIComponent(
    [
      "🏗️ *NEW ORDER — Sufyan Traders & Transport*",
      "━━━━━━━━━━━━━━━━━━━━━━",
      `📦 *Product:* ${a.product || "—"}`,
      a.brand ? `🏭 *Brand:* ${a.brand}` : null,
      `📊 *Quantity:* ${a.quantity || "—"}`,
      `🚛 *Delivery:* ${a.delivery || "—"}`,
      a.location ? `📍 *Location:* ${a.location}` : null,
      `👤 *Name:* ${a.name || "—"}`,
      `📞 *Phone:* ${a.phone || "—"}`,
      "━━━━━━━━━━━━━━━━━━━━━━",
      "Please confirm this order. Thank you! 🙏",
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

/* ═══════════════════════════════════════════════════════
   CHATBOT COMPONENTS
═══════════════════════════════════════════════════════ */
function TypingBubble() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
        S
      </div>
      <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm px-4 py-3 flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-green-600 inline-block"
            style={{
              animation: `chatDot 1.2s ${i * 0.2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function BotBubble({ text }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <div
      className="flex items-end gap-2 mb-3"
      style={{ animation: "bubIn 0.28s ease" }}
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
        S
      </div>
      <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm px-3 py-2 max-w-[78%] text-sm leading-relaxed text-gray-800 whitespace-pre-line">
        {parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p))}
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div
      className="flex justify-end mb-3"
      style={{ animation: "bubIn 0.22s ease" }}
    >
      <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl rounded-br-sm px-3 py-2 max-w-[72%] text-sm leading-relaxed shadow-md">
        {text}
      </div>
    </div>
  );
}

function ChipOptions({ options, onSelect, locked }) {
  const [sel, setSel] = useState(null);
  return (
    <div className="flex flex-wrap gap-2 pb-3 pl-9">
      {options.map((o) => (
        <button
          key={o.value}
          disabled={locked || sel !== null}
          onClick={() => {
            setSel(o.value);
            onSelect(o.label, o.value);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
            ${sel === o.value ? "bg-green-50 border-green-600 text-green-700" : "bg-white border-gray-300 text-gray-600"}
            ${locked || (sel && sel !== o.value) ? "opacity-40" : "hover:border-green-500 hover:text-green-700 cursor-pointer"}
          `}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function InputStep({ step, onSubmit, locked }) {
  const [val, setVal] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    if (!locked) setTimeout(() => ref.current?.focus(), 120);
  }, [locked]);
  const go = () => {
    if (val.trim()) onSubmit(val.trim());
  };
  return (
    <div className="flex gap-2 pb-3 pl-9 items-center">
      <input
        ref={ref}
        disabled={locked}
        type={step.inputType || "text"}
        placeholder={step.placeholder}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && go()}
        className="flex-1 px-3 py-2 rounded-full border border-gray-300 text-sm outline-none bg-white disabled:bg-gray-100 disabled:opacity-50 focus:border-green-500"
      />
      <button
        onClick={go}
        disabled={locked || !val.trim()}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 transition-all
          ${val.trim() && !locked ? "bg-gradient-to-br from-green-500 to-green-700 cursor-pointer" : "bg-gray-300 cursor-default"}`}
      >
        ➤
      </button>
    </div>
  );
}

function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState({});
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    startStep(0, {});
  }, []);
  useEffect(() => {
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      80,
    );
  }, [messages, typing]);

  function startStep(idx, curAns) {
    const visible = getVisibleSteps(curAns);
    if (idx >= visible.length) return;
    const step = visible[idx];
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      let botText = step.bot;
      if (step.type === "confirm") {
        const lines = [
          curAns.product && `📦 *Product:* ${curAns.product}`,
          curAns.brand && `🏭 *Brand:* ${curAns.brand}`,
          curAns.quantity && `📊 *Qty:* ${curAns.quantity}`,
          curAns.delivery && `🚛 ${curAns.delivery}`,
          curAns.location && `📍 ${curAns.location}`,
          curAns.name && `👤 ${curAns.name}`,
          curAns.phone && `📞 ${curAns.phone}`,
        ]
          .filter(Boolean)
          .join("\n");
        botText = `✅ *Order Summary:*\n\n${lines}\n\nReady to send to WhatsApp? 👇`;
      }
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: botText },
        { type: "ui", step, idx, curAns },
      ]);
    }, 850);
  }

  function handleAnswer(step, label, value, curAns) {
    const newAns = step.key ? { ...curAns, [step.key]: value } : curAns;
    setAnswers(newAns);
    setMessages((prev) => [...prev, { type: "user", text: label }]);
    const visible = getVisibleSteps(newAns);
    const cur = visible.findIndex((s) => s.id === step.id);
    if (cur + 1 < visible.length) startStep(cur + 1, newAns);
  }

  function sendWA(curAns) {
    window.open(
      `https://wa.me/${WA_PHONE}?text=${buildWAMessage(curAns)}`,
      "_blank",
    );
    setMessages((prev) => [
      ...prev,
      { type: "user", text: "✅ Send to WhatsApp!" },
      {
        type: "bot",
        text: "🎉 Opening WhatsApp now!\nOur team will confirm your order shortly.\nThank you for choosing *Sufyan Traders*! 🙏",
      },
    ]);
    setDone(true);
  }

  function restart() {
    setMessages([]);
    setAnswers({});
    setDone(false);
    setTimeout(() => startStep(0, {}), 80);
  }

  return (
    <div className="flex flex-col" style={{ height: "100%" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#128C7E,#054d41)" }}
      >
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white font-black text-lg border-2 border-white/25 shadow-lg flex-shrink-0">
          S
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-sm leading-tight">
            Sufyan Traders
          </div>
          <div className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Online · Replies instantly
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/15 text-white text-sm flex items-center justify-center hover:bg-white/25 transition-colors flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-3"
        style={{
          background: "#ece5dd",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c8b9a8' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M10 10h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-24 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {messages.map((m, i) => {
          if (m.type === "bot") return <BotBubble key={i} text={m.text} />;
          if (m.type === "user") return <UserBubble key={i} text={m.text} />;
          if (m.type === "ui") {
            const locked = messages
              .slice(i + 1)
              .some((mm) => mm.type === "user");
            const opts = m.step.optionsFn
              ? m.step.optionsFn(m.curAns)
              : m.step.options;
            if (m.step.type === "confirm")
              return (
                <div key={i} className="flex flex-wrap gap-2 pb-3 pl-9">
                  <button
                    disabled={done || locked}
                    onClick={() => sendWA(m.curAns)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold transition-all
                    ${done || locked ? "bg-gray-400 cursor-default" : "bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 cursor-pointer shadow-lg"}`}
                  >
                    💬 Send via WhatsApp
                  </button>
                  <button
                    disabled={done || locked}
                    onClick={() => {
                      setMessages((prev) => [
                        ...prev,
                        { type: "user", text: "✏️ Edit order" },
                      ]);
                      restart();
                    }}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all
                    ${done || locked ? "opacity-40 cursor-default" : "border-gray-400 text-gray-600 bg-white hover:border-gray-600 cursor-pointer"}`}
                  >
                    ✏️ Edit
                  </button>
                </div>
              );
            if (m.step.type === "chips")
              return (
                <ChipOptions
                  key={i}
                  options={opts}
                  locked={locked}
                  onSelect={(lbl, val) =>
                    handleAnswer(m.step, lbl, val, m.curAns)
                  }
                />
              );
            if (m.step.type === "input")
              return (
                <InputStep
                  key={i}
                  step={m.step}
                  locked={locked}
                  onSubmit={(val) => handleAnswer(m.step, val, val, m.curAns)}
                />
              );
          }
          return null;
        })}
        {typing && <TypingBubble />}
        {done && (
          <div className="text-center py-3">
            <button
              onClick={restart}
              className="border border-green-600 text-green-700 px-5 py-2 rounded-full text-xs font-bold hover:bg-green-50 transition-colors"
            >
              🔄 New Order
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div className="bg-white px-4 py-2 text-center text-xs text-gray-400 flex-shrink-0 border-t border-gray-100">
        <strong className="text-green-700">Sufyan Traders</strong> · 📞
        9110031847
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   WEBSITE DATA
═══════════════════════════════════════════════════════ */
const PRODUCTS = [
  {
    icon: "🧱",
    name: "Cement",
    desc: "ACC, UltraTech, Ambuja, JSW & more. 50kg bags, wholesale & retail pricing.",
  },
  {
    icon: "🏖️",
    name: "Sand (Ballu)",
    desc: "River sand & M-Sand for construction & plastering. Truck delivery across Darbhanga.",
  },
  {
    icon: "🪨",
    name: "Stone Aggregate",
    desc: "6mm–40mm graded aggregate from rack point. Ideal for RCC & concrete work.",
  },
  {
    icon: "⚙️",
    name: "TMT Steel Bar",
    desc: "Fe-500/500D bars 8mm–32mm. Best for columns, slabs & structural frames.",
  },
  {
    icon: "🏗️",
    name: "Bricks (Eent)",
    desc: "Fired clay & fly ash bricks of superior quality. Bulk orders at special rates.",
  },
  {
    icon: "🌿",
    name: "Filling Soil",
    desc: "Earthfill soil by hyva (heavy vehicle). Foundation filling & land leveling.",
  },
  {
    icon: "🚛",
    name: "Transport",
    desc: "Freight across Darbhanga & surrounding districts. Reliable, on-time delivery.",
  },
];

const BRANDS = [
  {
    name: "ACC",
    sub: "Gold · Water Shield",
    icon: "/images/acc.jpeg",
    grades: ["PPC", "OPC 53"],
  },
  {
    name: "UltraTech",
    sub: "India's No.1",
    icon: "/images/ultratech.png",
    grades: ["PPC", "OPC 43", "OPC 53"],
  },
  {
    name: "Ambuja",
    sub: "Kawach · Plus",
    icon: "/images/ambuja.png",
    grades: ["PPC", "Composite"],
  },
  {
    name: "JSW",
    sub: "Leaders' Choice",
    icon: "/images/jsw.png",
    grades: ["PPC", "OPC"],
  },
  {
    name: "Nuvoco",
    sub: "Shaping A New World",
    icon: "/images/nuvaco.jpeg",
    grades: ["Concreto"],
  },
  {
    name: "Prism",
    sub: "Think Ahead",
    icon: "/images/prism.png",
    grades: ["PPC", "OPC"],
  },
  {
    name: "Dalmia",
    sub: "Bharat",
    icon: "/images/dalmia.jpeg",
    grades: ["PPC", "OPC 53"],
  },
  {
    name: "Bangur",
    sub: "Strong & Reliable",
    icon: "/images/bangur.png",
    grades: ["PPC", "OPC"],
  },
];

const WHY_US = [
  {
    icon: "💰",
    title: "Lowest Market Price",
    desc: "We buy wholesale and pass the savings directly to you — guaranteed cheaper.",
  },
  {
    icon: "🏭",
    title: "9+ Cement Brands",
    desc: "From ACC to Dalmia — every major Indian cement brand under one roof.",
  },
  {
    icon: "🚛",
    title: "Doorstep Delivery",
    desc: "Sand & aggregate by truck, cement from rack point — to your site.",
  },
  {
    icon: "✅",
    title: "100% Genuine",
    desc: "Sourced through authorized channels only. No fakes, no adulteration.",
  },
  {
    icon: "📋",
    title: "GST Invoice",
    desc: "Full GST billing on every purchase. GSTIN: 10EOYPS9835H1Z4.",
  },
  {
    icon: "📞",
    title: "Always Reachable",
    desc: "6 days a week for orders, quotes, or any help. Call anytime.",
  },
];

/* ═══════════════════════════════════════════════════════
   UTILITY HOOKS
═══════════════════════════════════════════════════════ */
function useInView(threshold = 0.12) {
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

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════ */
export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    product: "",
    message: "",
  });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveNav(id);
    setMobileMenu(false);
  };

  const NAV = ["home", "products", "brands", "why-us", "contact"];

  return (
    <div className="font-sans bg-stone-50 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&family=Lato:wght@300;400;700;900&family=Playfair+Display:wght@700;900&display=swap');
        body { font-family: 'Lato', sans-serif; }
        .font-display { font-family: 'Playfair Display', serif; }
        .font-label  { font-family: 'Rajdhani', sans-serif; }
        @keyframes chatDot { 0%,80%,100%{transform:scale(0.6);opacity:0.3} 40%{transform:scale(1);opacity:1} }
        @keyframes bubIn   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatBag{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes ticker  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pulseG  { 0%,100%{box-shadow:0 8px 28px rgba(37,211,102,0.5)} 50%{box-shadow:0 8px 44px rgba(37,211,102,0.85),0 0 0 12px rgba(37,211,102,0.12)} }
        @keyframes pulseR  { 0%,100%{box-shadow:0 6px 20px rgba(200,16,46,0.45)} 50%{box-shadow:0 6px 32px rgba(200,16,46,0.7),0 0 0 10px rgba(200,16,46,0.1)} }
        .chat-widget { animation: slideUp 0.38s cubic-bezier(0.34,1.56,0.64,1); }
        .float-wa    { animation: pulseG 2.8s infinite; }
        .float-call  { animation: pulseR 2.8s infinite; }
        .bag-float   { animation: floatBag 3.2s ease-in-out infinite; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #C8102E; border-radius: 5px; }
      `}</style>

      {/* ════════════════════════════════════
          FLOATING BUTTONS (bottom-right)
      ════════════════════════════════════ */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3">
        {/* Call */}

        {/* WhatsApp */}
        <button
          onClick={() => setChatOpen((c) => !c)}
          className="float-wa w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-2xl text-white shadow-xl hover:scale-110 transition-transform border-0"
        >
          💬
        </button>
      </div>

      {/* ════════════════════════════════════
          CHATBOT WIDGET
      ════════════════════════════════════ */}
      {chatOpen && (
        <div
          className="chat-widget fixed bottom-28 right-4 sm:right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{ maxHeight: "72vh", maxWidth: "calc(100vw - 24px)" }}
        >
          {/* <Chatbot onClose={() => setChatOpen(false)} /> */}
        </div>
      )}

      {/* ════════════════════════════════════
          HEADER
      ════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-40 transition-shadow duration-300 ${scrolled ? "shadow-2xl" : ""}`}
        style={{ background: "linear-gradient(135deg,#C8102E,#8B0000)" }}
      >
        {/* Top bar */}
        <div className="bg-black/90 px-4 sm:px-8 py-1.5 flex flex-wrap justify-between items-center gap-1 text-xs">
          <span className="text-amber-400">
            📍 Ekmighat Road, LaheriaSarai, Darbhanga
          </span>
          <div className="flex items-center gap-4">
            <a
              href="tel:9110031847"
              className="text-amber-400 font-bold no-underline"
            >
              📞 9110031847
            </a>
            <span className="text-gray-600 hidden sm:inline">
              GSTIN: 10EOYPS9835H1Z4
            </span>
          </div>
        </div>

        {/* Brand row */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-8 py-3">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center font-label font-black text-red-700 text-[9px] sm:text-[10px] text-center leading-tight border-2 border-amber-400 flex-shrink-0"
              style={{ boxShadow: "0 0 0 4px rgba(245,166,35,0.22)" }}
            >
              SUFYAN
              <br />
              TRADERS
            </div>
            <div>
              <h1 className="font-label font-black text-white text-xl sm:text-2xl lg:text-4xl tracking-wide leading-tight">
                Sufyan Traders <span className="text-yellow-300">&amp;</span>{" "}
                Transport
              </h1>
              <p className="font-label text-white/60 text-[10px] sm:text-xs tracking-widest uppercase">
                Darbhanga's Trusted Building Material Supplier
              </p>
            </div>
          </div>
          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white text-2xl p-1"
            onClick={() => setMobileMenu((m) => !m)}
          >
            {mobileMenu ? "✕" : "☰"}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex justify-center items-center bg-neutral-900">
          {NAV.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(id);
              }}
              className={`font-label font-bold tracking-widest uppercase text-xs px-5 py-3.5 border-b-2 transition-all duration-200 no-underline
                ${activeNav === id ? "text-yellow-300 border-yellow-300 bg-red-900/50" : "text-gray-300 border-transparent hover:text-yellow-300 hover:border-yellow-300 hover:bg-red-900/40"}`}
            >
              {id === "why-us"
                ? "Why Us"
                : id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
          <button
            onClick={() => setChatOpen(true)}
            className="ml-4 my-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white font-label font-bold text-xs tracking-widest uppercase flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            💬 Order on WhatsApp
          </button>
        </nav>

        {/* Mobile Nav */}
        {mobileMenu && (
          <nav className="lg:hidden bg-neutral-900 flex flex-col">
            {NAV.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(id);
                }}
                className="font-label font-bold tracking-widest uppercase text-xs px-6 py-4 text-gray-300 border-b border-white/10 no-underline hover:text-yellow-300 hover:bg-red-900/40 transition-colors"
              >
                {id === "why-us"
                  ? "Why Us"
                  : id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
            <button
              onClick={() => {
                setChatOpen(true);
                setMobileMenu(false);
              }}
              className="mx-4 my-3 py-3 rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white font-label font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2"
            >
              💬 Order on WhatsApp
            </button>
          </nav>
        )}
      </header>

      {/* ════════════════════════════════════
          TICKER
      ════════════════════════════════════ */}
      <div className="bg-amber-400 py-2 overflow-hidden whitespace-nowrap">
        <div
          className="inline-block"
          style={{ animation: "ticker 26s linear infinite" }}
        >
          {[...Array(2)].map((_, i) => (
            <span
              key={i}
              className="font-label font-bold text-xs sm:text-sm tracking-widest text-neutral-900"
            >
              &nbsp;&nbsp;&nbsp;🏗️ WHOLESALE RATES ON ALL PRODUCTS &nbsp;|&nbsp;
              🚛 TRUCK DELIVERY — SAND & AGGREGATE &nbsp;|&nbsp; 🏭 9+ CEMENT
              BRANDS &nbsp;|&nbsp; ✅ GST BILLING &nbsp;|&nbsp; 📞 9110031847
              &nbsp;|&nbsp; 💬 ORDER ON WHATSAPP &nbsp;|&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section
        id="home"
        className="relative overflow-hidden min-h-screen flex items-center"
        style={{
          background: "linear-gradient(155deg,#1a0a00,#2e1000 45%,#4a2000)",
        }}
      >
        {/* grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {/* glow */}
        <div
          className="absolute top-1/3 left-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(200,16,46,0.18),transparent 70%)",
          }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div style={{ animation: "fadeUp 0.8s ease both" }}>
            <div className="inline-block bg-amber-400 text-neutral-900 font-label font-black text-[10px] tracking-widest uppercase px-5 py-1.5 rounded-full mb-5">
              🏆 Darbhanga's #1 Building Materials
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Your Dream Home,
              <br />
              <span className="text-amber-400">Our Strong Cement!</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              Cement, Sand, Aggregate, TMT Bars, Bricks &amp; Soil — all at
              wholesale prices. ACC, UltraTech, Ambuja, JSW &amp; more. Home
              delivery across Darbhanga.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setChatOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-label font-black text-sm tracking-widest uppercase px-7 py-4 rounded-lg shadow-xl hover:opacity-90 transition-all hover:-translate-y-0.5"
              >
                💬 Order on WhatsApp
              </button>
              <a
                href="tel:9110031847"
                className="flex items-center gap-2 border-2 border-white/30 text-white font-label font-black text-sm tracking-widest uppercase px-7 py-4 rounded-lg hover:border-amber-400 hover:text-amber-400 transition-all no-underline"
              >
                📞 Call Now
              </a>
            </div>
          </div>

          {/* Floating cement bags */}
          <div
            className="flex justify-center lg:justify-end items-end gap-4 sm:gap-6"
            style={{ animation: "fadeUp 0.9s 0.2s ease both" }}
          >
            {[
              {
                brand: "ACC GOLD",
                style: "bg-gradient-to-b from-neutral-800 to-black text-white",
                delay: "0s",
              },
              {
                brand: "UltraTech",
                style:
                  "bg-gradient-to-b from-yellow-400 to-yellow-600 text-neutral-900",
                delay: "0.7s",
                tall: true,
              },
              {
                brand: "Ambuja",
                style:
                  "bg-gradient-to-b from-orange-500 to-orange-700 text-white",
                delay: "1.4s",
              },
            ].map(({ brand, style, delay, tall }) => (
              <div
                key={brand}
                className={`bag-float ${style} rounded-2xl flex flex-col items-center justify-center text-center shadow-2xl px-3 cursor-default`}
                style={{
                  width: 110,
                  minHeight: tall ? 172 : 155,
                  animationDelay: delay,
                }}
              >
                <div className="text-3xl mb-2">🏗️</div>
                <div className="font-label font-black text-sm sm:text-base tracking-wide leading-tight">
                  {brand}
                </div>
                <div className="text-[9px] opacity-75 mt-1 tracking-widest uppercase">
                  50kg Bag
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          BRAND STRIP
      ════════════════════════════════════ */}
      <div className="bg-white border-t-4 border-b-4 border-red-700 py-6 px-4 sm:px-8">
        <p className="text-center font-label font-bold text-gray-500 text-[10px] tracking-widest uppercase mb-4">
          Authorized Dealer of All Major Cement Brands
        </p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
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
            <span
              key={b}
              className="font-label font-black text-sm tracking-wide px-4 py-2 rounded-lg bg-stone-100 border-2 border-stone-200 text-neutral-700 cursor-default hover:bg-red-700 hover:text-white hover:border-red-700 transition-all duration-200"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════
          STATS
      ════════════════════════════════════ */}
      <div
        className="py-14 px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
        style={{ background: "linear-gradient(135deg,#C8102E,#8B0000)" }}
      >
        {[
          { n: "9+", l: "Cement Brands" },
          { n: "50kg", l: "Per Bag Net Wt." },
          { n: "Wholesale", l: "Best Rates" },
          { n: "6 Days", l: "A Week Service" },
        ].map((s) => (
          <Reveal key={s.l}>
            <div className="font-label font-black text-yellow-300 text-4xl sm:text-5xl leading-none">
              {s.n}
            </div>
            <div className="text-white/80 text-sm mt-2">{s.l}</div>
          </Reveal>
        ))}
      </div>

      {/* ════════════════════════════════════
          PRODUCTS
      ════════════════════════════════════ */}
      <section id="products" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal className="text-center mb-12">
          <span className="inline-block bg-red-700 text-white font-label font-bold text-[10px] tracking-widest uppercase px-5 py-1 rounded-full mb-3">
            Our Products
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            Everything You Need to <span className="text-red-700">Build</span>
          </h2>
          <p className="text-gray-500 text-base mt-3">
            Wholesale &amp; retail — one stop in Darbhanga
          </p>
          <div className="w-14 h-1 bg-gradient-to-r from-red-700 to-amber-400 rounded mx-auto mt-4" />
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.05}>
              <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:border-red-600 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                <div className="h-32 flex items-center justify-center text-5xl bg-gradient-to-br from-orange-50 to-amber-100">
                  {p.icon}
                </div>
                <div className="p-5 flex-1">
                  <h3 className="font-label font-black text-lg text-neutral-800 mb-2">
                    {p.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-label font-bold text-gray-400 text-[10px] tracking-widest uppercase">
                    Rate on Call
                  </span>
                  <button
                    onClick={() => setChatOpen(true)}
                    className="font-label font-bold text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-md bg-neutral-900 group-hover:bg-red-700 text-white transition-colors"
                  >
                    💬 Order
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          BRANDS
      ════════════════════════════════════ */}
      <section id="brands" className="py-20 px-4 sm:px-8 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="inline-block bg-red-700 text-white font-label font-bold text-[10px] tracking-widest uppercase px-5 py-1 rounded-full mb-3">
              Cement Brands
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              India's Top <span className="text-amber-400">Cement Brands</span>
            </h2>
            <p className="text-gray-500 text-base mt-3">
              All available at Sufyan Traders, Darbhanga
            </p>
            <div className="w-14 h-1 bg-gradient-to-r from-red-700 to-amber-400 rounded mx-auto mt-4" />
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {BRANDS.map((b, i) => (
              <Reveal key={b.name} delay={i * 0.05}>
                <div className="group bg-neutral-800 rounded-2xl p-6 text-center border border-white/5 hover:border-red-600 hover:bg-neutral-700 hover:-translate-y-1 transition-all duration-300">
                  {/* <div className="text-4xl mb-3">{b.icon}</div> */}
                  <img
                    src={b.icon}
                    alt={b.name}
                    className="text-4xl mb-3 block mx-auto object-contain"
                    width={"50px"}
                    height={"50px"}
                  />
                  <div className="font-label font-black text-white text-lg tracking-wide">
                    {b.name}
                  </div>
                  <div className="text-gray-500 text-xs mt-1 tracking-wide">
                    {b.sub}
                  </div>
                  <div className="flex flex-wrap justify-center gap-1 mt-3">
                    {b.grades.map((g) => (
                      <span
                        key={g}
                        className="font-label font-bold text-gray-600 text-[9px] tracking-widest uppercase bg-white/5 px-2 py-0.5 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          WHY US
      ════════════════════════════════════ */}
      <section id="why-us" className="py-20 px-4 sm:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="inline-block bg-red-700 text-white font-label font-bold text-[10px] tracking-widest uppercase px-5 py-1 rounded-full mb-3">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
              Darbhanga's Most{" "}
              <span className="text-red-700">Trusted Supplier</span>
            </h2>
            <p className="text-gray-500 text-base mt-3">
              Years of experience. Thousands of satisfied customers.
            </p>
            <div className="w-14 h-1 bg-gradient-to-r from-red-700 to-amber-400 rounded mx-auto mt-4" />
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_US.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.06}>
                <div className="group bg-white rounded-2xl p-7 border-l-4 border-red-600 hover:border-amber-400 shadow-sm hover:shadow-xl hover:translate-x-1 transition-all duration-300">
                  <div className="text-4xl mb-4">{w.icon}</div>
                  <h3 className="font-label font-black text-lg text-neutral-800 mb-2">
                    {w.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {w.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CONTACT
      ════════════════════════════════════ */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-8"
        style={{ background: "linear-gradient(155deg,#1a0a00,#2e1200)" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <Reveal>
            <p className="font-label font-bold text-amber-400 text-[10px] tracking-widest uppercase mb-3">
              Get In Touch
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
              Contact <span className="text-amber-400">Us</span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
              Place an order, ask for rates, or get assistance — we're always
              here.
            </p>
            <div className="space-y-4">
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
                  value: "Ekmighat Road, LaheriaSarai, Darbhanga, Bihar",
                },
                { icon: "🧾", label: "GSTIN", value: "10EOYPS9835H1Z4" },
                { icon: "🕐", label: "Hours", value: "Mon – Sat: 7 AM – 8 PM" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-700 flex items-center justify-center text-xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-label font-bold text-amber-400 text-[10px] tracking-widest uppercase mb-1">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-label font-bold text-white text-base no-underline hover:text-amber-400 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-label font-semibold text-white text-sm">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* WhatsApp CTA */}
            <button
              onClick={() => setChatOpen(true)}
              className="mt-6 w-full flex items-center gap-4 p-5 rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#128C7E,#054d41)" }}
            >
              <span className="text-4xl"> </span>
              <div className="text-left">
                <p className="font-label font-black text-white text-base tracking-wide">
                  Order on WhatsApp
                </p>
                <p className="text-white/65 text-xs mt-0.5">
                  Chat with us &amp; place your order instantly
                </p>
              </div>
            </button>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-2xl">
              {formSent ? (
                <div className="text-center py-10">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="font-display text-2xl font-black mb-3">
                    Thank You!
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    We've received your enquiry. Our team will call you shortly.
                    <br />
                    📞 9110031847
                  </p>
                  <button
                    onClick={() => {
                      setFormSent(false);
                      setForm({
                        name: "",
                        phone: "",
                        product: "",
                        message: "",
                      });
                    }}
                    className="mt-6 bg-red-700 text-white font-label font-bold text-xs tracking-widest uppercase px-7 py-3 rounded-lg hover:bg-red-800 transition-colors"
                  >
                    New Enquiry
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-neutral-800 mb-6">
                    📋 Quick Enquiry Form
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        k: "name",
                        label: "Full Name",
                        ph: "e.g. Rameshwar Prasad",
                        t: "text",
                      },
                      {
                        k: "phone",
                        label: "Mobile Number",
                        ph: "10-digit number",
                        t: "tel",
                      },
                    ].map((f) => (
                      <div key={f.k}>
                        <label className="block font-label font-bold text-gray-500 text-[10px] tracking-widest uppercase mb-1.5">
                          {f.label}
                        </label>
                        <input
                          type={f.t}
                          placeholder={f.ph}
                          value={form[f.k]}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, [f.k]: e.target.value }))
                          }
                          className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none bg-gray-50 text-neutral-800 transition-colors focus:border-red-600
                            ${form[f.k] ? "border-red-500" : "border-gray-200"}`}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block font-label font-bold text-gray-500 text-[10px] tracking-widest uppercase mb-1.5">
                        Product
                      </label>
                      <select
                        value={form.product}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, product: e.target.value }))
                        }
                        className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none bg-gray-50 text-neutral-800 transition-colors focus:border-red-600
                          ${form.product ? "border-red-500" : "border-gray-200"}`}
                      >
                        <option value="">-- Select Product --</option>
                        {[
                          "Cement",
                          "Sand (Ballu)",
                          "Stone Aggregate (Gitti)",
                          "TMT Bar",
                          "Bricks (Eent)",
                          "Soil (Mitti)",
                          "Transport",
                          "Other",
                        ].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-label font-bold text-gray-500 text-[10px] tracking-widest uppercase mb-1.5">
                        Message / Quantity
                      </label>
                      <textarea
                        placeholder="e.g. Need 200 bags ACC cement, deliver to Laheriasarai…"
                        value={form.message}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, message: e.target.value }))
                        }
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none bg-gray-50 text-neutral-800 resize-y transition-colors focus:border-red-600
                          ${form.message ? "border-red-500" : "border-gray-200"}`}
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!form.name || !form.phone)
                          return alert(
                            "Please enter your name and phone number.",
                          );
                        setFormSent(true);
                      }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-red-700 to-red-900 text-white font-label font-black text-sm tracking-widest uppercase hover:from-amber-500 hover:to-amber-600 hover:text-neutral-900 transition-all duration-300"
                    >
                      📤 Submit Enquiry
                    </button>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════
          FOOTER
      ════════════════════════════════════ */}
      <footer className="bg-neutral-950 border-t-4 border-red-700 py-5 px-4 sm:px-8 text-center">
        <p className="text-gray-600 text-xs sm:text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="text-amber-400 font-bold">
            Sufyan Traders &amp; Transport Designed & developed by |&nbsp;
            <a
              href="https://wa.me/7361874124?text=Hi%20Sir,%20I%20want%20to%20know%20more%20about%20website%20Development." // replace with your WhatsApp number
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Md Dilshad
            </a>
            <br />
          </span>{" "}
          &nbsp;|&nbsp; Ekmighat Road, LaheriaSarai, Darbhanga &nbsp;|&nbsp;
          GSTIN: 10EOYPS9835H1Z4 &nbsp;|&nbsp; 📞{" "}
          <span className="text-amber-400">9110031847</span>
        </p>
        <p className="text-neutral-800 text-xs mt-2">
          Cement · Sand · Aggregate · TMT Bars · Bricks · Soil · Transport
          &nbsp;|&nbsp; Cement Darbhanga &nbsp;|&nbsp; Building Material Bihar
        </p>
      </footer>
    </div>
  );
}
