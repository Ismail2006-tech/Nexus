"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight, Download, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import ResumePreview, { ResumeData } from "@/components/dashboard/ResumePreview";

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function ResumeBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  
  const [data, setData] = useState<ResumeData>({
    personalDetails: { fullName: "", email: "", phone: "", location: "", linkedin: "", github: "" },
    summary: "",
    education: [{ id: generateId(), degree: "", institution: "", startYear: "", endYear: "", score: "" }],
    skills: { technical: [], soft: [] },
    projects: [],
    experience: [],
    certifications: [],
    achievements: []
  });

  const [techSkillInput, setTechSkillInput] = useState("");
  const [softSkillInput, setSoftSkillInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // Load from DB on mount
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch('/api/resume');
        if (res.ok) {
          const savedData = await res.json();
          if (savedData) {
            setData(savedData);
          } else {
            // fallback to local storage
            const localSaved = localStorage.getItem("nexus_resume_data");
            if (localSaved) {
              setData(JSON.parse(localSaved));
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch resume:", error);
      } finally {
        setIsInitialLoad(false);
      }
    };
    fetchResume();
  }, []);

  // Save to local storage and DB on change (debounced)
  useEffect(() => {
    localStorage.setItem("nexus_resume_data", JSON.stringify(data));
    
    if (isFirstRender.current || isInitialLoad) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus("saving");

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          setSaveStatus("saved");
        } else {
          setSaveStatus("idle");
        }
      } catch (error) {
        console.error("Failed to save resume:", error);
        setSaveStatus("idle");
      }
    }, 800);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [data, isInitialLoad]);

  const resumeRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = async () => {
    if (!resumeRef.current) return;
    
    setIsGeneratingPdf(true);
    setPdfError("");
    
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = resumeRef.current;
      
      const fileName = data.personalDetails.fullName.trim() 
        ? `${data.personalDetails.fullName.trim().replace(/\s+/g, '_')}_Resume.pdf`
        : 'Nexus_Resume.pdf';

      const opt = {
        margin:       0,
        filename:     fileName,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed", error);
      setPdfError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(c => c + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, personalDetails: { ...data.personalDetails, [e.target.name]: e.target.value } });
  };

  const updateArrayItem = (arrayName: keyof ResumeData, id: string, field: string, value: string) => {
    setData({
      ...data,
      [arrayName]: (data[arrayName] as any[]).map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const addArrayItem = (arrayName: keyof ResumeData, template: any) => {
    setData({ ...data, [arrayName]: [...(data[arrayName] as any[]), { id: generateId(), ...template }] });
  };

  const removeArrayItem = (arrayName: keyof ResumeData, id: string) => {
    setData({ ...data, [arrayName]: (data[arrayName] as any[]).filter(item => item.id !== id) });
  };

  const addSkill = (type: "technical" | "soft") => {
    const input = type === "technical" ? techSkillInput : softSkillInput;
    if (!input.trim()) return;
    setData({
      ...data,
      skills: { ...data.skills, [type]: [...data.skills[type], input.trim()] }
    });
    type === "technical" ? setTechSkillInput("") : setSoftSkillInput("");
  };

  const removeSkill = (type: "technical" | "soft", index: number) => {
    setData({
      ...data,
      skills: { ...data.skills, [type]: data.skills[type].filter((_, i) => i !== index) }
    });
  };

  const addAchievement = () => {
    if (!achievementInput.trim()) return;
    setData({ ...data, achievements: [...data.achievements, achievementInput.trim()] });
    setAchievementInput("");
  };

  const generateAiSummary = () => {
    setIsGeneratingAi(true);
    // Client-side AI simulation based on inputs
    setTimeout(() => {
      const { personalDetails, education, skills, projects } = data;
      const primaryEdu = education[0]?.degree ? `${education[0].degree} student` : 'Dedicated professional';
      const techSkills = skills.technical.length > 0 ? ` skilled in ${skills.technical.slice(0, 3).join(', ')}` : '';
      const projMention = projects.length > 0 ? `. Proven ability to deliver results through projects like ${projects[0].title}` : '';
      
      const summary = `Results-driven ${primaryEdu}${techSkills}, seeking to leverage strong analytical and problem-solving abilities. Passionate about learning new technologies and applying them to solve real-world problems${projMention}.`;
      
      setData({ ...data, summary });
      setIsGeneratingAi(false);
    }, 1500);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: 'calc(100vh - 120px)' }}>
      {/* LEFT: WIZARD */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', margin: 0 }}>Resume Builder</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Step {currentStep} of {totalSteps}</p>
            {pdfError && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '4px 0 0 0' }}>{pdfError}</p>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {saveStatus === "saving" && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Loader2 size={12} className="animate-spin" /> Saving...
              </span>
            )}
            {saveStatus === "saved" && (
              <span style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={12} /> Saved
              </span>
            )}
            <button onClick={handlePrint} disabled={isGeneratingPdf || isInitialLoad} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem' }}>
              {isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
              {isGeneratingPdf ? "Generating..." : "Export PDF"}
            </button>
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', opacity: isInitialLoad ? 0.5 : 1, pointerEvents: isInitialLoad ? 'none' : 'auto' }}>
          
          {/* STEP 1: PERSONAL DETAILS */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>Personal Details</h3>
              <div className="input-group"><label className="input-label">Full Name *</label><input name="fullName" value={data.personalDetails.fullName} onChange={handlePersonalChange} className="input-field" placeholder="John Doe" /></div>
              <div className="input-group"><label className="input-label">Email *</label><input name="email" value={data.personalDetails.email} onChange={handlePersonalChange} className="input-field" placeholder="john@example.com" /></div>
              <div className="input-group"><label className="input-label">Phone *</label><input name="phone" value={data.personalDetails.phone} onChange={handlePersonalChange} className="input-field" placeholder="+1 234 567 8900" /></div>
              <div className="input-group"><label className="input-label">Location</label><input name="location" value={data.personalDetails.location} onChange={handlePersonalChange} className="input-field" placeholder="New York, NY" /></div>
              <div className="input-group"><label className="input-label">LinkedIn URL</label><input name="linkedin" value={data.personalDetails.linkedin} onChange={handlePersonalChange} className="input-field" placeholder="linkedin.com/in/johndoe" /></div>
              <div className="input-group"><label className="input-label">GitHub URL</label><input name="github" value={data.personalDetails.github} onChange={handlePersonalChange} className="input-field" placeholder="github.com/johndoe" /></div>
            </div>
          )}

          {/* STEP 2: EDUCATION */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>Education</h3>
              {data.education.map((edu, index) => (
                <div key={edu.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative' }}>
                  {index > 0 && <button onClick={() => removeArrayItem('education', edu.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>}
                  <div className="input-group" style={{ marginBottom: '1rem' }}><label className="input-label">Degree / Course *</label><input value={edu.degree} onChange={e => updateArrayItem('education', edu.id, 'degree', e.target.value)} className="input-field" placeholder="B.Tech in Computer Science" /></div>
                  <div className="input-group" style={{ marginBottom: '1rem' }}><label className="input-label">Institution *</label><input value={edu.institution} onChange={e => updateArrayItem('education', edu.id, 'institution', e.target.value)} className="input-field" placeholder="University Name" /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="input-group"><label className="input-label">Start Year</label><input value={edu.startYear} onChange={e => updateArrayItem('education', edu.id, 'startYear', e.target.value)} className="input-field" placeholder="2020" /></div>
                    <div className="input-group"><label className="input-label">End Year</label><input value={edu.endYear} onChange={e => updateArrayItem('education', edu.id, 'endYear', e.target.value)} className="input-field" placeholder="2024" /></div>
                  </div>
                  <div className="input-group"><label className="input-label">CGPA / Percentage</label><input value={edu.score} onChange={e => updateArrayItem('education', edu.id, 'score', e.target.value)} className="input-field" placeholder="8.5 CGPA" /></div>
                </div>
              ))}
              <button onClick={() => addArrayItem('education', { degree: "", institution: "", startYear: "", endYear: "", score: "" })} className="btn" style={{ background: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                <Plus size={16} /> Add Education
              </button>
            </div>
          )}

          {/* STEP 3: SKILLS */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Technical Skills</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input value={techSkillInput} onChange={e => setTechSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill('technical')} className="input-field" placeholder="e.g. React.js, Python" />
                  <button onClick={() => addSkill('technical')} className="btn btn-primary" style={{ padding: '0 1rem' }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {data.skills.technical.map((skill, i) => (
                    <span key={i} style={{ padding: '0.25rem 0.75rem', background: 'rgba(139,92,246,0.2)', color: 'var(--primary-light)', borderRadius: '999px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {skill} <button onClick={() => removeSkill('technical', i)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}><Trash2 size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Soft Skills</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input value={softSkillInput} onChange={e => setSoftSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill('soft')} className="input-field" placeholder="e.g. Leadership, Communication" />
                  <button onClick={() => addSkill('soft')} className="btn btn-primary" style={{ padding: '0 1rem' }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {data.skills.soft.map((skill, i) => (
                    <span key={i} style={{ padding: '0.25rem 0.75rem', background: 'rgba(59,130,246,0.2)', color: '#60a5fa', borderRadius: '999px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {skill} <button onClick={() => removeSkill('soft', i)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}><Trash2 size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PROJECTS */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>Projects</h3>
              {data.projects.map((proj, index) => (
                <div key={proj.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <button onClick={() => removeArrayItem('projects', proj.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  <div className="input-group" style={{ marginBottom: '1rem' }}><label className="input-label">Project Title *</label><input value={proj.title} onChange={e => updateArrayItem('projects', proj.id, 'title', e.target.value)} className="input-field" placeholder="E-commerce App" /></div>
                  <div className="input-group" style={{ marginBottom: '1rem' }}><label className="input-label">Description (One line)</label><input value={proj.description} onChange={e => updateArrayItem('projects', proj.id, 'description', e.target.value)} className="input-field" placeholder="A full-stack app for buying shoes" /></div>
                  <div className="input-group" style={{ marginBottom: '1rem' }}><label className="input-label">Tech Stack</label><input value={proj.techStack} onChange={e => updateArrayItem('projects', proj.id, 'techStack', e.target.value)} className="input-field" placeholder="React, Node.js, MongoDB" /></div>
                  <div className="input-group"><label className="input-label">Link (GitHub/Live)</label><input value={proj.link} onChange={e => updateArrayItem('projects', proj.id, 'link', e.target.value)} className="input-field" placeholder="github.com/..." /></div>
                </div>
              ))}
              <button onClick={() => addArrayItem('projects', { title: "", description: "", techStack: "", link: "" })} className="btn" style={{ background: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                <Plus size={16} /> Add Project
              </button>
            </div>
          )}

          {/* STEP 5: EXPERIENCE */}
          {currentStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>Experience / Internships</h3>
              {data.experience.map((exp, index) => (
                <div key={exp.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <button onClick={() => removeArrayItem('experience', exp.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  <div className="input-group" style={{ marginBottom: '1rem' }}><label className="input-label">Role / Title *</label><input value={exp.role} onChange={e => updateArrayItem('experience', exp.id, 'role', e.target.value)} className="input-field" placeholder="Software Engineer Intern" /></div>
                  <div className="input-group" style={{ marginBottom: '1rem' }}><label className="input-label">Company</label><input value={exp.company} onChange={e => updateArrayItem('experience', exp.id, 'company', e.target.value)} className="input-field" placeholder="Google" /></div>
                  <div className="input-group" style={{ marginBottom: '1rem' }}><label className="input-label">Duration</label><input value={exp.duration} onChange={e => updateArrayItem('experience', exp.id, 'duration', e.target.value)} className="input-field" placeholder="May 2023 - Aug 2023" /></div>
                  <div className="input-group"><label className="input-label">Responsibilities (Bulleted, line by line)</label><textarea value={exp.bullets} onChange={e => updateArrayItem('experience', exp.id, 'bullets', e.target.value)} className="input-field" placeholder="- Built a new feature&#10;- Improved performance by 20%" rows={4} style={{ resize: 'vertical' }} /></div>
                </div>
              ))}
              <button onClick={() => addArrayItem('experience', { role: "", company: "", duration: "", bullets: "" })} className="btn" style={{ background: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                <Plus size={16} /> Add Experience
              </button>
            </div>
          )}

          {/* STEP 6: CERTIFICATIONS & ACHIEVEMENTS */}
          {currentStep === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Certifications</h3>
                {data.certifications.map((cert) => (
                  <div key={cert.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative', marginBottom: '1rem' }}>
                    <button onClick={() => removeArrayItem('certifications', cert.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    <div className="input-group" style={{ marginBottom: '1rem' }}><label className="input-label">Name</label><input value={cert.name} onChange={e => updateArrayItem('certifications', cert.id, 'name', e.target.value)} className="input-field" placeholder="AWS Cloud Practitioner" /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="input-group"><label className="input-label">Issuer</label><input value={cert.issuer} onChange={e => updateArrayItem('certifications', cert.id, 'issuer', e.target.value)} className="input-field" placeholder="Amazon" /></div>
                      <div className="input-group"><label className="input-label">Year</label><input value={cert.year} onChange={e => updateArrayItem('certifications', cert.id, 'year', e.target.value)} className="input-field" placeholder="2023" /></div>
                    </div>
                  </div>
                ))}
                <button onClick={() => addArrayItem('certifications', { name: "", issuer: "", year: "" })} className="btn" style={{ background: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', width: '100%' }}>
                  <Plus size={16} /> Add Certification
                </button>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Achievements</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input value={achievementInput} onChange={e => setAchievementInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAchievement()} className="input-field" placeholder="e.g. 1st Place in Hackathon" />
                  <button onClick={addAchievement} className="btn btn-primary" style={{ padding: '0 1rem' }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {data.achievements.map((ach, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                      <span style={{ fontSize: '0.9rem' }}>{ach}</span>
                      <button onClick={() => setData({ ...data, achievements: data.achievements.filter((_, idx) => idx !== i) })} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: SUMMARY */}
          {currentStep === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>Career Objective / Summary</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Write a short 2-3 sentence professional summary. You can generate one automatically based on the details you've already filled out.</p>
              
              <div className="input-group">
                <textarea 
                  value={data.summary} 
                  onChange={(e) => setData({ ...data, summary: e.target.value })} 
                  className="input-field" 
                  rows={6} 
                  placeholder="A passionate software engineer..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button onClick={generateAiSummary} disabled={isGeneratingAi} className="btn" style={{ background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem' }}>
                <Sparkles size={16} /> {isGeneratingAi ? 'Generating...' : 'AI Generate Summary'}
              </button>
            </div>
          )}

        </div>

        {/* WIZARD CONTROLS */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.1)' }}>
          <button onClick={prevStep} disabled={currentStep === 1} className="btn" style={{ background: 'rgba(255,255,255,0.1)', opacity: currentStep === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ChevronLeft size={16} /> Back
          </button>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i + 1 === currentStep ? 'var(--primary)' : 'rgba(255,255,255,0.2)' }} />
            ))}
          </div>

          <button onClick={nextStep} disabled={currentStep === totalSteps} className="btn btn-primary" style={{ opacity: currentStep === totalSteps ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* RIGHT: PREVIEW PANEL */}
      <div style={{ background: '#2a2d3e', borderRadius: '12px', padding: '1rem', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
        <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
          <ResumePreview ref={resumeRef} data={data} />
        </div>
      </div>
    </div>
  );
}
