import React from 'react';
import { Logo } from '../common/Logo';
import { Container } from '../common/Container';

export const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#FAFAFC', borderTop: '1px solid #E2E8F0', padding: '4rem 0 2rem 0', marginTop: 'auto' }}>
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <Logo />
            <p style={{ marginTop: '1rem', color: '#64748B', fontSize: '0.9rem', maxWidth: '300px' }}>
              Master high-impact software engineering, full-stack development, and artificial intelligence systems through deliberate grit.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', marginBottom: '1rem' }}>Programs</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.9rem', color: '#475569' }}>
              <li>Full-Stack Web Mastery</li>
              <li>AI Systems & Agentic Engineering</li>
              <li>Distributed Systems Design</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', marginBottom: '1rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.9rem', color: '#475569' }}>
              <li>Curriculum</li>
              <li>Graduate Outcomes</li>
              <li>About GRIT SCHOOL</li>
            </ul>
          </div>
        </div>
        <hr className="thin-divider" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '2rem', fontSize: '0.85rem', color: '#94A3B8' }}>
          <span>© {new Date().getFullYear()} GRIT SCHOOL. All rights reserved.</span>
          <span>Designed with high-impact precision.</span>
        </div>
      </Container>
    </footer>
  );
};
