import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LaunchPage.css';

function LaunchPage() {
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    navigate('/app');
  };

  const handleReadDoc = () => {
    window.open('https://magma-finance.gitbook.io', '_blank'); // Assumed Gitbook URL
  };

  const [glowPosition] = useState({ x: 50, y: 50 }); // Fixed in center

  const logos = [
    // Keep the logos or replace with Sui-related if needed
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqYyygKaispLzlgNY95kc5HBQd3qW7ugzAkg&s",
    // ... other logos ...
    "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/buck.svg/public"
  ];

  return (
    <div className="cover-container30">
      <div className="mosaic-background30">
        {Array.from({ length: 400 }).map((_, i) => (
          <img
            key={i}
            src={logos[i % logos.length]}
            alt={`logo-${i}`}
            className="mosaic-tile30"
          />
        ))}
      </div>
      <div className="background-overlay30"></div>
      <div className="background-glow30" style={{
        left: `${glowPosition.x}%`,
        top: `${glowPosition.y}%`,
      }}></div>
      <div className="logo-container30">
        <img src="https://pbs.twimg.com/profile_images/1858767491109163008/bxBJTMsP.jpg" alt="Magma Logo" className="logo-image30" />
        <span className="logo-text30">Seal</span>
      </div>
      <div className="social-buttons30">
        <a href="https://x.com/Magma_Finance" target="_blank" rel="noopener noreferrer" className="social-link30">
          <img src="https://img.icons8.com/ios/50/ffffff/twitterx.png" alt="X" className="social-icon30" />
        </a>
        <a href="https://discord.gg/magmafinance" target="_blank" rel="noopener noreferrer" className="social-link30">
          <img src="https://img.icons8.com/ios/50/ffffff/discord-logo.png" alt="Discord" className="social-icon30" />
        </a>
      </div>

      <section className="section hero-section">
        <div className="content-wrapper30">
          <h1 className="title30">
            <span className="title-line1">The Most Adaptive</span>
            <span className="title-line2">Liquidity Engine on Sui</span>
          </h1>
          <p className="subtitle30">Magma is the first AMM on Sui to implement adaptive liquidity provisioning. It offers unmatched capital efficiency, permissionless incentives, and a seamless trading experience — all secured by robust audits.</p>
          <div className="buttons30">
            <button className="launch-button30" onClick={handleLaunchApp}>
              Launch App
            </button>
            <button className="doc-button30" onClick={handleReadDoc}>
              Read the Doc
            </button>
          </div>
        </div>
      </section>

      <section className="section user-roles-section">
        <h2 className="section-title">Participant Roles</h2>
        <div className="roles-wrapper">
          <div className="role-card">
            <img src="https://img.icons8.com/ios/50/ffffff/wallet.png" alt="Liquidity Provider" className="role-icon" />
            <h3 className="role-title">Liquidity Providers</h3>
            <p className="role-description">Provide liquidity dynamically and earn optimized yields.</p>
          </div>
          <div className="role-card">
            <img src="https://img.icons8.com/ios/50/ffffff/swap.png" alt="Trader" className="role-icon" />
            <h3 className="role-title">Traders</h3>
            <p className="role-description">Experience deeper liquidity and lower fees with ALMM.</p>
          </div>
          <div className="role-card">
            <img src="https://img.icons8.com/ios/50/ffffff/coins.png" alt="Governance Participant" className="role-icon" />
            <h3 className="role-title">Governance Participants</h3>
            <p className="role-description">Shape the future of Magma with decentralized governance.</p>
          </div>
        </div>
      </section>

      <section className="section key-features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-wrapper">
          <div className="feature-card">
            <img src="https://img.icons8.com/ios/50/ffffff/box.png" alt="Adaptive Liquidity" className="feature-icon" />
            <h3 className="feature-title">Adaptive Liquidity Provision</h3>
            <p className="feature-description">Dynamic range-based liquidity for maximum capital efficiency.</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/ios/50/ffffff/coins.png" alt="Capital-Efficient" className="feature-icon" />
            <h3 className="feature-title">Capital-Efficient AMM</h3>
            <p className="feature-description">Minimized slippage. Optimized fee generation. Built for volatility.</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/ios/50/ffffff/shield.png" alt="Audited" className="feature-icon" />
            <h3 className="feature-title">Audited & Secure</h3>
            <p className="feature-description">Battle-tested smart contracts and rigorous security audits.</p>
          </div>
        </div>
      </section>

      <section className="section partners-section">
        <h2 className="section-title">Our Auditors</h2>
        <div className="partners-wrapper">
          <div className="partner-card">
            <img src="https://pbs.twimg.com/profile_images/1585464816298336256/C-Vc3cv2.jpg" alt="MoveBit Logo" className="partner-logo" />
            <span className="partner-name">MoveBit</span>
            <p className="partner-description">MoveBit is a security team focused on the Move ecosystem, building the standard and delivering security audits for secure Move ecosystem.</p>
          </div>
          <div className="partner-card">
            <img src="https://pbs.twimg.com/profile_images/1715242418457747456/FkBeZCZ5.jpg" alt="Zellic Logo" className="partner-logo" />
            <span className="partner-name">Zellic</span>
            <p className="partner-description">Zellic specializes in securing emerging technologies.</p>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <h2 className="section-title">We've got answers! Here are some common inquiries:</h2>
        <div className="faq-wrapper">
          <div className="faq-item">
            <div className="faq-question-wrapper">
              <h3 className="faq-question">How do I participate?</h3>
              <span className="faq-toggle">✨</span>
            </div>
            <p className="faq-answer">Provide liquidity to Magma pools or trade on the platform to benefit from adaptive pricing and rewards.</p>
          </div>
          <div className="faq-item">
            <div className="faq-question-wrapper">
              <h3 className="faq-question">Why choose Magma over other DEXs?</h3>
              <span className="faq-toggle">✨</span>
            </div>
            <p className="faq-answer">Magma is the first AMM on Sui to implement adaptive liquidity provisioning. It offers unmatched capital efficiency, permissionless incentives, and a seamless trading experience — all secured by robust audits.</p>
          </div>
          <div className="faq-item">
            <div className="faq-question-wrapper">
              <h3 className="faq-question">Is Magma audited?</h3>
              <span className="faq-toggle">✨</span>
            </div>
            <p className="faq-answer">Yes. Magma's smart contracts are audited by leading security firms to ensure safety and reliability.</p>
          </div>
          <div className="faq-item">
            <div className="faq-question-wrapper">
              <h3 className="faq-question">Which assets are supported?</h3>
              <span className="faq-toggle">✨</span>
            </div>
            <p className="faq-answer">Magma supports major blue-chip assets, stablecoins, and long-tail tokens on Sui, with dynamic liquidity allocation tailored for each pair.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LaunchPage;