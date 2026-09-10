import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Card } from '../../components/ui/Card';
import { Target, Compass, Flame } from 'lucide-react';
import './About.css';

export const About: React.FC = () => {
  return (
    <MainLayout>
      <div className="about-page">
        <div style={{ maxWidth: 'var(--max-width-site)', margin: '0 auto', padding: '0 var(--space-lg)' }}>
          <SectionHeading
            badge="OUR MISSION"
            title={<>About <span className="highlight-purple">GRIT SCHOOL</span></>}
            subtitle="We empower software engineers to achieve mastery through deliberate practice, production codebases, and relentless perseverance."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <Card hoverable={false}>
              <Target size={28} color="#6366F1" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0F172A' }}>
                Deliberate Practice
              </h3>
              <p style={{ color: '#64748B', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Passive video watching does not produce great engineers. GRIT SCHOOL emphasizes writing production code, debugging real systems, and shipping software.
              </p>
            </Card>

            <Card hoverable={false}>
              <Compass size={28} color="#8B5CF6" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0F172A' }}>
                Modern Architecture
              </h3>
              <p style={{ color: '#64748B', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Our curriculum continuously adapts to industry shifts, teaching modern React 18, TypeScript, Node.js, Supabase security, and state-of-the-art agentic AI.
              </p>
            </Card>

            <Card hoverable={false}>
              <Flame size={28} color="#6366F1" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0F172A' }}>
                Perseverance & Grit
              </h3>
              <p style={{ color: '#64748B', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Engineering excellence is forged through overcoming challenges. We instill technical resilience and problem-solving grit in every graduate.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
