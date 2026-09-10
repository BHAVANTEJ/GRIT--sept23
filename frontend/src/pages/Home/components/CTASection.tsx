import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { ArrowRight } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: 'var(--max-width-site)', margin: '0 auto', padding: '0 var(--space-lg)' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
            borderRadius: '24px',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.2)',
          }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', lineHeight: 1.2 }}>
            Ready to Accelerate Your Career with <span style={{ color: '#818CF8' }}>Grit</span>?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#CBD5E1', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Enroll in our flagship engineering cohorts and join a community of high-impact software developers.
          </p>
          <Link to="/courses">
            <Button variant="primary" size="lg">
              <span>Start Learning Today</span>
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
