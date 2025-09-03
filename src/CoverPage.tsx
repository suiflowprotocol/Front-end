import React from 'react';
import { useNavigate } from 'react-router-dom';

const CoverPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    navigate('/swap');
  };

  return (
    <div className="cover-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(45deg, #1e3a8a, #1f2937, #4b0082, #006d5b)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-color)',
      padding: '40px 20px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes particleFloat {
          0% { transform: translate(0, 0); opacity: 0.3; }
          50% { opacity: 0.5; }
          100% { transform: translate(100px, -100px); opacity: 0; }
        }
        .cover-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"%3E%3Ccircle cx="50" cy="50" r="3" fill="rgba(255,255,255,0.2)" /%3E%3Ccircle cx="200" cy="200" r="2" fill="rgba(255,255,255,0.15)" /%3E%3Ccircle cx="400" cy="100" r="4" fill="rgba(255,255,255,0.25)" /%3E%3Ccircle cx="600" cy="300" r="3" fill="rgba(255,255,255,0.2)" /%3E%3C/svg%3E');
          background-size: 800px 800px;
          animation: particleFloat 20s infinite linear;
          pointer-events: none;
        }
        .cover-container {
          text-align: center;
          width: 100%;
          max-width: 1280px;
          padding: 0 24px;
          animation: fadeIn 1s ease-out;
        }
        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          animation: fadeIn 1.2s ease-out;
        }
        .logo-image {
          width: 96px;
          height: 96px;
          margin-right: 20px;
          transition: transform 0.3s ease;
        }
        .logo-image:hover {
          transform: scale(1.1);
        }
        .logo-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 48px;
          font-weight: 700;
          letter-spacing: 2px;
          background: linear-gradient(90deg, #3b82f6, #10b981);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 8px rgba(59, 130, 246, 0.5), 0 0 16px rgba(16, 185, 129, 0.3);
          transition: transform 0.3s ease;
        }
        .logo-text:hover {
          transform: scale(1.05);
        }
        .built-on {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          font-size: 22px;
          font-weight: 500;
          color: var(--text-secondary);
          animation: fadeIn 1.4s ease-out;
        }
        .sui-logo {
          width: 24px;
          height: 24px;
          margin: 0 10px;
        }
        .headline {
          font-family: 'Poppins', sans-serif;
          font-size: 64px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 28px;
          background: linear-gradient(180deg, #ffffff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: fadeIn 1.6s ease-out;
        }
        .subheadline {
          font-size: 28px;
          font-weight: 400;
          margin-bottom: 56px;
          color: var(--text-secondary);
          animation: fadeIn 1.8s ease-out;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
          margin-bottom: 56px;
          animation: fadeIn 2s ease-out;
        }
        .feature-card {
          background: var(--card-bg);
          padding: 32px;
          border-radius: 16px;
          border: 1px solid transparent;
          background-clip: padding-box, border-box;
          background-origin: padding-box, border-box;
          box-shadow: 0 8px 24px var(--shadow-color);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 16px;
          padding: 2px;
          background: linear-gradient(45deg, #3b82f6, #10b981);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        }
        .feature-icon {
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
        }
        .feature-card h3 {
          font-family: 'Poppins', sans-serif;
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-color);
        }
        .feature-card p {
          font-size: 16px;
          color: var(--text-secondary);
        }
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 24px;
          animation: fadeIn 2.2s ease-out;
        }
        .launch-button {
          background: linear-gradient(90deg, #3b82f6, #10b981);
          color: #ffffff;
          font-family: 'Poppins', sans-serif;
          font-size: 20px;
          font-weight: 600;
          padding: 16px 48px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }
        .launch-button:hover {
          background: linear-gradient(90deg, #4b9cfa, #34d399);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        .docs-button {
          background: transparent;
          color: var(--text-color);
          font-family: 'Poppins', sans-serif;
          font-size: 20px;
          font-weight: 600;
          padding: 16px 48px;
          border: 2px solid var(--primary-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }
        .docs-button:hover {
          background: var(--primary-color);
          color: #ffffff;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        .social-links {
          position: absolute;
          top: 24px;
          right: 24px;
          display: flex;
          gap: 16px;
          z-index: 10;
        }
        .social-link {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--modal-bg);
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .social-link:hover {
          background: var(--hover-bg);
          transform: translateY(-4px);
          box-shadow: 0 4px 12px var(--shadow-color);
        }
        .social-icon {
          width: 24px;
          height: 24px;
          fill: var(--text-color);
        }
        .social-link:hover .social-icon {
          fill: var(--primary-color);
        }
        .social-tooltip {
          visibility: hidden;
          position: absolute;
          top: 100%;
          right: 50%;
          transform: translateX(50%);
          background: var(--modal-bg);
          color: var(--text-color);
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 6px;
          white-space: nowrap;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .social-link:hover .social-tooltip {
          visibility: visible;
          opacity: 1;
        }
        @media (max-width: 1024px) {
          .cover-container {
            max-width: 90%;
          }
          .headline {
            font-size: 48px;
          }
          .subheadline {
            font-size: 24px;
          }
          .feature-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .social-links {
            top: 16px;
            right: 16px;
            gap: 12px;
          }
          .social-link {
            width: 36px;
            height: 36px;
          }
          .social-icon {
            width: 20px;
            height: 20px;
          }
        }
        @media (max-width: 640px) {
          .headline {
            font-size: 36px;
          }
          .subheadline {
            font-size: 18px;
            margin-bottom: 40px;
          }
          .logo-image {
            width: 72px;
            height: 72px;
          }
          .logo-text {
            font-size: 36px;
            letter-spacing: 1.5px;
          }
          .built-on {
            font-size: 18px;
          }
          .sui-logo {
            width: 20px;
            height: 20px;
          }
          .feature-card {
            padding: 24px;
          }
          .feature-icon {
            width: 40px;
            height: 40px;
          }
          .feature-card h3 {
            font-size: 24px;
          }
          .action-buttons {
            flex-direction: column;
            gap: 16px;
          }
          .launch-button, .docs-button {
            font-size: 18px;
            padding: 14px 32px;
          }
          .social-links {
            top: 12px;
            right: 12px;
            gap: 8px;
          }
          .social-link {
            width: 32px;
            height: 32px;
          }
          .social-icon {
            width: 18px;
            height: 18px;
          }
          .social-tooltip {
            font-size: 10px;
            padding: 4px 8px;
          }
        }
      `}</style>

      {/* Social Media Links */}
      <div className="social-links">
        <div className="social-link">
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <span className="social-tooltip">Follow us on X</span>
        </div>
        <div className="social-link">
          <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
            <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.258 2.263a1.026 1.026 0 00-.708-.143l-19.5 2.77a1 1 0 00-.76 1.335 1.01 1.01 0 00.292.467l3.947 3.955 1.766 10.25a1 1 0 00.584.757 1 1 0 00.964-.115l5.308-4.865 4.806 3.75a1 1 0 001.475-.346l4.5-17.5a1 1 0 00-.374-1.36zm-4.614 4.523l-8.636 8.58-1.964-1.964 8.636-8.58 1.964 1.964z"/>
            </svg>
          </a>
          <span className="social-tooltip">Join our Telegram</span>
        </div>
        <div className="social-link">
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
            <svg className="social-icon" viewBox="0 0 127.14 96.36" xmlns="http://www.w3.org/2000/svg">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5.18-12.74,11.45-12.74a12.81,12.81,0,0,1,4.83,1,68.09,68.09,0,0,1,3.93,2.39c1.46.93,2.9,1.93,4.3,3a12.08,12.08,0,0,1,3.62,8.72C54.65,60,49.71,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.16-12.74,11.43-12.74a12.85,12.85,0,0,1,4.85,1,67.65,67.65,0,0,1,3.91,2.39c1.46.93,2.9,1.93,4.29,3a12.09,12.09,0,0,1,3.63,8.72C100.94,60,96,65.69,84.69,65.69Z"/>
            </svg>
          </a>
          <span className="social-tooltip">Join our Discord</span>
        </div>
      </div>

      <div className="cover-container">
        {/* Logo and Branding */}
        <div className="logo-container">
          <img 
            src="https://i.meee.com.tw/SdliTGK.png" 
            alt="SuiFlow Logo" 
            className="logo-image"
          />
          <span className="logo-text">SuiFlow CLMM DEX</span>
        </div>

        {/* Built on SUI */}
        <div className="built-on">
          <span>Built on</span>
          <img 
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8.40657 5.17061L8.40639 5.17105C8.81435 5.68259 9.05815 6.3305 9.05815 7.03519C9.05815 7.75037 8.80704 8.40707 8.38808 8.92208L8.352 8.96642L8.34243 8.91006C8.33431 8.86213 8.32474 8.81376 8.31364 8.76497C8.10396 7.84371 7.42079 7.05371 6.2964 6.41406C5.53711 5.98331 5.1025 5.46461 4.98839 4.87529C4.91469 4.49421 4.96948 4.11144 5.07537 3.78358C5.18121 3.45583 5.33868 3.18124 5.47245 3.01591L5.47253 3.01581L5.90992 2.48097C5.98663 2.38717 6.13018 2.38717 6.20689 2.48097L8.40657 5.17061ZM9.09838 4.63626L9.09847 4.63606L6.16677 1.05133C6.11079 0.982889 6.006 0.982889 5.95002 1.05133L3.01828 4.6361L3.01837 4.6363L3.00883 4.64813C2.46933 5.31759 2.14648 6.16836 2.14648 7.09448C2.14648 9.25138 3.89786 11 6.05838 11C8.21891 11 9.97029 9.25138 9.97029 7.09448C9.97029 6.16836 9.64744 5.31759 9.10796 4.64813L9.09838 4.63626ZM3.71976 5.15906L3.71988 5.15892L3.9821 4.83827L3.99003 4.89746C3.9963 4.94436 4.00392 4.99149 4.01295 5.03883C4.18261 5.92905 4.78872 6.67133 5.80208 7.24623C6.68291 7.74755 7.19577 8.32403 7.34354 8.95627C7.40519 9.22013 7.41619 9.47974 7.38949 9.70673L7.38783 9.72073L7.37512 9.72696C6.97757 9.92123 6.53065 10.0302 6.0583 10.0302C4.40157 10.0302 3.05844 8.68933 3.05844 7.03519C3.05844 6.325 3.30605 5.67244 3.71976 5.15906Z' fill='%2375C8FF'/%3E%3C/svg%3E"
            alt="Sui Logo"
            className="sui-logo"
          />
          <span style={{ fontWeight: '600' }}>Sui</span>
        </div>

        {/* Main Headline */}
        <h1 className="headline">
          SuiFlow, where<br />Decentralized Trading<br />Thrives
        </h1>

        {/* Subheadline */}
        <p className="subheadline">
          Swap tokens, provide liquidity, and earn $SuiFlow rewards on the leading CLMM DEX on Sui.
        </p>

        {/* Feature Highlights */}
        <div className="feature-grid">
          <div className="feature-card">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2">
              <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <h3>Swap Tokens</h3>
            <p>Instantly trade tokens with low fees and optimal price execution using our CLMM protocol.</p>
          </div>
          <div className="feature-card">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2">
              <path d="M4 4v16h16M9 4v4M4 9h5m0 7h5m6-7v4m0 4v4"/>
            </svg>
            <h3>Provide Liquidity</h3>
            <p>Add liquidity to pools and earn fees with concentrated liquidity for maximum capital efficiency.</p>
          </div>
          <div className="feature-card">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2">
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            <h3>Earn Rewards</h3>
            <p>Stake and trade to earn $SuiFlow token rewards with our incentivized programs.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="launch-button"
            onClick={handleLaunchApp}
          >
            Launch App
          </button>
          <a
            href="https://cetus-1.gitbook.io/cetus-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="docs-button"
          >
            Documentation
          </a>
        </div>
      </div>
    </div>
  );
};

export default CoverPage;