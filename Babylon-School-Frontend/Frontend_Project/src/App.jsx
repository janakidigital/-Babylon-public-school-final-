import React, { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import LoadingScreen from "./components/common/LoadingScreen";
import "./components/common/LoadingScreen.css";
import PosterPopup from "./components/common/PosterPopup";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return <LoadingScreen message="Loading website..." variant="dark" />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
      <PosterPopup />
    </>
  );
}