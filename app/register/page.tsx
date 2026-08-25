"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../auth.module.css";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    branch: "",
    yearOfStudy: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          college: formData.college,
          branch: formData.branch,
          yearOfStudy: formData.yearOfStudy,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`card ${styles.authCard}`} style={{ maxWidth: '600px' }}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join NEXUS and start your placement journey</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className={styles.inputGroup}>
              <label className="input-label" htmlFor="name">Full Name</label>
              <input id="name" type="text" className="input-field" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className={styles.inputGroup}>
              <label className="input-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input-field" placeholder="you@college.edu" value={formData.email} onChange={handleChange} required />
            </div>

            <div className={styles.inputGroup}>
              <label className="input-label" htmlFor="password">Password</label>
              <input id="password" type="password" className="input-field" placeholder="••••••••" value={formData.password} onChange={handleChange} required minLength={6} />
            </div>
            
            <div className={styles.inputGroup}>
              <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" type="password" className="input-field" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required minLength={6} />
            </div>

            <div className={styles.inputGroup}>
              <label className="input-label" htmlFor="college">College/University</label>
              <input id="college" type="text" className="input-field" placeholder="NIT / IIT / University" value={formData.college} onChange={handleChange} required />
            </div>

            <div className={styles.inputGroup}>
              <label className="input-label" htmlFor="branch">Degree / Branch</label>
              <input id="branch" type="text" className="input-field" placeholder="B.Tech Computer Science" value={formData.branch} onChange={handleChange} required />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label className="input-label" htmlFor="yearOfStudy">Year of Study</label>
            <select id="yearOfStudy" className="input-field" value={formData.yearOfStudy} onChange={handleChange} required style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <option value="" disabled>Select your year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? "Creating account..." : (
                <>
                  <UserPlus size={18} style={{ marginRight: '8px' }} />
                  Register
                </>
              )}
            </button>
          </div>
        </form>

        <div className={styles.footer}>
          Already have an account? <Link href="/login" className={styles.link}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
