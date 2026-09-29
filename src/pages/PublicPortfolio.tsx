import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ResearchSection from '../components/sections/ResearchSection';
import CadCaeSection from '../components/sections/CadCaeSection';
import PlcSection from '../components/sections/PlcSection';
import CertificationsSection from '../components/sections/CertificationsSection';
import AiEngineeringSection from '../components/sections/AiEngineeringSection';
import ArticlesSection from '../components/sections/ArticlesSection';
import ResumeSection from '../components/sections/ResumeSection';
import ConnectionsSection from '../components/sections/ConnectionsSection';
import ContactSection from '../components/sections/ContactSection';
import DynamicSection from '../components/sections/DynamicSection';
import ClickTelemetryOverlay from '../components/ui/ClickTelemetryOverlay';
import { fetchSections } from '@/lib/portfolioService';
import type { PortfolioSection } from '@/lib/types';


export default function PublicPortfolio() {
  const [dynamicSections, setDynamicSections] = useState<PortfolioSection[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchSections().then(({ data }) => {
      if (mounted) {
        setDynamicSections(data.filter((s) => s.enabled));
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--color-obsidian)] text-[var(--color-white)] overflow-hidden">
      {/* Global Click Telemetry Interaction System */}
      <ClickTelemetryOverlay />

      {/* Global Engineering Fixed Navbar */}
      <Navbar />


      <main className="relative z-10 flex flex-col">
        {/* Core Architectural Sections */}
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ResearchSection />
        <CadCaeSection />
        <PlcSection />
        <CertificationsSection />
        <AiEngineeringSection />
        <ArticlesSection />
        <ResumeSection />
        <ConnectionsSection />

        {/* Dynamic Sections from Supabase CMS */}
        {dynamicSections.map((section) => (
          <DynamicSection key={section.id} section={section} />
        ))}

        {/* Contact Console */}
        <ContactSection />
      </main>

      {/* Engineering Footer */}
      <Footer />
    </div>
  );
}
