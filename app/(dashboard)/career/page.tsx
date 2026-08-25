"use client";

import { useState, useEffect } from "react";
import { Search, Map as MapIcon, ChevronDown, ChevronRight, CheckCircle2, Circle, Target, Briefcase, RefreshCw, Lightbulb } from "lucide-react";

export default function CareerRoadmapPage() {
  const [careerGoal, setCareerGoal] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [roadmapMeta, setRoadmapMeta] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);

  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchExistingRoadmap();
  }, []);

  const fetchExistingRoadmap = async () => {
    try {
      const res = await fetch("/api/career");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setRoadmapMeta({ id: data.id, progress: data.progress, careerGoal: data.careerGoal });
          setRoadmap(data.data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateRoadmap = async (targetCareer: string, skills: string) => {
    if (!targetCareer.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setCareerGoal(targetCareer);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const res = await fetch("/api/career/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerGoal: targetCareer, currentSkills: skills })
      });
      const generatedData = await res.json();

      if (generatedData.error || !generatedData.stages) {
        throw new Error(generatedData.error || "Unable to generate a valid roadmap format.");
      }

      const initializedStages = generatedData.stages.map((stage: any) => ({
        ...stage,
        topics: stage.topics.map((t: string) => ({ name: t, completed: false }))
      }));
      generatedData.stages = initializedStages;

      const saveRes = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerGoal: targetCareer, roadmapData: generatedData })
      });
      
      const savedData = await saveRes.json();
      
      setRoadmapMeta({ id: savedData.id, progress: 0, careerGoal: savedData.careerGoal });
      setRoadmap(generatedData);
      setExpandedStages({}); 

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateRoadmap(careerGoal, currentSkills);
  };

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  const handleTopicToggle = async (stageIndex: number, topicIndex: number) => {
    if (!roadmap || !roadmapMeta) return;

    const newRoadmap = { ...roadmap };
    const topic = newRoadmap.stages[stageIndex].topics[topicIndex];
    topic.completed = !topic.completed;

    let totalTopics = 0;
    let completedTopics = 0;
    newRoadmap.stages.forEach((stage: any) => {
      stage.topics.forEach((t: any) => {
        totalTopics++;
        if (t.completed) completedTopics++;
      });
    });

    const newProgress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

    setRoadmap(newRoadmap);
    setRoadmapMeta({ ...roadmapMeta, progress: newProgress });

    try {
      await fetch("/api/career", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: roadmapMeta.id,
          roadmapData: newRoadmap,
          progress: newProgress
        })
      });
    } catch (e) {
      console.error("Failed to sync progress");
    }
  };

  if (!roadmap) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
        <div className="card" style={{ padding: '3rem', margin: '0 auto', width: '100%', maxWidth: '800px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <MapIcon size={56} color="var(--primary)" style={{ margin: '0 auto 1.5rem auto' }} />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1rem' }}>Build Your Career Roadmap</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Tell us what career you want to pursue, and Nexus will create a personalized learning roadmap for you.
            </p>
          </div>

          <form onSubmit={handleGenerateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            {errorMsg && (
              <div style={{ padding: '1rem', background: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.3)', borderRadius: '8px', color: '#ff3366', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{errorMsg}</span>
                <button type="button" onClick={() => generateRoadmap(careerGoal, currentSkills)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Try Again</button>
              </div>
            )}
            
            <div style={{ position: 'relative' }}>
              <Target size={24} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field"
                placeholder="What do you want to become? (e.g. AI Engineer)"
                style={{ paddingLeft: '3.5rem', width: '100%', paddingBlock: '1.25rem', fontSize: '1.1rem', background: 'rgba(255,255,255,0.03)' }}
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <Briefcase size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field"
                placeholder="Current skills / knowledge (Optional)"
                style={{ paddingLeft: '3.5rem', width: '100%', paddingBlock: '1.25rem', fontSize: '1.1rem', background: 'rgba(255,255,255,0.03)' }}
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }} disabled={loading || !careerGoal.trim()}>
              {loading ? "Generating Personalized Roadmap..." : "Generate Roadmap"}
            </button>
          </form>

          <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Select a Career Domain</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
              {[
                "Software Engineering", "Full-Stack Development", "Artificial Intelligence (AI)", 
                "Data Science", "Machine Learning Engineering", "Cybersecurity", 
                "Cloud Computing", "DevOps", "Mobile App Development", 
                "Database Engineering", "Network Engineering", "Game Development", 
                "Embedded Systems / IoT", "Blockchain Development", "Research & Academia"
              ].map(c => (
                <button 
                  key={c} 
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderRadius: '999px', background: 'rgba(255,255,255,0.02)' }}
                  onClick={() => generateRoadmap(c, currentSkills)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { careerOverview, stages } = roadmap;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      
      {/* Header */}
      <div className="card" style={{ padding: '2.5rem', borderTop: '4px solid var(--primary)', position: 'relative' }}>
        <button 
          className="btn btn-outline" 
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          onClick={() => { setRoadmap(null); setRoadmapMeta(null); }}
        >
          <RefreshCw size={14} style={{ marginRight: '6px' }} /> Create New
        </button>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '0.5rem', color: '#fff' }}>
          {careerOverview.title} Roadmap
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px', lineHeight: 1.6, marginBottom: '2rem' }}>
          {careerOverview.description}
        </p>

        <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Estimated Time</span>
            <strong style={{ color: '#00ffaa' }}>{careerOverview.estimatedTime}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Overall Progress</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '150px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${roadmapMeta.progress}%`, background: 'var(--primary)', borderRadius: '999px', transition: 'width 0.3s ease' }}></div>
              </div>
              <strong style={{ color: 'var(--primary)' }}>{roadmapMeta.progress}%</strong>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Key Skills You Will Master</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {careerOverview.keySkills?.map((skill: string) => (
              <span key={skill} style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap Stages */}
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        <div style={{ position: 'absolute', left: '2.5rem', top: '1rem', bottom: '1rem', width: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {stages.map((stage: any, sIdx: number) => {
            const isExpanded = expandedStages[stage.id] ?? (sIdx === 0);
            
            const totalStageTopics = stage.topics.length;
            const completedStageTopics = stage.topics.filter((t: any) => t.completed).length;
            const isStageComplete = totalStageTopics > 0 && totalStageTopics === completedStageTopics;

            return (
              <div key={stage.id} style={{ position: 'relative', zIndex: 1, paddingLeft: '3rem' }}>
                <div style={{ 
                  position: 'absolute', left: '-10px', top: '24px', width: '22px', height: '22px', 
                  borderRadius: '50%', background: isStageComplete ? 'var(--primary)' : 'var(--bg-secondary)', 
                  border: isStageComplete ? 'none' : '2px solid var(--primary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
                }}>
                  {isStageComplete && <CheckCircle2 size={14} color="#fff" />}
                </div>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                  <div 
                    style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                    onClick={() => toggleStage(stage.id)}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: isStageComplete ? 'var(--text-secondary)' : '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {stage.name}
                        {isStageComplete && <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(0,255,170,0.1)', color: '#00ffaa', borderRadius: '4px' }}>COMPLETED</span>}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{completedStageTopics} / {totalStageTopics} Topics Completed</p>
                    </div>
                    {isExpanded ? <ChevronDown size={20} color="var(--text-muted)" /> : <ChevronRight size={20} color="var(--text-muted)" />}
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                      
                      <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                          {stage.whyLearn}
                        </p>
                        
                        <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Learning Checklist</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {stage.topics.map((topic: any, tIdx: number) => (
                            <div 
                              key={tIdx} 
                              style={{ 
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', 
                                background: 'rgba(255,255,255,0.02)', borderRadius: '6px', cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onClick={() => handleTopicToggle(sIdx, tIdx)}
                            >
                              {topic.completed ? (
                                <CheckCircle2 size={18} color="var(--primary)" />
                              ) : (
                                <Circle size={18} color="var(--text-muted)" />
                              )}
                              <span style={{ fontSize: '0.95rem', color: topic.completed ? 'var(--text-muted)' : '#fff', textDecoration: topic.completed ? 'line-through' : 'none' }}>
                                {topic.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {stage.recommendedTools?.length > 0 && (
                          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Recommended Tools</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {stage.recommendedTools.map((tool: string) => (
                                <span key={tool} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>{tool}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {stage.skillsGained?.length > 0 && (
                          <div>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Skills You Will Gain</h4>
                            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              {stage.skillsGained.map((skill: string, i: number) => <li key={i}>{skill}</li>)}
                            </ul>
                          </div>
                        )}

                        {stage.projects?.length > 0 && (
                          <div style={{ background: 'rgba(0, 240, 255, 0.05)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: '#00f0ff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Lightbulb size={14} /> Related Projects
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {stage.projects.map((proj: any, i: number) => (
                                <div key={i} style={{ fontSize: '0.85rem', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                  <span>{proj.name}</span>
                                  <span style={{ color: 'var(--text-muted)' }}>{proj.level}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                      </div>

                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
