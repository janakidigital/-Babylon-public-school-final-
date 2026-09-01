import React, { Suspense, lazy } from "react";
import HeroSection from "../../components/home/HeroSection";
import StatisticsSection from "../../components/home/StatisticsSection";
import NoticesSection from "../../components/home/NoticesSection";
import AboutSection from "../../components/home/AboutSection";
import LoadingScreen from "../../components/common/LoadingScreen";

// Lazy-load below-the-fold sections
const ProgramsSection = lazy(() =>
  import("../../components/home/ProgramsSection")
);

const WhyChooseUsSection = lazy(() =>
  import("../../components/home/WhyChooseUsSection")
);

const StudentLifeSection = lazy(() =>
  import("../../components/home/StudentLifeSection")
);

const TestimonialsSection = lazy(() =>
  import("../../components/home/TestimonialsSection")
);

const ContactSection = lazy(() =>
  import("../../components/home/ContactSection")
);

export default function HomePage() {
  return (
    <>
      {/* Load immediately (visible above the fold) */}
      <HeroSection />
      <StatisticsSection />
      <NoticesSection limit={5} />
      <AboutSection />

      {/* Lazy load remaining sections */}
      <Suspense
        fallback={
          <LoadingScreen
            message="Loading content..."
            variant="dark"
          />
        }
      >
        <ProgramsSection />
        <WhyChooseUsSection />
        <StudentLifeSection />
        <TestimonialsSection />
        <ContactSection />
      </Suspense>
    </>
  );
}