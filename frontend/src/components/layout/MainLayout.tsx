import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  onSignInClick?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, onSignInClick }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Navbar onSignInClick={onSignInClick} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
};
