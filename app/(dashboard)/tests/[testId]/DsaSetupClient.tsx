"use client";

import { useState } from "react";
import TestClient from "./TestClient";
import styles from "../tests.module.css";
import { Code2, Braces, TerminalSquare, ArrowRight, ArrowLeft } from "lucide-react";

export default function DsaSetupClient({ testId }: { testId: string }) {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [testType, setTestType] = useState("");

  const [setupComplete, setSetupComplete] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);
  
  const handleComplete = () => {
    setSetupComplete(true);
  };

  if (setupComplete) {
    // Generate language specific dummy data based on selection
    const generateLanguageSpecificCode = () => {
      if (language === "Python") return `def binary_search(arr, target):\n    # Python syntax\n    pass`;
      if (language === "Java") return `public static int binarySearch(int[] arr, int target) {\n    // Java syntax\n    return -1;\n}`;
      if (language === "C") return `int binarySearch(int arr[], int n, int target) {\n    // C syntax\n    return -1;\n}`;
      return "";
    };

    const customizedTestData = {
      title: `DSA with ${language} - ${topic}`,
      questions: [
        { 
          q: `What is the time complexity of this ${language} algorithm?\n\n${generateLanguageSpecificCode()}`, 
          options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], 
          correct: 1 
        },
        { 
          q: `Which ${language} collection is best for LIFO operations in ${topic}?`, 
          options: ["Queue", "Tree/Map", "Stack/List", "Graph"], 
          correct: 2 
        },
        { 
          q: `In ${language}, what is the worst-case time for QuickSort?`, 
          options: ["O(n log n)", "O(n^2)", "O(n)", "O(1)"], 
          correct: 1 
        },
      ]
    };

    return <TestClient testId={testId} testData={customizedTestData} />;
  }

  return (
    <div className={styles.container} style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <div className={styles.header} style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className={styles.title}>DSA Test Setup</h1>
        <p className={styles.subtitle}>Configure your practice environment.</p>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '2rem', justifyContent: 'center' }}>
          {[1, 2, 3, 4].map(num => (
            <div 
              key={num} 
              style={{ 
                height: '6px', 
                width: '60px', 
                borderRadius: '4px', 
                background: step >= num ? 'var(--primary)' : 'var(--bg-secondary)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Choose Your Programming Language</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <button 
                className={`btn ${language === 'Python' ? 'btn-primary' : 'btn-outline'}`}
                style={{ height: '140px', flexDirection: 'column', gap: '1rem', border: language === 'Python' ? '2px solid var(--primary)' : '' }}
                onClick={() => setLanguage('Python')}
              >
                <TerminalSquare size={32} />
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Python</span>
              </button>
              <button 
                className={`btn ${language === 'Java' ? 'btn-primary' : 'btn-outline'}`}
                style={{ height: '140px', flexDirection: 'column', gap: '1rem', border: language === 'Java' ? '2px solid var(--primary)' : '' }}
                onClick={() => setLanguage('Java')}
              >
                <Code2 size={32} />
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Java</span>
              </button>
              <button 
                className={`btn ${language === 'C' ? 'btn-primary' : 'btn-outline'}`}
                style={{ height: '140px', flexDirection: 'column', gap: '1rem', border: language === 'C' ? '2px solid var(--primary)' : '' }}
                onClick={() => setLanguage('C')}
              >
                <Braces size={32} />
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>C</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Select DSA Topic</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {["Arrays", "Strings", "Linked Lists", "Stacks", "Queues", "Trees", "Graphs", "Dynamic Programming", "All Topics"].map(t => (
                <button 
                  key={t}
                  className={`btn ${topic === t ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '1rem', textAlign: 'center' }}
                  onClick={() => setTopic(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Select Difficulty</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
              {["Easy", "Medium", "Hard", "Mixed Difficulty"].map(d => (
                <button 
                  key={d}
                  className={`btn ${difficulty === d ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '1.25rem' }}
                  onClick={() => setDifficulty(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Select Test Type</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
              {[
                { name: "Topic-wise Test", desc: "Questions from one selected DSA topic." },
                { name: "Full DSA Test", desc: "Questions covering multiple DSA topics." },
                { name: "Coding Challenge", desc: "Programming-based DSA problems." },
                { name: "Company-style Test", desc: "Placement-oriented DSA questions." }
              ].map(tt => (
                <button 
                  key={tt.name}
                  className={`btn ${testType === tt.name ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}
                  onClick={() => setTestType(tt.name)}
                >
                  <span style={{ fontWeight: 600 }}>{tt.name}</span>
                  <span style={{ fontSize: '0.85rem', color: testType === tt.name ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' }}>{tt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            className="btn btn-outline" 
            onClick={handlePrev}
            style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
          >
            <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back
          </button>
          
          {step < 4 ? (
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={(step === 1 && !language) || (step === 2 && !topic) || (step === 3 && !difficulty)}
            >
              Continue <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleComplete}
              disabled={!testType}
            >
              Start {language} Test <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
