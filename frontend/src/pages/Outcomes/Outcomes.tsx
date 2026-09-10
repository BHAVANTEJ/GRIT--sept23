import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Card } from '../../components/ui/Card';
import { TrendingUp, Briefcase, Award } from 'lucide-react';
import './Outcomes.css';

export const Outcomes: React.FC = () => {
  return (
    <MainLayout>
      <div className="outcomes-page">
        <div style={{ maxWidth: 'var(--max-width-site)', margin: '0 auto', padding: '0 var(--space-lg)' }}>
          <SectionHeading
            badge="GRADUATE SUCCESS"
            title={<>Career <span className="highlight-purple">Impact & Outcomes</span></>}
            subtitle="GRIT SCHOOL alumni stand out in technical interviews with verified production experience."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <Card hoverable={false}>
              <TrendingUp size={28} color="#10B981" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0F172A' }}>
                Senior Career Growth
              </h3>
              <p style={{ color: '#64748B', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Graduates transition from junior roles to full-stack tech leads and senior software engineering positions.
              </p>
            </Card>

            <Card hoverable={false}>
              <Briefcase size={28} color="#6366F1" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0F172A' }}>
                Verified Portfolio
              </h3>
              <p style={{ color: '#64748B', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Deploy live production applications with Supabase authentication, SQL migrations, and AI capabilities to showcase to hiring teams.
              </p>
            </Card>

            <Card hoverable={false}>
              <Award size={28} color="#8B5CF6" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0F172A' }}>
                Industry Certification
              </h3>
              <p style={{ color: '#64748B', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Receive an authenticated GRIT SCHOOL Graduate Certificate recognizing full-stack and AI engineering mastery.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
