// CreatePoolPage.tsx
import React, { useState, useEffect } from "react";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { ConnectModal } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";
import TokenModal, { tokens } from "./TokenModal";
import "./CreatePoolPage.css";
import Sidebar from "./SidebarMenu";

export function CustomConnectButton() {
  const { mutate: disconnect } = useDisconnectWallet();
  const currentAccount = useCurrentAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '140px',
    height: '40px',
    background: 'linear-gradient(90deg, #1e293b, #2d3748)',
    border: '1px solid rgba(59, 130, 246, 0.5)',
    borderRadius: '12px',
    cursor: 'pointer',
    padding: '8px',
    transition: 'all 0.3s ease',
    color: '#e2e8f0',
    fontSize: '16px',
    fontWeight: '500',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `0x${address.slice(2, 6)}...${address.slice(-4)}`;
  };

  const disconnectedContent = (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: '10px' }}
      >
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
      </svg>
      <span>Connect Wallet</span>
    </>
  );

  const connectedContent = (
    <>
      {currentAccount && (
        <img
          src="https://assets.crypto.ro/logos/sui-sui-logo.png"
          alt="Wallet Logo"
          style={{ width: '22px', height: '22px', marginRight: '10px', borderRadius: '50%' }}
        />
      )}
      <span>{truncateAddress(currentAccount?.address || '')}</span>
    </>
  );

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentAccount) {
      setShowDisconnect(!showDisconnect);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDisconnect(false);
  };

  const allowedWallets = ['Slush', 'Suiet', 'Martian', 'Sui Wallet', 'Martian Sui Wallet'];
  const walletFilter = (wallet: any) => allowedWallets.includes(wallet.name);

  return (
    <div style={{ position: 'relative' }}>
      <ConnectModal
        open={isModalOpen}
        trigger={
          <button
            onClick={handleButtonClick}
            style={baseStyle}
            aria-label={currentAccount ? 'Wallet Connected' : 'Connect Wallet'}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(90deg, #2d3748, #4b5563)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(90deg, #1e293b, #2d3748)')}
          >
            {currentAccount ? connectedContent : disconnectedContent}
          </button>
        }
        onOpenChange={(open) => setIsModalOpen(open)}
        walletFilter={walletFilter}
      />
      {showDisconnect && currentAccount && (
        <button
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: '#e2e8f0',
            color: '#1e293b',
            padding: '6px 12px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            zIndex: 1000,
            marginTop: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      )}
    </div>
  );
}

