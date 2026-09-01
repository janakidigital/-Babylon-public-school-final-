import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import PageTransition from "../components/common/PageTransition";
import LoadingScreen from "../components/common/LoadingScreen";

// ----------------------
// Lazy Loaded Pages
// ----------------------
const HomePage = lazy(() => import("../pages/Home/HomePage"));

const AboutPage = lazy(() => import("../pages/About/AboutPage"));
const InternationalPartnersPage = lazy(() =>
  import("../pages/About/InternationalPartnersPage")
);
const NationalPartnersPage = lazy(() =>
  import("../pages/About/NationalPartnersPage")
);

const AcademicsPage = lazy(() =>
  import("../pages/Academics/AcademicsPage")
);
const CoursesPage = lazy(() => import("../pages/Academics/CoursesPage"));
const CourseDetailsPage = lazy(() =>
  import("../pages/Academics/CourseDetailsPage")
);

const EventsPage = lazy(() => import("../pages/Events/EventsPage"));
const EventDetailsPage = lazy(() =>
  import("../pages/Events/EventDetailsPage")
);

const NoticesPage = lazy(() => import("../pages/Notices/NoticesPage"));

const BlogPage = lazy(() => import("../pages/Blog/BlogPage"));
const BlogGridOnePage = lazy(() =>
  import("../pages/Blog/BlogGridOnePage")
);
const BlogGridTwoPage = lazy(() =>
  import("../pages/Blog/BlogGridTwoPage")
);
const BlogDetailsPage = lazy(() =>
  import("../pages/Blog/BlogDetailsPage")
);

const TeamPage = lazy(() => import("../pages/Team/TeamPage"));
const TeacherProfilePage = lazy(() =>
  import("../pages/Team/TeacherProfilePage")
);
const BecomeTeacherPage = lazy(() =>
  import("../pages/Team/BecomeTeacherPage")
);

const AdmissionsPage = lazy(() =>
  import("../pages/Admissions/AdmissionsPage")
);

const FacilitiesPage = lazy(() =>
  import("../pages/Facilities/FacilitiesPage")
);

const GalleryPage = lazy(() => import("../pages/Gallery/GalleryPage"));

const AchievementsPage = lazy(() =>
  import("../pages/Achievements/AchievementsPage")
);

const FaqPage = lazy(() => import("../pages/FAQ/FaqPage"));

const ContactPage = lazy(() =>
  import("../pages/Contact/ContactPage")
);

const DownloadsPage = lazy(() =>
  import("../pages/Downloads/DownloadsPage")
);

const NotFoundPage = lazy(() =>
  import("../pages/NotFound/NotFoundPage")
);

// ----------------------
// Layout
// ----------------------
function PublicLayout({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
}

// ----------------------
// Routes
// ----------------------
export default function PublicRoutes() {
  const location = useLocation();

  return (
    <PublicLayout>
      <Suspense
        fallback={
          <LoadingScreen
            message="Loading page..."
            variant="dark"
          />
        }
      >
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
              path="/notices/:id"
              element={
                <PageTransition>
                  <NoticesPage />
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

            {/* 404 Page */}
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
      </Suspense>
    </PublicLayout>
  );
}