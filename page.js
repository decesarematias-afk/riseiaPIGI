"use client";
import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════
// CONFIGURACIÓN CENTRAL — EDITÁ SOLO ESTO
// ═══════════════════════════════════════════
const CONFIG = {
  phone: "5491130657887",
  phoneDisplay: "+54 9 11 3065-7887",
  calendlyUrl: "https://calendly.com/riseia/consulta", // ← CAMBIÁ POR TU URL REAL
  elevenLabsAgentId: "YOUR_AGENT_ID", // ← CAMBIÁ POR TU AGENT ID REAL
  ars: 1405,
};

const WA = (msg) => `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(msg)}`;
const TEL = `tel:+${CONFIG.phone}`;

// ═══════════════════════════════════════════
// VERTICALS
// ═══════════════════════════════════════════
const VERTICALS = {
  inmobiliarias: {
    label: "Rising Estates", icon: "🏠",
    gradient: "linear-gradient(135deg, #0284c7, #0ea5e9, #38bdf8)",
    color: "#0ea5e9", dark: "#0369a1", glow: "rgba(14,165,233,0.25)",
    painStat: "78%", painLabel: "de los leads se pierden por demora en respuesta",
    roiStat: "21x", roiLabel: "más chances respondiendo en <5 min con IA",
    waMsg: "Hola! Vi la info de Rising Estates y me interesa automatizar mi inmobiliaria 🏠",
  },
  restaurantes: {
    label: "Gastro IA", icon: "🍽️",
    gradient: "linear-gradient(135deg, #ea580c, #f97316, #fb923c)",
    color: "#f97316", dark: "#c2410c", glow: "rgba(249,115,22,0.25)",
    painStat: "35%", painLabel: "de comisión cobran PedidosYa y Rappi por pedido",
    roiStat: "20:1", roiLabel: "ROI — Ahorrá +$1,500 USD/mes en comisiones",
    waMsg: "Hola! Vi la info de Gastro IA y me interesa automatizar mi restaurante 🍽️",
  },
};

// ═══════════════════════════════════════════
// PLANES
// ═══════════════════════════════════════════
const getPlans = (v) => [
  {
    tier: "INICIO", price: 97, annual: 78, setup: 0, popular: false,
    tag: "Tu primer paso con IA",
    features: v === "inmobiliarias"
      ? ["Chatbot WhatsApp con IA","500 conversaciones IA/mes","Auto-respuesta a leads de portales","CRM básico de contactos","1 tarjeta NFC personalizada","Soporte por email"]
      : ["Chatbot WhatsApp con IA","500 conversaciones IA/mes","Menú digital QR incluido","Gestión de reservas básica","1 tarjeta NFC personalizada","Soporte por email"],
    excluded: v === "inmobiliarias"
      ? ["Asistente de voz IA","Integración Tokko Broker","Landing page","Workflows automatización"]
      : ["Asistente de voz IA","Pedidos directos WhatsApp","Landing page","Workflows automatización"],
    costs: { wa: "$8–15", ia: "$3–5", voice: null },
  },
  {
    tier: "PROFESIONAL", price: 197, annual: 158, setup: 297, popular: true,
    tag: "Todo para crecer — el más elegido",
    features: v === "inmobiliarias"
      ? ["Chatbot WhatsApp avanzado con IA","2.000 conversaciones IA/mes","Pre-calificación automática de leads","CRM con pipeline + seguimiento","5 tarjetas NFC diseño custom","100 min asistente de voz IA/mes","Landing page incluida","3 workflows de automatización","Soporte email + WhatsApp"]
      : ["Chatbot WhatsApp avanzado con IA","2.000 conversaciones IA/mes","Pedidos directos por WhatsApp","Menú QR interactivo + analytics","5 posavasos/tarjetas NFC","100 min asistente de voz IA/mes","Landing page incluida","3 workflows de automatización","Soporte email + WhatsApp"],
    excluded: [],
    costs: { wa: "$20–45", ia: "$14–21", voice: "$10–15" },
  },
  {
    tier: "EMPRESA", price: 397, annual: 318, setup: 597, popular: false,
    tag: "La solución completa sin límites",
    features: v === "inmobiliarias"
      ? ["Chatbot enterprise + IA premium","Conversaciones IA ilimitadas","Integración completa Tokko Broker","CRM completo + lead scoring","15+ tarjetas NFC + tags","500 min asistente de voz IA/mes","Sitio web completo (10 páginas)","Workflows ilimitados","Account manager dedicado"]
      : ["Chatbot enterprise + IA premium","Conversaciones IA ilimitadas","Sistema pedidos directos completo","Menú QR premium + promos dinámicas","15+ posavasos/tarjetas NFC","500 min asistente de voz IA/mes","Sitio web completo (10 páginas)","Workflows ilimitados","Account manager dedicado"],
    excluded: [],
    costs: { wa: "$45–140", ia: "$35–70", voice: "$40–50" },
  },
];

