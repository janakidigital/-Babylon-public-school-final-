import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import PageTransition from "../components/common/PageTransition";

import HomePage from "../pages/Home/HomePage";
import AboutPage from "../pages/About/AboutPage";
import InternationalPartnersPage from "../pages/About/InternationalPartnersPage";
import NationalPartnersPage from "../pages/About/NationalPartnersPage";
import AcademicsPage from "../pages/Academics/AcademicsPage";
import CoursesPage from "../pages/Academics/CoursesPage";
import CourseDetailsPage from "../pages/Academics/CourseDetailsPage";
import EventsPage from "../pages/Events/EventsPage";
import EventDetailsPage from "../pages/Events/EventDetailsPage";
import NoticesPage from "../pages/Notices/NoticesPage";
import BlogPage from "../pages/Blog/BlogPage";
import BlogGridOnePage from "../pages/Blog/BlogGridOnePage";
import BlogGridTwoPage from "../pages/Blog/BlogGridTwoPage";
import BlogDetailsPage from "../pages/Blog/BlogDetailsPage";
import TeamPage from "../pages/Team/TeamPage";
import TeacherProfilePage from "../pages/Team/TeacherProfilePage";
import BecomeTeacherPage from "../pages/Team/BecomeTeacherPage";
// import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import AdmissionsPage from "../pages/Admissions/AdmissionsPage";
import FacilitiesPage from "../pages/Facilities/FacilitiesPage";
import GalleryPage from "../pages/Gallery/GalleryPage";
import AchievementsPage from "../pages/Achievements/AchievementsPage";
import FaqPage from "../pages/FAQ/FaqPage";
import ContactPage from "../pages/Contact/ContactPage";
import DownloadsPage from "../pages/Downloads/DownloadsPage";
import EnhancingEcaPage from "../pages/ECA/EnhancingEcaPage";
import ExtraCurricularPage from "../pages/ECA/ExtraCurricularPage";
// import LoginPage from "../pages/Auth/LoginPage";
// import SignupPage from '../pages/Auth/SignupPage';
// import DashboardPage from '../pages/Dashboard/DashboardPage';
import NotFoundPage from "../pages/NotFound/NotFoundPage";

function PublicLayout({ children }) {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
}

export default function PublicRoutes() {
  const location = useLocation();

  return (
    <PublicLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <AboutPage />
              </PageTransition>
            }
          />
          <Route
            path="/international-partners"
            element={
              <PageTransition>
                <InternationalPartnersPage />
              </PageTransition>
            }
          />
          <Route
            path="/national-partners"
            element={
              <PageTransition>
                <NationalPartnersPage />
              </PageTransition>
            }
          />
          <Route
            path="/academics"
            element={
              <PageTransition>
                <AcademicsPage />
              </PageTransition>
            }
          />
          <Route
            path="/courses"
            element={
              <PageTransition>
                <CoursesPage />
              </PageTransition>
            }
          />
          <Route
            path="/course-details/:id"
            element={
              <PageTransition>
                <CourseDetailsPage />
              </PageTransition>
            }
          />
          <Route
            path="/events"
            element={
              <PageTransition>
                <EventsPage />
              </PageTransition>
            }
          />
          <Route
            path="/events/:id"
            element={
              <PageTransition>
                <EventDetailsPage />
              </PageTransition>
            }
          />
          <Route
            path="/event-details/:id"
            element={
              <PageTransition>
                <EventDetailsPage />
              </PageTransition>
            }
          />
          <Route
            path="/notices"
            element={
              <PageTransition>
                <NoticesPage />
              </PageTransition>
            }
          />
          <Route
            path="/information-center"
            element={
              <PageTransition>
                <NoticesPage />
              </PageTransition>
            }
          />
          <Route
            path="/information-center/notices"
            element={
              <PageTransition>
                <NoticesPage />
              </PageTransition>
            }
          />
          <Route
            path="/notices/:id"
            element={
              <PageTransition>
                <NoticesPage />
              </PageTransition>
            }
          />
          <Route
            path="/information-center/notices/:id"
            element={
              <PageTransition>
                <NoticesPage />
              </PageTransition>
            }
          />
          <Route
            path="/information-center/eca/enhancing-eca"
            element={
              <PageTransition>
                <EnhancingEcaPage />
              </PageTransition>
            }
          />
          <Route
            path="/eca/enhancing-eca"
            element={
              <PageTransition>
                <EnhancingEcaPage />
              </PageTransition>
            }
          />
          <Route
            path="/information-center/eca/extra-curricular-activities"
            element={
              <PageTransition>
                <ExtraCurricularPage />
              </PageTransition>
            }
          />
          <Route
            path="/eca/extra-curricular-activities"
            element={
              <PageTransition>
                <ExtraCurricularPage />
              </PageTransition>
            }
          />
          <Route
            path="/eca"
            element={
              <PageTransition>
                <ExtraCurricularPage />
              </PageTransition>
            }
          />
          <Route
            path="/downloads"
            element={
              <PageTransition>
                <DownloadsPage />
              </PageTransition>
            }
          />
          <Route
            path="/blog"
            element={
              <PageTransition>
                <BlogPage />
              </PageTransition>
            }
          />
          <Route
            path="/blog-grid-one"
            element={
              <PageTransition>
                <BlogGridOnePage />
              </PageTransition>
            }
          />
          <Route
            path="/blog-grid-two"
            element={
              <PageTransition>
                <BlogGridTwoPage />
              </PageTransition>
            }
          />
          <Route
            path="/blog-details/:id"
            element={
              <PageTransition>
                <BlogDetailsPage />
              </PageTransition>
            }
          />
          <Route
            path="/team"
            element={
              <PageTransition>
                <TeamPage />
              </PageTransition>
            }
          />
          <Route
            path="/teacher-profile/:id"
            element={
              <PageTransition>
                <TeacherProfilePage />
              </PageTransition>
            }
          />
          <Route
            path="/teachers/:id"
            element={
              <PageTransition>
                <TeacherProfilePage />
              </PageTransition>
            }
          />
          <Route
            path="/become-a-teacher"
            element={
              <PageTransition>
                <BecomeTeacherPage />
              </PageTransition>
            }
          />
          <Route
            path="/admissions"
            element={
              <PageTransition>
                <AdmissionsPage />
              </PageTransition>
            }
          />
          <Route
            path="/facilities"
            element={
              <PageTransition>
                <FacilitiesPage />
              </PageTransition>
            }
          />
          <Route
            path="/facilities/:id"
            element={
              <PageTransition>
                <FacilitiesPage />
              </PageTransition>
            }
          />
          <Route
            path="/gallery"
            element={
              <PageTransition>
                <GalleryPage />
              </PageTransition>
            }
          />
          <Route
            path="/achievements"
            element={
              <PageTransition>
                <AchievementsPage />
              </PageTransition>
            }
          />
          <Route
            path="/faq"
            element={
              <PageTransition>
                <FaqPage />
              </PageTransition>
            }
          />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <ContactPage />
              </PageTransition>
            }
          />
          {/* <Route
            path="/login"
            element={
              <PageTransition>
                <LoginPage />
              </PageTransition>
            }
          /> */}

          {/* <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} /> */}

          {/* 404 page for any unknown route */}
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFoundPage />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </PublicLayout>
  );
}
