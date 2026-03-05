import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import './InstallPrompt.css';

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      const dismissed = sessionStorage.getItem('pwa-dismissed');
      if (!dismissed) setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
  };

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('pwa-dismissed', '1');
  };

  if (!visible) return null;

  return (
    <div className="install-prompt">
      <span className="install-prompt-icon">🥭</span>
      <div className="install-prompt-text">
        <strong>Add to Home Screen</strong>
        <span>Shop mangoes like an app — fast & easy</span>
      </div>
      <button className="install-prompt-btn" onClick={handleInstall}>
        <Download size={14} />
        Install
      </button>
      <button className="install-prompt-close" onClick={handleDismiss} aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}
