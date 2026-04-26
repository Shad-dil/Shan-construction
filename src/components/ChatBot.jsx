import { useState, useEffect, useRef } from "react";

const PHONE = "919110031847"; // WhatsApp number with country code

// ─── Conversation Flow ────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "welcome",
    bot: "👋 Hello! Welcome to *Sufyan Traders & Transport*, Darbhanga.\n\nWhat would you like to order today?",
    type: "chips",
    key: "product",
    options: [
      { label: "🧱 Cement", value: "Cement" },
      { label: "🏖️ Sand (Ballu)", value: "Sand" },
      { label: "🪨 Stone Aggregate (Gitti)", value: "Stone Aggregate" },
      { label: "⚙️ TMT Steel Bar", value: "TMT Steel Bar" },
      { label: "🏗️ Bricks (Eent)", value: "Bricks" },
      { label: "🌿 Filling Soil (Mitti)", value: "Filling Soil" },
      { label: "🚛 Transport Service", value: "Transport Service" },
    ],
  },
  {
    id: "brand",
    bot: "Great choice! Which brand do you prefer?\n(You can skip if unsure)",
    type: "chips",
    key: "brand",
    showIf: (answers) => answers.product === "Cement",
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
    bot: "How much quantity do you need?",
    type: "chips",
    key: "quantity",
    optionsFn: (answers) => {
      if (answers.product === "Cement")
        return [
          { label: "10–50 Bags", value: "10–50 Bags" },
          { label: "50–100 Bags", value: "50–100 Bags" },
          { label: "100–500 Bags", value: "100–500 Bags" },
          { label: "500+ Bags (Bulk)", value: "500+ Bags" },
        ];
      if (answers.product === "Sand" || answers.product === "Stone Aggregate")
        return [
          { label: "1 Truck", value: "1 Truck" },
          { label: "2–5 Trucks", value: "2–5 Trucks" },
          { label: "5+ Trucks", value: "5+ Trucks" },
        ];
      return [
        { label: "Small Qty", value: "Small Qty" },
        { label: "Medium Qty", value: "Medium Qty" },
        { label: "Large / Bulk", value: "Large / Bulk" },
      ];
    },
  },
  {
    id: "delivery",
    bot: "Do you need delivery to your site?",
    type: "chips",
    key: "delivery",
    options: [
      { label: "🚛 Yes, Home Delivery", value: "Yes, home delivery needed" },
      { label: "🏪 I'll Pick Up", value: "Self pickup from store" },
    ],
  },
  {
    id: "location",
    bot: "📍 Please tell us your delivery area / mohalla in Darbhanga:",
    type: "input",
    key: "location",
    placeholder: "e.g. Laheriasarai, Benta, Minapur...",
    showIf: (answers) => answers.delivery === "Yes, home delivery needed",
  },
  {
    id: "name",
    bot: "Almost done! 😊\n\nWhat's your *name*?",
    type: "input",
    key: "name",
    placeholder: "Your full name",
  },
  {
    id: "phone",
    bot: "And your *mobile number* so we can confirm your order?",
    type: "input",
    key: "phone",
    placeholder: "10-digit mobile number",
    inputType: "tel",
  },
  {
    id: "confirm",
    bot: null, // dynamically generated summary
    type: "confirm",
    key: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildWhatsAppMessage(answers) {
  const lines = [
    "🏗️ *NEW ORDER — Sufyan Traders*",
    "─────────────────────────",
    `📦 *Product:* ${answers.product || "—"}`,
    answers.brand ? `🏭 *Brand:* ${answers.brand}` : null,
    `📊 *Quantity:* ${answers.quantity || "—"}`,
    `🚛 *Delivery:* ${answers.delivery || "—"}`,
    answers.location ? `📍 *Location:* ${answers.location}` : null,
    `👤 *Name:* ${answers.name || "—"}`,
    `📞 *Phone:* ${answers.phone || "—"}`,
    "─────────────────────────",
    "Please confirm this order. Thank you! 🙏",
  ].filter(Boolean);
  return encodeURIComponent(lines.join("\n"));
}

function buildSummary(answers) {
  return [
    answers.product && `📦 Product: ${answers.product}`,
    answers.brand && `🏭 Brand: ${answers.brand}`,
    answers.quantity && `📊 Qty: ${answers.quantity}`,
    answers.delivery && `🚛 ${answers.delivery}`,
    answers.location && `📍 ${answers.location}`,
    answers.name && `👤 ${answers.name}`,
    answers.phone && `📞 ${answers.phone}`,
  ].filter(Boolean);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div
      style={{
        display: "flex",
        gap: 5,
        alignItems: "center",
        padding: "10px 14px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#25D366",
            animation: `typingDot 1.2s ${i * 0.2}s ease-in-out infinite`,
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

function BotBubble({ text, isTyping }) {
  if (isTyping)
    return (
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
          marginBottom: 10,
        }}
      >
        <Avatar />
        <div
          style={{
            background: "#fff",
            borderRadius: "18px 18px 18px 4px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <TypingDots />
        </div>
      </div>
    );

  // parse *bold*
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
        marginBottom: 10,
        animation: "bubbleIn 0.3s ease",
      }}
    >
      <Avatar />
      <div
        style={{
          background: "#fff",
          borderRadius: "18px 18px 18px 4px",
          padding: "10px 14px",
          maxWidth: "78%",
          fontSize: 13.5,
          lineHeight: 1.6,
          color: "#111",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          whiteSpace: "pre-line",
        }}
      >
        {parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p))}
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 10,
        animation: "bubbleIn 0.25s ease",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg,#25D366,#128C7E)",
          color: "#fff",
          borderRadius: "18px 18px 4px 18px",
          padding: "10px 14px",
          maxWidth: "72%",
          fontSize: 13.5,
          lineHeight: 1.6,
          boxShadow: "0 2px 8px rgba(37,211,102,0.3)",
        }}
      >
        {text}
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg,#C8102E,#8B0000)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        fontWeight: 800,
        color: "#fff",
        boxShadow: "0 2px 8px rgba(200,16,46,0.4)",
      }}
    >
      S
    </div>
  );
}

