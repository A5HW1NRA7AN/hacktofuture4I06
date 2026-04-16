import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Mic, MicOff, Send, MessageSquare, Briefcase,
  Activity, CheckCircle2, ChevronRight, Hash, Zap,
  AlertTriangle, Loader2, ArrowRight, PlusCircle, Clock
} from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import { backendApi } from '../../api/backend';
import { sendAction, type ActionItemData } from '../../api/agent';

// ── Types ───────────────────────────────────────────────────────────────────

type FeedItem = {
  id: string;
  type: 'user' | 'agent' | 'system';
  text: string;
  actions?: ActionItemData[];
  timestamp: string;
  isError?: boolean;
};

type ChatSession = {
  id: string;
  title: string;
  created_at: string;
};

// ── Tool Icon Mapping ───────────────────────────────────────────────────────

function ToolIcon({ tool }: { tool: string }) {
  switch (tool) {
    case 'jira': return <Briefcase className="w-3.5 h-3.5 text-blue-400" />;
    case 'slack': return <Hash className="w-3.5 h-3.5 text-purple-400" />;
    case 'linear': return <ArrowRight className="w-3.5 h-3.5 text-violet-400" />;
    default: return <Zap className="w-3.5 h-3.5 text-amber-400" />;
  }
}

// ── Chat View ────────────────────────────────────────────────────────────────

