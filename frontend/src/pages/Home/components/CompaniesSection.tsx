import React, { useEffect, useState } from 'react';
import { companyService } from '../../../services/company.service';
import { COMPANIES_SECTION_LABEL, FALLBACK_COMPANIES } from '../../../data/companies';
import { Company } from '../../../types/company.types';

/**
 * Infinite horizontal marquee of company names/logos.
 *
 * Data comes from `companyService` (Supabase `companies` table, falling back to
 * `data/companies.ts`) — the list is no longer hardcoded in this component.
 *
 * The seamless loop is pure CSS: the track holds the list twice and translates
 * by exactly -50%, so the moment the first copy scrolls out the second copy is
 * pixel-identical in its place and the reset is invisible. Animation and
 * reduced-motion handling live in `styles/globals.css`.
 */
export const CompaniesSection: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(FALLBACK_COMPANIES);

  useEffect(() => {
    let cancelled = false;
    companyService
      .getVisibleCompanies()
      .then((data) => {
        if (!cancelled && data.length > 0) setCompanies(data);
      })
      .catch(() => {
        /* fallback list already in state */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (companies.length === 0) return null;

  // Duplicated once for the -50% loop. `aria-hidden` on the clone keeps screen
  // readers from announcing every name twice.
  const renderItem = (company: Company, key: string, isClone = false) => (
    <li key={key} className="companies-marquee__item" aria-hidden={isClone || undefined}>
      {company.logo_url ? (
        <img
          src={company.logo_url}
          alt={company.name}
          loading="lazy"
          className="companies-marquee__logo"
        />
      ) : (
        <span className="companies-marquee__name">{company.name}</span>
      )}
    </li>
  );

  return (
    <section
      style={{
        padding: '3.5rem 0',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #F1F5F9',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width-site)',
          margin: '0 auto',
          padding: '0 var(--space-lg)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#94A3B8',
            marginBottom: '1.75rem',
          }}
        >
          {COMPANIES_SECTION_LABEL}
        </p>
      </div>

      {/* Full-bleed viewport: the fade masks sit at the edges of the screen,
          and overflow is clipped here so the page itself never scrolls sideways. */}
      <div className="companies-marquee">
        <ul
          className="companies-marquee__track"
          style={
            {
              // Longer lists get proportionally more time so the perceived speed
              // stays constant no matter how many companies are configured.
              '--marquee-duration': `${Math.max(18, companies.length * 4)}s`,
            } as React.CSSProperties
          }
        >
          {companies.map((c) => renderItem(c, `a-${c.id}`))}
          {companies.map((c) => renderItem(c, `b-${c.id}`, true))}
        </ul>
      </div>
    </section>
  );
};
