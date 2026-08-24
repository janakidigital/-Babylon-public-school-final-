import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import HomePage from '../pages/Home/HomePage';
import AboutPage from '../pages/About/AboutPage';
import AcademicsPage from '../pages/Academics/AcademicsPage';
import CoursesPage from '../pages/Academics/CoursesPage';
import CourseDetailsPage from '../pages/Academics/CourseDetailsPage';
import StudentLifePage from '../pages/StudentLife/StudentLifePage';
import EventsPage from '../pages/Events/EventsPage';
import EventDetailsPage from '../pages/Events/EventDetailsPage';
import NoticesPage from '../pages/Notices/NoticesPage';
import BlogPage from '../pages/Blog/BlogPage';
import BlogGridOnePage from '../pages/Blog/BlogGridOnePage';
import BlogGridTwoPage from '../pages/Blog/BlogGridTwoPage';
import BlogDetailsPage from '../pages/Blog/BlogDetailsPage';
import TeamPage from '../pages/Team/TeamPage';
import TeacherProfilePage from '../pages/Team/TeacherProfilePage';
import BecomeTeacherPage from '../pages/Team/BecomeTeacherPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import AdmissionsPage from '../pages/Admissions/AdmissionsPage';
import FacilitiesPage from '../pages/Facilities/FacilitiesPage';
import GalleryPage from '../pages/Gallery/GalleryPage';
import AchievementsPage from '../pages/Achievements/AchievementsPage';
import FaqPage from '../pages/FAQ/FaqPage';
import ContactPage from '../pages/Contact/ContactPage';
import LoginPage from '../pages/Auth/LoginPage';
import SignupPage from '../pages/Auth/SignupPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';

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
  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/academics" element={<AcademicsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/course-details/:id" element={<CourseDetailsPage />} />
        <Route path="/student-life" element={<StudentLifePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/event-details/:id" element={<EventDetailsPage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/notices/:id" element={<NoticesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog-grid-one" element={<BlogGridOnePage />} />
        <Route path="/blog-grid-two" element={<BlogGridTwoPage />} />
        <Route path="/blog-details/:id" element={<BlogDetailsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/teacher-profile/:id" element={<TeacherProfilePage />} />
        <Route path="/teachers/:id" element={<TeacherProfilePage />} />
        <Route path="/become-a-teacher" element={<BecomeTeacherPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admissions" element={<AdmissionsPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PublicLayout>
  );
}