// ═══════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════
function useScrollPast(threshold = 300) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const h = () => setPast(window.scrollY > threshold);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [threshold]);
  return past;
}

function useTimeOnPage(seconds) {
  const [reached, setReached] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReached(true), seconds * 1000);
    return () => clearTimeout(t);
  }, [seconds]);
  return reached;
}

// ═══════════════════════════════════════════
// ANIMATED COUNTER
// ═══════════════════════════════════════════
function Counter({ end, duration = 800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);

  return <span ref={ref}>{val.toLocaleString("es-AR")}</span>;
}

// ═══════════════════════════════════════════
// PLAN CARD
// ═══════════════════════════════════════════
function PlanCard({ plan, v, vKey, annual, expanded, onExpand }) {
  const price = annual ? plan.annual : plan.price;
  const ars = Math.round(price * CONFIG.ars);
  return (
    <div style={{
      flex: 1, minWidth: 280, maxWidth: 380,
      background: plan.popular ? `linear-gradient(180deg,${v.color}06,${v.color}12)` : "#fff",
      border: plan.popular ? `2.5px solid ${v.color}` : "1px solid #e2e8f0",
      borderRadius: 22, padding: "34px 22px 26px", position: "relative",
      boxShadow: plan.popular ? `0 20px 56px ${v.glow}` : "0 2px 14px rgba(0,0,0,0.04)",
      transform: plan.popular ? "scale(1.02)" : "scale(1)", transition: "all .4s ease",
    }}>
      {plan.popular && <div style={{ position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)", background:v.gradient,color:"#fff",padding:"6px 26px",borderRadius:22, fontSize:12,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase", boxShadow:`0 8px 24px ${v.glow}` }}>★ Más elegido</div>}

      <div style={{ textAlign:"center",marginBottom:18 }}>
        <div style={{ fontSize:15,fontWeight:800,letterSpacing:3,color:plan.popular?v.color:"#94a3b8",textTransform:"uppercase" }}>{plan.tier}</div>
        <div style={{ fontSize:12,color:"#94a3b8",marginTop:2 }}>{plan.tag}</div>
      </div>

      <div style={{ textAlign:"center",marginBottom:22 }}>
        <div style={{ display:"flex",alignItems:"baseline",justifyContent:"center",gap:3 }}>
          <span style={{ fontSize:15,fontWeight:700,color:"#94a3b8" }}>USD</span>
          <span style={{ fontSize:52,fontWeight:900,color:v.color,lineHeight:1,letterSpacing:-2 }}>${price}</span>
        </div>
        <div style={{ fontSize:13,color:"#b0b8c4" }}>/mes</div>
        <div style={{ fontSize:12,color:"#c4cad2",marginTop:3 }}>~ARS <Counter end={ars} /></div>
        {annual && <div style={{ display:"inline-block",marginTop:5,background:"#ecfdf5",color:"#059669",padding:"3px 12px",borderRadius:12,fontSize:11,fontWeight:700 }}>Ahorrás 20% anual</div>}
        {plan.setup > 0 && <div style={{ fontSize:11,color:"#b0b8c4",marginTop:4 }}>Setup único: USD ${plan.setup}</div>}
      </div>

      <div style={{ marginBottom:18 }}>
        {plan.features.map((f,i) => (
          <div key={i} style={{ display:"flex",alignItems:"center",gap:9,padding:"5px 0",fontSize:13.5,color:"#334155" }}>
            <div style={{ width:20,height:20,borderRadius:6,background:`${v.color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0,color:v.color,fontWeight:700 }}>✓</div>{f}
          </div>
        ))}
        {plan.excluded.map((f,i) => (
          <div key={i} style={{ display:"flex",alignItems:"center",gap:9,padding:"4px 0",fontSize:13,color:"#d1d5db" }}>
            <div style={{ width:20,height:20,borderRadius:6,background:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,flexShrink:0,color:"#d1d5db" }}>✗</div>{f}
          </div>
        ))}
      </div>

      <button onClick={onExpand} style={{ width:"100%",padding:10,background:expanded?`${v.color}08`:"transparent", border:`1px dashed ${v.color}50`,borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:700,color:v.color,marginBottom:14,transition:"all .3s" }}>
        {expanded ? "▲ Ocultar detalle IA" : "🔍 Ver costos estimados de IA"}
      </button>

      {expanded && (
        <div style={{ background:"#f8fafc",borderRadius:14,padding:16,marginBottom:16,border:"1px solid #e2e8f0",animation:"fadeIn .3s ease" }}>
          <div style={{ fontSize:11,fontWeight:800,color:"#475569",marginBottom:10,letterSpacing:1,textTransform:"uppercase" }}>Costos estimados mensuales</div>
          {[
            { label:"WhatsApp API", value:plan.costs.wa, detail:"Msgs marketing ~$0.07 · Respuestas GRATIS" },
            { label:"Chatbot IA", value:plan.costs.ia, detail:"Claude Haiku 4.5 · ~$0.007/conv" },
            plan.costs.voice && { label:"Voz IA", value:plan.costs.voice, detail:"ElevenLabs · ~$0.10/min" },
          ].filter(Boolean).map((c,i) => (
            <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #e8ecf1" }}>
              <div><div style={{ fontSize:13,fontWeight:600,color:"#334155" }}>{c.label}</div><div style={{ fontSize:10,color:"#94a3b8" }}>{c.detail}</div></div>
              <div style={{ fontSize:15,fontWeight:800,color:v.color }}>{c.value}</div>
            </div>
          ))}
          <div style={{ display:"flex",justifyContent:"space-between",padding:"9px 0 0" }}>
            <span style={{ fontSize:13,fontWeight:700,color:"#1e293b" }}>Mantenimiento & Mejoras</span>
            <span style={{ fontSize:13,fontWeight:800,color:"#10b981" }}>INCLUIDO ✓</span>
          </div>
          <div style={{ marginTop:10,padding:"9px 14px",background:"#fffbeb",borderRadius:10,fontSize:11,color:"#92400e",lineHeight:1.6,border:"1px solid #fde68a" }}>
            ⚠️ Costos varían según uso real. Recibís reporte mensual detallado con cada conversación trazada.
          </div>
        </div>
      )}

      <a href={WA(`${VERTICALS[vKey].waMsg} — Plan ${plan.tier}`)} target="_blank" rel="noopener noreferrer" style={{
        display:"block",width:"100%",padding:16,textAlign:"center",textDecoration:"none",borderRadius:16,fontSize:15,fontWeight:800,
        background:plan.popular?v.gradient:"transparent", color:plan.popular?"#fff":v.color,
        border:plan.popular?"none":`2px solid ${v.color}`, boxShadow:plan.popular?`0 8px 28px ${v.glow}`:"none",
      }}>
        {plan.popular ? "💬 Empezar por WhatsApp" : "Consultar →"}
      </a>
    </div>
  );
}

// ═══════════════════════════════════════════
// ROI CALCULATOR
// ═══════════════════════════════════════════
function ROICalc({ v, vKey }) {
  const [val, setVal] = useState(vKey === "restaurantes" ? 30 : 150);
  const label = vKey === "restaurantes" ? "pedidos por día vía apps" : "consultas de leads por mes";
  const savings = vKey === "restaurantes"
    ? Math.round(val * 0.3 * 3500 * 30)
    : Math.round(val * 0.4 * 15);
  const savingsUSD = vKey === "restaurantes" ? Math.round(savings / CONFIG.ars) : savings;

  return (
    <div style={{ background:"#fff",borderRadius:22,padding:"28px 24px",boxShadow:"0 4px 20px rgba(0,0,0,0.04)",border:"1px solid #e2e8f0",maxWidth:500,margin:"0 auto" }}>
      <h3 style={{ fontSize:18,fontWeight:800,color:"#0f172a",textAlign:"center",margin:"0 0 4px" }}>💰 Calculá tu ahorro</h3>
      <p style={{ textAlign:"center",fontSize:13,color:"#64748b",margin:"0 0 20px" }}>Mové el slider y mirá cuánto podés ahorrar</p>
      <label style={{ fontSize:13,fontWeight:600,color:"#334155",display:"block",marginBottom:8 }}>
        {val} {label}
      </label>
      <input type="range" min={vKey==="restaurantes"?5:50} max={vKey==="restaurantes"?100:500} value={val}
        onChange={e=>setVal(Number(e.target.value))}
        style={{ width:"100%",accentColor:v.color,height:8,marginBottom:16 }} />
      <div style={{ background:`${v.color}08`,borderRadius:14,padding:16,textAlign:"center",border:`1px solid ${v.color}20` }}>
        <div style={{ fontSize:13,color:"#64748b" }}>Ahorro estimado mensual</div>
        <div style={{ fontSize:36,fontWeight:900,color:v.color,lineHeight:1.2 }}>~USD ${savingsUSD.toLocaleString("es-AR")}</div>
        {vKey==="restaurantes" && <div style={{ fontSize:12,color:"#94a3b8" }}>~ARS {savings.toLocaleString("es-AR")}/mes en comisiones</div>}
      </div>
      <a href={WA(`${v.waMsg} — Quiero ahorrar USD $${savingsUSD}/mes!`)} target="_blank" rel="noopener noreferrer"
        style={{ display:"block",width:"100%",padding:14,background:v.gradient,color:"#fff",borderRadius:14,fontSize:15,fontWeight:800,textAlign:"center",textDecoration:"none",marginTop:16,boxShadow:`0 8px 24px ${v.glow}` }}>
        Quiero estos resultados →
      </a>
    </div>
  );
}

// ═══════════════════════════════════════════
// CONTACT HUB — 4 CANALES
// ═══════════════════════════════════════════
function ContactHub({ v, vKey }) {
  const [showCalendly, setShowCalendly] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  return (
    <div style={{ maxWidth:600,margin:"0 auto" }}>
      <h2 style={{ fontSize:24,fontWeight:900,color:"#0f172a",textAlign:"center",margin:"0 0 4px" }}>¿Cómo preferís comunicarte?</h2>
      <p style={{ textAlign:"center",fontSize:14,color:"#64748b",margin:"0 0 24px" }}>Elegí la opción que más te guste</p>

      <a href={WA(v.waMsg)} target="_blank" rel="noopener noreferrer" style={{
        display:"flex",alignItems:"center",justifyContent:"center",gap:10,width:"100%",padding:18,
        background:"linear-gradient(135deg,#25D366,#128C7E)",color:"#fff",borderRadius:16,
        fontSize:17,fontWeight:800,textDecoration:"none",marginBottom:14,
        boxShadow:"0 8px 28px rgba(37,211,102,0.3)",minHeight:56,
      }}>💬 WhatsApp directo</a>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
        <button onClick={()=>setShowVoice(!showVoice)} style={{
          padding:"14px 8px",background:showVoice?`${v.color}10`:"#fff",border:`1.5px solid ${showVoice?v.color:"#e2e8f0"}`,
          borderRadius:14,cursor:"pointer",fontSize:13,fontWeight:700,color:v.dark,minHeight:56,
          display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all .3s",
        }}>
          <span style={{ fontSize:22 }}>🤖</span>Hablar con IA
        </button>

        <a href={TEL} style={{
          padding:"14px 8px",background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:14,
          textDecoration:"none",fontSize:13,fontWeight:700,color:v.dark,minHeight:56,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,
        }}>
          <span style={{ fontSize:22 }}>📞</span>Llamar ahora
        </a>

        <button onClick={()=>setShowCalendly(!showCalendly)} style={{
          padding:"14px 8px",background:showCalendly?`${v.color}10`:"#fff",border:`1.5px solid ${showCalendly?v.color:"#e2e8f0"}`,
          borderRadius:14,cursor:"pointer",fontSize:13,fontWeight:700,color:v.dark,minHeight:56,
          display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all .3s",
        }}>
          <span style={{ fontSize:22 }}>📅</span>Agendar cita
        </button>
      </div>

      {showVoice && (
        <div style={{ marginTop:14,background:`${v.color}06`,borderRadius:16,padding:24,border:`1px solid ${v.color}20`,textAlign:"center",animation:"fadeIn .3s ease" }}>
          <div style={{ fontSize:48,marginBottom:8 }}>🎙️</div>
          <h3 style={{ fontSize:16,fontWeight:800,color:"#0f172a",margin:"0 0 6px" }}>Asistente de voz Rise IA</h3>
          <p style={{ fontSize:13,color:"#64748b",margin:"0 0 16px" }}>Preguntale lo que quieras sobre nuestros planes</p>
          <div style={{ padding:16,background:"#fff",borderRadius:12,border:"1px dashed #d1d5db",fontSize:13,color:"#94a3b8" }}>
            🔧 Agente de voz en preparación.<br/>Mientras tanto, escribinos por WhatsApp o llamanos directamente.
          </div>
          <div style={{ marginTop:10,fontSize:11,color:"#b0b8c4" }}>Powered by ElevenLabs Conversational AI</div>
        </div>
      )}

      {showCalendly && (
        <div style={{ marginTop:14,background:`${v.color}06`,borderRadius:16,padding:24,border:`1px solid ${v.color}20`,textAlign:"center",animation:"fadeIn .3s ease" }}>
          <div style={{ fontSize:48,marginBottom:8 }}>📅</div>
          <h3 style={{ fontSize:16,fontWeight:800,color:"#0f172a",margin:"0 0 6px" }}>Agendá tu consulta gratis</h3>
          <p style={{ fontSize:13,color:"#64748b",margin:"0 0 16px" }}>15 minutos para conocer cómo automatizar tu negocio</p>
          <a href={CONFIG.calendlyUrl} target="_blank" rel="noopener noreferrer" style={{
            display:"inline-flex",alignItems:"center",gap:8,padding:"14px 32px",
            background:v.gradient,color:"#fff",borderRadius:14,fontSize:15,fontWeight:800,
            textDecoration:"none",boxShadow:`0 8px 24px ${v.glow}`,
          }}>📅 Abrir calendario</a>
          <div style={{ marginTop:10,fontSize:11,color:"#b0b8c4" }}>Powered by Calendly</div>
        </div>
      )}

      <div style={{ textAlign:"center",marginTop:14,fontSize:13,color:"#64748b" }}>📱 {CONFIG.phoneDisplay}</div>
    </div>
  );
}

// ═══════════════════════════════════════════
// STICKY WA + SOCIAL TOAST
// ═══════════════════════════════════════════
function StickyWA({ v, show }) {
  if (!show) return null;
  return (
    <a href={WA(v.waMsg)} target="_blank" rel="noopener noreferrer" style={{
      position:"fixed",bottom:24,right:20,zIndex:9999,width:60,height:60,borderRadius:"50%",
      background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",
      boxShadow:"0 6px 24px rgba(37,211,102,0.45)",textDecoration:"none",fontSize:28,
      animation:"bounceIn .5s ease, pulseWA 2s ease infinite 3s",
    }}>💬</a>
  );
}

function SocialToast({ show }) {
  const proofs = ["Juan de Lanús consultó hace 8 min","María de Palermo agendó una demo","Resto La Farola ya automatizó sus pedidos"];
  const [idx] = useState(Math.floor(Math.random() * proofs.length));
  const [visible, setVisible] = useState(true);
  useEffect(() => { if (show) { const t = setTimeout(() => setVisible(false), 5000); return () => clearTimeout(t); } }, [show]);
  if (!show || !visible) return null;
  return (
    <div style={{
      position:"fixed",bottom:96,left:16,right:16,zIndex:9998,
      background:"#fff",borderRadius:14,padding:"12px 16px",
      boxShadow:"0 8px 32px rgba(0,0,0,0.12)",border:"1px solid #e2e8f0",
      display:"flex",alignItems:"center",gap:10,fontSize:13,color:"#334155",
      animation:"slideUp .4s ease",maxWidth:360,
    }}>
      <span style={{ fontSize:18 }}>🔔</span><span>{proofs[idx]}</span>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════
export default function Page() {
  const [vertical, setVertical] = useState("inmobiliarias");
  const [annual, setAnnual] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [showFAQ, setShowFAQ] = useState(null);
  const scrolledPast = useScrollPast(400);
  const showToast = useTimeOnPage(12);
  const v = VERTICALS[vertical];
  const plans = getPlans(vertical);

  const faqs = [
    { q:"¿Qué son los 'costos por uso de IA'?", a:"Cada conversación del chatbot usa IA que cuesta menos de $0.01 USD. WhatsApp cobra ~$0.07 por mensaje de marketing. Las respuestas a clientes que te escriben son GRATIS. Se factura aparte con total transparencia." },
    { q:"¿Qué incluye el mantenimiento?", a:"Actualizaciones del chatbot, mejoras en flujos, optimización, soporte técnico y adaptación a cambios de WhatsApp/Meta. Todo incluido en la mensualidad." },
    { q:"¿Puedo cambiar de plan?", a:"Sí, subís o bajás en cualquier momento. El cambio aplica en el próximo ciclo de facturación." },
    { q:"¿Cómo se cobra?", a:"Mensualidad fija vía MercadoPago (tarjeta, débito o wallet). Los costos de IA se detallan en un reporte mensual con cada conversación trazada." },
    { q:"¿Hay permanencia mínima?", a:"No. Sin contrato. Cancelás cuando quieras. Con plan anual ahorrás 20% pero podés cancelar con 30 días de aviso." },
  ];

  return (
    <div style={{ fontFamily:"'Outfit',system-ui,-apple-system,sans-serif",background:"#fafbfc",minHeight:"100vh" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounceIn{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
        @keyframes pulseWA{0%,100%{box-shadow:0 6px 24px rgba(37,211,102,0.45)}50%{box-shadow:0 6px 36px rgba(37,211,102,0.7)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes glow{0%,100%{opacity:.5}50%{opacity:1}}
        input[type=range]{-webkit-appearance:none;appearance:none;height:8px;border-radius:4px;background:#e2e8f0;outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2)}
      `}</style>

      <StickyWA v={v} show={scrolledPast} />
      <SocialToast show={showToast} />

      {/* ══════ HERO ══════ */}
      <div style={{ background:"#0a0e1a",padding:"44px 20px 40px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",width:350,height:350,borderRadius:"50%",background:`radial-gradient(circle,${v.glow},transparent 70%)`,top:-80,right:-80,animation:"glow 4s ease infinite",transition:"background .8s" }} />
        <div style={{ position:"absolute",width:250,height:250,borderRadius:"50%",background:`radial-gradient(circle,${v.glow},transparent 70%)`,bottom:-60,left:-60,animation:"glow 5s ease infinite 1s",transition:"background .8s" }} />
        <div style={{ position:"relative",zIndex:1 }}>
          <div style={{ fontSize:10,fontWeight:600,letterSpacing:3,color:"#64748b",textTransform:"uppercase",marginBottom:4 }}>Una empresa de AION-8 · Ventures</div>
          <div style={{ fontSize:12,fontWeight:600,letterSpacing:3,color:"#475569",textTransform:"uppercase",marginBottom:10 }}>Powered by Rise IA</div>
          <h1 style={{ fontSize:"clamp(36px,7vw,64px)",fontWeight:900,background:v.gradient,backgroundSize:"200% 200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",margin:0,lineHeight:1,letterSpacing:-1,animation:"gradientShift 4s ease infinite",transition:"all .5s" }}>P.I.G.I.</h1>
          <div style={{ fontSize:13,color:"#64748b",marginTop:4,letterSpacing:.5 }}>Plataforma Integral de Gestión Inteligente</div>

          <div style={{ display:"inline-flex",gap:4,padding:4,background:"rgba(255,255,255,0.06)",borderRadius:16,margin:"22px 0 24px",border:"1px solid rgba(255,255,255,0.08)" }}>
            {Object.entries(VERTICALS).map(([k,val]) => (
              <button key={k} onClick={()=>{setVertical(k);setExpandedPlan(null)}} style={{
                padding:"12px 26px",border:"none",background:vertical===k?val.gradient:"transparent",
                color:vertical===k?"#fff":"#64748b",borderRadius:12,fontSize:14,fontWeight:700,
                cursor:"pointer",transition:"all .4s",display:"flex",alignItems:"center",gap:6,
                boxShadow:vertical===k?`0 6px 24px ${val.glow}`:"none",
              }}><span style={{ fontSize:18 }}>{val.icon}</span>{val.label}</button>
            ))}
          </div>

          <div style={{ display:"flex",justifyContent:"center",gap:28,flexWrap:"wrap" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:44,fontWeight:900,color:v.color,lineHeight:1,transition:"color .5s" }}>{v.painStat}</div>
              <div style={{ fontSize:12,color:"#94a3b8",maxWidth:180,marginTop:3 }}>{v.painLabel}</div>
            </div>
            <div style={{ width:1,background:"rgba(255,255,255,0.1)",alignSelf:"stretch" }} />
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:44,fontWeight:900,color:"#10b981",lineHeight:1 }}>{v.roiStat}</div>
              <div style={{ fontSize:12,color:"#94a3b8",maxWidth:180,marginTop:3 }}>{v.roiLabel}</div>
            </div>
          </div>

          <a href={WA(v.waMsg)} target="_blank" rel="noopener noreferrer" style={{
            display:"inline-flex",alignItems:"center",gap:10,padding:"16px 36px",marginTop:24,
            background:"linear-gradient(135deg,#25D366,#128C7E)",color:"#fff",borderRadius:16,
            fontSize:16,fontWeight:800,textDecoration:"none",boxShadow:"0 8px 28px rgba(37,211,102,0.35)",minHeight:56,
          }}>💬 Hablemos por WhatsApp</a>
        </div>
      </div>

      {/* ══════ SOCIAL PROOF BAR ══════ */}
      <div style={{ background:"#fff",padding:"16px 20px",display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap",borderBottom:"1px solid #e8ecf1" }}>
        {[{ n:50,s:"+ negocios automatizados" },{ n:1500,s:"+ mensajes IA procesados" },{ n:200,s:"+ horas ahorradas/mes" }].map((m,i) => (
          <div key={i} style={{ textAlign:"center" }}>
            <div style={{ fontSize:22,fontWeight:900,color:v.color,transition:"color .5s" }}><Counter end={m.n} /></div>
            <div style={{ fontSize:11,color:"#64748b" }}>{m.s}</div>
          </div>
        ))}
      </div>

      {/* ══════ BILLING TOGGLE ══════ */}
      <div style={{ display:"flex",justifyContent:"center",padding:"28px 20px 6px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:14,background:"#fff",padding:"8px 22px",borderRadius:50,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",border:"1px solid #e8ecf1" }}>
          <span style={{ fontSize:14,fontWeight:annual?500:800,color:annual?"#94a3b8":"#1e293b",transition:"all .3s" }}>Mensual</span>
          <div onClick={()=>setAnnual(!annual)} style={{ width:52,height:28,borderRadius:14,cursor:"pointer",background:annual?v.gradient:"#e2e8f0",position:"relative",transition:"background .4s" }}>
            <div style={{ width:22,height:22,background:"#fff",borderRadius:"50%",position:"absolute",top:3,left:annual?27:3,transition:"left .3s cubic-bezier(.16,1,.3,1)",boxShadow:"0 2px 6px rgba(0,0,0,.15)" }} />
          </div>
          <span style={{ fontSize:14,fontWeight:annual?800:500,color:annual?"#1e293b":"#94a3b8",transition:"all .3s" }}>
            Anual <span style={{ background:"#ecfdf5",color:"#059669",padding:"2px 8px",borderRadius:8,fontSize:11,fontWeight:700,marginLeft:4 }}>-20%</span>
          </span>
        </div>
      </div>
      <div style={{ textAlign:"center",padding:"10px 20px 4px" }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:50,background:`${v.color}08`,border:`1px solid ${v.color}20`,fontSize:12,fontWeight:600,color:v.dark,transition:"all .4s" }}>
          🔍 Precios 100% transparentes — tocá "Ver costos de IA" en cada plan
        </div>
      </div>

      {/* ══════ PLANS ══════ */}
      <div style={{ display:"flex",gap:16,padding:"20px 16px 40px",justifyContent:"center",flexWrap:"wrap",maxWidth:1200,margin:"0 auto" }}>
        {plans.map((p,i) => (
          <PlanCard key={`${vertical}-${i}`} plan={p} v={v} vKey={vertical} annual={annual}
            expanded={expandedPlan===i} onExpand={()=>setExpandedPlan(expandedPlan===i?null:i)} />
        ))}
      </div>

      {/* ══════ HOW PRICING WORKS ══════ */}
      <div style={{ maxWidth:900,margin:"0 auto",padding:"0 20px 40px" }}>
        <div style={{ background:"#fff",borderRadius:22,padding:"32px 24px",boxShadow:"0 4px 20px rgba(0,0,0,0.04)",border:"1px solid #e8ecf1" }}>
          <h2 style={{ fontSize:22,fontWeight:900,color:"#0f172a",margin:"0 0 4px",textAlign:"center" }}>¿Cómo funciona el precio?</h2>
          <p style={{ textAlign:"center",color:"#64748b",margin:"0 0 24px",fontSize:13 }}>Tres componentes claros. Sin letra chica.</p>
          <div style={{ display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center" }}>
            {[
              { n:"1",icon:"📋",title:"Mensualidad fija",desc:"Plataforma, CRM, NFC, soporte, landing y herramientas",color:v.color },
              { n:"2",icon:"🤖",title:"Uso de IA (variable)",desc:"Cada conversación y minuto de voz. Reporte mensual detallado",color:"#f59e0b" },
              { n:"3",icon:"🔧",title:"Mantenimiento",desc:"Actualizaciones, mejoras, optimización y soporte. TODO INCLUIDO",color:"#10b981" },
            ].map((item,i) => (
              <div key={i} style={{ flex:1,minWidth:220,background:`${item.color}08`,borderRadius:16,padding:"22px 18px",textAlign:"center",border:`1px solid ${item.color}15`,position:"relative" }}>
                <div style={{ position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",width:26,height:26,borderRadius:"50%",background:item.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900 }}>{item.n}</div>
                <div style={{ fontSize:26,marginTop:8,marginBottom:4 }}>{item.icon}</div>
                <div style={{ fontSize:14,fontWeight:800,color:"#0f172a",marginBottom:4 }}>{item.title}</div>
                <div style={{ fontSize:12,color:"#64748b",lineHeight:1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20,display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center" }}>
            {["📊 Reporte mensual detallado","🔓 Sin contrato","💳 MercadoPago","🎯 14 días gratis"].map((g,i) => (
              <div key={i} style={{ padding:"6px 16px",background:"#f0fdf4",borderRadius:10,fontSize:12,fontWeight:600,color:"#166534",border:"1px solid #bbf7d0" }}>{g}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════ ROI CALCULATOR ══════ */}
      <div style={{ padding:"0 20px 40px" }}><ROICalc v={v} vKey={vertical} /></div>

      {/* ══════ CONTACT HUB ══════ */}
      <div style={{ padding:"0 20px 40px" }} id="contacto"><ContactHub v={v} vKey={vertical} /></div>

      {/* ══════ FAQ ══════ */}
      <div style={{ maxWidth:680,margin:"0 auto",padding:"0 20px 40px" }}>
        <h2 style={{ fontSize:22,fontWeight:900,color:"#0f172a",textAlign:"center",marginBottom:16 }}>Preguntas frecuentes</h2>
        {faqs.map((f,i) => (
          <div key={i} onClick={()=>setShowFAQ(showFAQ===i?null:i)} style={{
            background:"#fff",borderRadius:14,padding:"16px 20px",marginBottom:8,cursor:"pointer",
            border:showFAQ===i?`1px solid ${v.color}30`:"1px solid #e2e8f0",
            boxShadow:showFAQ===i?`0 4px 16px ${v.glow}`:"none",transition:"all .3s",
          }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ fontSize:14,fontWeight:700,color:"#1e293b" }}>{f.q}</span>
              <span style={{ fontSize:13,color:v.color,fontWeight:700,transition:"transform .3s",transform:showFAQ===i?"rotate(180deg)":"rotate(0)" }}>▼</span>
            </div>
            {showFAQ===i && <p style={{ margin:"10px 0 0",fontSize:13.5,color:"#64748b",lineHeight:1.7,animation:"fadeIn .3s ease" }}>{f.a}</p>}
          </div>
        ))}
        <div style={{ textAlign:"center",marginTop:14 }}>
          <a href={WA(`${v.waMsg} — Tengo una pregunta`)} target="_blank" rel="noopener noreferrer" style={{ fontSize:14,fontWeight:700,color:v.color,textDecoration:"none" }}>
            ¿Más preguntas? Escribinos por WhatsApp →
          </a>
        </div>
      </div>

      {/* ══════ FINAL CTA ══════ */}
      <div style={{ background:"#0a0e1a",padding:"48px 20px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${v.glow},transparent 70%)`,top:-160,left:"50%",transform:"translateX(-50%)",animation:"glow 4s ease infinite" }} />
        <div style={{ position:"relative",zIndex:1 }}>
          <h2 style={{ fontSize:"clamp(22px,4vw,32px)",fontWeight:900,color:"#fff",margin:"0 0 6px" }}>¿Listo para automatizar con {v.label}?</h2>
          <p style={{ fontSize:15,color:"#94a3b8",margin:"0 0 24px" }}>Agendá una demo gratuita de 15 minutos. Sin compromiso.</p>
          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
            <a href={WA(v.waMsg)} target="_blank" rel="noopener noreferrer" style={{ padding:"16px 36px",background:"linear-gradient(135deg,#25D366,#128C7E)",color:"#fff",borderRadius:16,fontSize:16,fontWeight:800,textDecoration:"none",display:"flex",alignItems:"center",gap:8,boxShadow:"0 8px 28px rgba(37,211,102,0.35)",minHeight:56 }}>💬 WhatsApp</a>
            <a href={TEL} style={{ padding:"16px 36px",background:"transparent",color:"#fff",border:"2px solid rgba(255,255,255,0.2)",borderRadius:16,fontSize:16,fontWeight:800,textDecoration:"none",display:"flex",alignItems:"center",gap:8,minHeight:56 }}>📞 Llamar</a>
          </div>
          <div style={{ marginTop:16,fontSize:14,color:"#64748b" }}>📱 {CONFIG.phoneDisplay}</div>
          <div style={{ marginTop:28,paddingTop:20,borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap",fontSize:11,color:"#475569" }}>
            <span>AION-8 · Ventures</span><span>Rise IA © 2026</span><span>riseia.ar</span><span>Buenos Aires, Argentina</span>
          </div>
        </div>
      </div>
    </div>
  );
}
