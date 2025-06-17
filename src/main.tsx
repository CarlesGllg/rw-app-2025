
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize i18n before rendering the app
import './lib/i18n'

// Small delay to ensure i18n is fully initialized
setTimeout(() => {
  createRoot(document.getElementById("root")!).render(<App />);
}, 0);
