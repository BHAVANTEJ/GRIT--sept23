import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { HeroSection } from './components/HeroSection';
import { CompaniesSection } from './components/CompaniesSection';
import { FeaturesSection } from './components/FeaturesSection';
import { CountdownSection } from './components/CountdownSection';
import { CTASection } from './components/CTASection';
import './Home.css';

export const Home: React.FC = () => {
  return (
    <MainLayout>
      <div className="home-page">
        <HeroSection />
        <CompaniesSection />
        {/* The UX / outcomes section of the landing page. */}
        <FeaturesSection />
        {/* Countdown sits immediately after it, before the closing CTA. */}
        <CountdownSection />
        <CTASection />
      </div>
    </MainLayout>
  );
};
