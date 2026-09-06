import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Sparkles, BookOpen } from 'lucide-react';
import { mockCoachMessages, mockSuggestedPrompts } from '../data/mockData';

const mockResponses = [
  {
    text: "Based on your performance data and course materials, I recommend focusing on K-Maps today. Your mastery is 43% and it accounts for 32% of past paper questions.",
    sources: ['DLD Lecture 07 — K-Maps', 'DLD Final 2025']
  },
  {
    text: "Great question! I checked Dr. Ahmed Khan's past papers and Sequential Logic questions usually focus on flip-flop conversion. I've added a quick review session to your plan.",
    sources: ['Chapter 3 Notes — Sequential Logic']
  },
  {
    text: "You've been studying for 2 hours straight. Your analytics show your retention drops after 90 minutes. I suggest taking a 15-minute break now.",
    sources: []
  },
  {
    text: "I've analyzed your progress. You're doing excellent in Boolean Algebra (82% mastery). Let's shift some of that study time to weaker areas.",
    sources: []
  }
];

export default function AICoachPage() {
  const [messages, setMessages] = useState(mockCoachMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [responseIndex, setResponseIndex] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user', text, sources: [] }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = mockResponses[responseIndex % mockResponses.length];
      setResponseIndex(prev => prev + 1);
      setMessages([...newMessages, { role: 'assistant', text: response.text, sources: response.sources }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-6xl mx-auto card overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-[#ECECF2] p-5 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-[650] text-[#202033] tracking-[-0.035em] leading-[1.15] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[9px] bg-[#EEEAFE] text-[#6347F5] flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-[#6347F5]" />
            </div>
            AI Study Coach
          </h1>
          <p className="text-[13px] text-[#6F7182] mt-1">Your personal study strategist</p>
        </div>
        <div className="bg-[#F0ECFF] text-[#6347F5] px-3 py-1.5 rounded-[7px] text-[10px] font-[700] flex items-center gap-1.5 border border-[#EEEAFE]">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by RAG
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FCFCFE]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[82%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>

              {/* Avatar */}
              <div className="shrink-0 mt-0.5">
                {msg.role === 'assistant' ? (
                  <div className="w-8 h-8 bg-[#EEEAFE] text-[#6347F5] rounded-full flex items-center justify-center shadow-sm">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-[#6347F5] text-white rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col gap-1">
                {msg.role === 'assistant' && (
                  <span className="text-[11px] font-[600] text-[#9295A5] ml-1">Study Coach</span>
                )}
                <div className={`p-3.5 rounded-[10px] text-[13px] leading-[1.45] whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#6347F5] text-white rounded-tr-none'
                    : 'bg-white text-[#202033] border border-[#ECECF2] rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 ml-1">
                    <div className="text-[11px] font-[500] text-[#9295A5] mb-1.5 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      Based on your material:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((source, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-[#F0ECFF] text-[#6347F5] px-2 py-0.5 rounded-[6px] font-[600] border border-[#EEEAFE]">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#EEEAFE] text-[#6347F5] rounded-full flex items-center justify-center shadow-sm shrink-0">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="bg-white border border-[#ECECF2] rounded-[10px] rounded-tl-none p-3 shadow-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#9295A5] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#9295A5] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-[#9295A5] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="px-5 py-2.5 border-t border-[#ECECF2] bg-white overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex gap-2">
          {mockSuggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-[600] bg-[#FCFCFE] border border-[#ECECF2] text-[#6F7182] px-3 py-1.5 rounded-[8px] hover:bg-[#F0ECFF] hover:text-[#6347F5] hover:border-[#EEEAFE] transition-colors shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-[#ECECF2]">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask your coach anything..."
            className="flex-1 bg-[#FCFCFE] border border-[#ECECF2] rounded-[8px] px-3.5 py-2.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#6347F5] focus:border-transparent text-[#202033] placeholder-[#9498A8]"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="bg-[#6347F5] text-white px-4 py-2.5 rounded-[8px] hover:bg-[#5236E5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 cursor-pointer text-[12.5px] font-[700]"
          >
            <Send className="w-4 h-4 mr-1" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}