function ChipOptions({ options, onSelect, disabled }) {
  const [selected, setSelected] = useState(null);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        padding: "4px 0 8px 40px",
      }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          disabled={disabled || selected !== null}
          onClick={() => {
            setSelected(o.value);
            onSelect(o.label, o.value);
          }}
          style={{
            padding: "8px 14px",
            borderRadius: 20,
            border: "1.5px solid",
            borderColor: selected === o.value ? "#25D366" : "#ddd",
            background: selected === o.value ? "#e8fdf0" : "#fff",
            color: selected === o.value ? "#128C7E" : "#444",
            fontSize: 13,
            fontWeight: 600,
            cursor: disabled || selected ? "default" : "pointer",
            transition: "all 0.2s",
            opacity: disabled || (selected && selected !== o.value) ? 0.45 : 1,
            fontFamily: "inherit",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function InputStep({ step, onSubmit, disabled }) {
  const [val, setVal] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);
  const submit = () => {
    if (val.trim()) {
      onSubmit(val.trim());
    }
  };
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        padding: "4px 0 6px 40px",
        alignItems: "center",
      }}
    >
      <input
        ref={ref}
        disabled={disabled}
        type={step.inputType || "text"}
        placeholder={step.placeholder}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: 22,
          border: "1.5px solid #ddd",
          fontSize: 13.5,
          outline: "none",
          fontFamily: "inherit",
          background: disabled ? "#f5f5f5" : "#fff",
          color: "#111",
          opacity: disabled ? 0.5 : 1,
        }}
      />
      <button
        onClick={submit}
        disabled={disabled || !val.trim()}
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "none",
          background:
            val.trim() && !disabled
              ? "linear-gradient(135deg,#25D366,#128C7E)"
              : "#ddd",
          color: "#fff",
          fontSize: 16,
          cursor: val.trim() && !disabled ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.2s",
        }}
      >
        ➤
      </button>
    </div>
  );
}