export default function ChatView() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentOnline, setAgentOnline] = useState<boolean | null>(null);
  
  const [feed, setFeed] = useState<FeedItem[]>([
    {
      id: 'welcome',
      type: 'agent',
      text: "Welcome to VoxBridge. I'm your Autonomous PM — tell me what happened, what you need done, or give me a voice command. I'll orchestrate Jira, Slack, and Linear for you.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useSpeech();
  const endOfFeedRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Sessions
  useEffect(() => {
    backendApi.get('/chat/sessions/')
      .then(res => {
        // Handle paginated DRF response: { count, results: [...] }
        const data = res.data?.results ?? res.data;
        const list = Array.isArray(data) ? data : [];
        setSessions(list);
        if (list.length > 0) setActiveSessionId(list[0].id);
      })
      .catch(err => console.error(err));
  }, []);

  // Auto-scroll feed
  useEffect(() => {
    endOfFeedRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [feed, isProcessing]);

  // Pipe voice transcript into the text input live
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Check agent health on mount
  useEffect(() => {
    import('../../api/agent').then(({ checkHealth }) => {
      checkHealth().then(setAgentOnline);
    });
  }, []);

  const handleNewSession = () => {
    setActiveSessionId(null);
    setFeed([
      {
        id: 'new',
        type: 'agent',
        text: "New conversation started. How can I assist you?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || isProcessing) return;

    if (isListening) stopListening();
    resetTranscript();
    setInput('');
    setIsProcessing(true);

    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const id = Date.now().toString();

    setFeed((prev) => [...prev, { id: `user-${id}`, type: 'user', text: userMessage, timestamp: ts }]);

    try {
      const result = await sendAction(userMessage);
      setFeed((prev) => [
        ...prev,
        {
          id: `agent-${id}`,
          type: 'agent',
          text: result.message,
          actions: result.actions_taken,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setFeed((prev) => [
        ...prev,
        {
          id: `err-${id}`,
          type: 'agent',
          text: 'Failed to reach the agent service.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
      if (input.trim()) setTimeout(() => handleSubmit(), 150);
    } else {
      setInput('');
      startListening();
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden relative pb-16">
      {/* ─── Sessions Sidebar ────────────────────────────────────────────── */}
      <div className="w-72 border-r border-white/5 bg-[#0a0d12]/50 hidden md:flex flex-col">
        <div className="p-4 border-b border-white/5">
          <button 
            onClick={handleNewSession}
            className="w-full py-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-3 px-2">Recent History</h3>
          {sessions.map(s => (
            <button 
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex flex-col gap-1 ${
                activeSessionId === s.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <span className="truncate block font-medium">{s.title}</span>
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 
                {new Date(s.created_at).toLocaleDateString()}
              </span>
            </button>
          ))}
          {sessions.length === 0 && (
            <div className="text-xs text-gray-500 text-center py-4">No recent history</div>
          )}
        </div>
      </div>

      {/* ─── Chat Area ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full bg-[#0a0d12]">
        {/* Header Indicator */}
        <div className="h-12 border-b border-white/5 flex items-center px-4 justify-end gap-2 bg-[#0f1318]/50 shrink-0">
           <span className="text-xs text-gray-400">Agent Status:</span>
           <span className={`w-2 h-2 rounded-full ${agentOnline ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : agentOnline === false ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'}`} />
        </div>

        {/* Activity Feed */}
        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
            <AnimatePresence>
              {feed.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`flex gap-3 ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Agent avatar */}
                  {item.type !== 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-indigo-400" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`flex flex-col gap-1.5 max-w-[80%] ${item.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
                        item.type === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-md shadow-lg shadow-indigo-600/10'
                          : item.isError
                            ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-md'
                            : 'bg-white/[0.04] border border-white/[0.06] text-gray-300 rounded-bl-md'
                      }`}
                    >
                      {item.isError && <AlertTriangle className="w-4 h-4 text-red-400 inline mr-2 -mt-0.5" />}
                      {item.text}
                    </div>

                    {/* Actions */}
                    {item.actions && item.actions.length > 0 && (
                      <div className="w-full mt-1">
                        <div className="bg-[#0d1017] rounded-xl border border-white/[0.06] p-3.5 shadow-inner">
                          <h4 className="text-[10px] uppercase tracking-[0.15em] text-gray-600 font-semibold mb-2.5 flex items-center gap-1.5">
                            <Activity className="w-3 h-3" /> Actions Executed
                          </h4>
                          <div className="space-y-2">
                            {item.actions.map((act, idx) => (
                              <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.15, duration: 0.25 }}
                                key={idx}
                                className="flex items-start gap-2.5 bg-white/[0.03] p-2.5 rounded-lg border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                              >
                                <div className="mt-0.5">
                                  {act.status === 'success' ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[13px] font-medium text-gray-300 flex items-center gap-1.5 flex-wrap">
                                    <ToolIcon tool={act.tool} />
                                    <span className="capitalize">{act.tool}</span>
                                    <span className="text-gray-600">·</span>
                                    <code className="text-[11px] text-gray-500 bg-white/[0.04] px-1.5 py-0.5 rounded font-mono">{act.action}</code>
                                  </p>
                                  <p className="text-[12px] text-gray-500 mt-0.5 truncate">{act.message}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] text-gray-600 px-1 select-none">{item.timestamp}</span>
                  </div>
                </motion.div>
              ))}

              {isProcessing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
                  </div>
                  <div className="px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] rounded-bl-md flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span className="text-xs text-gray-500 font-medium">Orchestrating actions...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endOfFeedRef} className="pb-8" />
          </div>
        </div>

        {/* ─── Input Bar ──────────────────────────────────────────────────── */}
        <div className="absolute bottom-0 inset-x-0 ml-0 md:ml-72 bg-[#0f1318]/90 backdrop-blur-xl border-t border-white/5 p-4 z-20">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
              {isSupported && (
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`p-3 rounded-xl transition-all duration-300 shrink-0 ${
                    isListening
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                      : 'bg-white/5 text-gray-500 border border-white/10 hover:text-amber-400'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
              <div className={`relative flex-1 rounded-xl border transition-all duration-300 flex items-center ${isListening ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 bg-white/[0.03] focus-within:border-indigo-500/50'}`}>
                <span className="pl-3.5"><MessageSquare className="w-4 h-4 text-gray-600" /></span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? 'Listening...' : 'Describe what happened or what you need done...'}
                  className="w-full bg-transparent text-gray-200 py-3.5 px-3 outline-none text-sm"
                  disabled={isProcessing}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 transition-all shrink-0 shadow-lg shadow-indigo-600/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
