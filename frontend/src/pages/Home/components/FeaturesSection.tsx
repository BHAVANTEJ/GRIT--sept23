import React from 'react';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { Card } from '../../../components/ui/Card';
import { Code2, Cpu, Database, Zap, Users, Trophy } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Code2 size={24} color="#6366F1" />,
      title: 'Production Codebases',
      description: 'Build non-trivial, complete full-stack web applications with clean TypeScript and modular architecture.',
    },
    {
      icon: <Cpu size={24} color="#8B5CF6" />,
      title: 'AI & Agentic Workflows',
      description: 'Learn to engineer autonomous LLM agents, vector embeddings, and RAG retrieval pipelines.',
    },
    {
      icon: <Database size={24} color="#6366F1" />,
      title: 'PostgreSQL & Supabase RLS',
      description: 'Design relational database schemas with raw SQL migrations and row-level access security policies.',
    },
    {
      icon: <Zap size={24} color="#8B5CF6" />,
      title: 'High-Performance APIs',
      description: 'Develop Node.js/Express REST APIs with robust error handling, validation, and session security.',
    },
    {
      icon: <Users size={24} color="#6366F1" />,
      title: 'Expert Code Reviews',
      description: 'Receive detailed line-by-line feedback from principal software engineers and tech leaders.',
    },
    {
      icon: <Trophy size={24} color="#8B5CF6" />,
      title: 'Career Placement Support',
      description: 'Optimize your portfolio, master system design interviews, and land top-tier tech roles.',
    },
  ];

  return (
    <section style={{ padding: '5rem 0', backgroundColor: '#FAFAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: 'var(--max-width-site)', margin: '0 auto', padding: '0 var(--space-lg)' }}>
        <SectionHeading
          badge="WHY GRIT SCHOOL"
          title={<>Built for Engineers Who Demand <span className="highlight-purple">Excellence</span></>}
          subtitle="Our methodology focuses on deep hands-on implementation rather than superficial tutorials."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {features.map((item, idx) => (
            <Card key={idx}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
