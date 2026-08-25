import Link from "next/link";
import styles from "./tests.module.css";
import { Code, Database, Brain, Clock, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Mock Tests | NEXUS",
};

export default function TestsPage() {
  const tests = [
    {
      id: "dsa",
      title: "Data Structures & Algorithms",
      desc: "Arrays, Strings, Linked Lists, Trees, DP, and more.",
      icon: Code,
      difficulty: "Medium",
      questions: 10,
      time: "15 mins",
      colorClass: styles.medium
    },
    {
      id: "aptitude",
      title: "Quantitative Aptitude",
      desc: "Time & Work, Probability, Permutations, and general math.",
      icon: Brain,
      difficulty: "Hard",
      questions: 10,
      time: "20 mins",
      colorClass: styles.hard
    },
    {
      id: "core",
      title: "Core CS Subjects",
      desc: "DBMS, Operating Systems, Computer Networks.",
      icon: Database,
      difficulty: "Medium",
      questions: 15,
      time: "15 mins",
      colorClass: styles.medium
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mock Tests</h1>
        <p className={styles.subtitle}>Assess your placement readiness across various topics.</p>
      </div>

      <div className={styles.grid}>
        {tests.map((test) => {
          const Icon = test.icon;
          return (
            <div key={test.id} className={`card ${styles.testCard}`}>
              <div className={styles.cardHeader}>
                <div className={styles.testIcon}>
                  <Icon size={24} />
                </div>
                <div className={`${styles.difficulty} ${test.colorClass}`}>
                  {test.difficulty}
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3>{test.title}</h3>
                <p>{test.desc}</p>
                
                <div className={styles.metaInfo}>
                  <div className={styles.metaItem}>
                    <HelpCircle size={14} />
                    {test.questions} Qs
                  </div>
                  <div className={styles.metaItem}>
                    <Clock size={14} />
                    {test.time}
                  </div>
                </div>
              </div>

              <Link href={`/tests/${test.id}`} className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }}>
                Start Test
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
