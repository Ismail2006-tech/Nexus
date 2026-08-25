import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import styles from "./dashboard.module.css";
import { Search, Bot, FileText, Volume2, Mic, Settings, Maximize, Activity, Target } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  // Fetch real data from DB
  const profile = await db.profile.findUnique({
    where: { userId: user?.id },
  });

  const testResults = await db.testResult.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const interviewResults = await db.interviewResult.findMany({
    where: { userId: user?.id },
  });

  // Calculate metrics
  const readinessScore = profile?.placementReadiness || 68;
  const testsTaken = testResults.length;
  const interviewsTaken = interviewResults.length;
  const weakTopics = ["System Design", "DP", "OS"]; // Simulated anomalies

  return (
    <div className={styles.container}>
      {/* Sentinel Top Bar */}
      <div className={styles.sentinelBar}>
        <div className={styles.controls}>
          <button className={styles.controlBtn}>
            <Maximize size={16} /> Quick Review
          </button>
          <button className={styles.controlBtn}>
            <Activity size={16} /> Performance Overlay
          </button>
          <button className={`${styles.controlBtn} ${styles.active}`}>
            <Target size={16} /> Target Companies HUD
          </button>
        </div>

        <div className={styles.searchBar}>
          <input 
            type="text" 
            placeholder="Ask AI: e.g. 'Generate a mock test for Database Normalization'"
            className={styles.searchInput}
          />
        </div>

        <div className={styles.controls}>
          <Link href="/interviews" className={styles.actionBtn}>
            <Bot size={16} /> AI Interview
          </Link>
          <button className={styles.controlBtn}>
            <FileText size={16} /> Generate Report
          </button>
        </div>

        <div className={styles.controls} style={{ marginLeft: '1rem', gap: '0.5rem' }}>
          <button className={styles.controlBtn} style={{ padding: '0.5rem' }}><Volume2 size={16} /></button>
          <button className={styles.controlBtn} style={{ padding: '0.5rem' }}><Mic size={16} /></button>
          <button className={styles.controlBtn} style={{ padding: '0.5rem' }}><Settings size={16} /></button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricBox}>
          <div className={styles.metricTitle}>Placement Readiness</div>
          <div className={`${styles.metricValue} ${styles.green}`}>
            {readinessScore}%
          </div>
          <div className={styles.metricSub}>+1.2% vs last week</div>
        </div>

        <div className={styles.metricBox}>
          <div className={styles.metricTitle}>Total Problems Solved</div>
          <div className={`${styles.metricValue} ${styles.cyan}`}>
            {testsTaken * 10 || 120}
          </div>
          <div className={styles.metricSub}>Across all topics</div>
        </div>

        <div className={styles.metricBox}>
          <div className={styles.metricTitle}>Weak Topics Detected</div>
          <div className={`${styles.metricValue} ${styles.red}`}>
            {weakTopics.length}
          </div>
          <div className={styles.metricSub}>{weakTopics.join(", ")}</div>
        </div>

        <div className={styles.metricBox}>
          <div className={styles.metricTitle}>AI Interviews Practiced</div>
          <div className={styles.metricValue}>
            {interviewsTaken}
          </div>
          <div className={styles.metricSub}>Next recommended: HR Round</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartBox}>
          <div className={styles.chartTitle}>Readiness Trend (Last 7 Days)</div>
          
          <div className={styles.lineGraph}>
            {/* CSS Mock Graph */}
            <div className={styles.graphPoint} style={{ left: '10%', bottom: '20%' }} />
            <div className={styles.graphLine} style={{ left: '10%', bottom: '20%', width: '15%', transform: 'rotate(-15deg)' }} />
            
            <div className={styles.graphPoint} style={{ left: '25%', bottom: '30%' }} />
            <div className={styles.graphLine} style={{ left: '25%', bottom: '30%', width: '15%', transform: 'rotate(5deg)' }} />
            
            <div className={styles.graphPoint} style={{ left: '40%', bottom: '28%' }} />
            <div className={styles.graphLine} style={{ left: '40%', bottom: '28%', width: '15%', transform: 'rotate(-20deg)' }} />
            
            <div className={styles.graphPoint} style={{ left: '55%', bottom: '45%' }} />
            <div className={styles.graphLine} style={{ left: '55%', bottom: '45%', width: '15%', transform: 'rotate(10deg)' }} />
            
            <div className={styles.graphPoint} style={{ left: '70%', bottom: '40%' }} />
            <div className={styles.graphLine} style={{ left: '70%', bottom: '40%', width: '15%', transform: 'rotate(-25deg)' }} />
            
            <div className={styles.graphPoint} style={{ left: '85%', bottom: '60%' }} />
          </div>
          <div className={styles.graphLabels}>
            <span>09:00</span>
            <span>10:00</span>
            <span>11:00</span>
            <span>12:00</span>
            <span>13:00</span>
            <span>14:00</span>
          </div>
        </div>

        <div className={styles.chartBox}>
          <div className={styles.chartTitle}>Topic Distribution</div>
          <div className={styles.doughnutContainer}>
            <div className={styles.doughnut}>
              <div className={styles.doughnutHole}></div>
            </div>
          </div>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: '#ff3366' }}></div> DSA
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: '#ff9900' }}></div> Core CS
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: '#00f0ff' }}></div> Aptitude
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: '#8b5cf6' }}></div> Projects
            </div>
          </div>
        </div>

        <div className={styles.chartBox}>
          <div className={styles.chartTitle}>Daily Activity Frequency</div>
          <div className={styles.barChart}>
            <div className={styles.bar} style={{ height: '30%' }}></div>
            <div className={styles.bar} style={{ height: '50%' }}></div>
            <div className={styles.bar} style={{ height: '80%' }}></div>
            <div className={styles.bar} style={{ height: '40%' }}></div>
            <div className={styles.bar} style={{ height: '70%' }}></div>
            <div className={styles.bar} style={{ height: '20%' }}></div>
          </div>
          <div className={styles.graphLabels} style={{ marginTop: '5px' }}>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
