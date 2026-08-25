"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../doubts/doubts.module.css";
import { Send, User, Brain, Sparkles } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

export default function TutorPage() {
  const [topic, setTopic] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setHasStarted(true);
    setMessages([
      {
        id: "1",
        role: "ai",
        content: `Great! Let's learn about ${topic}. I'll explain the concept and then ask you a few questions to test your understanding.\n\nTo begin, what do you already know about ${topic}?`,
      }
    ]);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `That's a good start! In professional terms, ${topic} is an important concept in Computer Science often asked in interviews.\n\nHere is a practice question for you: Can you write a small pseudo-code or explain the core algorithm behind it?`,
      }]);
      setIsTyping(false);
    }, 2500);
  };

  if (!hasStarted) {
    return (
      <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '3rem', textAlign: 'center' }}>
          <Brain size={48} color="var(--secondary)" style={{ marginBottom: '1.5rem' }} />
          <h1 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>AI Tutor</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
            Enter a topic you want to learn. The AI Tutor will guide you, ask questions, and evaluate your knowledge.
          </p>
          
          <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'left' }}>
              <label className="input-label">Topic</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Binary Search, React Hooks, DNS" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Start Learning Session</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Tutor: {topic}</h1>
        <p className={styles.subtitle}>Conversational learning session.</p>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.message} ${styles[msg.role]}`}>
              <div className={`${styles.avatar} ${styles[msg.role]}`}>
                {msg.role === "ai" ? <Brain size={20} /> : <User size={20} />}
              </div>
              <div className={styles.bubble} style={{ whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className={`${styles.message} ${styles.ai}`}>
              <div className={`${styles.avatar} ${styles.ai}`}>
                <Brain size={20} />
              </div>
              <div className={styles.bubble}>
                <div className={styles.typingIndicator}>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <form onSubmit={handleSend} className={styles.inputForm}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              className={styles.inputField}
            />
            <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isTyping}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
