import React, { useState } from 'react';
import { useIntro } from '../../hooks/useIntro';
import { IntroCloseButton } from './components/IntroCloseButton';
import { IntroContent } from './components/IntroContent';
import { IntroVideo } from './components/IntroVideo';
import { IntroTransition } from './components/IntroTransition';
import { Navbar } from '../../components/layout/Navbar';
import { Home } from '../Home/Home';
import { Modal } from '../../components/ui/Modal';
import { AuthForm } from '../Auth/components/AuthForm';
import './Intro.css';

export const Intro: React.FC = () => {
  const { step, transitionToAuth, closeIntro, onVideoEnded } = useIntro();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  // If intro has been closed, render the main Home page
  if (step === 'CLOSED') {
    return <Home />;
  }

  return (
    <div className="intro-wrapper">
      {/* Navbar with brand top-left */}
      <Navbar onSignInClick={() => {
        setAuthMode('login');
        transitionToAuth();
      }} />

      {/* Accessible Top-Right Close Button */}
      <IntroCloseButton onClose={closeIntro} />

      {/* Main Intro Container matching approved 2-column layout */}
      <div className="intro-container">
        {/* Left Column: GRIT SCHOOL Copy & CTA */}
        <IntroTransition isVisible={true}>
          <IntroContent onStartClick={() => {
            setAuthMode('signup');
            transitionToAuth();
          }} />
        </IntroTransition>

        {/* Right Column: Intro Video */}
        <IntroTransition isVisible={true}>
          <div style={{ width: '100%', height: '420px' }}>
            <IntroVideo onEnded={onVideoEnded} autoPlay={true} />
          </div>
        </IntroTransition>
      </div>

      {/* Auth Screen Modal (Displayed when video completes or user scrolls down) */}
      <Modal
        isOpen={step === 'AUTH_VISIBLE'}
        onClose={closeIntro}
        title={authMode === 'signup' ? 'Join GRIT SCHOOL' : 'Welcome Back'}
      >
        <AuthForm
          mode={authMode}
          onToggleMode={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
          onSuccess={closeIntro}
        />
      </Modal>
    </div>
  );
};
