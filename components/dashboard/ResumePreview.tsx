import React, { forwardRef } from 'react';

export interface ResumeData {
  personalDetails: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    startYear: string;
    endYear: string;
    score: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Array<{
    id: string;
    title: string;
    description: string;
    techStack: string;
    link: string;
  }>;
  experience: Array<{
    id: string;
    role: string;
    company: string;
    duration: string;
    bullets: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    year: string;
  }>;
  achievements: string[];
}

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data }, ref) => {
  const { personalDetails, summary, education, skills, projects, experience, certifications, achievements } = data;

  const SectionHeader = ({ title }: { title: string }) => (
    <div style={{ borderBottom: '1px solid #000', marginBottom: '8px', paddingBottom: '2px', marginTop: '16px' }}>
      <h3 style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#000' }}>{title}</h3>
    </div>
  );

  return (
    <div 
      ref={ref} 
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        margin: '0 auto',
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: '"Times New Roman", Times, serif',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        boxSizing: 'border-box',
        lineHeight: 1.4,
        fontSize: '11pt'
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 'bold', margin: '0 0 8px 0', color: '#000' }}>
          {personalDetails.fullName || 'YOUR NAME'}
        </h1>
        <div style={{ fontSize: '10pt', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
          {personalDetails.location && <span>{personalDetails.location}</span>}
          {personalDetails.location && (personalDetails.phone || personalDetails.email) && <span>|</span>}
          {personalDetails.phone && <span>{personalDetails.phone}</span>}
          {personalDetails.phone && personalDetails.email && <span>|</span>}
          {personalDetails.email && <span>{personalDetails.email}</span>}
        </div>
        <div style={{ fontSize: '10pt', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
          {personalDetails.linkedin && <span>{personalDetails.linkedin}</span>}
          {personalDetails.linkedin && personalDetails.github && <span>|</span>}
          {personalDetails.github && <span>{personalDetails.github}</span>}
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ margin: 0, textAlign: 'justify' }}>{summary}</p>
        </div>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <div>
          <SectionHeader title="Education" />
          {education.map(edu => (
            <div key={edu.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{edu.institution || 'Institution Name'}</span>
                <span>{edu.startYear} {edu.startYear && edu.endYear ? '-' : ''} {edu.endYear}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic' }}>
                <span>{edu.degree || 'Degree/Course'}</span>
                <span>{edu.score ? `Score: ${edu.score}` : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {(skills.technical.length > 0 || skills.soft.length > 0) && (
        <div>
          <SectionHeader title="Skills" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {skills.technical.length > 0 && (
              <div>
                <strong>Technical: </strong>
                <span>{skills.technical.join(', ')}</span>
              </div>
            )}
            {skills.soft.length > 0 && (
              <div>
                <strong>Soft Skills: </strong>
                <span>{skills.soft.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <div>
          <SectionHeader title="Experience" />
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{exp.role || 'Job Title'} {exp.company && `| ${exp.company}`}</span>
                <span>{exp.duration}</span>
              </div>
              {exp.bullets && (
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                  {exp.bullets.split('\n').filter(b => b.trim()).map((bullet, i) => (
                    <li key={i} style={{ marginBottom: '2px' }}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <div>
          <SectionHeader title="Projects" />
          {projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>
                  {proj.title || 'Project Name'} 
                  {proj.techStack && <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}> | {proj.techStack}</span>}
                </strong>
                {proj.link && <span>{proj.link}</span>}
              </div>
              {proj.description && (
                <p style={{ margin: '4px 0 0 0' }}>{proj.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CERTIFICATIONS */}
      {certifications.length > 0 && (
        <div>
          <SectionHeader title="Certifications" />
          <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
            {certifications.map(cert => (
              <li key={cert.id} style={{ marginBottom: '2px' }}>
                <strong>{cert.name}</strong> {cert.issuer && `- ${cert.issuer}`} {cert.year && `(${cert.year})`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {achievements.length > 0 && (
        <div>
          <SectionHeader title="Achievements" />
          <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
            {achievements.map((ach, i) => (
              <li key={i} style={{ marginBottom: '2px' }}>{ach}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
