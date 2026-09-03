// src/config/chatbot.js
export const CHATBOT_CONFIG = {
  scriptUrl: import.meta.env.VITE_CHATBOT_SCRIPT_URL || 'https://chatbot.nextleaper.com/static/widget.js',
  icon: {
    size: 70,
    imageSize: 45,
    backgroundColor: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
    shadowColor: 'rgba(37, 99, 235, 0.5)',
    borderColor: 'white',
    borderWidth: 3
  }
};