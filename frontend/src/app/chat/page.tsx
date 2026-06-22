"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, BrainCircuit, User, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { io, Socket } from "socket.io-client";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

const DUMMY_HISTORY = [
  "Best lightweight material for aerospace",
  "Compare graphene and titanium",
  "Best heat resistant materials",
];

const INITIAL_MESSAGE: Message = {
  id: "init-1",
  role: "ai",
  content: "Hello! I am your AI Materials Expert. Ask me anything about material properties, comparisons, or recommendations for your engineering projects.",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to Socket.IO backend
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("ai_typing", (data: { status: boolean }) => {
      setIsTyping(data.status);
    });

    socketRef.current.on("ai_response", (data: { id: string, message: string }) => {
      setMessages((prev) => [...prev, { id: data.id, role: "ai", content: data.message }]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Send via socket
    if (socketRef.current) {
      socketRef.current.emit("ai_message", { message: input });
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-navy-900">
      {/* Sidebar History */}
      <div className="w-80 border-r border-white/5 bg-navy-900/50 hidden md:flex flex-col p-4">
        <button className="w-full py-3 px-4 rounded-xl border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-white/5 transition-all mb-8">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          New Chat
        </button>
        <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4 px-2">Recent Chats</div>
        <div className="flex-col space-y-2 flex-1 overflow-y-auto pr-2">
          {DUMMY_HISTORY.map((chat, idx) => (
            <button
              key={idx}
              className="w-full text-left px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors truncate flex items-center gap-3"
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0 text-white/40" />
              <span className="truncate">{chat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={cn(
                "flex max-w-3xl mx-auto gap-4",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  msg.role === "user"
                    ? "bg-gradient-to-br from-purple-500 to-blue-600"
                    : "bg-gradient-to-br from-cyan-400 to-blue-500"
                )}
              >
                {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <BrainCircuit className="w-5 h-5 text-white" />}
              </div>
              <div
                className={cn(
                  "px-5 py-4 rounded-2xl text-sm sm:text-base border shadow-sm",
                  msg.role === "user"
                    ? "bg-blue-600/20 border-blue-500/20 text-white rounded-tr-none"
                    : "glass-card border-white/10 text-white/90 rounded-tl-none"
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex max-w-3xl mx-auto gap-4"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div className="px-5 py-4 rounded-2xl glass-card border-white/10 text-white/90 rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-navy-900 border-t border-white/5">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about materials..."
              className="w-full pl-6 pr-14 py-4 rounded-2xl glass-panel text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all border border-white/10 shadow-lg"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-2 p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="max-w-3xl mx-auto mt-3 flex justify-center gap-2 hidden sm:flex">
             <span className="text-xs text-white/40">Try asking:</span>
             <button onClick={() => setInput("Best lightweight material for aerospace")} className="text-xs text-cyan-400 hover:underline">&quot;Best lightweight material for aerospace&quot;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
