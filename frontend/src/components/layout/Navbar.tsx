import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { User, LogOut, Shield, Menu, X } from 'lucide-react';

interface NavbarProps {
  onSignInClick?: () => void;
}

/**
 * Primary navigation.
 *
 * Home used to link to `//home`, which has never been a registered route — that
 * was the source of the "click Home and get a 404" report. Every destination
 * here is now a real route, and NavLink handles the active state instead of a
 * hand-rolled pathname comparison.
 */
export const Navbar: React.FC<NavbarProps> = ({ onSignInClick }) => {
  const { isAuthenticated, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: 'Outcomes', path: '/outcomes' },
    { label: 'About', path: '/about' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate('/');
  };

  const linkStyle = (isActive: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-heading)',
    fontSize: '0.95rem',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? '#6366F1' : '#475569',
    transition: 'color 0.2s ease',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  });

  const navItems = (
    <>
      {navLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          // `end` stops "/" from matching every other route as active.
          end={link.path === '/'}
          onClick={() => setMenuOpen(false)}
          style={({ isActive }) => linkStyle(isActive)}
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );

  const authItems = isAuthenticated ? (
    <>
      {isAdmin && (
        <NavLink
          to="/admin"
          onClick={() => setMenuOpen(false)}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: isActive ? '#6366F1' : '#0F172A',
            fontWeight: 600,
            fontSize: '0.9rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          })}
        >
          <Shield size={17} color="#8B5CF6" />
          <span>Admin</span>
        </NavLink>
      )}
      <Link
        to="/dashboard"
        onClick={() => setMenuOpen(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#0F172A',
          fontWeight: 600,
          fontSize: '0.9rem',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <User size={18} color="#6366F1" />
        <span>Dashboard</span>
      </Link>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <LogOut size={16} />
        <span>Logout</span>
      </Button>
    </>
  ) : (
    <>
      {onSignInClick ? (
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            onSignInClick();
          }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#0F172A',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Sign in
        </button>
      ) : (
        <Link
          to="/signin"
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#0F172A',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Sign in
        </Link>
      )}
      <Link to="/register" onClick={() => setMenuOpen(false)}>
        <Button variant="primary" size="md">
          Get Started →
        </Button>
      </Link>
    </>
  );

  return (
    <header className="site-header">
      <div className="site-header__inner">
        {/* Top-Left: Logo — always routes to "/" */}
        <Logo />

        {/* Top-Center: Navigation Links (desktop) */}
        <nav className="site-nav">{navItems}</nav>

        {/* Top-Right: Auth actions (desktop) */}
        <div className="site-header__actions">{authItems}</div>

        <button
          type="button"
          className="site-header__toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="site-header__mobile">
          <nav className="site-header__mobile-nav">{navItems}</nav>
          <div className="site-header__mobile-actions">{authItems}</div>
        </div>
      )}
    </header>
  );
};
