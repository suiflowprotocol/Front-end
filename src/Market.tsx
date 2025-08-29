
import React, { useState, useEffect } from "react";
import { ConnectModal, useDisconnectWallet, useCurrentAccount } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";
import Sidebar from "./SidebarMenu"; // Assume this is imported from the app
import AssetModal from "./AssetModal"; // Import the new component
import './Market.css';

const walletLogos = {
  'Slush': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYHwA15AKYWXvoSL-94ysbnJrmUX_oU1fJyw&s',
  'Suiet': 'https://framerusercontent.com/modules/6HmgaTsk3ODDySrS62PZ/a3c2R3qfkYJDxcZxkoVv/assets/eDZRos3xvCrlWxmLFr72sFtiyQ.png',
  'Martian': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhb6QLKfuQY_N8ZvpiKcdZlCnQKILXw7NArw&s',
  'Sui Wallet': 'https://assets.crypto.ro/logos/sui-sui-logo.png',
};

export function CustomConnectButton() {
  const { mutate: disconnect } = useDisconnectWallet();
  const currentAccount = useCurrentAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `0x${address.slice(2, 5)}...${address.slice(-3)}`;
  };

  const disconnectedContent = (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: '8px' }}
      >
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
      </svg>
      <span>Connect</span>
    </>
  );

  const connectedContent = (
    <>
      {currentAccount && (
        <img
          src="https://assets.crypto.ro/logos/sui-sui-logo.png"
          alt="Wallet Logo"
          style={{ width: '20px', height: '20px', marginRight: '8px' }}
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
    <div className="connect-button-wrapper">
      <ConnectModal
        open={isModalOpen}
        trigger={
          <button
            onClick={handleButtonClick}
            className="connect-button"
            aria-label={currentAccount ? 'Wallet Connected' : 'Connect Wallet'}
          >
            {currentAccount ? connectedContent : disconnectedContent}
          </button>
        }
        onOpenChange={(open) => setIsModalOpen(open)}
        walletFilter={walletFilter}
      />
      {showDisconnect && currentAccount && (
        <button
          className="disconnect-button"
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      )}
    </div>
  );
}

const Market = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = (menu: string | null) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const openModal = (asset: string) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };

  return (
    <div className="container789">
      <div className="header789">
        <div className="background-glow header-glow"></div>
        <div className="header-top">
          <div className="logo-container">
            <img src="https://suilend.fi/icons/suilend-logo.png" alt="Logo" className="logo-image" />
            <span className="logo-text">Suilend</span>
          </div>
          {!isMobile ? (
            <div className={`nav-menu789 ${isMenuOpen ? "open" : ""}`}>
              <div className={`nav-item789 ${openDropdown === "lend" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("lend")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">Lend</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={`dropdown789 ${openDropdown === "lend" ? "open" : ""}`}>
                  <Link to="/market" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                    </svg>
                    Market
                  </Link>
                </div>
              </div>
              <div className={`nav-item789 ${openDropdown === "swap" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("swap")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">Swap</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={`dropdown789 ${openDropdown === "swap" ? "open" : ""}`}>
                  <Link to="/app" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                    </svg>
                    Swap
                  </Link>
                </div>
              </div>
              <div className={`nav-item789 ${openDropdown === "strategies" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("strategies")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">Strategies</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={`dropdown789 ${openDropdown === "strategies" ? "open" : ""}`}>
                  <Link to="/pool" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M5.68 5.792 7.345 7.75 5.681 9.708a2.75 2.75 0 1 1 0-3.916ZM8 6.978 6.416 5.113l-.014-.015a3.75 3.75 0 1 0 0 5.304l.014-.015L8 8.522l1.584 1.865.014.015a3.75 3.75 0 1 0 0-5.304l-.014.015zm.656.772 1.663-1.958a2.75 2.75 0 1 1 0 3.916z"/>
                    </svg>
                    Pools
                  </Link>
                  <a href="#" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M5.493 0a.5.5 0 0 1 .493.606L5.533 4.938A.498.498 0 0 1 5.038 5.5c-1.636 0-3.087.313-4.355.869l-.706 1.947A.5.5 0 0 1-.857 7.925l3.847 2.236c-.713 1.352-1.131 2.754-1.26 4.165a.5.5 0 0 1-.968-.326c.14-1.453.59-2.888 1.325-4.29L.41 8.008A.5.5 0 0 1 .824 7.05l1.934.708c.613-1.291 1.328-2.562 2.105-3.837h-2.808a.5.5 0 0 1 .5-.5h3.5zM12 5.5c1.636 0 3.087.313 4.355.869l.706 1.947a.5.5 0 0 1 .474.391l-3.847 2.236c.713 1.352 1.131 2.754 1.26 4.165a.5.5 0 0 1 .968-.326c-.14-1.453-.59-2.888-1.325-4.29l2.536-1.468a.5.5 0 0 1-.414-.958l-1.934.708c-.613-1.291-1.328-2.562-2.105-3.837h2.808a.5.5 0 0 1-.5.5h-3.5z"/>
                    </svg>
                    Rewards
                  </a>
                  <Link to="/xseal" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42 .893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c .24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072 .56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048 .625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692a1.54 1.54 0 0 1 1.044-1.262c.658-.215 1.777-.562 2.887-.87z"/>
<path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/>
                    </svg>
                    Burn
                  </Link>
                </div>
              </div>
              <div className={`nav-item789 ${openDropdown === "send" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("send")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">SEND New</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={`dropdown789 ${openDropdown === "send" ? "open" : ""}`}>
                  <Link to="/send" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342 .474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
                    </svg>
                    Send
                  </Link>
                </div>
              </div>
              <div className={`nav-item789 ${openDropdown === "bridge" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("bridge")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">Bridge</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={`dropdown789 ${openDropdown === "bridge" ? "open" : ""}`}>
                  <a href="https://bridge.sui.io/" target="_blank" rel="noopener noreferrer" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16" style={{transform: 'rotate(180deg)'}}>
                      <path fill-rule="evenodd" d="M7.21 .8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.12 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21 .8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
<path fill-rule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z"/>
                    </svg>
                    Sui Bridge
                  </a>
                  <a href="https://token-image.suins.io/icon.svg" target="_blank" rel="noopener noreferrer" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342 .474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
                    </svg>
                    Wormhole
                  </a>
                  <a href="https://mayan.finance/" target="_blank" rel="noopener noreferrer" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M3 3h10v10H3z" fill="currentColor"/>
                    </svg>
                    Mayan
                  </a>
                </div>
              </div>
              <div className={`nav-item789 ${openDropdown === "more" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("more")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">More</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={`dropdown789 ${openDropdown === "more" ? "open" : ""}`}>
                  <a href="#" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
<path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v3.5H11V4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                    </svg>
                    Docs
                  </a>
                  <a href="#" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16" style={{transform: 'rotate(180deg)'}}>
                      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42 .893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c .24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072 .56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048 .625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692a1.54 1.54 0 0 1 1.044-1.262c.658-.215 1.777-.562 2.887-.87z"/>
<path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                    </svg>
                    Security
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <button className="hamburger-menu" onClick={toggleMenu}>
              <svg className="hamburger-icon" viewBox="0 0 24 24" width="24px" height="24px">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="var(--text-color)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <div className="wallet-actions">
            <CustomConnectButton />
            <a href="https://x.com/suilendprotocol" target="_blank" rel="noopener noreferrer" className="icon-button css-fi49l4">
              <div className="css-1ke24j5">
                <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1 2.25h7.28l4.71 6.23zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
            </a>
            <a href="https://t.me/suilendprotocol" target="_blank" rel="noopener noreferrer" className="icon-button css-163hjq3">
              <div className="css-1ke24j5">
                <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                  <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.06L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
      {isMobile && (
        <Sidebar isOpen={isMenuOpen} onClose={toggleMenu} />
      )}
      <div className="main-content789">
        <div className="content-column">
          <div className="card789 market-summary">
            <div className="card-header">
              <h2 className="text-primary789">Main Market</h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground789">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <div className="market-stats">
              <div className="stat-item">
                <p className="text-muted-foreground789">Deposits</p>
                <p>$897M</p>
              </div>
              <div className="stat-item">
                <p className="text-muted-foreground789">Borrows</p>
                <p>$232M</p>
              </div>
              <div className="stat-item">
                <p className="text-muted-foreground789">TVL</p>
                <p>$635M</p>
              </div>
            </div>
          </div>
          <div className="card789 asset-table-card">
            <table className="table789">
              <thead>
                <tr>
                  <th>Asset name</th>
                  <th>Deposits</th>
                  <th>Borrows</th>
                  <th>LTV / BW</th>
                  <th>Deposit APR</th>
                  <th>Borrow APR</th>
                </tr>
              </thead>
              <tbody>
                <tr className="section-header">
                  <td colSpan={6}>Featured assets</td>
                </tr>
                <tr onClick={() => openModal('UP')}>
                  <td>
                    <img src="https://www.doubleup.fun/Diamond_Only.png" alt="UP" className="asset-icon" />
                    UP <span className="text-muted-foreground789">$7.184</span>
                  </td>
                  <td>647K UP <span className="text-muted-foreground789">$465K</span></td>
                  <td>102K UP <span className="text-muted-foreground789">$73.8K</span></td>
                  <td>0% / 2</td>
                  <td className="text-green-500789">38.89%</td>
                  <td>29.49%</td>
                </tr>
                <tr className="section-header">
                  <td colSpan={6}>Main assets 22</td>
                </tr>
                <tr onClick={() => openModal('sSUI')}>
                  <td>
                    <img src="https://trade.bluefin.io/tokens/sSUI.png" alt="sSUI" className="asset-icon" />
                    sSUI <span className="text-muted-foreground789">$3.30</span>
                  </td>
                  <td>75.1M sSUI <span className="text-muted-foreground789">$248M</span></td>
                  <td>-</td>
                  <td>70% / ∞</td>
                  <td>3.44%</td>
                  <td>0.00%</td>
                </tr>
                <tr className="expandable-section" onClick={() => toggleSection('ecosystem')}>
                  <td colSpan={6}>
                    <div className="section-title">
                      ECOSYSTEM LSTs 10
                      <svg className={`arrow-icon ${expandedSections['ecosystem'] ? 'rotated' : ''}`} viewBox="0 0 12 12" width="12px" height="12px">
                        <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                      </svg>
                    </div>
                  </td>
                </tr>
                {expandedSections['ecosystem'] && (
                  <>
                    <tr onClick={() => openModal('oshiSUI')}>
                      <td>
                        <img src="https://bafybeib6vvpcgfql6ijoeckkzrcuijvvmnq3xmrp3krb75dgsyvq2oq5ei.ipfs.w3s.link/OSUI.png" alt="oshiSUI" className="asset-icon" />
                        oshiSUI <span className="text-muted-foreground789">$3.60</span>
                      </td>
                      <td>10M oshiSUI <span className="text-muted-foreground789">$36M</span></td>
                      <td>5M oshiSUI <span className="text-muted-foreground789">$18M</span></td>
                      <td>70% / 1</td>
                      <td>4.50%</td>
                      <td>2.30%</td>
                    </tr>
                    <tr onClick={() => openModal('strateSUI')}>
                      <td>
                        <img src="https://bafybeidzbmtzzwy4uqi5tzvypnqfw5fnrfsovmfxcfkw7n2lxqulw4bfzq.ipfs.w3s.link/%E4%B8%8B%E8%BD%BD.png" alt="strateSUI" className="asset-icon" />
                        strateSUI <span className="text-muted-foreground789">$3.55</span>
                      </td>
                      <td>15M strateSUI <span className="text-muted-foreground789">$53M</span></td>
                      <td>-</td>
                      <td>70% / -</td>
                      <td>3.80%</td>
                      <td>0.00%</td>
                    </tr>
                    <tr onClick={() => openModal('jugSUI')}>
                      <td>
                        <img src="https://bafybeidzbmtzzwy4uqi5tzvypnqfw5fnrfsovmfxcfkw7n2lxqulw4bfzq.ipfs.w3s.link/jugsui.png" alt="jugSUI" className="asset-icon" />
                        jugSUI <span className="text-muted-foreground789">$3.58</span>
                      </td>
                      <td>12M jugSUI <span className="text-muted-foreground789">$43M</span></td>
                      <td>6M jugSUI <span className="text-muted-foreground789">$21M</span></td>
                      <td>70% / 1</td>
                      <td>4.20%</td>
                      <td>2.10%</td>
                    </tr>
                    <tr onClick={() => openModal('kSUI')}>
                      <td>
                        <img src="https://bafybeiaosl33qpik6gy5hu7tifqwj3ywdb4zeba6pixsqm7ghijidaifue.ipfs.w3s.link/ksui.png" alt="kSUI" className="asset-icon" />
                        kSUI <span className="text-muted-foreground789">$3.62</span>
                      </td>
                      <td>8M kSUI <span className="text-muted-foreground789">$29M</span></td>
                      <td>-</td>
                      <td>70% / -</td>
                      <td>3.60%</td>
                      <td>0.00%</td>
                    </tr>
                    <tr onClick={() => openModal('iSUI')}>
                      <td>
                        <img src="https://bafybeic2g4yp4dxflraoxq22dass27vs6jc3obcjsnpzomf6rt7hpc5yfe.ipfs.w3s.link/isui.png" alt="iSUI" className="asset-icon" />
                        iSUI <span className="text-muted-foreground789">$3.59</span>
                      </td>
                      <td>9M iSUI <span className="text-muted-foreground789">$32M</span></td>
                      <td>4M iSUI <span className="text-muted-foreground789">$14M</span></td>
                      <td>70% / 1</td>
                      <td>4.10%</td>
                      <td>2.00%</td>
                    </tr>
                    <tr onClick={() => openModal('trevinSUI')}>
                      <td>
                        <img src="https://bafybeid56767zzbsr6msysbgkudd5c7fadgq3l57c5pbfwjwsubenp6doiou.ipfs.w3s.link/trevin.png" alt="trevinSUI" className="asset-icon" />
                        trevinSUI <span className="text-muted-foreground789">$3.61</span>
                      </td>
                      <td>7M trevinSUI <span className="text-muted-foreground789">$25M</span></td>
                      <td>-</td>
                      <td>70% / -</td>
                      <td>3.70%</td>
                      <td>0.00%</td>
                    </tr>
                    <tr onClick={() => openModal('mSUI')}>
                      <td>
                        <img src="https://bafybeif3avog4o5u2ptqv3batbwjass5fxleosfboksxat7m2kjjmkggsq.ipfs.w3s.link/msui.png" alt="mSUI" className="asset-icon" />
                        mSUI <span className="text-muted-foreground789">$3.57</span>
                      </td>
                      <td>11M mSUI <span className="text-muted-foreground789">$39M</span></td>
                      <td>5.5M mSUI <span className="text-muted-foreground789">$19M</span></td>
                      <td>70% / 1</td>
                      <td>4.00%</td>
                      <td>2.20%</td>
                    </tr>
                    <tr onClick={() => openModal('fudSUI')}>
                      <td>
                        <img src="https://bafybeifjs6vumen4c6tdfxrerxmxerb7uxrl54iwksbjlewvwi5xpvu2iu.ipfs.w3s.link/fudsui.png" alt="fudSUI" className="asset-icon" />
                        fudSUI <span className="text-muted-foreground789">$3.63</span>
                      </td>
                      <td>6M fudSUI <span className="text-muted-foreground789">$22M</span></td>
                      <td>-</td>
                      <td>70% / -</td>
                      <td>3.90%</td>
                      <td>0.00%</td>
                    </tr>
                    <tr onClick={() => openModal('flSUI')}>
                      <td>
                        <img src="https://bafybeid56767zzbsr6msysbgkudd5c7fadgq3l57c5pbfwjwsubenp6doiou.ipfs.w3s.link/flsui.png" alt="flSUI" className="asset-icon" />
                        flSUI <span className="text-muted-foreground789">$3.56</span>
                      </td>
                      <td>13M flSUI <span className="text-muted-foreground789">$46M</span></td>
                      <td>7M flSUI <span className="text-muted-foreground789">$25M</span></td>
                      <td>70% / 1</td>
                      <td>4.30%</td>
                      <td>2.40%</td>
                    </tr>
                    <tr onClick={() => openModal('upSUI')}>
                      <td>
                        <img src="https://bafybeiaosl33qpik6gy5hu7tifqwj3ywdb4zeba6pixsqm7ghijidaifue.ipfs.w3s.link/upsui.png" alt="upSUI" className="asset-icon" />
                        upSUI <span className="text-muted-foreground789">$3.64</span>
                      </td>
                      <td>5M upSUI <span className="text-muted-foreground789">$18M</span></td>
                      <td>-</td>
                      <td>70% / -</td>
                      <td>3.50%</td>
                      <td>0.00%</td>
                    </tr>
                  </>
                )}
                <tr onClick={() => openModal('SUI')}>
                  <td>
                    <img src="https://s3.coinmarketcap.com/static-gravity/image/5bd0f43855f6434386c59f2341c5aaf0.png" alt="SUI" className="asset-icon" />
                    SUI <span className="text-muted-foreground789">$3.30</span>
                  </td>
                  <td>71.1M SUI <span className="text-muted-foreground789">$235M</span></td>
                  <td>37.4M SUI <span className="text-muted-foreground789">$123M</span></td>
                  <td>70% / 1</td>
                  <td>2.42%</td>
                  <td>1.23%</td>
                </tr>
                <tr onClick={() => openModal('USDC')}>
                  <td>
                    <img src="https://s2.coinmarketcap.com/static/img/coins/200x200/3408.png" alt="USDC" className="asset-icon" />
                    USDC <span className="text-muted-foreground789">$0.9999</span>
                  </td>
                  <td>74.5M USDC <span className="text-muted-foreground789">$74.8M</span></td>
                  <td>78.8M USDC <span className="text-muted-foreground789">$78.8M</span></td>
                  <td>77% / 1</td>
                  <td>8.33%</td>
                  <td>7.32%</td>
                </tr>
                <tr onClick={() => openModal('suiUSDT')}>
                  <td>
                    <img src="https://momentum-statics.s3.us-west-1.amazonaws.com/suiUSDT.png" alt="suiUSDT" className="asset-icon" />
                    suiUSDT <span className="text-muted-foreground789">$1.00</span>
                  </td>
                  <td>18.0M suiUSDT <span className="text-muted-foreground789">$18.1M</span></td>
                  <td>9.26M suiUSDT <span className="text-muted-foreground789">$9.26M</span></td>
                  <td>77% / 1</td>
                  <td>5.82%</td>
                  <td>2.93%</td>
                </tr>
                <tr onClick={() => openModal('AUSD')}>
                  <td>
                    <img src="https://static.agora.finance/ausd-token-icon.svg" alt="AUSD" className="asset-icon" />
                    AUSD <span className="text-muted-foreground789">$0.9999</span>
                  </td>
                  <td>7.83M AUSD <span className="text-muted-foreground789">$7.83M</span></td>
                  <td>1.96M AUSD <span className="text-muted-foreground789">$1.96M</span></td>
                  <td>77% / 1</td>
                  <td>5.26%</td>
                  <td>5.88%</td>
                </tr>
                <tr onClick={() => openModal('LBTC')}>
                  <td>
                    <img src="https://www.lombard.finance/lbtc/LBTC.png" alt="LBTC" className="asset-icon" />
                    LBTC <span className="text-muted-foreground789">$109,725.50</span>
                  </td>
                  <td>517 LBTC <span className="text-muted-foreground789">$56.8M</span></td>
                  <td>-</td>
                  <td>56% / 1</td>
                  <td>1.57%</td>
                  <td>3.60%</td>
                </tr>
                <tr onClick={() => openModal('wBTC')}>
                  <td>
                    <img src="https://bridge-assets.sui.io/suiWBTC.png" alt="wBTC" className="asset-icon" />
                    wBTC <span className="text-muted-foreground789">$109,725.50</span>
                  </td>
                  <td>641 wBTC <span className="text-muted-foreground789">$70.4M</span></td>
                  <td>3.36 BTC <span className="text-muted-foreground789">$368K</span></td>
                  <td>56% / 1</td>
                  <td>2.79%</td>
                  <td>2.63%</td>
                </tr>
                <tr onClick={() => openModal('xBTC')}>
                  <td>
                    <img src="https://static.coinall.ltd/cdn/oksupport/common/20250512-095503.72e1f41d9b9a06.png" alt="xBTC" className="asset-icon" />
                    xBTC <span className="text-muted-foreground789">$109,725.50</span>
                  </td>
                  <td>175 xBTC <span className="text-muted-foreground789">$19.2M</span></td>
                  <td>5.62 xBTC <span className="text-muted-foreground789">$616K</span></td>
                  <td>56% / 1</td>
                  <td>0.05%</td>
                  <td>2.16%</td>
                </tr>
                <tr onClick={() => openModal('suiETH')}>
                  <td>
                    <img src="https://trade.bluefin.io/tokens/31484f64-6efd-4f82-bbcd-9088c389adc5.png" alt="suiETH" className="asset-icon" />
                    suiETH <span className="text-muted-foreground789">$4,337.29</span>
                  </td>
                  <td>10.6K suiETH <span className="text-muted-foreground789">$46.2M</span></td>
                  <td>291 suiETH <span className="text-muted-foreground789">$1.26M</span></td>
                  <td>70% / 1</td>
                  <td>2.88%</td>
                  <td>0.97%</td>
                </tr>
                <tr onClick={() => openModal('SOL')}>
                  <td>
                    <img src="https://trade.bluefin.io/tokens/e1547bda-9921-485a-a529-d7624547318a.png" alt="SOL" className="asset-icon" />
                    SOL <span className="text-muted-foreground789">$206.84</span>
                  </td>
                  <td>21.7K SOL <span className="text-muted-foreground789">$4.50M</span></td>
                  <td>11.0K SOL <span className="text-muted-foreground789">$2.28M</span></td>
                  <td>60% / 1</td>
                  <td>4.37%</td>
                  <td>4.33%</td>
                </tr>
                <tr onClick={() => openModal('DEEP')}>
                  <td>
                    <img src="https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/DEEP_BlueBackground.png/public" alt="DEEP" className="asset-icon" />
                    DEEP <span className="text-muted-foreground789">$0.1366</span>
                  </td>
                  <td>327M DEEP <span className="text-muted-foreground789">$44.7M</span></td>
                  <td>62.9M DEEP <span className="text-muted-foreground789">$8.61M</span></td>
                  <td>30% / 1.6</td>
                  <td>27.41%</td>
                  <td>9.23%</td>
                </tr>
                <tr onClick={() => openModal('WAL')}>
                  <td>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDDWKVQog0SDLcTsqXjWTuUu4cOeA5hZjaSQ&s" alt="WAL" className="asset-icon" />
                    WAL <span className="text-muted-foreground789">$0.3862</span>
                  </td>
                  <td>7.4M WAL <span className="text-muted-foreground789">$28.6M</span></td>
                  <td>29.4M WAL <span className="text-muted-foreground789">$11.3M</span></td>
                  <td>30% / 1.6</td>
                  <td>42.02%</td>
                  <td>23.50%</td>
                </tr>
                <tr className="section-header">
                  <td colSpan={6}>Isolated assets 12</td>
                </tr>
                <tr onClick={() => openModal('SEND')}>
                  <td>
                    <img src="https://trade.bluefin.io/tokens/1a00f220-9815-4ff3-97af-9b776d1ca129.png" alt="SEND" className="asset-icon" />
                    SEND <span className="text-muted-foreground789">$0.4895</span>
                  </td>
                  <td>10.3M SEND <span className="text-muted-foreground789">$5.07M</span></td>
                  <td>3.847 SEND <span className="text-muted-foreground789">$1.883 12</span></td>
                  <td>0% / 2</td>
                  <td>0.01%</td>
                  <td>59.81%</td>
                </tr>
                <tr onClick={() => openModal('IKA')}>
                  <td>
                    <img src="https://s2.coinmarketcap.com/static/img/coins/200x200/37454.png" alt="IKA" className="asset-icon" />
                    IKA <span className="text-muted-foreground789">$0.03202</span>
                  </td>
                  <td>179M IKA <span className="text-muted-foreground789">$5.75M</span></td>
                  <td>39.8M IKA <span className="text-muted-foreground789">$1.28M</span></td>
                  <td>0% / 1.8</td>
                  <td>128.11%</td>
                  <td>69.87%</td>
                </tr>
                <tr onClick={() => openModal('HAEDAL')}>
                  <td>
                    <img src="https://node1.irys.xyz/Rp80fmqZS3qBDnfyxyKEvc65nVdTunjOG3NY8T6AjpI" alt="HAEDAL" className="asset-icon" />
                    HAEDAL <span className="text-muted-foreground789">$0.1287</span>
                  </td>
                  <td>7.688 HAEDAL <span className="text-muted-foreground789">$918K</span></td>
                  <td>116K HAEDAL <span className="text-muted-foreground789">$15.1K</span></td>
                  <td>0% / 2</td>
                  <td>20.82%</td>
                  <td>22.64%</td>
                </tr>
                <tr onClick={() => openModal('BLUE')}>
                  <td>
                    <img src="https://bluefin.io/images/square.png" alt="BLUE" className="asset-icon" />
                    BLUE <span className="text-muted-foreground789">$0.06924</span>
                  </td>
                  <td>448K BLUE <span className="text-muted-foreground789">$31.1K</span></td>
                  <td>332 BLUE <span className="text-muted-foreground789">$23.05</span></td>
                  <td>0% / 2</td>
                  <td>0.01%</td>
                  <td>29.32%</td>
                </tr>
                <tr onClick={() => openModal('NS')}>
                  <td>
                    <img src="https://token-image.suins.io/icon.svg" alt="NS" className="asset-icon" />
                    NS <span className="text-muted-foreground789">$0.1116</span>
                  </td>
                  <td>301K NS <span className="text-muted-foreground789">$33.7K</span></td>
                  <td>2.222 NS <span className="text-muted-foreground789">$248.06</span></td>
                  <td>0% / 2</td>
                  <td>0.11%</td>
                  <td>29.15%</td>
                </tr>
                <tr onClick={() => openModal('DMC')}>
                  <td>
                    <img src="https://storage.googleapis.com/tokenimage.deloreanlabs.com/DMCTokenIcon.svg" alt="DMC" className="asset-icon" />
                    DMC <span className="text-muted-foreground789">$0.02075</span>
                  </td>
                  <td>92.0M DMC <span className="text-muted-foreground789">$1.91K</span></td>
                  <td>0.01 DMC <span className="text-muted-foreground789">$0.00</span></td>
                  <td>0% / 2</td>
                  <td>16.75%</td>
                  <td>50.00%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="sidebar789">
          <div className="card789 unclaimed-rewards">
            <div className="p-4 flex flex-col gap-2 space-y-0 rounded-t-[3px] bg-card">
              <div className="flex h-5 flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                  <div className="cursor-pointer">
                    <h2 className="font-mono text-sm font-normal font-normal flex flex-row items-center gap-2 uppercase w-full text-primary789">
                      Unclaimed rewards
                      <span className="text-xs text-muted-foreground789">&lt;$0.01</span>
                    </h2>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-end gap-1">
                  <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/10 hover:text-foreground h-8 w-8 rounded-sm gap-1 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up w-4 h-4 shrink-0 transition-colors">
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                    <span className="sr-only">Toggle</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 pt-0 flex flex-col gap-4 rounded-b-[3px] bg-card">
              <div className="grid w-full grid-cols-2 gap-x-4 gap-y-1">
                <div className="flex flex-row items-center gap-1.5">
                  <div className="relative shrink-0" style={{width: '16px', height: '16px'}}>
                    <img className="relative z-[1] rounded-[50%]" src="https://trade.bluefin.io/tokens/sSUI.png" alt="sSUI logo" style={{width: '16px', height: '16px'}} />
                  </div>
                  <p className="text-foreground font-mono text-sm font-normal">
                    &lt;0.01 sSUI
                  </p>
                </div>
              </div>
              <div className="w-max">
                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-foreground hover:bg-primary/90 h-8 rounded-sm px-3 py-2 gap-1 w-[150px]">
                  <p className="font-mono font-normal text-sm text-inherit transition-colors uppercase">
                    Claim rewards
                  </p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-3 h-3 shrink-0">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="card789 account">
            <div className="p-4 flex flex-col gap-2 space-y-0 rounded-t-[3px] bg-card">
              <div className="flex h-5 flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                  <div className="cursor-pointer">
                    <h2 className="font-mono text-sm font-normal flex flex-row items-center gap-2 uppercase w-full text-primary789">
                      Account
                    </h2>
                  </div>
                  <div className="flex h-4 flex-row items-center">
                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/10 hover:text-foreground h-8 w-8 rounded-sm gap-1 text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy w-4 h-4 shrink-0 transition-colors">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1 .9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                      </svg>
                      <span className="sr-only">Copy</span>
                    </button>
                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/10 hover:text-foreground h-8 w-8 rounded-sm gap-1 text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link w-4 h-4 shrink-0 transition-colors">
                        <path d="M15 3h6v6"></path>
                        <path d="M10 14 21 3"></path>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      </svg>
                      <span className="sr-only">Open on Suiscan</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-end gap-1">
                  <button className="inline-flex items-center justify-start whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:border-secondary hover:text-primary-foreground border hover:bg-secondary/5 h-8 rounded-sm px-3 py-2 gap-1">
                    <p className="font-mono font-normal text-inherit transition-colors uppercase text-xs">
                      Overview
                    </p>
                  </button>
                  <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/10 hover:text-foreground h-8 w-8 rounded-sm gap-1 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up w-4 h-4 shrink-0 transition-colors">
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                    <span className="sr-only">Toggle</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 pt-0 flex flex-col gap-4 rounded-b-[3px] bg-card">
              <div className="relative w-full">
                <div className="absolute bottom-0 left-0 right-[66.6667%] top-0 z-[1] rounded-l-sm bg-gradient-to-r from-primary/20 to-transparent"></div>
                <div className="relative z-[2] flex flex-row items-center justify-around gap-1 rounded-sm border border-primary/5 px-4 py-3">
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-muted-foreground font-sans text-xs font-normal w-max text-center">
                      Equity
                    </p>
                    <p className="text-foreground font-mono text-sm font-normal w-max text-center">
                      &lt;$0.01
                    </p>
                  </div>
                  <p className="text-muted-foreground font-sans text-xs font-normal">
                    =
                  </p>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-muted-foreground font-sans text-xs font-normal w-max text-center decoration-muted/50 underline decoration-dotted decoration-1 underline-offset-2">
                      Deposits
                    </p>
                    <p className="text-foreground font-mono text-sm font-normal w-max text-center">
                      &lt;$0.81
                    </p>
                  </div>
                  <p className="text-muted-foreground font-sans text-xs font-normal">
                    -
                  </p>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-muted-foreground font-sans text-xs font-normal w-max text-center decoration-muted/50 underline decoration-dotted decoration-1 underline-offset-2">
                      Borrows
                    </p>
                    <p className="text-foreground font-mono text-sm font-normal w-max text-center">
                      $0.00
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between gap-2">
                <p className="text-muted-foreground font-sans text-xs font-normal w-max decoration-muted/50 underline decoration-dotted decoration-1 underline-offset-2">
                  Net APR
                </p>
                <p className="text-foreground font-mono text-sm font-normal w-max text-right">
                  3.48%
                </p>
              </div>
              <div className="flex flex-row justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row items-center gap-1.5">
                    <div className="h-3 w-1" style={{backgroundColor: 'hsl(var(--foreground))'}}></div>
                    <p className="text-muted-foreground font-sans text-xs font-normal w-max decoration-muted/50 underline decoration-dotted decoration-1 underline-offset-2">
                      Weighted borrows
                    </p>
                  </div>
                  <p className="text-foreground font-mono text-sm font-normal w-max">
                    $0.00
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex flex-row items-center gap-1.5">
                    <div className="h-3 w-1 bg-primary"></div>
                    <p className="text-muted-foreground font-sans text-xs font-normal w-max decoration-muted/50 underline decoration-dotted decoration-1 underline-offset-2">
                      Borrow limit
                    </p>
                  </div>
                  <p className="text-foreground font-mono text-sm font-normal w-max text-center">
                    &lt;$0.01
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex flex-row items-center gap-1.5">
                    <div className="h-3 w-1 bg-secondary"></div>
                    <p className="text-muted-foreground font-sans text-xs font-normal w-max decoration-muted/50 underline decoration-dotted decoration-1 underline-offset-2">
                      Liq. threshold
                    </p>
                  </div>
                  <p className="text-foreground font-mono text-sm font-normal w-max text-right">
                    &lt;$0.01
                  </p>
                </div>
              </div>
              <div className="-mb-[3px] border-b border-dotted border-b-muted/40 pb-[2px]">
                <div className="relative flex h-3 w-full flex-row">
                  <div className="relative z-[1] h-full bg-muted/20" style={{width: '69.9306%'}}></div>
                  <div className="relative z-[1] h-full bg-muted/20" style={{width: '5.00173%'}}></div>
                  <div className="relative z-[1] h-full bg-muted/20" style={{width: '25.0676%'}}></div>
                  <div className="absolute bottom-0 top-0 z-[2] w-1 -translate-x-1/2 bg-primary" style={{left: '69.9306%'}}></div>
                  <div className="absolute bottom-0 top-0 z-[2] w-1 -translate-x-1/2 bg-secondary" style={{left: '74.9324%'}}></div>
                </div>
              </div>
              <div className="relative flex w-full flex-row items-center justify-center">
                <div className="bg-border h-[1px] w-full flex-1"></div>
                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/10 hover:text-foreground rounded-sm px-3 gap-1 relative z-[2] h-fit !bg-transparent uppercase text-muted-foreground">
                  <p className="font-mono font-normal text-sm text-inherit transition-colors">
                    Show breakdown
                  </p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down shrink-0 transition-colors h-4 w-4">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </button>
                <div className="bg-border h-[1px] w-full flex-1"></div>
              </div>
            </div>
          </div>
          <div className="card789 deposited-assets">
            <div className="p-4 flex flex-col gap-2 space-y-0">
              <div className="flex h-5 flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                  <div className="cursor-pointer">
                    <h2 className="text-primary789 font-mono text-sm font-normal flex flex-row items-center gap-2 uppercase w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download w-4 h-4 shrink-0">
                        <path d="M21 15v4a2 0 0 1-2 2H5a2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" x2="12" y1="15" y2="3"></line>
                      </svg>
                      Deposited assets
                      <span className="text-xs text-muted-foreground789">2</span>
                    </h2>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-end gap-1">
                  <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/10 hover:text-foreground h-8 w-8 rounded-sm gap-1 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up w-4 h-4 shrink-0 transition-colors">
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                    <span className="sr-only">Toggle</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-0">
              <div className="w-full">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b relative z-[2]">
                      <tr className="border-b transition-colors hover:bg-transparent">
                        <th className="text-left align-middle font-medium text-muted-foreground h-9 px-0 py-0">
                          <button className="inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-foreground gap-1 h-full w-full rounded-none px-4 py-0 text-muted-foreground hover:bg-transparent justify-start">
                            <p className="font-normal text-inherit transition-colors font-sans text-xs min-w-max">
                              Asset name
                            </p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-up-down w-3 h-3 shrink-0 transition-colors">
                              <path d="m7 15 5 5 5-5"></path>
                              <path d="m7 9 5-5 5 5"></path>
                            </svg>
                          </button>
                        </th>
                        <th className="text-left align-middle font-medium text-muted-foreground h-9 px-0 py-0">
                          <button className="inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-foreground gap-1 h-full w-full rounded-none px-4 py-0 text-muted-foreground hover:bg-transparent justify-end">
                            <p className="font-normal text-inherit transition-colors font-sans text-xs min-w-max">
                              Deposits
                            </p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-up-down w-3 h-3 shrink-0 transition-colors">
                              <path d="m7 15 5 5 5-5"></path>
                              <path d="m7 9 5-5 5 5"></path>
                            </svg>
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0 relative z-[1]">
                      <tr className="border-b transition-colors cursor-pointer hover:bg-muted/10">
                        <td className="p-4 align-middle h-16 pr-0">
                          <div className="flex flex-row items-center gap-3">
                            <div className="relative shrink-0" style={{width: '28px', height: '28px'}}>
                              <img className="relative z-[1] rounded-[50%]" src="https://trade.bluefin.io/tokens/sSUI.png" alt="sSUI" style={{width: '28px', height: '28px'}} />
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
                                <p className="text-foreground font-mono text-sm font-normal">
                                  sSUI
                                </p>
                                <a className="font-medium decoration-foreground/50 transition-colors hover:decoration-primary-foreground/50 block shrink-0 text-xs uppercase text-muted-foreground no-underline hover:text-foreground" href="/swap/sSUI-SUI?swapInAccount=true">
                                  Swap
                                </a>
                              </div>
                              <p className="text-muted-foreground font-mono text-xs font-normal">
                                $3.30
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle h-16 pl-0">
                          <div className="flex flex-col items-end gap-1">
                            <p className="text-foreground font-mono text-sm font-normal text-right">
                              &lt;0.01
                            </p>
                            <p className="text-muted-foreground font-mono text-xs font-normal text-right">
                              &lt;$0.01
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b transition-colors cursor-pointer hover:bg-muted/10">
                        <td className="p-4 align-middle h-16 pr-0">
                          <div className="flex flex-row items-center gap-3">
                            <div className="relative shrink-0" style={{width: '28px', height: '28px'}}>
                              <img className="relative z-[1] rounded-[50%]" src="https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/DEEP_BlueBackground.png/public" alt="DEEP" style={{width: '28px', height: '28px'}} />
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
                                <p className="text-foreground font-mono text-sm font-normal">
                                  DEEP
                                </p>
                                <a className="font-medium decoration-foreground/50 transition-colors hover:decoration-primary-foreground/50 block shrink-0 text-xs uppercase text-muted-foreground no-underline hover:text-foreground" href="/swap/DEEP-SUI?swapInAccount=true">
                                  Swap
                                </a>
                              </div>
                              <p className="text-muted-foreground font-mono text-xs font-normal">
                                $0.1366
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle h-16 pl-0">
                          <div className="flex flex-col items-end gap-1">
                            <p className="text-foreground font-mono text-sm font-normal text-right">
                              &lt;0.01
                            </p>
                            <p className="text-muted-foreground font-mono text-xs font-normal text-right">
                              &lt;$0.01
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="card789 borrowed-assets">
            <div className="p-4 flex flex-col gap-2 space-y-0">
              <div className="flex h-5 flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                  <div className="cursor-pointer">
                    <h2 className="text-primary789 font-mono text-sm font-normal flex flex-row items-center gap-2 uppercase w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload w-4 h-4 shrink-0">
                        <path d="M21 15v4a2 0 0 1-2 2H5a2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" x2="12" y1="3" y2="15"></line>
                      </svg>
                      Borrowed assets
                      <span className="text-xs text-muted-foreground789">0</span>
                    </h2>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-end gap-1">
                  <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/10 hover:text-foreground h-8 w-8 rounded-sm gap-1 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up w-4 h-4 shrink-0 transition-colors">
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                    <span className="sr-only">Toggle</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-0">
              <div className="w-full">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b relative z-[2]">
                      <tr className="border-b transition-colors hover:bg-transparent">
                        <th className="text-left align-middle font-medium text-muted-foreground h-9 px-0 py-0">
                          <button className="inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-foreground gap-1 h-full w-full rounded-none px-4 py-0 text-muted-foreground hover:bg-transparent justify-start">
                            <p className="font-normal text-inherit transition-colors font-sans text-xs min-w-max">
                              Asset name
                            </p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-up-down w-3 h-3 shrink-0 transition-colors">
                              <path d="m7 15 5 5 5-5"></path>
                              <path d="m7 9 5-5 5 5"></path>
                            </svg>
                          </button>
                        </th>
                        <th className="text-left align-middle font-medium text-muted-foreground h-9 px-0 py-0">
                          <button className="inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-foreground gap-1 h-full w-full rounded-none px-4 py-0 text-muted-foreground hover:bg-transparent justify-end">
                            <p className="font-normal text-inherit transition-colors font-sans text-xs min-w-max">
                              Borrows
                            </p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-up-down w-3 h-3 shrink-0 transition-colors">
                              <path d="m7 15 5 5 5-5"></path>
                              <path d="m7 9 5-5 5 5"></path>
                            </svg>
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0 relative z-[1]">
                      <tr className="border-b transition-colors hover:bg-transparent cursor-default">
                        <td className="p-4 align-middle h-16 py-0 text-center" colSpan={2}>
                          <p className="text-muted-foreground font-sans text-xs font-normal">
                            No borrows
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="card789 wallet-balances">
            <div className="p-4 flex flex-col gap-2 space-y-0">
              <div className="flex h-5 flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                  <div className="cursor-pointer">
                    <h2 className="text-primary789 font-mono text-sm font-normal flex flex-row items-center gap-2 uppercase w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet w-4 h-4 shrink-0">
                        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                      </svg>
                      Wallet balances
                      <span className="text-xs text-muted-foreground789">$1.84+</span>
                    </h2>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-end gap-1">
                  <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/10 hover:text-foreground h-8 w-8 rounded-sm gap-1 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up w-4 h-4 shrink-0 transition-colors">
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                    <span className="sr-only">Toggle</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-0">
              <div className="w-full">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b relative z-[2]">
                      <tr className="border-b transition-colors hover:bg-transparent">
                        <th className="text-left align-middle font-medium text-muted-foreground h-9 px-0 py-0">
                          <button className="inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-foreground gap-1 h-full w-full rounded-none px-4 py-0 text-muted-foreground hover:bg-transparent justify-start">
                            <p className="font-normal text-inherit transition-colors font-sans text-xs min-w-max">
                              Asset name
                            </p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-up-down w-3 h-3 shrink-0 transition-colors">
                              <path d="m7 15 5 5 5-5"></path>
                              <path d="m7 9 5-5 5 5"></path>
                            </svg>
                          </button>
                        </th>
                        <th className="text-left align-middle font-medium text-muted-foreground h-9 px-0 py-0">
                          <button className="inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-foreground gap-1 h-full w-full rounded-none px-4 py-0 text-muted-foreground hover:bg-transparent justify-end">
                            <p className="font-normal text-inherit transition-colors font-sans text-xs min-w-max">
                              Balance
                            </p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-up-down w-3 h-3 shrink-0 transition-colors">
                              <path d="m7 15 5 5 5-5"></path>
                              <path d="m7 9 5-5 5 5"></path>
                            </svg>
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0 relative z-[1]">
                      <tr className="border-b transition-colors cursor-pointer hover:bg-muted/10">
                        <td className="p-4 align-middle h-16 pr-0">
                          <div className="flex flex-row items-center gap-3">
                            <div className="relative shrink-0" style={{width: '28px', height: '28px'}}>
                              <img className="relative z-[1] rounded-[50%]" src="https://suilend.fi/icons/sui.png" alt="SUI SWAP STAKE" style={{width: '28px', height: '28px'}} />
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
                                <p className="text-foreground font-mono text-sm font-normal">
                                  SUI SWAP STAKE
                                </p>
                              </div>
                              <p className="text-muted-foreground font-mono text-xs font-normal">
                                $3.30
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle h-16 pl-0">
                          <div className="flex flex-col items-end gap-1">
                            <p className="text-foreground font-mono text-sm font-normal text-right">
                              0.55
                            </p>
                            <p className="text-muted-foreground font-mono text-xs font-normal text-right">
                              $1.84
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b transition-colors cursor-pointer hover:bg-muted/10">
                        <td className="p-4 align-middle h-16 pr-0">
                          <div className="flex flex-row items-center gap-3">
                            <div className="relative shrink-0" style={{width: '28px', height: '28px'}}>
                              <img className="relative z-[1] rounded-[50%]" src="https://token-image.suins.io/icon.svg" alt="NS SWAP" style={{width: '28px', height: '28px'}} />
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
                                <p className="text-foreground font-mono text-sm font-normal">
                                  NS SWAP
                                </p>
                              </div>
                              <p className="text-muted-foreground font-mono text-xs font-normal">
                                $0.1116
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle h-16 pl-0">
                          <div className="flex flex-col items-end gap-1">
                            <p className="text-foreground font-mono text-sm font-normal text-right">
                              0.03
                            </p>
                            <p className="text-muted-foreground font-mono text-xs font-normal text-right">
                              &lt;$0.01
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b transition-colors cursor-pointer hover:bg-muted/10">
                        <td className="p-4 align-middle h-16 pr-0">
                          <div className="flex flex-row items-center gap-3">
                            <div className="relative shrink-0" style={{width: '28px', height: '28px'}}>
                              <img className="relative z-[1] rounded-[50%]" src="https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/DEEP_BlueBackground.png/public" alt="DEEP SWAP" style={{width: '28px', height: '28px'}} />
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
                                <p className="text-foreground font-mono text-sm font-normal">
                                  DEEP SWAP
                                </p>
                              </div>
                              <p className="text-muted-foreground font-mono text-xs font-normal">
                                $0.1366
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle h-16 pl-0">
                          <div className="flex flex-col items-end gap-1">
                            <p className="text-foreground font-mono text-sm font-normal text-right">
                              0.00
                            </p>
                            <p className="text-muted-foreground font-mono text-xs font-normal text-right">
                              $0.00
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b transition-colors cursor-pointer hover:bg-muted/10">
                        <td className="p-4 align-middle h-16 pr-0">
                          <div className="flex flex-row items-center gap-3">
                            <div className="relative shrink-0" style={{width: '28px', height: '28px'}}>
                              <img className="relative z-[1] rounded-[50%]" src="https://api.movepump.com/uploads/DALLA_E_2024_09_14_20_36_43_A_cute_cartoonish_octopus_designed_as_a_profile_picture_The_octopus_has_a_round_friendly_face_with_big_adorable_eyes_and_a_cheerful_smile_It_is_pr_b57590d63d.webp" alt="OCTO SWAP" style={{width: '28px', height: '28px'}} />
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
                                <p className="text-foreground font-mono text-sm font-normal">
                                  OCTO SWAP
                                </p>
                              </div>
                              <p className="text-muted-foreground font-mono text-xs font-normal">
                                --
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle h-16 pl-0">
                          <div className="flex flex-col items-end gap-1">
                            <p className="text-foreground font-mono text-sm font-normal text-right">
                              1.00
                            </p>
                            <p className="text-muted-foreground font-mono text-xs font-normal text-right">
                              --
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && selectedAsset && (
        <AssetModal asset={selectedAsset} onClose={closeModal} />
      )}
    </div>
  );
};

export default Market;