import React from 'react';
import { Message, Role } from './types';

interface ChatInterfaceProps {
  message: Message;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] ${isUser ? 'bg-slate-200 text-slate-600' : 'bg-white border border-slate-100 text-slate-400'}`}>
          {isUser ? '我' : '安'}
        </div>
        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-slate-800 text-slate-100 rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'}`}>
          {message.content}
        </div>
      </div>
    </div>
  );
};
export default ChatInterface;