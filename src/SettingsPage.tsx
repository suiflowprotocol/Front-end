import React, { useState } from 'react';
import './SettingsPage.css';

interface SettingsPageProps {
  onClose: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose }) => {
  const [slippage, setSlippage] = useState("0.5");
  const [customSlippage, setCustomSlippage] = useState("");
  const [transactionMode, setTransactionMode] = useState("Default");
  const [mevProtection, setMevProtection] = useState(false);

  const handleSlippageSelect = (value: string) => {
    setSlippage(value);
    setCustomSlippage("");
  };

  const handleCustomSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSlippage(e.target.value);
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setSlippage(value.toString());
    }
  };

  return (
    <div className="settings-modal">
      <div className="settings-content">
        <h2 className="settings-title">Settings</h2>
        <button className="close-button" onClick={onClose}>
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
        
        <div className="slippage-section">
          <div className="section-header">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V6h2v6z" />
            </svg>
            <h3>Slippage Tolerance</h3>
          </div>
          <div className="slippage-options">
            <div className="slippage-presets">
              <div className="button-group">
                <button 
                  className={slippage === "0.1" ? "active" : ""} 
                  onClick={() => handleSlippageSelect("0.1")}
                >
                  0.1%
                </button>
                <button 
                  className={slippage === "0.5" ? "active" : ""} 
                  onClick={() => handleSlippageSelect("0.5")}
                >
                  0.5%
                </button>
                <button 
                  className={slippage === "1" ? "active" : ""} 
                  onClick={() => handleSlippageSelect("1")}
                >
                  1%
                </button>
              </div>
            </div>
            <div className="custom-slippage">
              <input
                placeholder="Custom"
                value={customSlippage}
                onChange={handleCustomSlippageChange}
              />
            </div>
          </div>
        </div>

        <div className="separator"></div>

        <div className="transaction-mode-section">
          <div className="section-header">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 14h-8v-2h8v2zm0-4h-8V6h8v6z" />
            </svg>
            <h3>Transaction Mode</h3>
          </div>
          <div className="transaction-mode-options">
            <button 
              className={transactionMode === "Default" ? "active" : ""}
              onClick={() => setTransactionMode("Default")}
            >
              Default
            </button>
            <button 
              className={transactionMode === "Fast Mode" ? "active" : ""}
              onClick={() => setTransactionMode("Fast Mode")}
            >
              
              Fast Mode
            </button>
          </div>
        </div>

        <div className="separator"></div>

        <div className="mev-protection-section">
          <div className="section-header">
            <svg viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            <h3>MEV Protect</h3>
          </div>
          <div className="mev-protection-row">
            <span className="mev-protection-label">Enable MEV Protection</span>
            <div className="mev-protection-switch">
              <input
                type="checkbox"
                id="mev-protection"
                checked={mevProtection}
                onChange={(e) => setMevProtection(e.target.checked)}
              />
              <label htmlFor="mev-protection">
                <span className="thumb"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="button-row">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="save-button" onClick={() => alert("Settings saved")}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;