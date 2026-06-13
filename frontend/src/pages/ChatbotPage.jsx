import { useEffect, useRef, useState } from 'react';
import { chatbotService } from '../services/chatbotService';
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';

const DEFAULT_SUGGESTIONS = [
  'What is the weather today?',
  'Wheat market price',
  'Irrigation tips for rice',
  'PM-KISAN scheme details',
  'Cotton disease prevention',
  'Best fertilizer for wheat',
];

export default function ChatbotPage() {
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const { toast, showToast } = useToast();

  useEffect(() => {
    chatbotService.getHistory()
      .then((res) => {
        const hist = res.data.data || [];
        setMessages(hist);
        if (hist.length > 0) setShowWelcome(false);
      })
      .catch(() => {});
    chatbotService.getSuggestions()
      .then((res) => setSuggestions(res.data.data || DEFAULT_SUGGESTIONS))
      .catch(() => setSuggestions(DEFAULT_SUGGESTIONS));
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text?.trim() || input.trim();
    if (!msg) return;
    setShowWelcome(false);
    const userMsg = { sender: 'USER', message: msg, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await chatbotService.sendMessage(msg);
      const data = res.data.data;
      setMessages((prev) => [...prev, { sender: 'BOT', message: data.reply, createdAt: new Date().toISOString() }]);
      if (data.suggestions?.length) setSuggestions(data.suggestions);
    } catch { showToast('Failed to send message', 'error'); }
    finally { setLoading(false); inputRef.current?.focus(); }
  };

  const formatTime = (iso) => {
    try { return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
    catch { return ''; }
  };

  return (
    <>
      <Toast toast={toast} />
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h2 className="page-title mb-0">💬 AgroPulse Assistant</h2>
        <div className="d-flex align-items-center gap-2">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#43a047', display: 'inline-block' }} />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Online</span>
        </div>
      </div>

      <div className="row g-4">
        {/* ── Chat window ── */}
        <div className="col-lg-8">
          <div className="card-custom p-0" style={{ overflow: 'hidden' }}>
            {/* Chat header */}
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '1rem 1.4rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🌾</div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>AgroPulse AI Assistant</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Weather • Market • Crop Care • Schemes</div>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-window" style={{ height: 420, borderRadius: 0, border: 'none', borderBottom: '1px solid var(--border)' }}>
              {showWelcome && messages.length === 0 && (
                <div className="text-center py-4">
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌾</div>
                  <h6 style={{ color: 'var(--primary)', fontWeight: 700 }}>Hello! I'm your Agriculture Assistant</h6>
                  <p className="text-muted-custom mb-3" style={{ fontSize: '0.88rem', maxWidth: 340, margin: '0 auto 1rem' }}>
                    Ask me anything about weather, crop care, market prices, irrigation, or government schemes.
                  </p>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    {DEFAULT_SUGGESTIONS.slice(0, 3).map((s, i) => (
                      <button key={i} className="btn btn-sm btn-outline-success" style={{ fontSize: '0.8rem' }} onClick={() => sendMessage(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'USER' ? 'flex-end' : 'flex-start', marginBottom: '1rem' }}>
                  {m.sender === 'BOT' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(46,125,50,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>🌾</div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)' }}>Assistant</span>
                    </div>
                  )}
                  <div className={`chat-bubble ${m.sender === 'USER' ? 'user' : 'bot'}`}>{m.message}</div>
                  <div className="chat-meta" style={{ textAlign: m.sender === 'USER' ? 'right' : 'left' }}>{formatTime(m.createdAt)}</div>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(46,125,50,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>🌾</div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)' }}>Assistant is typing…</span>
                  </div>
                  <div className="chat-bubble bot" style={{ padding: '0.6rem 1rem' }}>
                    <span style={{ display: 'inline-flex', gap: '4px' }}>
                      {[0, 0.2, 0.4].map((d, i) => (
                        <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block', animation: `bounce 1s ${d}s infinite` }} />
                      ))}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '1rem 1.25rem', background: 'var(--surface)' }}>
              {suggestions.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {suggestions.slice(0, 4).map((s, i) => (
                    <button key={i} className="btn btn-sm btn-outline-success" style={{ fontSize: '0.78rem', borderRadius: 20 }} onClick={() => sendMessage(s)}>{s}</button>
                  ))}
                </div>
              )}
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="d-flex gap-2">
                <input
                  ref={inputRef}
                  className="form-control"
                  placeholder="Ask about weather, crops, market prices, schemes..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <button type="submit" className="btn btn-primary-custom" disabled={loading || !input.trim()} style={{ whiteSpace: 'nowrap', minWidth: 80 }}>
                  Send ➤
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="col-lg-4">
          <div className="card-custom mb-3">
            <div className="section-title">💡 What can I help with?</div>
            {[
              { icon: '🌤', topic: 'Weather',        desc: 'Current conditions, forecasts, rain alerts' },
              { icon: '💰', topic: 'Market Prices',   desc: 'Live mandi rates and price trends' },
              { icon: '💧', topic: 'Irrigation',      desc: 'Watering schedules based on crop & weather' },
              { icon: '🌱', topic: 'Crop Care',       desc: 'Fertilizer, pest control, disease tips' },
              { icon: '🏛', topic: 'Govt Schemes',    desc: 'Subsidies, PM-KISAN and more' },
            ].map((item) => (
              <div key={item.topic} className="d-flex align-items-center gap-3 mb-3 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(46,125,50,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.topic}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-custom">
            <div className="section-title">🔥 Popular Questions</div>
            {DEFAULT_SUGGESTIONS.map((s, i) => (
              <button key={i} className="d-block w-100 text-start btn btn-link p-0 mb-2" style={{ color: 'var(--text)', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}
                onClick={() => sendMessage(s)}>
                <span style={{ color: 'var(--primary)', marginRight: '0.4rem' }}>›</span>{s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
