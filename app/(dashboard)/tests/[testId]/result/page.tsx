import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "../../tests.module.css";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

export default async function ResultPage({ searchParams }: { searchParams: { id: string } }) {
  const session = await auth();
  
  // Need to await searchParams in Next 15+
  const resolvedParams = await searchParams;
  
  if (!resolvedParams.id || !session?.user?.id) {
    redirect("/tests");
  }

  const result = await db.testResult.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!result || result.userId !== session.user.id) {
    redirect("/tests");
  }

  const timeMinutes = Math.floor(result.timeTaken / 60);
  const timeSeconds = result.timeTaken % 60;
  const timeString = `${timeMinutes}m ${timeSeconds}s`;

  return (
    <div className={styles.testInterface}>
      <Link href="/tests" className="btn btn-outline" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={16} style={{marginRight:'8px'}} /> Back to Tests
      </Link>

      <div className={`card ${styles.resultCard}`}>
        <h1 style={{ marginBottom: '2rem' }}>{result.category} Result</h1>

        <div className={styles.scoreCircle} style={{ '--percentage': `${result.percentage}%` } as React.CSSProperties}>
          <div className={styles.scoreValue}>{result.percentage.toFixed(0)}%</div>
          <div className={styles.scoreLabel}>Score</div>
        </div>

        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Correct</div>
            <div className={styles.statValue} style={{color: 'var(--success)'}}>
              <CheckCircle size={18} style={{display:'inline', marginRight:'4px'}} />
              {result.score}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Incorrect</div>
            <div className={styles.statValue} style={{color: 'var(--danger)'}}>
              <XCircle size={18} style={{display:'inline', marginRight:'4px'}} />
              {result.total - result.score}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Time Taken</div>
            <div className={styles.statValue}>{timeString}</div>
          </div>
        </div>

        <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>
          {result.percentage >= 70 ? 
            "Great job! You have a solid understanding of this topic." : 
            "Keep practicing. Review the concepts and try again."}
        </p>

        <Link href="/tests" className="btn btn-primary">
          Take Another Test
        </Link>
      </div>
    </div>
  );
}
