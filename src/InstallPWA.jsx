import { useEffect, useState } from 'react';
import './InstallPWA.css';

function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="install-prompt">
      <div className="install-content">
        <div className="install-text">
          <strong>Install T&P Tracker</strong>
          <p>Install this app on your device for quick access and offline use</p>
        </div>
        <div className="install-actions">
          <button onClick={handleInstallClick} className="btn-install">
            Install
          </button>
          <button onClick={handleDismiss} className="btn-dismiss">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPWA;
