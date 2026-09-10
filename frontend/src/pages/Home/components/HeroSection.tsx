import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/ui/Badge';
import { ArrowRight, Play, Terminal, ShieldCheck, Cpu } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section style={{ padding: '4rem 0 5rem 0', backgroundColor: '#FFFFFF' }}>
      <div
        style={{
          maxWidth: 'var(--max-width-site)',
          margin: '0 auto',
          padding: '0 var(--space-lg)',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '4rem',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Headline & Call To Action */}
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <Badge variant="purple">⚡ THE NEXT GENERATION LEARNING PLATFORM</Badge>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.75rem, 4.5vw, 4rem)',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
            }}
          >
            Master High-Impact Skills with{' '}
            <span className="highlight-purple">Grit & Practice</span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#475569',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '540px',
            }}
          >
            Build real-world full-stack platforms, scalable microservices, and agentic AI architectures with structured guidance from senior industry engineers.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/courses">
              <Button variant="primary" size="lg">
                <span>Explore Courses</span>
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">
                <Play size={16} />
                <span>Our Methodology</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Feature Card Container */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              backgroundColor: '#0F172A',
              borderRadius: '24px',
              padding: '2.5rem',
              color: '#FFFFFF',
              boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
              border: '1px solid #1E293B',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Terminal size={22} color="#818CF8" />
                <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.9rem', color: '#CBD5E1' }}>
                  grit-school/mastery.ts
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#1E293B', borderRadius: '12px', padding: '1.25rem', borderLeft: '4px solid #6366F1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <ShieldCheck size={18} color="#10B981" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F8FAFC' }}>Full-Stack Web Mastery</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>React 18 + TS + Node.js + Supabase RLS Security</p>
              </div>

              <div style={{ backgroundColor: '#1E293B', borderRadius: '12px', padding: '1.25rem', borderLeft: '4px solid #8B5CF6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Cpu size={18} color="#818CF8" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F8FAFC' }}>Agentic AI Engineering</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>LLMs, Vector Search, Tool Calling & RAG Pipelines</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
