import React, { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import LoadingScreen from "./components/common/LoadingScreen";
import "./components/common/LoadingScreen.css";
import PosterPopup from "./components/common/PosterPopup";
import { Toaster } from "react-hot-toast";
import ChatbotWidget from "./components/common/ChatbotWidget"; // Import the component

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return <LoadingScreen fullPage message="Babylon National School" />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
      <PosterPopup />
      <ChatbotWidget /> {/* Clean and simple! */}
    </>
  );
}