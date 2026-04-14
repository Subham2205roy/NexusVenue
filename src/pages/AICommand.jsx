import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PROMPT_CHIPS } from '../utils/constants';
import { sendMessage } from '../utils/geminiClient';
import GaugeChart from '../components/charts/GaugeChart';
import { Send, Mic, Bot, User, Hexagon, Zap, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AICommand() {
  const { data } = useApp();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Welcome to NexusAI. I'm currently monitoring ${data?.totalAttendance?.toLocaleString() || '42,310'} attendees across 6 zones. Gate C and Parking Exit are showing critical queue times. Would you like me to suggest an action plan?`,
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async (text) => {
    const message = text || input;
    if (!message.trim()) return;

    const userMsg = { role: 'user', content: message.trim(), time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await sendMessage(message.trim(), data || {}, chatHistory);
      setMessages(prev => [...prev, { role: 'assistant', content: response, time: new Date() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I encountered an error. Please try again.', time: new Date() }]);
    }
    setIsTyping(false);
  };

  const handleChipClick = (chip) => {
    handleSend(chip);
  };

  const recommendations = [
    { type: 'critical', icon: AlertTriangle, text: 'Redirect Gate C overflow to Gate F — Est. wait reduction: 8 min', color: '#EF4444' },
    { type: 'warning', icon: Zap, text: 'Deploy 3 additional staff to North Stand concourse', color: '#F59E0B' },
    { type: 'info', icon: CheckCircle, text: 'Food Court queue normalizing — no action needed', color: '#10B981' },
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 160px)', minHeight: '500px' }}>
      {/* Chat Interface */}
      <div className="glass-card" style={{ flex: '6 1 0%', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h3 className="font-display text-lg font-semibold text-text-primary">
            NexusAI — Gemini-Powered Operations Assistant
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Ask anything about current venue operations, predictions, or recommendations
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm" style={{ background: 'rgba(0, 212, 255, 0.15)' }}>
                    <Hexagon size={20} className="text-accent-cyan" />
                  </div>
                )}
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`p-5 md:p-6 rounded-2xl text-[16px] leading-[1.7] shadow-sm ${msg.role === 'user'
                      ? 'bg-bg-secondary border border-border text-text-primary ml-auto'
                      : 'bg-bg-primary border border-border'
                      }`}
                  >
                    {msg.content.split('\n').map((line, li) => (
                      line.trim() === '' ? <div key={li} className="h-2"></div> :
                        <p key={li} className={li > 0 ? 'mt-2' : ''} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>') }} />
                    ))}
                  </div>
                  <p className="text-[11px] text-text-secondary mt-2 px-2 font-medium">
                    {msg.time.toLocaleTimeString()}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 bg-bg-secondary border border-border shadow-sm">
                    <User size={20} className="text-text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-bg-secondary border border-border">
                <Hexagon size={16} className="text-accent-cyan" />
              </div>
              <div className="p-4 rounded-xl bg-bg-primary border border-border">
                <div className="typing-indicator flex gap-1.5">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Chips */}
        <div className="px-6 pt-3 pb-3 flex gap-3 overflow-x-auto no-scrollbar">
          {PROMPT_CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className="flex-shrink-0 px-4 py-2.5 rounded-full text-[13px] font-medium text-text-secondary bg-bg-card border border-border hover:border-accent-cyan hover:text-accent-cyan transition-all shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-border bg-bg-secondary/20">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask NexusAI (Press Enter to send, Shift+Enter for newline)..."
              className="flex-1 px-5 py-4 rounded-xl text-[16px] leading-relaxed bg-bg-primary border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/50 transition-all shadow-sm resize-none"
              rows={2}
              id="ai-chat-input"
            />
            <button className="p-4 mb-0.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-secondary border border-transparent transition-colors flex-shrink-0">
              <Mic size={24} />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-4 mb-0.5 rounded-xl bg-accent-cyan text-bg-primary disabled:opacity-40 hover:bg-accent-cyan/90 transition-colors shadow-lg flex-shrink-0"
              id="ai-send-btn"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="no-scrollbar" style={{ flex: '4 1 0%', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', minWidth: 0 }}>
        {/* Current Stats */}
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Current Situation</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Attendance', value: data?.totalAttendance?.toLocaleString() || '42,310', color: '#00D4FF' },
              { label: 'Alerts', value: data?.alerts?.length || 3, color: '#EF4444' },
              { label: 'Staff Available', value: data?.staffAvailable || 119, color: '#7C3AED' },
              { label: 'Avg Queue', value: `${data?.avgQueueWait || 8.4}m`, color: '#F59E0B' },
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-lg text-center bg-bg-secondary border border-border">
                <p className="font-display text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[12px] text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">AI Recommendations</h4>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="p-5 rounded-xl bg-bg-secondary border border-border flex flex-col justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <rec.icon size={16} style={{ color: rec.color }} className="mt-0.5 flex-shrink-0" />
                  <p className="text-[14px] text-text-primary leading-relaxed font-medium">{rec.text}</p>
                </div>
                <button
                  onClick={() => toast.success('Recommendation applied', { style: { background: 'var(--color-bg-card)', color: 'var(--color-text-primary)', border: '1px solid var(--color-success)' } })}
                  className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors border"
                  style={{ background: 'var(--color-bg-primary)', color: rec.color, borderColor: rec.color }}
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Gauge */}
        <GaugeChart value={87} />
      </div>
    </div>
  );
}