const CreatePoolPage: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [showTokenModal, setShowTokenModal] = useState<string | null>(null);
  const [baseToken, setBaseToken] = useState<any>(null);
  const [quoteToken, setQuoteToken] = useState<any>(tokens.find(t => t.address === "0x2::sui::SUI"));
  const [feeTier, setFeeTier] = useState<string | null>(null);
  const [initialPrice, setInitialPrice] = useState('');
  const [rangeType, setRangeType] = useState('full');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('∞');
  const [depositBase, setDepositBase] = useState('');
  const [depositQuote, setDepositQuote] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const selectToken = (token: any, type: string) => {
    if (type === "base") {
      setBaseToken(token);
    } else {
      setQuoteToken(token);
    }
    setShowTokenModal(null);
  };

  const toggleDropdown = (menu: string | null) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isStep1Complete = baseToken && quoteToken && feeTier;
  const isStep2Complete = initialPrice && minPrice && maxPrice;
  const isStep3Complete = depositBase && depositQuote;

  const getTokenInfo = (token: any) => token || { name: 'Select token', icon: '' };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="background-glow"></div>
        <div className="header-top">
          <div className="logo-container">
            <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image" />
            <span className="logo-text">Seal</span>
          </div>
          {!isMobile ? (
            <nav className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
              <div className={`nav-item ${openDropdown === "trade" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("trade")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">Trade</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="#94a3b8" />
                </svg>
                <div className={`dropdown ${openDropdown === "trade" ? "open" : ""}`}>
                  <Link to="/app" className="dropdown-item">
                    <svg aria-hidden="true" fill="#e2e8f0" width="20px" height="20px" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                    </svg>
                    Swap
                  </Link>
                </div>
              </div>
              <div className={`nav-item ${openDropdown === "earn" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("earn")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">Earn</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="#94a3b8" />
                </svg>
                <div className={`dropdown ${openDropdown === "earn" ? "open" : ""}`}>
                  <Link to="/pool" className="dropdown-item">
                    <svg aria-hidden="true" fill="#e2e8f0" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M5.68 5.792 7.345 7.75 5.681 9.708a2.75 2.75 0 1 1 0-3.916ZM8 6.978 6.416 5.113l-.014-.015a3.75 3.75 0 1 0 0 5.304l.014-.015L8 8.522l1.584 1.865l.014.015a3.75 3.75 0 1 0 0-5.304l-.014.015zm.656.772 1.663-1.958a2.75 2.75 0 1 1 0 3.916z"/>
                    </svg>
                    Pools
                  </Link>
                  <a href="#" className="dropdown-item">
                    <svg aria-hidden="true" fill="#e2e8f0" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
<path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v3.5H11V4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                    </svg>
                    Rewards
                  </a>
                  <Link to="/xseal" className="dropdown-item">
                    <svg aria-hidden="true" fill="#e2e8f0" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42 .893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c .24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072 .56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048 .625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692a1.54 1.54 0 0 1 1.044-1.262c.658-.215 1.777-.562 2.887-.87z"/>
<path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                    </svg>
                    Burn
                  </Link>
                </div>
              </div>
              <div className={`nav-item ${openDropdown === "bridge" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("bridge")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">Bridge</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="#94a3b8" />
                </svg>
                <div className={`dropdown ${openDropdown === "bridge" ? "open" : ""}`}>
                  <a href="https://bridge.sui.io/" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <svg aria-hidden="true" fill="#e2e8f0" width="20px" height="20px" viewBox="0 0 16 16" style={{transform: 'rotate(180deg)'}}>
                      <path fill-rule="evenodd" d="M7.21 .8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.12 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21 .8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
<path fill-rule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z"/>
                    </svg>
                    Sui Bridge
                  </a>
                  <a href="https://bridge.cetus.zone/sui" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <svg aria-hidden="true" fill="#e2e8f0" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342 .474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
                    </svg>
                    Wormhole
                  </a>
                  <a href="https://mayan.finance/" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <svg aria-hidden="true" fill="#e2e8f0" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M3 3h10v10H3z" fill="#e2e8f0"/>
                    </svg>
                    Mayan
                  </a>
                </div>
              </div>
              <div className={`nav-item ${openDropdown === "more" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("more")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">More</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="#94a3b8" />
                </svg>
                <div className={`dropdown ${openDropdown === "more" ? "open" : ""}`}>
                  <a href="#" className="dropdown-item">
                    <svg aria-hidden="true" fill="#e2e8f0" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
<path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v3.5H11V4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                    </svg>
                    Docs
                  </a>
                  <a href="#" className="dropdown-item">
                    <svg aria-hidden="true" fill="#e2e8f0" width="20px" height="20px" viewBox="0 0 16 16" style={{transform: 'rotate(180deg)'}}>
                      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42 .893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c .24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072 .56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048 .625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692a1.54 1.54 0 0 1 1.044-1.262c.658-.215 1.777-.562 2.887-.87z"/>
<path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                    </svg>
                    Security
                  </a>
                </div>
              </div>
            </nav>
          ) : (
            <button className="hamburger-menu" onClick={toggleMenu}>
              <svg className="hamburger-icon" viewBox="0 0 24 24" width="24px" height="24px">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <div className="wallet-actions">
            <CustomConnectButton />
            <a href="https://x.com/sealprotocol_" target="_blank" rel="noopener noreferrer" className="icon-button">
              <svg aria-hidden="true" fill="#94a3b8" width="20px" height="20px" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1 2.25h7.28l4.71 6.23zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://t.me/sealprotocol" target="_blank" rel="noopener noreferrer" className="icon-button">
              <svg aria-hidden="true" fill="#94a3b8" width="20px" height="20px" viewBox="0 0 24 24">
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.06L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
              </svg>
            </a>
          </div>
        </div>
      </header>
      {isMobile && <Sidebar isOpen={isMenuOpen} onClose={toggleMenu} />}

      {/* Main content */}
      <main className="main-content">
        <div className="card-container">
          <div className="step-progress">
            <div className="step-item active">
              <div className="step-circle">1</div>
              <div className="step-label">
                <span>Step 1</span>
                <span>Select Token & Fee Tier</span>
              </div>
            </div>
            <div className="step-line"></div>
            <div className="step-item">
              <div className="step-circle">2</div>
              <div className="step-label">
                <span>Step 2</span>
                <span>Set Initial Price & Range</span>
              </div>
            </div>
            <div className="step-line"></div>
            <div className="step-item">
              <div className="step-circle">3</div>
              <div className="step-label">
                <span>Step 3</span>
                <span>Enter Deposit Amounts</span>
              </div>
            </div>
          </div>
          <div className="content-section">
            {currentStep === 1 && (
              <div className="step-content">
                <h2 className="section-title">Select Pair</h2>
                <p className="section-subtitle">Choose the tokens and fee tier for your liquidity pool.</p>
                <div className="token-selection">
                  <button className="token-button" onClick={() => setShowTokenModal('base')}>
                    <span>Base Token</span>
                    <div className="token-display">
                      {baseToken ? (
                        <div className="token-info">
                          <img src={baseToken.icon} alt={baseToken.name} className="token-icon" />
                          <span>{baseToken.name}</span>
                        </div>
                      ) : (
                        <span>Select Token</span>
                      )}
                      <svg className="dropdown-arrow" viewBox="0 0 12 12">
                        <path d="M6 8L2 4h8L6 8z" fill="#94a3b8" />
                      </svg>
                    </div>
                  </button>
                  <button className="token-button" onClick={() => setShowTokenModal('quote')}>
                    <span>Quote Token</span>
                    <div className="token-display">
                      {quoteToken ? (
                        <div className="token-info">
                          <img src={quoteToken.icon} alt={quoteToken.name} className="token-icon" />
                          <span>{quoteToken.name}</span>
                        </div>
                      ) : (
                        <span>Select Token</span>
                      )}
                      <svg className="dropdown-arrow" viewBox="0 0 12 12">
                        <path d="M6 8L2 4h8L6 8z" fill="#94a3b8" />
                      </svg>
                    </div>
                  </button>
                </div>
                <div className="fee-tier">
                  <span className="fee-label">Fee Tier</span>
                  <p className="fee-description">The percentage you will earn in fees.</p>
                  <div className="fee-tier-dropdown">
                    <button className="fee-button" onClick={() => setFeeTier(feeTier === "0.05%" ? null : "0.05%")}>
                      <span>{feeTier || '0.05%'}</span>
                      <svg className="dropdown-arrow" viewBox="0 0 12 12">
                        <path d="M6 8L2 4h8L6 8z" fill="#94a3b8" />
                      </svg>
                    </button>
                    {feeTier && (
                      <div className="fee-options">
                        <button onClick={() => setFeeTier("0.3%")}>0.3%</button>
                        <button onClick={() => setFeeTier("1%")}>1%</button>
                      </div>
                    )}
                  </div>
                </div>
                <button className="continue-button" disabled={!isStep1Complete} onClick={handleNextStep}>
                  Continue
                </button>
              </div>
            )}
            {currentStep === 2 && (
              <div className="step-content">
                <div className="summary">
                  <div className="token-pair">
                    <img src={baseToken.icon} alt={baseToken.name} className="token-icon" />
                    <img src={quoteToken.icon} alt={quoteToken.name} className="token-icon" style={{ marginLeft: '-10px' }} />
                    <span>{baseToken.name} - {quoteToken.name}</span>
                    <span className="fee-tag">{feeTier}</span>
                  </div>
                  <button className="edit-button" onClick={() => setCurrentStep(1)}>
                    <svg className="edit-icon" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                </div>
                <div className="price-section">
                  <h2 className="section-title">Set Initial Price</h2>
                  <p className="section-subtitle">Set the initial price for this new pool.</p>
                  <div className="price-input">
                    <input
                      type="text"
                      value={initialPrice}
                      onChange={(e) => setInitialPrice(e.target.value)}
                      placeholder="0.0"
                      className="price-field"
                    />
                    <span className="price-unit">{quoteToken.name} per {baseToken.name}</span>
                  </div>
                </div>
                <div className="range-section">
                  <h2 className="section-title">Set Price Range</h2>
                  <p className="section-subtitle">Specify the price range for your liquidity.</p>
                  <div className="range-options">
                    <button
                      className={`range-option ${rangeType === 'full' ? 'active' : ''}`}
                      onClick={() => setRangeType('full')}
                    >
                      Full Range
                    </button>
                    <button
                      className={`range-option ${rangeType === 'custom' ? 'active' : ''}`}
                      onClick={() => setRangeType('custom')}
                    >
                      Custom Range
                    </button>
                  </div>
                  <div className="range-inputs">
                    <div className="range-input">
                      <span>Min Price</span>
                      <input
                        type="text"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="0.0"
                        className="range-field"
                      />
                      <span>{quoteToken.name} per {baseToken.name}</span>
                    </div>
                    <div className="range-input">
                      <span>Max Price</span>
                      <input
                        type="text"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="∞"
                        className="range-field"
                      />
                      <span>{quoteToken.name} per {baseToken.name}</span>
                    </div>
                  </div>
                  <button className="continue-button" disabled={!isStep2Complete} onClick={handleNextStep}>
                    Continue
                  </button>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="step-content">
                <div className="summary">
                  <div className="token-pair">
                    <img src={baseToken.icon} alt={baseToken.name} className="token-icon" />
                    <img src={quoteToken.icon} alt={quoteToken.name} className="token-icon" style={{ marginLeft: '-10px' }} />
                    <span>{baseToken.name} - {quoteToken.name}</span>
                    <span className="fee-tag">{feeTier}</span>
                  </div>
                  <button className="edit-button" onClick={() => setCurrentStep(1)}>
                    <svg className="edit-icon" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                </div>
                <div className="summary">
                  <div className="price-info">
                    <span>Initial Price</span>
                    <span>{initialPrice} {quoteToken.name} per {baseToken.name}</span>
                  </div>
                  <div className="price-info">
                    <span>Price Range</span>
                    <span>{minPrice} - {maxPrice} {quoteToken.name} per {baseToken.name}</span>
                  </div>
                  <button className="edit-button" onClick={() => setCurrentStep(2)}>
                    <svg className="edit-icon" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                </div>
                <div className="deposit-section">
                  <h2 className="section-title">Deposit Amounts</h2>
                  <div className="deposit-inputs">
                    <div className="deposit-input">
                      <input
                        type="text"
                        value={depositBase}
                        onChange={(e) => setDepositBase(e.target.value)}
                        placeholder="0.0"
                        className="deposit-field"
                      />
                      <div className="token-display">
                        <img src={baseToken.icon} alt={baseToken.name} className="token-icon" />
                        <span>{baseToken.name}</span>
                      </div>
                    </div>
                    <div className="deposit-input">
                      <input
                        type="text"
                        value={depositQuote}
                        onChange={(e) => setDepositQuote(e.target.value)}
                        placeholder="0.0"
                        className="deposit-field"
                      />
                      <div className="token-display">
                        <img src={quoteToken.icon} alt={quoteToken.name} className="token-icon" />
                        <span>{quoteToken.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="deposit-summary">
                    <div className="summary-item">
                      <span>Total Amount</span>
                      <span>--</span>
                    </div>
                    <div className="summary-item">
                      <span>Deposit Ratio</span>
                      <div className="ratio-display">
                        <div className="ratio-item">
                          <img src={baseToken.icon} alt={baseToken.name} className="token-icon" />
                          <span>{baseToken.name} 50%</span>
                        </div>
                        <div className="ratio-item">
                          <img src={quoteToken.icon} alt={quoteToken.name} className="token-icon" />
                          <span>{quoteToken.name} 50%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="continue-button" disabled={!currentAccount || !isStep3Complete}>
                    {currentAccount ? 'Confirm Deposit' : 'Connect Wallet'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Token selection modal */}
      {showTokenModal && (
        <TokenModal
          showTokenModal={showTokenModal}
          setShowTokenModal={setShowTokenModal}
          tokens={tokens}
          selectToken={selectToken}
          importedTokens={[]}
          activeList={""}
          setActiveList={() => {}}
          importAddress={""}
          setImportAddress={() => {}}
          importError={""}
          setImportError={() => {}}
          searchQuery={""}
          setSearchQuery={() => {}}
          balances={{}}
          importToken={function (): Promise<void> {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
};

export default CreatePoolPage;