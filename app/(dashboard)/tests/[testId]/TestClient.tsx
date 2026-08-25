"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../tests.module.css";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";

interface TestData {
  title: string;
  questions: {
    q: string;
    options: string[];
    correct: number;
  }[];
}

export default function TestClient({ testId, testData }: { testId: string, testData: TestData }) {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelect = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQ]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    
    // Calculate score
    let score = 0;
    testData.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) score++;
    });

    try {
      const res = await fetch("/api/tests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: testData.title,
          score,
          total: testData.questions.length,
          timeTaken: (15 * 60) - timeLeft,
        }),
      });
      
      const data = await res.json();
      router.push(`/tests/${testId}/result?id=${data.resultId}`);
    } catch (err) {
      console.error("Submission failed");
      setSubmitting(false);
    }
  };

  const q = testData.questions[currentQ];

  return (
    <div className={styles.testInterface}>
      <div className={styles.testHeader}>
        <div>
          <h2 style={{margin:0}}>{testData.title}</h2>
          <p style={{color:'var(--text-secondary)', fontSize:'0.9rem', marginTop:'4px'}}>Answer all questions. You can go back and review.</p>
        </div>
        <div className={styles.timer}>
          <Clock size={20} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className={`card ${styles.questionCard}`}>
        <div className={styles.questionNumber}>Question {currentQ + 1} of {testData.questions.length}</div>
        <div className={styles.questionText}>{q.q}</div>

        <div className={styles.optionsGrid}>
          {q.options.map((opt, idx) => (
            <div 
              key={idx}
              className={`${styles.option} ${answers[currentQ] === idx ? styles.selected : ''}`}
              onClick={() => handleSelect(idx)}
            >
              <div className={styles.optionCircle}></div>
              {opt}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.testFooter}>
        <button 
          className="btn btn-outline" 
          onClick={() => setCurrentQ(prev => prev - 1)}
          disabled={currentQ === 0}
        >
          <ArrowLeft size={16} style={{marginRight:'8px'}} /> Previous
        </button>

        {currentQ < testData.questions.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setCurrentQ(prev => prev + 1)}>
            Next <ArrowRight size={16} style={{marginLeft:'8px'}} />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        )}
      </div>
    </div>
  );
}
