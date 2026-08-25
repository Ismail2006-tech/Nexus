"use client";

import { useState, useEffect } from "react";
import { Search, Lightbulb, Save, X, ExternalLink, Bookmark, CheckCircle2 } from "lucide-react";
import styles from "./projects.module.css";

// CSS will be inline or in module. Let's use global classes where possible and inline for specifics.

export default function ProjectsPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [viewingSaved, setViewingSaved] = useState(false);

  useEffect(() => {
    fetchSavedProjects();
  }, []);

  const fetchSavedProjects = async () => {
    try {
      const res = await fetch("/api/projects/save");
      if (res.ok) {
        const data = await res.json();
        setSavedProjects(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setViewingSaved(false);
    try {
      const res = await fetch("/api/projects/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain })
      });
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = async (project: any) => {
    try {
      const res = await fetch("/api/projects/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: { ...project, domain } })
      });
      if (res.ok) {
        fetchSavedProjects();
        alert("Project Saved!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const suggestedDomains = [
    "Artificial Intelligence", "Machine Learning", "Web Development", 
    "Data Science", "Cyber Security", "Cloud Computing"
  ];

  const filteredProjects = projects.filter(p => p.level === activeTab);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <Lightbulb size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem auto' }} />
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.5rem' }}>Find Projects Based on Your Domain</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Enter your domain or area of interest and discover projects you can build to boost your portfolio.
        </p>

        <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field"
              placeholder="e.g. Machine Learning, Python, Full Stack..."
              style={{ paddingLeft: '3rem', width: '100%', background: 'rgba(255,255,255,0.03)' }}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading || !domain.trim()}>
            {loading ? "Generating..." : "Find Projects"}
          </button>
        </form>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          {suggestedDomains.map(d => (
            <div 
              key={d} 
              style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={() => { setDomain(d); }}
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {(["Beginner", "Intermediate", "Advanced"] as const).map(level => (
            <button
              key={level}
              className={`btn ${activeTab === level && !viewingSaved ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => { setActiveTab(level); setViewingSaved(false); }}
            >
              {level}
            </button>
          ))}
        </div>
        <button 
          className={`btn ${viewingSaved ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setViewingSaved(true)}
        >
          <Bookmark size={16} style={{ marginRight: '8px' }} />
          My Saved Projects ({savedProjects.length})
        </button>
      </div>

      {!viewingSaved && projects.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredProjects.map((proj, i) => (
            <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: `4px solid var(--primary)` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>{proj.name}</h3>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '999px', fontWeight: 600 }}>
                  {proj.difficulty}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {proj.shortDescription}
              </p>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Technologies:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {proj.technologies?.slice(0,3).map((t: string) => (
                    <span key={t} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>{t}</span>
                  ))}
                  {proj.technologies?.length > 3 && <span style={{ fontSize: '0.75rem', padding: '0.25rem' }}>+{proj.technologies.length - 3}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Placement Value: <strong style={{ color: '#00ffaa' }}>{proj.placementValue}</strong>
                </div>
                <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setSelectedProject(proj)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingSaved && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {savedProjects.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>You haven't saved any projects yet.</p>
          ) : (
            savedProjects.map((sp, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>{sp.projectName}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{sp.level}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{sp.description}</p>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#00ffaa' }}>Status: {sp.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '2rem' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '0' }}>
            
            <div style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {selectedProject.name}
                  <span style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '999px', fontWeight: 'normal' }}>
                    {selectedProject.level}
                  </span>
                </h2>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', gap: '1.5rem' }}>
                  <span>Difficulty: <strong style={{color: '#fff'}}>{selectedProject.difficulty}</strong></span>
                  <span>Time: <strong style={{color: '#fff'}}>{selectedProject.estimatedTime}</strong></span>
                  <span>Placement Value: <strong style={{color: '#00ffaa'}}>{selectedProject.placementValue}</strong></span>
                </div>
              </div>
              <button onClick={() => setSelectedProject(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Overview</h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedProject.overview}</p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>The Problem</h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedProject.problem}</p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>The Solution</h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedProject.solution}</p>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Tech Stack</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {selectedProject.technologies?.map((t: string) => (
                      <span key={t} style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>{t}</span>
                    ))}
                  </div>

                  <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Skills Required</h4>
                  <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedProject.skillsRequired?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Development Steps</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedProject.developmentSteps?.map((step: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '28px', height: '28px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>
                        {idx + 1}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', paddingTop: '4px' }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.2)', padding: '1.5rem', borderRadius: '8px' }}>
                  <h4 style={{ color: '#00f0ff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={18} /> Placement Value
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{selectedProject.placementReason}</p>
                  
                  <strong style={{ fontSize: '0.85rem' }}>Skills Demonstrated:</strong>
                  <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    {selectedProject.placementSkills?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                
                <div style={{ background: 'rgba(255, 51, 102, 0.05)', border: '1px solid rgba(255, 51, 102, 0.2)', padding: '1.5rem', borderRadius: '8px' }}>
                  <h4 style={{ color: '#ff3366', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={18} /> Interview Topics
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Expect these questions in an interview about this project:</p>
                  <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedProject.interviewTopics?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>

            </div>
            
            <div style={{ position: 'sticky', bottom: 0, background: 'var(--bg-secondary)', padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setSelectedProject(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { handleSaveProject(selectedProject); setSelectedProject(null); }}>
                <Save size={18} style={{ marginRight: '8px' }} /> Save to My Projects
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Quick icons for modal
function Briefcase(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
}
function Users(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
}
