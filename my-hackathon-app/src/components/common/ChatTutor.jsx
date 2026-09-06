import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Mic, MoreVertical, Paperclip, Bot } from 'lucide-react';

const ONBOARDING_QUESTIONS = [
  'Which university are you studying at?',
  "Who's your teacher/instructor for this subject?",
  'Which semester/year are you in?',
  'Which subject do you want to study today?',
  'Want to upload your notes or slides? (Optional)'
];

export default function ChatTutor() {
  const [messages, setMessages] = useState([{ role: 'assistant', text: ONBOARDING_QUESTIONS[0] }]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [studentContext, setStudentContext] = useState({
    university: '', teacher: '', semester: '', subject: '', notesFileName: ''
  });

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSubmit = input) => {
    if (!textToSubmit.trim() && step !== 4) return;

    const userText = textToSubmit.trim();
    setMessages((prev) => [...prev, {
      role: 'user',
      text: userText || (step === 4 ? 'Skipped upload' : '')
    }]);
    setInput('');

    if (step < ONBOARDING_QUESTIONS.length) {
      const keys = ['university', 'teacher', 'semester', 'subject', 'notesFileName'];
      const nextContext = { ...studentContext, [keys[step]]: userText };
      setStudentContext(nextContext);

      const nextStep = step + 1;
      setStep(nextStep);

      setTimeout(() => {
        if (nextStep < ONBOARDING_QUESTIONS.length) {
          setMessages((prev) => [...prev, { role: 'assistant', text: ONBOARDING_QUESTIONS[nextStep] }]);
        } else {
          setMessages((prev) => [...prev, {
            role: 'assistant',
            text: `Great! I'm ready to help you with ${nextContext.subject || userText}. What would you like to know?`
          }]);
        }
      }, 500);
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Missing API Key. Please add VITE_GEMINI_API_KEY to your environment variables.');

      const systemPrompt = `You are an expert AI study buddy. You are currently helping a ${studentContext.semester} student at ${studentContext.university}. Their teacher is ${studentContext.teacher} and they are studying ${studentContext.subject}. Keep answers concise, encouraging, and highly relevant to this context.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: { text: systemPrompt } },
            contents: [{ role: 'user', parts: [{ text: userText }] }]
          })
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiText) throw new Error('The AI returned an empty response.');
      setMessages((prev) => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: `⚠️ Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) handleSend(`Uploaded: ${file.name}`);
  };

  return (
    <section className="card ai-card">
      <div className="ai-header">
        <div>
          <div className="ai-title"><h2>AI Study Coach</h2><span>Beta</span></div>
          <p>Your AI study buddy. Ask anything!</p>
        </div>
        <MoreVertical size={16} />
      </div>

      <div className="ai-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-row ${msg.role}`}>
            {msg.role === 'assistant' && (
              <span className="assistant-avatar"><Bot size={14} /></span>
            )}
            <div className={`chat-bubble ${msg.role}`}>{msg.text}</div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-row assistant">
            <span className="assistant-avatar"><Sparkles size={14} /></span>
            <div className="chat-bubble assistant typing"><i /><i /><i /></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {step >= ONBOARDING_QUESTIONS.length && (
        <div className="quick-replies">
          {['Give me an example', 'Make it even simpler', 'Related practice questions'].map((chip) => (
            <button key={chip} type="button" onClick={() => handleSend(chip)}>{chip}</button>
          ))}
        </div>
      )}

      <div className="ai-input-wrap">
        <div className="ai-input">
          <input
            type="text"
            placeholder={step === 4 ? 'Upload file or press enter to skip' : 'Ask anything...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            aria-label="Ask AI Study Coach"
          />
          {step === 4 && (
            <>
              <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden-file" accept=".pdf,.doc,.docx,.ppt,.pptx" />
              <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Attach file"><Paperclip size={14} /></button>
            </>
          )}
          <button type="button" aria-label="Voice input"><Mic size={14} /></button>
          <button type="button" className="send-btn" onClick={() => handleSend()} aria-label="Send"><Send size={14} /></button>
        </div>
      </div>
    </section>
  );
}
