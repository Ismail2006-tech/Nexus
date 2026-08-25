import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { 
  User, Mail, GraduationCap, Target, Briefcase, Award, 
  BookOpen, CheckCircle2, ChevronRight, Zap, Code, FileText,
  Activity, Calendar, TrendingUp, Compass, Star
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Profile | NEXUS",
};

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  const profile = await db.profile.findUnique({
    where: { userId },
  });

  const careerRoadmap = await db.careerRoadmap.findFirst({
    where: { userId },
    orderBy: { updatedAt: 'desc' }
  });

  const completedTopicsCount = await db.topicProgress.count({
    where: { userId, completed: true }
  });

  const testsCompletedCount = await db.testResult.count({
    where: { userId }
  });

  const savedProjectsCount = await db.savedProject.count({
    where: { userId }
  });

  const recentTests = await db.testResult.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const recentTopics = await db.topicProgress.findMany({
    where: { userId, completed: true, completedAt: { not: null } },
    orderBy: { completedAt: 'desc' },
    take: 3
  });

  // Combine and sort activities
  const activities = [
    ...recentTests.map(t => ({
      id: `test-${t.id}`,
      title: `Completed ${t.category} Assessment`,
      desc: `Scored ${t.percentage}%`,
      date: t.createdAt,
      icon: <FileText size={16} className="text-purple-400" />,
      color: "bg-purple-500/10 text-purple-500"
    })),
    ...recentTopics.map(t => ({
      id: `topic-${t.id}`,
      title: `Mastered Topic: ${t.topicName}`,
      desc: `Stage ${t.stage} of Roadmap`,
      date: t.completedAt!,
      icon: <CheckCircle2 size={16} className="text-emerald-400" />,
      color: "bg-emerald-500/10 text-emerald-500"
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  const skillsList = profile?.skills ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  
  // Calculate Achievements
  const achievements = [];
  if (testsCompletedCount > 0) {
    achievements.push({ title: "First Test Cleared", icon: <Target size={20} />, color: "var(--primary)" });
  }
  if (testsCompletedCount >= 5) {
    achievements.push({ title: "Assessment Pro", icon: <Star size={20} />, color: "#eab308" });
  }
  if (completedTopicsCount > 0) {
    achievements.push({ title: "Learning Initiated", icon: <BookOpen size={20} />, color: "#3b82f6" });
  }
  if (skillsList.length >= 3) {
    achievements.push({ title: "Skill Builder", icon: <Code size={20} />, color: "#10b981" });
  }

  // Calculate profile completion
  let completionPoints = 0;
  if (profile?.college) completionPoints += 25;
  if (profile?.branch) completionPoints += 25;
  if (profile?.yearOfStudy) completionPoints += 25;
  if (skillsList.length > 0) completionPoints += 25;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View and manage your student profile and learning progress.</p>
      </div>

      {/* 1. Profile Header & 3. Placement Readiness */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          {/* Cover Photo Area */}
          <div style={{ height: '120px', background: 'linear-gradient(90deg, rgba(139,92,246,0.2) 0%, rgba(59,130,246,0.1) 100%)', position: 'relative' }}></div>
          
          <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start', marginTop: '-40px' }}>
            {/* Avatar */}
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '16px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '2.5rem', color: 'white', fontWeight: 600,
              border: '4px solid #0f111a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}>
              {session.user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            
            {/* User Info */}
            <div style={{ flex: '1', minWidth: '300px', paddingTop: '45px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>{session.user.name}</h2>
                  <p style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '1.1rem', marginBottom: '1rem' }}>
                    {careerRoadmap?.careerGoal || 'Future Tech Leader'}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <GraduationCap size={16} />
                      {profile?.college || 'College not specified'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Briefcase size={16} />
                      {profile?.branch || 'Branch not specified'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} />
                      {profile?.yearOfStudy || 'Year not specified'}
                    </div>
                  </div>
                </div>
                
                <Link href="/settings" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 3. Placement Readiness Card */}
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} color="var(--primary)" /> Placement Readiness
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {/* Circular Progress */}
              <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3"
                    strokeDasharray={`${profile?.placementReadiness || 0}, 100`}
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>
                  {profile?.placementReadiness || 0}%
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Profile Completion
                </p>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', marginBottom: '0.25rem' }}>
                  <div style={{ width: `${completionPoints}%`, height: '100%', background: 'var(--secondary)', borderRadius: '99px' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>{completionPoints}% Complete</span>
                  {completionPoints < 100 && <Link href="/settings" style={{ color: 'var(--primary)' }}>Complete Now</Link>}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Skills */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={20} color="var(--primary)" /> Top Skills
            </h3>
            
            {skillsList.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {skillsList.map((skill, i) => (
                  <span key={i} style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'rgba(139, 92, 246, 0.1)', 
                    border: '1px solid rgba(139, 92, 246, 0.2)', 
                    color: 'var(--primary-light)',
                    borderRadius: '8px', 
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                <Code size={32} style={{ margin: '0 auto 1rem auto', color: 'var(--text-secondary)', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No skills added yet.</p>
                <Link href="/settings" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Add Skills</Link>
              </div>
            )}
          </div>

          {/* Contact & About */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Contact Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email Address</p>
                  <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{session.user.email}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 5. Statistics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px', marginBottom: '0.5rem' }}>
                <BookOpen size={24} />
              </div>
              <h4 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', margin: 0 }}>{completedTopicsCount}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Topics Done</p>
            </div>
            
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', marginBottom: '0.5rem' }}>
                <FileText size={24} />
              </div>
              <h4 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', margin: 0 }}>{testsCompletedCount}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Quizzes Passed</p>
            </div>
            
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '12px', marginBottom: '0.5rem' }}>
                <Briefcase size={24} />
              </div>
              <h4 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', margin: 0 }}>{savedProjectsCount}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Projects Saved</p>
            </div>
          </div>

          {/* 2. Career Goal Card & 8. Career Progress */}
          <div className="card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            {/* Background Glow */}
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%' }}></div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
              <Compass size={20} color="var(--primary)" /> Career Journey
            </h3>
            
            {careerRoadmap ? (
              <div>
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Current Target Role</p>
                  <h4 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--primary-light)' }}>{careerRoadmap.careerGoal}</h4>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Roadmap Progress</span>
                    <span style={{ fontWeight: 600 }}>{Math.round(careerRoadmap.progress)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }}>
                    <div style={{ width: `${careerRoadmap.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '99px' }}></div>
                  </div>
                </div>
                
                <Link href="/roadmap" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  Continue Roadmap <ChevronRight size={18} />
                </Link>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                <Target size={32} style={{ margin: '0 auto 1rem auto', color: 'var(--text-secondary)', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You haven't set a career goal yet.</p>
                <Link href="/career" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Set Career Goal</Link>
              </div>
            )}
          </div>

          {/* 6. Achievements */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} color="var(--primary)" /> Achievements
              </h3>
            </div>
            
            {achievements.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                {achievements.map((ach, i) => (
                  <div key={i} style={{ 
                    padding: '1.25rem 1rem', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '50%', 
                      background: `color-mix(in srgb, ${ach.color} 15%, transparent)`, 
                      color: ach.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {ach.icon}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.2 }}>{ach.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                <Award size={32} style={{ margin: '0 auto 1rem auto', color: 'var(--text-secondary)', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-secondary)' }}>Your first achievement is waiting for you.</p>
              </div>
            )}
          </div>

          {/* 7. Recent Activity */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="var(--primary)" /> Recent Activity
            </h3>
            
            {activities.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activities.map((activity) => (
                  <div key={activity.id} style={{ 
                    display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px',
                    position: 'relative'
                  }}>
                    <div style={{ padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={activity.color}>
                      {activity.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.2rem' }}>{activity.title}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {activity.desc} • {new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                <Activity size={32} style={{ margin: '0 auto 1rem auto', color: 'var(--text-secondary)', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-secondary)' }}>No recent activity to show.</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginTop: '0.5rem' }}>
                  <Link href="/roadmap">Start learning today!</Link>
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
