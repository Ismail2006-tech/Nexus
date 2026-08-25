"use client";

import { useState } from "react";

export default function NotificationToggles() {
  const [testReminders, setTestReminders] = useState(true);
  const [learningReminders, setLearningReminders] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontWeight: 500 }}>Test Reminders</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Weekly reminders to take mock tests.</p>
        </div>
        <div 
          onClick={() => setTestReminders(!testReminders)}
          style={{ 
            width: '40px', height: '24px', 
            background: testReminders ? 'var(--primary)' : 'var(--bg-secondary)', 
            border: testReminders ? 'none' : '1px solid var(--border-color)',
            borderRadius: '999px', position: 'relative', cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ 
            width: '18px', height: '18px', 
            background: testReminders ? 'white' : 'var(--text-secondary)', 
            borderRadius: '50%', position: 'absolute', top: testReminders ? '3px' : '2px', 
            right: testReminders ? '3px' : 'auto',
            left: testReminders ? 'auto' : '2px',
            transition: 'all 0.2s ease'
          }}></div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontWeight: 500 }}>Learning Reminders</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Reminders to complete your roadmap topics.</p>
        </div>
        <div 
          onClick={() => setLearningReminders(!learningReminders)}
          style={{ 
            width: '40px', height: '24px', 
            background: learningReminders ? 'var(--primary)' : 'var(--bg-secondary)', 
            border: learningReminders ? 'none' : '1px solid var(--border-color)',
            borderRadius: '999px', position: 'relative', cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ 
            width: '18px', height: '18px', 
            background: learningReminders ? 'white' : 'var(--text-secondary)', 
            borderRadius: '50%', position: 'absolute', top: learningReminders ? '3px' : '2px', 
            right: learningReminders ? '3px' : 'auto',
            left: learningReminders ? 'auto' : '2px',
            transition: 'all 0.2s ease'
          }}></div>
        </div>
      </div>
    </div>
  );
}
