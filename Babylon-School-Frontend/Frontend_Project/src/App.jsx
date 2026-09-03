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
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // Add chatbot script with custom icon
  useEffect(() => {
    // Get the script URL from environment variables with fallback
    const scriptUrl = import.meta.env.VITE_CHATBOT_SCRIPT_URL || 'https://chatbot.nextleaper.com/static/widget.js';
    
    console.log(' Chatbot script URL:', scriptUrl); // Debug log

    const existingScript = document.querySelector(
      `script[src="${scriptUrl}"]`
    );
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log(' Chatbot loaded successfully');
        
        setTimeout(() => {
          const icon = document.getElementById('nextleaper-chatbot-icon');
          if (icon) {
            // Create SVG chat icon with gradient background
            const svg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="30" fill="url(#grad)"/>
                <path d="M44 20H20c-2.2 0-4 1.8-4 4v12c0 2.2 1.8 4 4 4h2v4l4-4h14c2.2 0 4-1.8 4-4V24c0-2.2-1.8-4-4-4z" fill="white"/>
                <circle cx="26" cy="30" r="2" fill="#667eea"/>
                <circle cx="32" cy="30" r="2" fill="#667eea"/>
                <circle cx="38" cy="30" r="2" fill="#667eea"/>
                <path d="M26 26h12" stroke="#667eea" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            `;
            
            icon.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
            icon.style.borderRadius = '50%';
            icon.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
            icon.style.border = '3px solid white';
            icon.style.objectFit = 'cover';
          }
        }, 1500);
      };
      
      script.onerror = () => {
        console.error(' Failed to load chatbot');
      };
      
      document.body.appendChild(script);
    }

    return () => {
      const scriptTag = document.querySelector(
        `script[src="${scriptUrl}"]`
      );
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, []);

  if (!ready) {
    return <LoadingScreen fullPage message="Babylon National School" />;
  }

  
  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
      <PosterPopup />
    </>
  );
}