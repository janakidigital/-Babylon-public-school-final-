import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingScreen from "../components/common/LoadingScreen";

// Lazy load route groups
const PublicRoutes = lazy(() => import("./PublicRoutes"));
const AdminRoutes = lazy(() => import("./AdminRoutes"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading page..." variant="dark" />}>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </Suspense>
  );
}