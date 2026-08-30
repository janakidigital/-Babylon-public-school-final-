import React from 'react';
import HeroSection from '../../components/home/HeroSection';
import StatisticsSection from '../../components/home/StatisticsSection';
import AboutSection from '../../components/home/AboutSection';
import ProgramsSection from '../../components/home/ProgramsSection';
import WhyChooseUsSection from '../../components/home/WhyChooseUsSection';
import StudentLifeSection from '../../components/home/StudentLifeSection';
// import HighlightsSection from '../../components/home/HighlightsSection';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import NoticesSection from '../../components/home/NoticesSection';
import ContactSection from '../../components/home/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatisticsSection />
      <AboutSection />
      <ProgramsSection />
      <WhyChooseUsSection />
      <StudentLifeSection />
      {/* <HighlightsSection /> */}
      <TestimonialsSection />
      <NoticesSection limit={5} />
      <ContactSection />
    </>
  )
}
