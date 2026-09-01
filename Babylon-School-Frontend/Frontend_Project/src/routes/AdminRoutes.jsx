import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingScreen from "../components/common/LoadingScreen";

// Lazy load Admin Panel
const AdminPage = lazy(() => import("../admin/AdminPage"));

export default function AdminRoutes() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          message="Loading admin panel..."
          variant="dark"
        />
      }
    >
      <Routes>
        <Route path="/*" element={<AdminPage />} />
      </Routes>
    </Suspense>
  );
}