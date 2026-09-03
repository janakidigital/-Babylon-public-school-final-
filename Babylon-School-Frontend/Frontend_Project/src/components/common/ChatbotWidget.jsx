// src/components/common/ChatbotWidget.jsx
import React, { useEffect } from 'react';
import robotAssistant from '../../assets/robot-assistant.png';
import { CHATBOT_CONFIG } from '../../config/chatbot';

const ChatbotWidget = () => {
  useEffect(() => {
    const scriptUrl = CHATBOT_CONFIG.scriptUrl;
    
    console.log('Chatbot script URL:', scriptUrl);

    const existingScript = document.querySelector(
      `script[src="${scriptUrl}"]`
    );
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Chatbot loaded successfully');
        
        setTimeout(() => {
          const originalIcon = document.getElementById('nextleaper-chatbot-icon');
          if (originalIcon) {
            originalIcon.style.display = 'none';
            
            const customIconContainer = document.createElement('div');
            customIconContainer.id = 'custom-chatbot-icon';
            customIconContainer.style.cssText = `
              position: fixed;
              bottom: 20px;
              right: 20px;
              z-index: 10000;
              cursor: pointer;
              width: ${CHATBOT_CONFIG.icon.size}px;
              height: ${CHATBOT_CONFIG.icon.size}px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: ${CHATBOT_CONFIG.icon.backgroundColor};
              border-radius: 50%;
              box-shadow: 0 4px 25px ${CHATBOT_CONFIG.icon.shadowColor};
              border: ${CHATBOT_CONFIG.icon.borderWidth}px solid ${CHATBOT_CONFIG.icon.borderColor};
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            `;
            
            customIconContainer.onmouseenter = () => {
              customIconContainer.style.transform = 'scale(1.08)';
              customIconContainer.style.boxShadow = '0 6px 35px rgba(37, 99, 235, 0.6)';
            };
            customIconContainer.onmouseleave = () => {
              customIconContainer.style.transform = 'scale(1)';
              customIconContainer.style.boxShadow = '0 4px 25px rgba(37, 99, 235, 0.5)';
            };
            
            customIconContainer.onclick = () => {
              const chatContainer = document.getElementById('nextleaper-chatbot-container');
              if (chatContainer) {
                const isVisible = chatContainer.style.display === 'flex';
                chatContainer.style.display = isVisible ? 'none' : 'flex';
              }
            };
            
            document.body.appendChild(customIconContainer);
            
            const img = document.createElement('img');
            img.src = robotAssistant;
            img.style.cssText = `
              width: ${CHATBOT_CONFIG.icon.imageSize}px;
              height: ${CHATBOT_CONFIG.icon.imageSize}px;
              border-radius: 50%;
              object-fit: cover;
            `;
            
            customIconContainer.appendChild(img);
          }
        }, 1500);
      };
      
      script.onerror = () => {
        console.error('Failed to load chatbot');
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
      
      const customIcon = document.getElementById('custom-chatbot-icon');
      if (customIcon) {
        customIcon.remove();
      }
    };
  }, []);

  return null;
};

export default ChatbotWidget;