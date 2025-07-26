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

  const handleCustomSlippage = () => {
    const value = parseFloat(customSlippage);
    if (isNaN(value) || value < 0 || value > 100) {
      alert("请输入有效的滑点百分比（0-100）");
      return;
    }
    setSlippage(value.toString());
    setCustomSlippage("");
  };

  return (
    <div className="settings-modal">
      <div className="settings-content">
        <h2 className="settings-logo">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2v-6zm0 8h2v2h-2v-2z" />
          </svg>
          Settings
        </h2>
        <button className="close-button" onClick={onClose}>
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
        <div className="slippage-section">
          <div className="section-header">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2v-6zm0 8h2v2h-2v-2z" />
            </svg>
            <h3>Slippage Tolerance</h3>
          </div>
          <div className="slippage-options">
            <div className="slippage-presets">
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
            <div className="custom-slippage">
              <input
                placeholder="Custom"
                value={customSlippage}
                onChange={(e) => setCustomSlippage(e.target.value)}
              />
              <button onClick={handleCustomSlippage}>Save</button>
            </div>
          </div>
        </div>
        <div className="transaction-mode-section">
          <div className="section-header">
            <svg viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6v-2zm0 4h8v2H6v-2zm10 0h2v2h-2v-2zm-6-4h8v2h-8v-2z" />
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
              <svg className="fast-icon" viewBox="0 0 24 24">
                <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              Fast Mode
            </button>
          </div>
          <div className="transaction-mode-note">
            Standard gas based on real-time network conditions
          </div>
        </div>
        <div className="mev-protection-section">
          <div className="section-header">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-8h2v2h-2v-2zm0-4h2v2h-2v-2z" />
            </svg>
            <h3>MEV Protect</h3>
          </div>
          <div className="mev-protection-row">
            <span className="mev-protection-label">Enable MEV Protection</span>
            <div className="mev-protection-switch">
              <input
                type="checkbox"
                checked={mevProtection}
                onChange={(e) => setMevProtection(e.target.checked)}
              />
              <span className="checkbox-custom">
                <span className="thumb"></span>
              </span>
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