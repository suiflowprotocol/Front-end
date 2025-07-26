import React, { useState } from 'react';
import './SettingsPage.css';

interface SettingsPageProps {
  onClose: () => void;
  slippage: string;
  setSlippage: (value: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose, slippage, setSlippage }) => {
  const [customSlippage, setCustomSlippage] = useState("");
  const [transactionMode, setTransactionMode] = useState("Default");
  const [mevProtection, setMevProtection] = useState(true);

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

  const handleSave = () => {
    setSlippage(slippage);
    onClose();
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
            <img src="https://img.icons8.com/ios/50/vertical-settings-mixer--v1.png" alt="Slippage Icon" className="section-icon" />
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
            <img src="https://img.icons8.com/ios-filled/50/flash-on.png" alt="Transaction Mode Icon" className="section-icon" />
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
            <img src="https://img.icons8.com/ios-filled/50/security-checked.png" alt="MEV Protect Icon" className="section-icon" />
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
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;