import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  BookOpen,
  ChevronRight,
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
    text: `Hello, I’m SILA. I help DCT planners understand flight scenarios, examine visitor conversion funnels, and evaluate evidence reliability.`,
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
    }, 280);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Trigger Button: "Ask SILA" */}
      <button
        id="open-ask-aerostay-btn"
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#0A2E4D] hover:bg-[#08233B] text-white px-4 py-3 rounded-full shadow-[0_4px_20px_rgba(10,46,77,0.2)] flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 no-print border border-[#D4AF37]/40"
      >
        <div className="w-6 h-6 rounded-full bg-[#0A2E4D] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center font-bold text-xs">
          ص
        </div>
        <span className="text-xs font-semibold tracking-tight">Ask SILA</span>
      </button>

      {/* Slide-over Drawer Backdrop */}
      {isOpen && (
        <div
          id="ask-aerostay-backdrop"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-[#0A2E4D]/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        >
          {/* Drawer Container */}
          <div
            id="ask-aerostay-drawer"
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#F4F1EA] shadow-2xl flex flex-col border-l border-[#0A2E4D]/15 animate-in slide-in-from-right duration-200"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#0A2E4D]/10 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0A2E4D] text-[#D4AF37] flex items-center justify-center font-bold text-sm shadow-xs">
                  ص
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0A2E4D] tracking-tight">
                    SILA Assistant
                  </h3>
                  <p className="text-[11px] text-[#0A2E4D]/60 font-normal">
                    Grounded in official DCT research &amp; live scenario state
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#0A2E4D]/40 hover:text-[#0A2E4D] hover:bg-[#F4F1EA] transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-header Banner */}
            <div className="px-5 py-3 bg-[#F4F1EA] border-b border-[#0A2E4D]/10 text-xs text-[#0A2E4D]">
              <span className="font-semibold text-[#0A2E4D]">What would you like to understand?</span>
              <span className="block text-[11px] text-[#0A2E4D]/60 mt-0.5">
                Current context: {currentRoute ? `${currentRoute.routeCode} (${currentRoute.modelledSourceMarket})` : 'All Markets'}
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#0A2E4D] text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-[#0A2E4D] border border-[#0A2E4D]/10 rounded-bl-xs shadow-xs space-y-2'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {msg.limitation && (
                      <div className="pt-2 border-t border-[#0A2E4D]/10 text-[10px] text-[#0A2E4D]/60">
                        {msg.limitation}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-[#0A2E4D]/40 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#0A2E4D]/10 w-28 text-xs text-[#0A2E4D]/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E6B6E] animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E6B6E] animate-pulse delay-75" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E6B6E] animate-pulse delay-150" />
                  <span className="text-[10px] ml-1">Thinking…</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Questions Bar */}
            <div className="px-5 py-3 border-t border-[#0A2E4D]/10 bg-white/70 space-y-2">
              <span className="text-[10px] font-semibold text-[#0A2E4D]/50 uppercase tracking-wider block">
                Suggested questions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ChatService.getSuggestedPrompts().map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-[#F4F1EA] text-[#0A2E4D] border border-[#0A2E4D]/10 font-medium transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-[#0A2E4D]/10 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about this scenario…"
                  className="flex-1 text-xs py-2.5 px-3.5 rounded-xl border border-[#0A2E4D]/15 bg-[#F4F1EA]/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0E6B6E]/20 focus:border-[#0E6B6E] text-[#0A2E4D] placeholder-[#0A2E4D]/40"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim()}
                  className="p-2.5 rounded-xl bg-[#0A2E4D] hover:bg-[#08233B] disabled:opacity-40 text-[#D4AF37] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
