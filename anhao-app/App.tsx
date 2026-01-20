
import React, { useState, useEffect } from 'react';
import { ViewMode } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatView from './components/ChatView';
import ImageGenView from './components/ImageGenView';
import LiveVoiceView from './components/LiveVoiceView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case ViewMode.DASHBOARD: return <Dashboard onNavigate={setActiveView} />;
      case ViewMode.CHAT: return <ChatView />;
      case ViewMode.IMAGE: return <ImageGenView />;
      case ViewMode.LIVE: return <LiveVoiceView />;
      default: return <Dashboard onNavigate={setActiveView} />;
    }
  };

  const getTitle = () => {
    switch(activeView) {
      case ViewMode.DASHBOARD: return "今日安好";
      case ViewMode.CHAT: return "心语空间";
      case ViewMode.IMAGE: return "绘梦板";
      case ViewMode.LIVE: return "愈见声音";
      default: return "安好一日";
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#fdfcf8] overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <main className="flex-1 transition-all duration-300 relative overflow-hidden flex flex-col">
        <header className="h-16 border-b border-stone-200 flex items-center justify-between px-6 bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-stone-100 rounded-lg md:hidden">
              <MenuIcon />
            </button>
            <h1 className="text-xl font-bold text-stone-700 text-title">{getTitle()}</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:block text-right mr-2">
                <p className="text-xs text-stone-400">当前状态</p>
                <p className="text-sm font-medium text-stone-600">安好</p>
             </div>
             <div className="h-9 w-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anhao" alt="avatar" />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);

export default App;