// ─── Main Chatbot ─────────────────────────────────────────────────────────────
function Chatbox({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [stepIdx, setStepIdx] = useState(-1); // -1 = not started
  const [answers, setAnswers] = useState({});
  const [typing, setTyping] = useState(false);
  const [activeInputStep, setActiveInputStep] = useState(null);
  const [done, setDone] = useState(false);
  const bottomRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      80,
    );
  }, [messages, typing]);

  // Start conversation
  useEffect(() => {
    advanceTo(0, {});
  }, []);

  function getVisibleSteps(ans) {
    return STEPS.filter((s) => !s.showIf || s.showIf(ans));
  }

  function advanceTo(idx, currentAnswers) {
    const visible = getVisibleSteps(currentAnswers);
    if (idx >= visible.length) return;

    const step = visible[idx];
    setTyping(true);
    setActiveInputStep(null);

    setTimeout(() => {
      setTyping(false);

      let botText = step.bot;
      if (step.type === "confirm") {
        const summary = buildSummary(currentAnswers);
        botText = `✅ Here's your order summary:\n\n${summary.join("\n")}\n\nShall I send this to WhatsApp? 👇`;
      }

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: botText, stepId: step.id },
        ...(step.type !== "confirm"
          ? [{ role: "ui", stepId: step.id, step, idx, currentAnswers }]
          : []),
        ...(step.type === "confirm"
          ? [
              {
                role: "ui",
                stepId: step.id,
                step,
                idx,
                currentAnswers,
                isConfirm: true,
              },
            ]
          : []),
      ]);

      setStepIdx(idx);
      if (step.type === "input") setActiveInputStep(step.id);
    }, 900);
  }

  function handleAnswer(stepId, displayText, value, currentAnswers) {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return;

    const newAnswers = step.key
      ? { ...currentAnswers, [step.key]: value }
      : currentAnswers;
    setAnswers(newAnswers);

    setMessages((prev) => [...prev, { role: "user", text: displayText }]);

    const visible = getVisibleSteps(newAnswers);
    const curIdx = visible.findIndex((s) => s.id === stepId);
    const nextIdx = curIdx + 1;

    if (nextIdx < visible.length) advanceTo(nextIdx, newAnswers);
  }

  function handleSendWhatsApp(currentAnswers) {
    const msg = buildWhatsAppMessage(currentAnswers);
    window.open(`https://wa.me/${PHONE}?text=${msg}`, "_blank");
    setMessages((prev) => [
      ...prev,
      { role: "user", text: "✅ Yes, Send to WhatsApp!" },
      {
        role: "bot",
        text: "🎉 Perfect! Opening WhatsApp now...\n\nOur team will confirm your order shortly. Thank you for choosing Sufyan Traders! 🙏",
      },
    ]);
    setDone(true);
  }

  function handleRestart() {
    setMessages([]);
    setAnswers({});
    setStepIdx(-1);
    setDone(false);
    setActiveInputStep(null);
    setTimeout(() => advanceTo(0, {}), 100);
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 100,
        right: 24,
        zIndex: 10000,
        width: 360,
        maxWidth: "calc(100vw - 32px)",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.08)",
        animation: "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "75vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#128C7E,#075E54)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            flexShrink: 0,
            background: "linear-gradient(135deg,#C8102E,#8B0000)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 900,
            color: "#fff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        >
          S
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              fontFamily: "'Rajdhani',sans-serif",
              letterSpacing: 0.5,
            }}
          >
            Sufyan Traders
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#4ade80",
                display: "inline-block",
              }}
            />
            Online · Typically replies instantly
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            color: "#fff",
            width: 30,
            height: 30,
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
        >
          ✕
        </button>
      </div>

      {/* Chat area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 12px 8px",
          background: "#ECE5DD",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8b9a8' fill-opacity='0.25'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {messages.map((m, i) => {
          if (m.role === "bot") return <BotBubble key={i} text={m.text} />;
          if (m.role === "user") return <UserBubble key={i} text={m.text} />;
          if (m.role === "ui") {
            const isLocked = messages
              .slice(i + 1)
              .some((mm) => mm.role === "user");
            const opts = m.step.optionsFn
              ? m.step.optionsFn(m.currentAnswers)
              : m.step.options;

            if (m.isConfirm)
              return (
                <div
                  key={i}
                  style={{
                    padding: "4px 0 8px 40px",
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    disabled={done || isLocked}
                    onClick={() => handleSendWhatsApp(m.currentAnswers)}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 22,
                      border: "none",
                      background:
                        done || isLocked
                          ? "#ccc"
                          : "linear-gradient(135deg,#25D366,#128C7E)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 13.5,
                      cursor: done || isLocked ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      boxShadow:
                        done || isLocked
                          ? "none"
                          : "0 4px 14px rgba(37,211,102,0.4)",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                    }}
                  >
                    <span>💬</span> Send via WhatsApp
                  </button>
                  <button
                    disabled={done || isLocked}
                    onClick={() => {
                      setMessages((prev) => [
                        ...prev,
                        { role: "user", text: "✏️ Edit my order" },
                      ]);
                      handleRestart();
                    }}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 22,
                      border: "1.5px solid #bbb",
                      background: "#fff",
                      color: "#555",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: done || isLocked ? "default" : "pointer",
                      opacity: done || isLocked ? 0.4 : 1,
                      fontFamily: "inherit",
                    }}
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
                  disabled={isLocked}
                  onSelect={(label, value) =>
                    handleAnswer(m.step.id, label, value, m.currentAnswers)
                  }
                />
              );
            if (m.step.type === "input")
              return (
                <InputStep
                  key={i}
                  step={m.step}
                  disabled={isLocked}
                  onSubmit={(val) =>
                    handleAnswer(m.step.id, val, val, m.currentAnswers)
                  }
                />
              );
          }
          return null;
        })}

        {typing && (
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
              marginBottom: 10,
            }}
          >
            <Avatar />
            <div
              style={{
                background: "#fff",
                borderRadius: "18px 18px 18px 4px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <TypingDots />
            </div>
          </div>
        )}

        {done && (
          <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
            <button
              onClick={handleRestart}
              style={{
                background: "transparent",
                border: "1.5px solid #128C7E",
                color: "#128C7E",
                padding: "9px 20px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              🔄 Place Another Order
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#fff",
          padding: "10px 14px",
          textAlign: "center",
          fontSize: 11.5,
          color: "#aaa",
          borderTop: "1px solid #f0f0f0",
          flexShrink: 0,
        }}
      >
        Powered by <strong style={{ color: "#128C7E" }}>Sufyan Traders</strong>{" "}
        · 📞 9110031847
      </div>
    </div>
  );
}

// ─── Launcher Buttons ─────────────────────────────────────────────────────────
function LauncherButtons({ onOpenChat }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "flex-end",
      }}
    >
      {/* Direct call button */}
      <a
        href="tel:9110031847"
        title="Call Us"
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#C8102E,#8B0000)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          color: "#fff",
          textDecoration: "none",
          boxShadow: "0 6px 20px rgba(200,16,46,0.45)",
          animation: "pulsRed 2.5s infinite",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        📞
      </a>

      {/* WhatsApp chat launcher */}
      <button
        onClick={onOpenChat}
        title="Order via WhatsApp"
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg,#25D366,#128C7E)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          color: "#fff",
          cursor: "pointer",
          boxShadow: "0 8px 28px rgba(37,211,102,0.5)",
          animation: "pulsGreen 2.5s infinite",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        💬
      </button>
    </div>
  );
}

