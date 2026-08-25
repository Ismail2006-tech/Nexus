"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./doubts.module.css";
import { Send, User, Bot, Sparkles } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

export default function DoubtsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "ai",
      content: "Hi there! I'm your AI Placement Assistant. What concept are you struggling with today? E.g., 'What is Normalization in DBMS?' or 'Explain Binary Search'.",
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

    // Simulate AI delay and response for demo
    setTimeout(() => {
      const aiResponse = generateDemoResponse(userMsg.content);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponse,
      }]);
      setIsTyping(false);
    }, 2000);
  };

  const generateDemoResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes("normalization")) {
      return "Normalization in DBMS is the process of organizing data in a database. This includes creating tables and establishing relationships between those tables according to rules designed both to protect the data and to make the database more flexible by eliminating redundancy and inconsistent dependency.\n\nThe normal forms include:\n1. 1NF: Atomic values only\n2. 2NF: No partial dependency\n3. 3NF: No transitive dependency\n4. BCNF: Stricter version of 3NF.";
    }
    if (q.includes("polymorphism")) {
      return "Polymorphism in OOP refers to the ability of a variable, function or object to take on multiple forms. It allows methods to do different things based on the object it is acting upon, even though they share the same name.\n\nTwo main types:\n1. Compile-time (Method Overloading)\n2. Runtime (Method Overriding)";
    }
    if (q.includes("thread")) {
      return "A process is an executing instance of an application. A thread is a path of execution within a process.\n\nKey differences:\n- Processes do not share memory space natively, but threads share the memory space of their parent process.\n- Context switching between threads is faster than between processes.\n- Processes are heavyweight, threads are lightweight.";
    }
    return `That's a great question about "${query}". In a real environment, I would use an LLM API like Google Gemini to provide a detailed, step-by-step technical explanation, complete with code snippets if applicable, to help you prepare for your placement interview.`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Doubt Solver</h1>
        <p className={styles.subtitle}>Get instant explanations for any technical concept.</p>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.message} ${styles[msg.role]}`}>
              <div className={`${styles.avatar} ${styles[msg.role]}`}>
                {msg.role === "ai" ? <Sparkles size={20} /> : <User size={20} />}
              </div>
              <div className={styles.bubble} style={{ whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className={`${styles.message} ${styles.ai}`}>
              <div className={`${styles.avatar} ${styles.ai}`}>
                <Sparkles size={20} />
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
              placeholder="Ask anything... (e.g. What is normalization?)"
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
