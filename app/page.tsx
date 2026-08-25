import Link from "next/link";
import styles from "./page.module.css";
import { Brain, Code, Target, MessageSquare, Briefcase, Calendar } from "lucide-react";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>NEXUS</div>
        <div className={styles.navLinks}>
          <Link href="/login" className="btn btn-outline">
            Login
          </Link>
          <Link href="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      <main className={styles.hero}>
        <div className={styles.heroBadge}>✨ The #1 AI-Powered Placement Platform</div>
        <h1 className={styles.title}>
          Prepare smarter. <br />
          Learn faster. <br />
          <span className={styles.highlight}>Get placement ready.</span>
        </h1>
        <p className={styles.subtitle}>
          Your all-in-one personalized dashboard for mock tests, AI tutor guidance, doubt solving, and structured placement roadmaps.
        </p>
        <div className={styles.ctaGroup}>
          <Link href="/register" className={`btn btn-primary ${styles.ctaBtn}`}>
            Start Your Journey
          </Link>
          <Link href="#features" className={`btn btn-outline ${styles.ctaBtn}`}>
            Explore Features
          </Link>
        </div>
      </main>

      <section id="features" className={styles.features}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>Everything you need to succeed</h2>
          <p className={styles.featuresSubtitle}>A complete ecosystem tailored for college students.</p>
        </div>

        <div className={styles.grid}>
          <div className={`card ${styles.featureCard}`}>
            <div className={styles.iconWrapper}>
              <Target size={28} />
            </div>
            <h3 className={styles.featureTitle}>Structured Roadmaps</h3>
            <p className={styles.featureDesc}>
              Follow a step-by-step personalized guide from fundamentals to core CS and interview prep.
            </p>
          </div>

          <div className={`card ${styles.featureCard}`}>
            <div className={styles.iconWrapper}>
              <MessageSquare size={28} />
            </div>
            <h3 className={styles.featureTitle}>AI Doubt Solver</h3>
            <p className={styles.featureDesc}>
              Stuck on a concept? Ask our specialized AI to get simple, detailed explanations instantly.
            </p>
          </div>

          <div className={`card ${styles.featureCard}`}>
            <div className={styles.iconWrapper}>
              <Brain size={28} />
            </div>
            <h3 className={styles.featureTitle}>Interactive AI Tutor</h3>
            <p className={styles.featureDesc}>
              Learn complex topics conversationally. The tutor asks you questions and evaluates your knowledge.
            </p>
          </div>

          <div className={`card ${styles.featureCard}`}>
            <div className={styles.iconWrapper}>
              <Code size={28} />
            </div>
            <h3 className={styles.featureTitle}>Mock Tests</h3>
            <p className={styles.featureDesc}>
              Practice with timed assessments in DSA, Aptitude, Core CS, and get deep performance analytics.
            </p>
          </div>

          <div className={`card ${styles.featureCard}`}>
            <div className={styles.iconWrapper}>
              <Briefcase size={28} />
            </div>
            <h3 className={styles.featureTitle}>AI Mock Interviews</h3>
            <p className={styles.featureDesc}>
              Simulate Technical and HR interviews. Receive instant feedback on your communication and technical accuracy.
            </p>
          </div>

          <div className={`card ${styles.featureCard}`}>
            <div className={styles.iconWrapper}>
              <Calendar size={28} />
            </div>
            <h3 className={styles.featureTitle}>Placement Events</h3>
            <p className={styles.featureDesc}>
              Stay updated with upcoming drives, dates, and locations so you never miss an opportunity.
            </p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 NEXUS Placement Preparation Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