// ─── Demo Page Wrapper ────────────────────────────────────────────────────────
export default function Chatbot() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&display=swap');
        @keyframes typingDot {
          0%,80%,100%{transform:scale(0.7);opacity:0.4}
          40%{transform:scale(1);opacity:1}
        }
        @keyframes bubbleIn {
          from{opacity:0;transform:translateY(8px) scale(0.97)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes slideUp {
          from{opacity:0;transform:translateY(30px) scale(0.95)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes pulsGreen {
          0%,100%{box-shadow:0 8px 28px rgba(37,211,102,0.5)}
          50%{box-shadow:0 8px 40px rgba(37,211,102,0.8),0 0 0 14px rgba(37,211,102,0.12)}
        }
        @keyframes pulsRed {
          0%,100%{box-shadow:0 6px 20px rgba(200,16,46,0.45)}
          50%{box-shadow:0 6px 30px rgba(200,16,46,0.7),0 0 0 10px rgba(200,16,46,0.1)}
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* ── Demo Background Page ── */}
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(155deg,#1a0a00 0%,#2e1000 50%,#1a0a00 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          textAlign: "center",
          gap: 32,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#C8102E,#8B0000)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 900,
            color: "#fff",
            fontFamily: "'Rajdhani',sans-serif",
            boxShadow:
              "0 0 0 6px rgba(200,16,46,0.25), 0 12px 40px rgba(200,16,46,0.4)",
          }}
        >
          S
        </div>

        <div>
          <h1
            style={{
              fontFamily: "'Rajdhani',sans-serif",
              fontSize: "clamp(28px,6vw,54px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: 1,
            }}
          >
            Sufyan Traders <span style={{ color: "#F5A623" }}>&</span> Transport
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 15,
              marginTop: 8,
            }}
          >
            Darbhanga's Trusted Building Material Supplier
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 13,
              marginTop: 6,
            }}
          >
            📍 Ekmighat Road, Laheriyasarai, Darbhanga &nbsp;|&nbsp; 📞
            9110031847
          </p>
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setChatOpen(true)}
            style={{
              padding: "14px 30px",
              borderRadius: 50,
              border: "none",
              background: "linear-gradient(135deg,#25D366,#128C7E)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "'Rajdhani',sans-serif",
              letterSpacing: 1,
              boxShadow: "0 8px 28px rgba(37,211,102,0.4)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            💬 Order via WhatsApp
          </button>
          <a
            href="tel:9110031847"
            style={{
              padding: "14px 30px",
              borderRadius: 50,
              border: "2px solid rgba(255,255,255,0.25)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              textDecoration: "none",
              fontFamily: "'Rajdhani',sans-serif",
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.06)",
            }}
          >
            📞 Call Now
          </a>
        </div>

        {/* Product chips preview */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "center",
            maxWidth: 480,
          }}
        >
          {[
            "🧱 Cement",
            "🏖️ Sand",
            "🪨 Stone",
            "⚙️ TMT Bar",
            "🏗️ Bricks",
            "🌿 Soil",
            "🚛 Transport",
          ].map((p) => (
            <span
              key={p}
              style={{
                padding: "7px 16px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
              }}
            >
              {p}
            </span>
          ))}
        </div>

        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
          👇 Tap the green chat button to place your order
        </p>
      </div>

      {/* ── Launcher ── */}
      {!chatOpen && <LauncherButtons onOpenChat={() => setChatOpen(true)} />}

      {/* ── Chatbot ── */}
      {chatOpen && <Chatbox onClose={() => setChatOpen(false)} />}
    </div>
  );
}
