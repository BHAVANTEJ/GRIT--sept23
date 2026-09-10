import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/common/Button';

/**
 * Catch-all route.
 *
 * Replaces the bare `<h1>404 – Page Not Found</h1>` that used to be declared
 * inline in App.tsx: it now renders inside the normal layout, so a visitor who
 * mistypes a URL still has the navbar, the logo and a working way back to /.
 */
export const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <MainLayout>
      <div
        style={{
          maxWidth: '560px',
          margin: '5rem auto',
          padding: '0 var(--space-lg)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            backgroundColor: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
          }}
        >
          <Compass size={30} color="var(--color-primary)" />
        </div>

        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: 'var(--color-text-light)',
            marginBottom: '0.75rem',
          }}
        >
          ERROR 404
        </p>

        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--color-text)',
            marginBottom: '0.75rem',
          }}
        >
          This page doesn&apos;t exist
        </h1>

        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: '2rem',
            wordBreak: 'break-word',
          }}
        >
          We couldn&apos;t find <code>{location.pathname}</code>. It may have moved, or the link may
          be out of date.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link to="/">
            <Button variant="primary" size="lg">
              Back to home
            </Button>
          </Link>
          <Link to="/courses">
            <Button variant="outline" size="lg">
              Browse courses
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};
