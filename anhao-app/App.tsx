import React, { useState, useEffect, useRef } from 'react';
import { Message, Role, Memory } from './types';
import { gemini } from './geminiService';
import ChatInterface from './ChatInterface';
import MemorySidebar from './MemorySidebar';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('anhao_messages');
    const savedMemories = localStorage.getItem('anhao_memories');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedMemories) setMemories(JSON.parse(savedMemories));
  }, []);

  useEffect(() => {
    localStorage.setItem('anhao_messages', JSON.stringify(messages));
    localStorage.setItem('anhao_memories', JSON.stringify(memories));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, memories]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 9) return "早安，新的一天，愿你心中有光。";
    if (hour < 12) return "上午好，忙碌之余别忘了喝口水休息一下。";
    if (hour < 18) return "下午好，愿这一刻的阳光能给你带来平静。";
    return "晚安，卸下一天的疲惫，好梦将至。";
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    setError(null);
    
    const userMessage: Message = { id: Date.now().toString(), role: Role.USER, content: input, timestamp: Date.now() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const originalInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const responseStream = await gemini.chat(newMessages, originalInput);
      let assistantContent = '';
      const assistantMessageId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, { id: assistantMessageId, role: Role.ASSISTANT, content: '', timestamp: Date.now() }]);

      for await (const chunk of responseStream) {
        if (chunk.text) {
          assistantContent += chunk.text;
          setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: assistantContent } : msg));
        }
      }

      if (newMessages.length > 0 && newMessages.length % 3 === 0) {
        const topic = await gemini.generateSummary([...newMessages, { id: assistantMessageId, role: Role.ASSISTANT, content: assistantContent, timestamp: Date.now() }]);
        setMemories(prev => [{ id: Date.now().toString(), topic, summary: assistantContent.substring(0, 50), timestamp: Date.now() }, ...prev].slice(0, 10));
      }
    } catch (e: any) {
      console.error(e);
      if (e.message === "API_KEY_MISSING") {
        setError("哎呀，安好似乎弄丢了它的‘通行密钥’。请在 Vercel 设置中检查 API_KEY 是否填错。");
      } else {
        setError("我的思绪飘向了远方，暂时没能回应你。请稍后再试。");
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f7f2] text-slate-700 overflow-hidden font-serif">
      <div className="w-72 border-r border-slate-200 bg-white/40 hidden md:block">
        <MemorySidebar memories={memories} onClear={() => { 
          if(window.confirm("确定要清空所有的对话记录和心迹存档吗？")) {
            setMessages([]); 
            setMemories([]); 
          }
        }} />
      </div>
      <main className="flex-1 flex flex-col relative max-w-5xl mx-auto w-full">
        <header className="h-20 flex items-center justify-between px-8 bg-white/60 backdrop-blur-sm z-10 border-b border-white/20">
          <div>
            <h1 className="text-xl font-medium tracking-widest text-slate-800">安好一日</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{getGreeting()}</p>
          </div>
        </header>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
              <div className="w-12 h-12 border border-slate-300 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-xs tracking-widest italic">清风徐来，水波不兴。说点什么吧。</p>
            </div>
          ) : (
            messages.map((msg) => <ChatInterface key={msg.id} message={msg} />)
          )}
          {isTyping && <div className="text-[10px] text-slate-400 animate-pulse ml-12 italic">安好正在细细聆听...</div>}
          {error && (
            <div className="mx-auto max-w-md p-4 bg-red-50/50 border border-red-100 text-red-500 text-[11px] rounded-2xl text-center shadow-sm">
              {error}
            </div>
          )}
        </div>

        <div className="p-6 bg-gradient-to-t from-[#f8f7f2] to-transparent">
          <div className="relative max-w-3xl mx-auto group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="分享你的此刻，或是那些细碎的心事..."
              className="w-full bg-white/80 border border-slate-200 rounded-2xl py-4 px-6 pr-14 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all placeholder:text-slate-300 text-sm shadow-sm backdrop-blur-md"
            />
            <button 
              onClick={handleSend} 
              disabled={isTyping || !input.trim()} 
              className={`absolute right-3 top-2.5 p-2 transition-all duration-300 ${input.trim() ? 'text-slate-600' : 'text-slate-300'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 19l7-7-7-7M5 12h14" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p className="text-center text-[9px] text-slate-300 mt-4 tracking-widest">每一段心声，都值得被温柔以待。</p>
        </div>
      </main>
    </div>
  );
};

export default App;
