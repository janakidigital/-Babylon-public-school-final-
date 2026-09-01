import React, { Suspense, lazy, useEffect, useState } from "react";
import "./App.css";
import "./components/common/LoadingScreen.css";
import LoadingScreen from "./components/common/LoadingScreen";
import { Toaster } from "react-hot-toast";

// Lazy-load large components
const AppRoutes = lazy(() => import("./routes/AppRoutes"));
const PosterPopup = lazy(() => import("./components/common/PosterPopup"));

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // No artificial delay
    setReady(true);
  }, []);

  if (!ready) {
    return <LoadingScreen message="Loading website..." variant="dark" />;
  }

  return (
    <>
      <Toaster position="top-right" />

      <Suspense fallback={<LoadingScreen message="Loading page..." variant="dark" />}>
        <AppRoutes />
        <PosterPopup />
      </Suspense>
    </>
  );
}