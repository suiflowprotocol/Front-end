// Modified LaunchPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LaunchPage.css';

function LaunchPage() {
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    navigate('/app');
  };

  const handleFaucet = () => {
    navigate('/faucet');
  };

  const [glowPosition] = useState({ x: 50, y: 50 });
  const [numTiles, setNumTiles] = useState(0);
  
  const logos = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqYyygKaispLzlgNY95kc5HBQd3qW7ugzAkg&s",
    "https://s2.coinmarketcap.com/static/img/coins/200x200/34187.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7PSlNuhwWmSkl8hUhvKcDI2sFhPN5izx9EQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyEbrXvJmpRWuhl4sKr6Uz2QcUqdp9A_3QDA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuyM97kd62m-EjaM66Mo_2bIN8yP2pzaG4wQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKEZG8ITXUh3I1FCfC4K2E5g6MtizSHKJF_A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXD5KutC2Bejkpf6igB2cmPVxV87_ezYxvBQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROKkNFn6cYC29l8MXEmZEXbXaj13LE9HZhOQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbiGb-G_KsIcCG_4pQNEwoKJUWFywbr-NAUQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_c8ST7JTdrKIS90tznsZIVt4ZaQ42LB3K0Q&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnwaCfj5XYzFZySTIxL7BN1eHABFqIUkuAXQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb68QfLt2aDOzW2dk-H1sdvh98nEOS5Uy74A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4IbguWBJU4ypOHKKdMw7kFnrn1d7WzHTbSA&s",
    "https://play-lh.googleusercontent.com/ladsNim2g-g_Yc8NUcF2fo3qdxDsg91ZmJZmgQe-GKrwlvm1Mpaalt8y4dlWe4TuaD8",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMQG3m5mz0C4h30kNIou_4Vnq5oPuv-6cgTg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYctZXhV-vC9i7jSqG0ODo9sZ30kDa99USxQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfW7UPMh0MA58qOWZe5Mv5_SvrLME0c6Q9Hg&s",
    "https://avatars.githubusercontent.com/u/194261944?s=200&v=4",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNK5Dd0ahUta40pXXS-foPtlqwkKaxszKAmQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB2VQthDtGP_61Rk7QEN-HgdiuAxZFEwQgKA&s",
    "https://pbs.twimg.com/profile_images/1946262175850373120/s26duOOP_400x400.png",
    "https://static.chainbroker.io/mediafiles/projects/flowx-finance/flowx-finance.jpeg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFNsFeJJP1psoI-XZIj8HvNicR5WpOdXoiPw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbcKGWTYEUYvZuEHSUYJGOCqv0L2KMZa55cA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5vZMGhRDTiYHpqC3AjQ1N7M7NIMuGwpz0pQ&s",
    "https://s2.coinmarketcap.com/static/img/coins/200x200/25114.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB1Mass2PEeP8hXGhHmRpVBbrd7Mdryfw5kA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDn1pdMpOFqEVQxBcH_r5_Mr6aCLvokRQAKA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM2cTZ2RynkVJewgh-jofDoPwr5UjsOV0Vkg&s",
    "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIa3GDAlj9jCzDOu-MBV7_NRhZ4VlzN-i8pg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxvCjJJoCU4zh4Xz5TLUPrsCXmBpaRUehl5A&s",
    "https://s2.coinmarketcap.com/static/img/coins/200x200/32864.png",
    "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/buck.svg/public"
  ];

  useEffect(() => {
    const calculateTiles = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const tileSize = 60;
      const columns = Math.floor(vw / tileSize) + 1;
      const rowsNeeded = Math.ceil((vh * 5) / tileSize) + 10; // 5 sections + margin
      setNumTiles(columns * rowsNeeded);
    };

    calculateTiles();
    window.addEventListener('resize', calculateTiles);
    return () => window.removeEventListener('resize', calculateTiles);
  }, []);

  return (
    <div className="cover-container30">
      <div className="mosaic-background30">
        {Array.from({ length: numTiles }).map((_, i) => (
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
        <img src="https://i.meee.com.tw/SdliTGK.png" alt="SuiFlow Logo" className="logo-image30" />
        <span className="logo-text30">SuiFlow</span>
      </div>
      <div className="social-buttons30">
        <a href="https://github.com/SuiFlowprotocol?tab=repositories" target="_blank" rel="noopener noreferrer" className="social-link30">
          <img src="https://img.icons8.com/ios/50/ffffff/github" alt="Github" className="social-icon30" />
        </a>
        <a href="https://telegram.me/SuiFlowprotocol" target="_blank" rel="noopener noreferrer" className="social-link30">
          <img src="https://img.icons8.com/ios/50/ffffff/telegram" alt="SuiFlow" className="social-icon30" />
        </a>
        <a href="https://x.com/SuiFlowprotocol_" target="_blank" rel="noopener noreferrer" className="social-link30">
          <img src="https://img.icons8.com/ios/50/ffffff/twitterx.png" alt="X" className="social-icon30" />
        </a>
        <a href="https://discord.gg/SuiFlowprotocol" target="_blank" rel="noopener noreferrer" className="social-link30">
          <img src="https://img.icons8.com/ios/50/ffffff/discord-logo.png" alt="Discord" className="social-icon30" />
        </a>
      </div>

      <section className="section hero-section">
        <div className="content-wrapper30">
          <h1 className="title30">
            <span className="title-line1">The Most Open-source</span>
            <span className="title-line2">Liquidity Engine on Sui</span>
          </h1>
          <p className="subtitle30">SuiFlow is the first Open-source CLMM on Sui to implement secure liquidity provisioning. It offers unmatched capital efficiency, permissionless incentives, and a seamless trading experience — all secured by robust audits.</p>
          <div className="buttons30">
            <button className="launch-button30" onClick={handleLaunchApp}>
              Launch App
            </button>
            <button className="doc-button30" onClick={handleFaucet}>
              Faucet for Test
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
            <p className="role-description">Experience deeper liquidity and lower fees with Optimized CLMM.</p>
          </div>
          <div className="role-card">
            <img src="https://img.icons8.com/ios/50/ffffff/coins.png" alt="Governance Participant" className="role-icon" />
            <h3 className="role-title">Governance Participants</h3>
            <p className="role-description">Shape the future of SuiFlow with decentralized governance.</p>
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
            <p className="faq-answer">Provide liquidity to SuiFlow pools or trade on the platform to benefit from adaptive pricing and rewards.</p>
          </div>
          <div className="faq-item">
            <div className="faq-question-wrapper">
              <h3 className="faq-question">Why choose SuiFlow over other DEXs?</h3>
              <span className="faq-toggle">✨</span>
            </div>
            <p className="faq-answer">Open-source And Fair Token Economics.All codes of SuiFlow protocol are open and available for anyone to audit, ensuring the absolute security of Defi protocol. Token economics advocates user-led</p>
          </div>
          <div className="faq-item">
            <div className="faq-question-wrapper">
              <h3 className="faq-question">Is SuiFlow audited?</h3>
              <span className="faq-toggle">✨</span>
            </div>
            <p className="faq-answer">Yes. SuiFlow's smart contracts are audited by leading security firms to ensure safety and reliability.</p>
          </div>
          <div className="faq-item">
            <div className="faq-question-wrapper">
              <h3 className="faq-question">Which assets are supported?</h3>
              <span className="faq-toggle">✨</span>
            </div>
            <p className="faq-answer">SuiFlow supports major blue-chip assets, stablecoins, and long-tail tokens on Sui, with dynamic liquidity allocation tailored for each pair.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LaunchPage;