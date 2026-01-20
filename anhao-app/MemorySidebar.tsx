import React from 'react';
import { Memory } from './types';

interface MemorySidebarProps {
  memories: Memory[];
  onClear: () => void;
}

const MemorySidebar: React.FC<MemorySidebarProps> = ({ memories, onClear }) => {
  return (
    <div className="flex flex-col h-full p-8">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">心迹存档</h2>
        <button onClick={onClear} className="text-[10px] text-slate-300 hover:text-red-400 transition-colors">清空</button>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto">
        {memories.length === 0 ? (
          <p className="text-[11px] text-slate-400 italic leading-loose">这里将记录我们聊过的温馨瞬间。</p>
        ) : (
          memories.map((m) => (
            <div key={m.id} className="group">
              <span className="text-[9px] text-slate-300 font-mono block mb-1">
                {new Date(m.timestamp).toLocaleDateString()}
              </span>
              <p className="text-xs text-slate-600 font-medium group-hover:text-slate-900 transition-colors cursor-default">
                {m.topic}
              </p>
            </div>
          ))
        )}
      </div>
      <div className="mt-8 pt-8 border-t border-slate-100">
        <div className="bg-[#fdfdfb] border border-slate-100 rounded-xl p-4">
          <p className="text-[10px] text-slate-400 leading-relaxed italic">
            “愿你每个清晨醒来，都能感受到这世界的温柔。”
          </p>
        </div>
      </div>
    </div>
  );
};
export default MemorySidebar;