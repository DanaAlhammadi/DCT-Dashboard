import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RotateCcw,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';
import { ChatMessage, ScenarioResult, RouteInfo } from '../../types/dashboard';
import { ChatService } from '../../services/chatService';

interface Props {
  currentResult?: ScenarioResult;
  currentRoute?: RouteInfo;
}

interface EnrichedChatMessage extends ChatMessage {
  sourcePage?: number;
  limitation?: string;
}

export const AskAeroStayDrawer: React.FC<Props> = ({ currentResult, currentRoute }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const initialMessage: EnrichedChatMessage = {
    id: 'msg-init',
    sender: 'assistant',
    timestamp: 'Just now',
    text: `Hello, I’m SILA. I can help you explore flight scenarios, understand market patterns, explain charts and warnings, and prepare a decision summary.`,
    quickReplies: ChatService.getSuggestedPrompts(),
    sourcePage: 1,
  };

  const [messages, setMessages] = useState<EnrichedChatMessage[]>([initialMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    const userMsg: EnrichedChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = ChatService.generateResponse(text, currentResult, currentRoute);
      const assistantMsg: EnrichedChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.text,
        sourcePage: response.sourcePage,
        limitation: response.limitation,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 350);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([initialMessage]);
  };

  return (
    <>
      {/* Floating Bottom-Right Button: "Ask SILA / AeroStay" */}
      <button
        id="ask-aerostay-floating-btn"
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 border border-teal-500/30 group"
        aria-label="Open Ask SILA | اسأل صِلَة chatbot"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-teal-400 group-hover:rotate-6 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-400 rounded-full" />
        </div>
        <span className="font-bold text-sm tracking-wide font-display">Ask SILA | اسأل صِلَة</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Right-Side Drawer */}
      <div
        id="ask-aerostay-drawer"
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-display">Ask SILA | اسأل صِلَة</h3>
              <p className="text-[11px] text-slate-300">Grounded in DCT_EDA_Report.pdf</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleResetChat}
              title="Reset conversation"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="close-ask-aerostay-btn"
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visible Governance Micro-Banner inside Drawer */}
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200/80 text-[11px] text-amber-950 flex items-center justify-between shrink-0 font-medium">
          <span>EDA Mode · Target: Monthly New Hotel Arrivals</span>
          <span className="font-mono text-teal-800 font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
            Validated Citations
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-teal-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="max-w-[88%] space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-teal-700 text-white rounded-tr-xs'
                        : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/80'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Citation & Limitation Badges for Assistant Responses */}
                  {!isUser && msg.sourcePage && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10.5px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                        <BookOpen className="w-3 h-3 text-teal-700 shrink-0" />
                        <span>
                          Source: <strong>DCT_EDA_Report.pdf</strong> (Page {msg.sourcePage})
                        </span>
                      </div>

                      {msg.limitation && (
                        <div className="flex items-start gap-1.5 text-[10.5px] text-amber-900 bg-amber-50/90 p-2 rounded-md border border-amber-200/80 leading-snug">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Limitation:</strong> {msg.limitation}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Reply Chips if present */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Suggested report questions:
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {msg.quickReplies.map((q, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(q)}
                            className="text-left text-[11px] font-semibold p-2 rounded-lg bg-white border border-teal-200 text-teal-950 hover:bg-teal-50 hover:border-teal-400 transition-all flex items-center justify-between group shadow-2xs"
                          >
                            <span>{q}</span>
                            <ArrowRight className="w-3 h-3 text-teal-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className={`text-[10px] text-slate-400 block px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2.5 items-center text-slate-400 text-xs italic">
              <div className="w-7 h-7 rounded-full bg-teal-800 text-white flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-1 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <input
              id="ask-aerostay-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about EDA findings, P2P, seasonality, data limits…"
              className="flex-1 text-xs py-2.5 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all"
            />
            <button
              id="send-ask-aerostay-btn"
              type="button"
              disabled={!inputValue.trim() || isTyping}
              onClick={() => handleSend()}
              className="p-2.5 rounded-xl bg-teal-700 text-white hover:bg-teal-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] text-slate-500 block text-center mt-2">
            Answers are strictly grounded in DCT_EDA_Report.pdf (Notebooks/01.ipynb).
          </span>
        </div>
      </div>
    </>
  );
};
