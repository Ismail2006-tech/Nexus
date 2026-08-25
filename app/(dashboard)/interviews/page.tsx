"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../doubts/doubts.module.css";
import { Send, User, Users, Briefcase, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

export default function InterviewsPage() {
  const router = useRouter();
  const [type, setType] = useState<"HR Technical Round" | "HR Interview" | "Mixed" | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [qCount, setQCount] = useState(0);
  const [report, setReport] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleStart = (selectedType: "HR Technical Round" | "HR Interview" | "Mixed") => {
    setType(selectedType);
    let initialMsg = "";
    if (selectedType === "HR Technical Round") {
      initialMsg = "Hello! I am your Technical Interviewer. We will be focusing strictly on your technical knowledge today.\n\nTo start, can you explain the architecture of a recent technical project you've built?";
    } else if (selectedType === "HR Interview") {
      initialMsg = "Welcome! I am your HR Interviewer. Today we'll discuss your background, teamwork, and career goals.\n\nTo begin, please tell me a little bit about yourself and your strengths.";
    } else {
      initialMsg = "Hello! I will be your interviewer for this Mixed Placement round, covering both technical and behavioral questions.\n\nLet's start with an introduction: tell me about yourself and your background.";
    }
    setMessages([{ id: "1", role: "ai", content: initialMsg }]);
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

    if (qCount >= 2) {
      // End interview after 3 interactions
      setTimeout(async () => {
        setIsTyping(false);
        const demoReport = {
          type,
          overallScore: 85,
          communication: 90,
          technical: 80,
          confidence: 85,
          feedbackReport: "You communicated your ideas clearly. Your technical knowledge on basic concepts is solid, but you should practice system design questions more.",
          weakAreas: "System Design, Deep dives into underlying implementations",
          strongAreas: "Communication, Core OOP principles",
        };
        
        try {
          await fetch("/api/interviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(demoReport),
          });
        } catch (err) {}
        
        setReport(demoReport);
      }, 2000);
      return;
    }

    // Continue interview
    setTimeout(() => {
      let nextQ = "";
      if (type === "HR Technical Round") {
        if (qCount === 0) nextQ = "That's an interesting architecture. Now, let's talk about Data Structures. How would you choose between an Array and a Linked List for a problem requiring frequent insertions and deletions?";
        else nextQ = "Good explanation. Finally, what is the exact difference between an Abstract Class and an Interface in Object-Oriented Programming, and when would you use each?";
      } else if (type === "HR Interview") {
        if (qCount === 0) nextQ = "Thank you for sharing that. Can you tell me about a time you faced a difficult conflict with a team member and how you resolved it?";
        else nextQ = "I see. Where do you see yourself in 5 years, and why do you believe our company is the right fit for your career goals?";
      } else {
        if (qCount === 0) nextQ = "That's interesting. On the technical side, can you explain the concept of Database Normalization and why it is important?";
        else nextQ = "Good. Lastly, how do you handle pressure when multiple project deadlines are approaching at the same time?";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: nextQ,
      }]);
      setQCount(prev => prev + 1);
      setIsTyping(false);
    }, 2000);
  };

  if (report) {
    return (
      <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <FileText size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h1 style={{ fontFamily: 'var(--font-heading)' }}>Interview Report</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Overall Score: {report.overallScore}/100</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Metrics</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Communication: {report.communication}/100</span>
                <span>Technical: {report.technical}/100</span>
                <span>Confidence: {report.confidence}/100</span>
              </div>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Feedback</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{report.feedbackReport}</p>
            </div>
            
            <button className="btn btn-primary" onClick={() => router.push('/dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  if (!type) {
    return (
      <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '700px', width: '100%', padding: '3rem', textAlign: 'center' }}>
          <Briefcase size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
          <h1 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Mock Interviews</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
            Practice your interview skills with an AI interviewer. Receive detailed feedback on your communication, technical knowledge, and confidence.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <button className="btn btn-outline" style={{ height: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }} onClick={() => handleStart('HR Technical Round')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}><Users size={20} /> HR Technical Round</div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Practice technical placement questions covering programming, DSA, Core CS, projects, and problem solving.</span>
            </button>
            <button className="btn btn-outline" style={{ height: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }} onClick={() => handleStart('HR Interview')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}><Users size={20} /> HR Interview</div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Practice behavioral and HR questions focused on communication, confidence, teamwork, and career readiness.</span>
            </button>
            <button className="btn btn-primary" style={{ height: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }} onClick={() => handleStart('Mixed')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}><Users size={20} /> Mixed</div>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Experience a complete placement interview combining technical and HR questions.</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Interview: {type} Round</h1>
        <p className={styles.subtitle}>Answer naturally. The AI will evaluate your responses.</p>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.message} ${styles[msg.role]}`}>
              <div className={`${styles.avatar} ${styles[msg.role]}`}>
                {msg.role === "ai" ? <Briefcase size={20} /> : <User size={20} />}
              </div>
              <div className={styles.bubble} style={{ whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className={`${styles.message} ${styles.ai}`}>
              <div className={`${styles.avatar} ${styles.ai}`}>
                <Briefcase size={20} />
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
