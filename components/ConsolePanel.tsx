import React, { useEffect, useRef } from 'react';
import { LogMessage } from '../types';
import { Terminal, DollarSign, MessageSquare } from 'lucide-react';

interface ConsolePanelProps {
  logs: LogMessage[];
}

const ConsolePanel: React.FC<ConsolePanelProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'A2A': return <MessageSquare size={12} className="text-walrus-purple" />;
      case 'WALRUS': return <DollarSign size={12} className="text-walrus-purple" />;
      case 'COMMANDER': return <span className="text-walrus-purple font-bold">📋</span>;
      default: return <Terminal size={12} className="text-gray-400" />;
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-gradient-to-br from-black via-walrus-teal/5 to-black border-t border-walrus-teal/20 font-mono text-xs overflow-hidden">
      {/* Ocean Wave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-walrus-purple/20 to-transparent"></div>
      </div>
      <div className="relative flex items-center px-4 py-2 bg-gradient-to-r from-walrus-teal/10 to-walrus-purple/5 border-b border-walrus-teal/20 backdrop-blur-sm z-10">
        <span className="text-walrus-teal font-bold mr-2 drop-shadow-glow">🐋 WALRUS://KERNEL_LOGS</span>
        <div className="flex-1"></div>
        <div className="flex gap-2">
           <span className="flex items-center gap-1 text-gray-500"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> LIVE</span>
        </div>
      </div>
      
      <div className="relative flex-1 overflow-y-auto p-4 space-y-1.5 z-10">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 group hover:bg-gradient-to-r hover:from-walrus-teal/10 hover:to-transparent p-2 rounded-lg transition-all duration-300 border border-transparent hover:border-walrus-teal/20">
            <span className="text-gray-500 min-w-[60px]">{log.timestamp}</span>
            <div className="mt-0.5">{getIcon(log.type)}</div>
            <span className={`
              ${log.type === 'WALRUS' ? 'text-walrus-purple' : ''}
              ${log.type === 'A2A' ? 'text-blue-300' : ''}
              ${log.type === 'COMMANDER' ? 'text-[#99efe4] font-bold' : ''}
              ${log.type === 'SYSTEM' ? 'text-gray-300' : ''}
              break-all
            `}>
              {log.content}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ConsolePanel;