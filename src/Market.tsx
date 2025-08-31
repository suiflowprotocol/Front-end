// Market.tsx
import React, { useState, useEffect, useRef } from "react";
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

export function CustomConnectButton({ setIsModalOpen }: { setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { mutate: disconnect } = useDisconnectWallet();
  const currentAccount = useCurrentAccount();
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

  return (
    <div className="connect-button-wrapper">
      <button
        onClick={handleButtonClick}
        className="connect-button"
        aria-label={currentAccount ? 'Wallet Connected' : 'Connect Wallet'}
      >
        {currentAccount ? connectedContent : disconnectedContent}
      </button>
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
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const currentAccount = useCurrentAccount();
  const allowedWallets = ['Slush', 'Suiet', 'Martian', 'Sui Wallet', 'Martian Sui Wallet'];
  const walletFilter = (wallet: any) => allowedWallets.includes(wallet.name);

  const CRYPTOCOMPARE_API = "https://min-api.cryptocompare.com/data";
  const CACHE_DURATION = 2 * 60 * 1000;
  const priceCache = useRef<{ [key: string]: { price: number; timestamp: number } }>({});

  const cryptoCompareIds: { [key: string]: string } = {
    SUI: "SUI",
    USDC: "USDC",
    USDT: "USDT",
    BTC: "BTC",
    ARB: "ARB",
    SOL: "SOL",
    APT: "APT",
    SEI: "SEI",
    AVAX: "AVAX",
    TIA: "TIA",
    POL: "MATIC",
    BLUE: "BLUE",
    AUSD: "AUSD",
    AFSUI: "AFSUI",
    VSUI: "VSUI",
    NAVX: "NAVX",
    USDY: "USDY",
    FUD: "FUD",
    HAEDAL: "HAEDAL",
    NS: "NS",
    CETUS: "CETUS",
    DEEP: "DEEP",
    WAL: "WAL",
    SCA: "SCA",
    HASUI: "HASUI",
    BUCK: "BUCK",
    "OKX_WRAPPED_BTC": "BTC",
    "TETHER_SUI_BRIDGE": "USDT"
  };

  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  const fetchWithRetry = async (url: string, retries = 3, delay = 1000): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json();
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  };

  const fetchTokenPrice = async (symbol: string) => {
    const ccId = cryptoCompareIds[symbol.toUpperCase()];
    if (!ccId) {
      console.warn(`No CryptoCompare ID found for ${symbol}`);
      return 0;
    }

    const cached = priceCache.current[symbol.toLowerCase()];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.price;
    }

    try {
      const data = await fetchWithRetry(`${CRYPTOCOMPARE_API}/price?fsym=${ccId}&tsyms=USD`);
      const price = data.USD || 0;
      priceCache.current[symbol.toLowerCase()] = { price, timestamp: Date.now() };
      return price;
    } catch (err) {
      console.error(`Failed to fetch price for ${symbol}:`, err);
      return 0;
    }
  };

  useEffect(() => {
    const fetchPrices = async () => {
      const symbols = ['UP', 'sSUI', 'oshiSUI', 'strateSUI', 'jugSUI', 'kSUI', 'iSUI', 'trevinSUI', 'mSUI', 'fudSUI', 'flSUI', 'upSUI', 'SUI', 'USDC', 'suiUSDT', 'AUSD', 'LBTC', 'wBTC', 'xBTC', 'suiETH', 'SOL', 'DEEP', 'WAL', 'SNED', 'IKA', 'HAEDAL', 'BLUE', 'NS', 'DMC', 'ALKIMI', 'mUSD', 'BUCK', 'HIPPO', 'FUD', 'wUSDC', 'wUSDT', 'wETH'];
      const newPrices: { [key: string]: number } = {};

      for (const symbol of symbols) {
        newPrices[symbol.toLowerCase()] = await fetchTokenPrice(symbol);
      }

      setPrices(newPrices);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const getPrice = (symbol: string) => {
    return prices[symbol.toLowerCase()]?.toFixed(4) || '0.0000';
  };

  return (
    <div className="container789">
      <div className="header789">
        <div className="background-glow header-glow"></div>
        <div className="header-top">
          <div className="logo-container">
            <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image" />
            <span className="logo-text">Seal</span>
          </div>
          {!isMobile ? (
            <div className={`nav-menu789 ${isMenuOpen ? "open" : ""}`}>
              <div className={`nav-item789 ${openDropdown === "trade" ? "open" : ""}`}
                   onMouseEnter={() => toggleDropdown("trade")}
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">Trade</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={`dropdown789 ${openDropdown === "trade" ? "open" : ""}`}>
                  <Link to="/app" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                    </svg>
                    Swap
                  </Link>
                </div>
              </div>
              <div className={`nav-item789 ${openDropdown === "Lend" ? "open" : ""}`}
                   onMouseEnter={() => toggleDropdown("Lend")}
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">Lend</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={`dropdown789 ${openDropdown === "Lend" ? "open" : ""}`}>
                  <Link to="/market" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                    </svg>
                    Market
                  </Link>
                  <Link to="/liquidation" className="dropdown-item789">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                    </svg>
                    Liquidation
                  </Link>
                </div>
              </div>
              <div className={`nav-item789 ${openDropdown === "earn" ? "open" : ""}`}
                   onMouseEnter={() => toggleDropdown("earn")}
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">Earn</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={`dropdown789 ${openDropdown === "earn" ? "open" : ""}`}>
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
            <CustomConnectButton setIsModalOpen={setIsConnectModalOpen} />
            <a href="https://x.com/sealprotocol_" target="_blank" rel="noopener noreferrer" className="icon-button css-fi49l4">
              <div className="css-1ke24j5">
                <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1 2.25h7.28l4.71 6.23zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
            </a>
            <a href="https://t.me/sealprotocol" target="_blank" rel="noopener noreferrer" className="icon-button css-163hjq3">
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
          <div className="card789 market-summary" style={{width: '100%'}}>
            <div className="card-header">
              <h2 className="section-title">Main Market</h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground789">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <div className="market-stats">
              <div className="stat-item left-align">
                <p className="text-muted-foreground789">Deposits</p>
                <p style={{ color: '#FFFFFF' }}>$0</p>
              </div>
              <div className="stat-item center-align">
                <p className="text-muted-foreground789">Borrows</p>
                <p style={{ color: '#FFFFFF' }}>$0</p>
              </div>
              <div className="stat-item right-align">
                <p className="text-muted-foreground789">TVL</p>
                <p style={{ color: '#FFFFFF' }}>$0</p>
              </div>
            </div>
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
                  <td colSpan={6} className="section-title">Featured assets</td>
                </tr>
                <tr onClick={() => openModal('UP')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://www.doubleup.fun/Diamond_Only.png" alt="UP" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>UP</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('UP')}</span>
  </div>
</td>
                  <td>0 UP <span className="text-muted-foreground789">$0</span></td>
                  <td>0 UP <span className="text-muted-foreground789">$0</span></td>
                  <td>0% / 2</td>
                  <td className="text-green-500789">0%</td>
                  <td>0%</td>
                </tr>
                <tr className="section-header">
                  <td colSpan={6} className="section-title">Main Assets</td>
                </tr>
                <tr onClick={() => openModal('sSUI')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://trade.bluefin.io/tokens/sSUI.png" alt="sSUI" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>sSUI</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SUI')}</span>
  </div>
</td>
                  <td>0 sSUI <span className="text-muted-foreground789">$0</span></td>
                  <td>0 sSUI <span className="text-muted-foreground789">$0</span></td>
                  <td>70% / -</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr className="expandable-section" onClick={() => toggleSection('ecosystem')}>
                  <td colSpan={6}>
                    <div className="section-title">
                      ECOSYSTEM LST
                      <svg className={`arrow-icon ${expandedSections['ecosystem'] ? 'rotated' : ''}`} viewBox="0 0 12 12" width="12px" height="12px">
                        <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                      </svg>
                    </div>
                  </td>
                </tr>
                {expandedSections['ecosystem'] && (
                  <>
                    <tr onClick={() => openModal('oshiSUI')}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://bafybeib6vvpcgfql6ijoeckkzrcuijvvmnq3xmrp3krb75dgsyvq2oq5ei.ipfs.w3s.link/OSUI.png" alt="oshiSUI" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>oshiSUI</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SUI')}</span>
  </div>
</td>
                      <td>0 oshiSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>0 oshiSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>70% / 1</td>
                      <td>0%</td>
                      <td>0%</td>
                    </tr>
                    <tr onClick={() => openModal('strateSUI')}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://bafybeidzbmtzzwy4uqi5tzvypnqfw5fnrfsovmfxcfkw7n2lxqulw4bfzq.ipfs.w3s.link/%E4%B8%8B%E8%BD%BD.png" alt="strateSUI" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>strateSUI</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SUI')}</span>
  </div>
</td>
                      <td>0 strateSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>0 strateSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>70% / -</td>
                      <td>0%</td>
                      <td>0%</td>
                    </tr>
                    <tr onClick={() => openModal('jugSUI')}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://bafybeidzbmtzzwy4uqi5tzvypnqfw5fnrfsovmfxcfkw7n2lxqulw4bfzq.ipfs.w3s.link/jugsui.png" alt="jugSUI" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>jugSUI</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SUI')}</span>
  </div>
</td>
                      <td>0 jugSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>0 jugSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>70% / 1</td>
                      <td>0%</td>
                      <td>0%</td>
                    </tr>
                    <tr onClick={() => openModal('kSUI')}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://bafybeiaosl33qpik6gy5hu7tifqwj3ywdb4zeba6pixsqm7ghijidaifue.ipfs.w3s.link/ksui.png" alt="kSUI" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>kSUI</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SUI')}</span>
  </div>
</td>
                      <td>0 kSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>0 kSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>70% / -</td>
                      <td>0%</td>
                      <td>0%</td>
                    </tr>
                    <tr onClick={() => openModal('iSUI')}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://bafybeic2g4yp4dxflraoxq22dass27vs6jc3obcjsnpzomf6rt7hpc5yfe.ipfs.w3s.link/isui.png" alt="iSUI" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>iSUI</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SUI')}</span>
  </div>
</td>
                      <td>0 iSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>0 iSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>70% / 1</td>
                      <td>0%</td>
                      <td>0%</td>
                    </tr>
                    <tr onClick={() => openModal('trevinSUI')}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://bafybeid56767zzbsr6msysbgkudd5c7fadgq3l57c5pbfwjwsubenp6doiou.ipfs.w3s.link/trevin.png" alt="trevinSUI" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>trevinSUI</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SUI')}</span>
  </div>
</td>
                      <td>0 trevinSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>0 trevinSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>70% / -</td>
                      <td>0%</td>
                      <td>0%</td>
                    </tr>
                    <tr onClick={() => openModal('mSUI')}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://bafybeif3avog4o5u2ptqv3batbwjass5fxleosfboksxat7m2kjjmkggsq.ipfs.w3s.link/msui.png" alt="mSUI" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>mSUI</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SUI')}</span>
  </div>
</td>
                      <td>0 mSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>0 mSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>70% / 1</td>
                      <td>0%</td>
                      <td>0%</td>
                    </tr>
                    <tr onClick={() => openModal('fudSUI')}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://bafybeifjs6vumen4c6tdfxrerxmxerb7uxrl54iwksbjlewvwi5xpvu2iu.ipfs.w3s.link/fudsui.png" alt="fudSUI" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>fudSUI</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SUI')}</span>
  </div>
</td>
                      <td>0 fudSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>0 fudSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>70% / -</td>
                      <td>0%</td>
                      <td>0%</td>
                    </tr>
                    <tr onClick={() => openModal('flSUI')}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://bafybeid56767zzbsr6msysbgkudd5c7fadgq3l57c5pbfwjwsubenp6doiou.ipfs.w3s.link/flsui.png" alt="flSUI" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>flSUI</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SUI')}</span>
  </div>
</td>
                      <td>0 flSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>0 flSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>70% / 1</td>
                      <td>0%</td>
                      <td>0%</td>
                    </tr>
                    <tr onClick={() => openModal('upSUI')}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://bafybeiaosl33qpik6gy5hu7tifqwj3ywdb4zeba6pixsqm7ghijidaifue.ipfs.w3s.link/upsui.png" alt="upSUI" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>upSUI</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SUI')}</span>
  </div>
</td>
                      <td>0 upSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>0 upSUI <span className="text-muted-foreground789">$0</span></td>
                      <td>70% / -</td>
                      <td>0%</td>
                      <td>0%</td>
                    </tr>
                  </>
                )}
                <tr onClick={() => openModal('SUI')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://s3.coinmarketcap.com/static-gravity/image/5bd0f43855f6434386c59f2341c5aaf0.png" alt="SUI" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>SUI</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SUI')}</span>
  </div>
</td>
                  <td>0 SUI <span className="text-muted-foreground789">$0</span></td>
                  <td>0 SUI <span className="text-muted-foreground789">$0</span></td>
                  <td>70% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('USDC')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://s2.coinmarketcap.com/static/img/coins/200x200/3408.png" alt="USDC" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>USDC</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('USDC')}</span>
  </div>
</td>
                  <td>0 USDC <span className="text-muted-foreground789">$0</span></td>
                  <td>0 USDC <span className="text-muted-foreground789">$0</span></td>
                  <td>77% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('suiUSDT')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://momentum-statics.s3.us-west-1.amazonaws.com/suiUSDT.png" alt="suiUSDT" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>suiUSDT</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('USDT')}</span>
  </div>
</td>
                  <td>0 suiUSDT <span className="text-muted-foreground789">$0</span></td>
                  <td>0 suiUSDT <span className="text-muted-foreground789">$0</span></td>
                  <td>77% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('AUSD')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://static.agora.finance/ausd-token-icon.svg" alt="AUSD" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>AUSD</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('AUSD')}</span>
  </div>
</td>
                  <td>0 AUSD <span className="text-muted-foreground789">$0</span></td>
                  <td>0 AUSD <span className="text-muted-foreground789">$0</span></td>
                  <td>77% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('LBTC')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://www.lombard.finance/lbtc/LBTC.png" alt="LBTC" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>LBTC</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('BTC')}</span>
  </div>
</td>
                  <td>0 LBTC <span className="text-muted-foreground789">$0</span></td>
                  <td>0 LBTC <span className="text-muted-foreground789">$0</span></td>
                  <td>60% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('wBTC')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://bridge-assets.sui.io/suiWBTC.png" alt="wBTC" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>wBTC</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('BTC')}</span>
  </div>
</td>
                  <td>0 wBTC <span className="text-muted-foreground789">$0</span></td>
                  <td>0 wBTC <span className="text-muted-foreground789">$0</span></td>
                  <td>60% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('xBTC')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://static.coinall.ltd/cdn/oksupport/common/20250512-095503.72e1f41d9b9a06.png" alt="xBTC" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>xBTC</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('BTC')}</span>
  </div>
</td>
                  <td>0 xBTC <span className="text-muted-foreground789">$0</span></td>
                  <td>0 xBTC <span className="text-muted-foreground789">$0</span></td>
                  <td>60% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('suiETH')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://trade.bluefin.io/tokens/31484f64-6efd-4f82-bbcd-9088c389adc5.png" alt="suiETH" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>suiETH</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('ETH')}</span>
  </div>
</td>
                  <td>0 suiETH <span className="text-muted-foreground789">$0</span></td>
                  <td>0 suiETH <span className="text-muted-foreground789">$0</span></td>
                  <td>65% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('SOL')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://trade.bluefin.io/tokens/e1547bda-9921-485a-a529-d7624547318a.png" alt="SOL" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>SOL</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SOL')}</span>
  </div>
</td>
                  <td>0 SOL <span className="text-muted-foreground789">$0</span></td>
                  <td>0 SOL <span className="text-muted-foreground789">$0</span></td>
                  <td>65% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('DEEP')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/DEEP_BlueBackground.png/public" alt="DEEP" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>DEEP</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('DEEP')}</span>
  </div>
</td>
                  <td>0 DEEP <span className="text-muted-foreground789">$0</span></td>
                  <td>0 DEEP <span className="text-muted-foreground789">$0</span></td>
                  <td>50% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('WAL')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDDWKVQog0SDLcTsqXjWTuUu4cOeA5hZjaSQ&s" alt="WAL" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>WAL</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('WAL')}</span>
  </div>
</td>
                  <td>0 WAL <span className="text-muted-foreground789">$0</span></td>
                  <td>0 WAL <span className="text-muted-foreground789">$0</span></td>
                  <td>50% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
              
                <tr className="section-header">
                  <td colSpan={6} className="section-title">Isolated assets</td>
                </tr>
                <tr onClick={() => openModal('SNED')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://trade.bluefin.io/tokens/1a00f220-9815-4ff3-97af-9b776d1ca129.png" alt="SNED" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>SNED</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('SNED')}</span>
  </div>
</td>
                  <td>0 SNED <span className="text-muted-foreground789">$0</span></td>
                  <td>0 SNED <span className="text-muted-foreground789">$0</span></td>
                  <td>50% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('IKA')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://s2.coinmarketcap.com/static/img/coins/200x200/37454.png" alt="IKA" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>IKA</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('IKA')}</span>
  </div>
</td>
                  <td>0 IKA <span className="text-muted-foreground789">$0</span></td>
                  <td>0 IKA <span className="text-muted-foreground789">$0</span></td>
                  <td>40% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('HAEDAL')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://node1.irys.xyz/Rp80fmqZS3qBDnfyxyKEvc65nVdTunjOG3NY8T6AjpI" alt="HAEDAL" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>HAEDAL</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('HAEDAL')}</span>
  </div>
</td>
                  <td>0 HAEDAL <span className="text-muted-foreground789">$0</span></td>
                  <td>0 HAEDAL <span className="text-muted-foreground789">$0</span></td>
                  <td>50% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('BLUE')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://bluefin.io/images/square.png" alt="BLUE" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>BLUE</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('BLUE')}</span>
  </div>
</td>
                  <td>0 BLUE <span className="text-muted-foreground789">$0</span></td>
                  <td>0 BLUE <span className="text-muted-foreground789">$0</span></td>
                  <td>45% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('NS')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://token-image.suins.io/icon.svg" alt="NS" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>NS</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('NS')}</span>
  </div>
</td>
                  <td>0 NS <span className="text-muted-foreground789">$0</span></td>
                  <td>0 NS <span className="text-muted-foreground789">$0</span></td>
                  <td>50% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('DMC')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://storage.googleapis.com/tokenimage.deloreanlabs.com/DMCTokenIcon.svg" alt="DMC" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>DMC</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('DMC')}</span>
  </div>
</td>
                  <td>0 DMC <span className="text-muted-foreground789">$0</span></td>
                  <td>0 DMC <span className="text-muted-foreground789">$0</span></td>
                  <td>45% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('ALKIMI')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://www.alkimi.org/images/img1_circle.png" alt="ALKIMI" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>ALKIMI</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('ALKIMI')}</span>
  </div>
</td>
                  <td>0 ALKIMI <span className="text-muted-foreground789">$0</span></td>
                  <td>0 ALKIMI <span className="text-muted-foreground789">$0</span></td>
                  <td>50% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
              
                <tr onClick={() => openModal('mUSD')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://mstable.io/coins/musd.svg" alt="mUSD" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>mUSD</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('USDC')}</span>
  </div>
</td>
                  <td>0 mUSD <span className="text-muted-foreground789">$0</span></td>
                  <td>0 mUSD <span className="text-muted-foreground789">$0</span></td>
                  <td>77% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('BUCK')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/buck.svg/public" alt="BUCK" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>BUCK</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('BUCK')}</span>
  </div>
</td>
                  <td>0 BUCK <span className="text-muted-foreground789">$0</span></td>
                  <td>0 BUCK <span className="text-muted-foreground789">$0</span></td>
                  <td>77% / 1</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
              
                <tr className="expandable-section" onClick={() => toggleSection('memes')}>
                  <td colSpan={6}>
                    <div className="section-title">
                      MEMEs
                      <svg className={`arrow-icon ${expandedSections['memes'] ? 'rotated' : ''}`} viewBox="0 0 12 12" width="12px" height="12px">
                        <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                      </svg>
                    </div>
                  </td>
                </tr>
                {expandedSections['memes'] && (
                  <>
                    <tr onClick={() => openModal('HIPPO')}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://bafybeiaucaw7u4qit3yn4hwjm4sks65d7vgsup4fa6l654inpc33ieu674.ipfs.w3s.link/hippo.webp" alt="HIPPO" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>HIPPO</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('HIPPO')}</span>
  </div>
</td>
                      <td>0 HIPPO <span className="text-muted-foreground789">$0</span></td>
                      <td>0 HIPPO <span className="text-muted-foreground789">$0</span></td>
                      <td>30% / 1</td>
                      <td>0%</td>
                      <td>0%</td>
                    </tr>
                    <tr onClick={() => openModal('FUD')}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://trade.bluefin.io/tokens/2e8a84a8-cd15-4d71-baac-b90861de8b10.png" alt="FUD" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>FUD</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('FUD')}</span>
  </div>
</td>
                      <td>0 FUD <span className="text-muted-foreground789">$0</span></td>
                      <td>0 FUD <span className="text-muted-foreground789">$0</span></td>
                      <td>20% / 1</td>
                      <td>0%</td>
                      <td>0%</td>
                    </tr>
                  </>
                )}
              
                <tr className="section-header">
                  <td colSpan={6} className="section-title">Deprecated assets</td>
                </tr>
             
                <tr onClick={() => openModal('wUSDC')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://trade.bluefin.io/tokens/82d109e2-a769-40fd-a1b9-0717886af64a.png" alt="wUSDC" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>wUSDC</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('USDC')}</span>
  </div>
</td>
                  <td>0 wUSDC <span className="text-muted-foreground789">$0</span></td>
                  <td>0 wUSDC <span className="text-muted-foreground789">$0</span></td>
                  <td>0% / -</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('wUSDT')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://trade.bluefin.io/tokens/4e661e54-a1d9-4e82-903f-7b9328f8362f.png" alt="wUSDT" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>wUSDT</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('USDT')}</span>
  </div>
</td>
                  <td>0 wUSDT <span className="text-muted-foreground789">$0</span></td>
                  <td>0 wUSDT <span className="text-muted-foreground789">$0</span></td>
                  <td>0% / -</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
                <tr onClick={() => openModal('wETH')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
  <img src="https://trade.bluefin.io/tokens/df6243a7-9d26-4010-890f-6f8d86fb51e4.png" alt="wETH" style={{ width: 32, height: 32 }} />
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>wETH</span>
    <span style={{ color: '#6B7280', fontSize: '14px' }}>${getPrice('ETH')}</span>
  </div>
</td>
                  <td>0 wETH <span className="text-muted-foreground789">$0</span></td>
                  <td>0 wETH <span className="text-muted-foreground789">$0</span></td>
                  <td>0% / -</td>
                  <td>0%</td>
                  <td>0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {currentAccount ? (
          <div className="sidebar789">
            <div style={{
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  border: '1px solid',
  borderImage: 'linear-gradient(to right, #00ffff, #00b7eb) 1',
  borderRadius: '0.1875rem'
}}>
  <style>
    {`
      .unclaimed-rewards-header {
        display: flex;
        height: 1.25rem;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      .unclaimed-rewards-title {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.25rem;
        cursor: pointer;
      }
      .section-title {
        color: #1E3A8A;
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
      }
      .token-image {
        width: 1rem;
        height: 1rem;
        vertical-align: middle;
        color: #ffffff;
      }
      .toggle-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        font-size: 0.875rem;
        font-weight: 500;
        transition: colors 0.2s ease;
        height: 2rem;
        width: 2rem;
        border-radius: 0.125rem;
        gap: 0.25rem;
        color: #9ca3af;
      }
      .toggle-button:hover {
        background-color: rgba(156, 163, 175, 0.1);
        color: #ffffff;
      }
      .toggle-button svg {
        width: 1rem;
        height: 1rem;
        transition: color 0.2s ease;
      }
      .claim-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        font-size: 0.875rem;
        font-weight: 500;
        transition: colors 0.2s ease;
        height: 2rem;
        border-radius: 0.125rem;
        padding: 0 0.75rem;
        gap: 0.25rem;
        width: 150px;
        background-color: #1e40af;
        color: #00ffff;
      }
      .claim-button:hover {
        background-color: #1e40af;
        opacity: 0.9;
      }
      .claim-button p {
        font-family: 'monospace';
        font-weight: normal;
        text-transform: uppercase;
        margin: 0;
      }
      .claim-button svg {
        width: 0.75rem;
        height: 0.75rem;
      }
      .gray-small {
        color: #6B7280;
        font-size: 12px;
      }
    `}
  </style>
  <div className="unclaimed-rewards-header">
    <div className="unclaimed-rewards-title">
      <h2 className="section-title">
        Unclaimed rewards
      </h2>
    </div>
    <div className="flex flex-row items-center justify-end gap-1">
      <button className="toggle-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up w-4 h-4 shrink-0 transition-colors">
          <path d="m18 15-6-6-6 6"></path>
        </svg>
        <span className="sr-only">Toggle</span>
      </button>
    </div>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    <span className="gray-small">$0.00 sSUI</span>
    <img src="https://trade.bluefin.io/tokens/sSUI.png" alt="sSUI" className="token-image" />
  </div>
  <button className="claim-button" type="button" id="radix-:rh7a:" aria-haspopup="menu" aria-expanded="false" data-state="closed" data-sentry-element="DropdownMenuTrigger" data-sentry-source-file="DropdownMenu.tsx">
    <p className="font-mono font-normal text-sm text-inherit transition-colors uppercase">Claim rewards</p>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-down w-3 h-3 shrink-0 transition-colors">
      <path d="m6 9 6 6 6-6"></path>
    </svg>
  </button>
</div>
            <div className="card789 account">
              <div className="p-4 flex flex-col gap-2 space-y-0 rounded-t-[3px] bg-card">
                <div className="flex h-5 flex-row items-center justify-between account-header">
                  <div className="flex flex-row items-center gap-1">
                    <h2 className="section-title">Account</h2>
                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/10 hover:text-foreground h-5 w-5 rounded-sm gap-1 text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy w-4 h-4 shrink-0 transition-colors">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1 .9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                      </svg>
                    </button>
                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/10 hover:text-foreground h-5 w-5 rounded-sm gap-1 text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link w-4 h-4 shrink-0 transition-colors">
                        <path d="M15 3h6v6"></path>
                        <path d="M10 14 21 3"></path>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-row items-center justify-end gap-1">
                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/10 hover:text-foreground h-5 w-5 rounded-sm gap-1 text-muted-foreground">
                      <span className="sr-only">Toggle</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0 flex flex-col gap-4 rounded-b-[3px] bg-card">
                <div className="relative w-full">
                  <div className="absolute bottom-0 left-0 right-[66.6667%] top-0 z-[1] rounded-l-sm bg-gradient-to-r from-primary/20 to-transparent"></div>
                  <div className="relative z-[2] equity-formula rounded-sm border border-primary/5 px-4 py-3" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-muted-foreground font-sans text-xs font-normal w-max text-center">
                        Equity
                      </p>
                      <p className="text-foreground font-mono text-sm font-normal w-max text-center">
                        $0.00
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
                        $0.00
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
                <div className="net-apr" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <p className="text-muted-foreground font-sans text-xs font-normal w-max decoration-muted/50 underline decoration-dotted decoration-1 underline-offset-2">
                    Net APR
                  </p>
                  <p className="text-foreground font-mono text-sm font-normal w-max text-right">
                    0%
                  </p>
                </div>
                <div className="borrow-info-row" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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
                      $0.00
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
                      $0.00
                    </p>
                  </div>
                </div>
                <div className="-mb-[3px] border-b border-dotted border-b-muted/40 pb-[2px]">
                  <div className="relative flex h-3 w-full flex-row">
                    <div className="relative z-[1] h-full bg-muted/20" style={{width: '0%'}}></div>
                    <div className="relative z-[1] h-full bg-muted/20" style={{width: '0%'}}></div>
                    <div className="relative z-[1] h-full bg-muted/20" style={{width: '100%'}}></div>
                    <div className="absolute bottom-0 top-0 z-[2] w-1 -translate-x-1/2 bg-primary" style={{left: '0%'}}></div>
                    <div className="absolute bottom-0 top-0 z-[2] w-1 -translate-x-1/2 bg-secondary" style={{left: '0%'}}></div>
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
                      <h2 className="section-title">
                        Deposited assets
                    
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
                            <div className="flex flex-row items-center gap-3" style={{ justifyContent: 'flex-start', width: '100%' }}>
                              <div className="relative shrink-0" style={{width: '28px', height: '28px'}}>
                                <img className="relative z-[1] rounded-[50%]" src="https://trade.bluefin.io/tokens/sSUI.png" alt="sSUI" style={{width: '28px', height: '28px'}} />
                              </div>
                              <div className="flex flex-col gap-1" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
                                  <p className="text-foreground font-mono text-sm font-normal">
                                    sSUI
                                  </p>
                                  <a className="font-medium decoration-foreground/50 transition-colors hover:decoration-primary-foreground/50 block shrink-0 text-xs uppercase text-muted-foreground no-underline hover:text-foreground" href="/swap/sSUI-SUI?swapInAccount=true">
                                    Swap
                                  </a>
                                </div>
                                <p className="text-muted-foreground font-mono text-xs font-normal">
                                  ${getPrice('SUI')}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle h-16 pl-0">
                            <div className="flex flex-col items-end gap-1" style={{ textAlign: 'right' }}>
                              <p className="text-foreground font-mono text-sm font-normal text-right">
                                0
                              </p>
                              <p className="text-muted-foreground font-mono text-xs font-normal text-right">
                                $0
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
                      <h2 className="section-title">
                        Borrowed assets
                    
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
                      <h2 className="section-title">
                        Wallet balances
                   
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
                            <div className="flex flex-row items-center gap-3" style={{ justifyContent: 'flex-start', width: '100%' }}>
                              <div className="relative shrink-0" style={{width: '28px', height: '28px'}}>
                                <img className="relative z-[1] rounded-[50%]" src="https://suilend.fi/icons/sui.png" alt="SUI" style={{width: '28px', height: '28px'}} />
                              </div>
                              <div className="flex flex-col gap-1" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
                                  <p className="text-foreground font-mono text-sm font-normal">
                                    SUI
                                  </p>
                                  <a className="font-medium decoration-foreground/50 transition-colors hover:decoration-primary-foreground/50 block shrink-0 text-xs uppercase text-muted-foreground no-underline hover:text-foreground" href="/swap/SUI-USDC">
                                    Swap
                                  </a>
                                  <a className="font-medium decoration-foreground/50 transition-colors hover:decoration-primary-foreground/50 block shrink-0 text-xs uppercase text-muted-foreground no-underline hover:text-foreground" href="https://springsui.com/SUI-sSUI">
                                    Stake
                                  </a>
                                </div>
                                <p className="text-muted-foreground font-mono text-xs font-normal">
                                  ${getPrice('SUI')}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle h-16 pl-0">
                            <div className="flex flex-col items-end gap-1" style={{ textAlign: 'right' }}>
                              <p className="text-foreground font-mono text-sm font-normal text-right">
                                0
                              </p>
                              <p className="text-muted-foreground font-mono text-xs font-normal text-right">
                                $0
                              </p>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors cursor-pointer hover:bg-muted/10">
                          <td className="p-4 align-middle h-16 pr-0">
                            <div className="flex flex-row items-center gap-3" style={{ justifyContent: 'flex-start', width: '100%' }}>
                              <div className="relative shrink-0" style={{width: '28px', height: '28px'}}>
                                <img className="relative z-[1] rounded-[50%]" src="https://token-image.suins.io/icon.svg" alt="NS" style={{width: '28px', height: '28px'}} />
                              </div>
                              <div className="flex flex-col gap-1" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
                                  <p className="text-foreground font-mono text-sm font-normal">
                                    NS
                                  </p>
                                  <a className="font-medium decoration-foreground/50 transition-colors hover:decoration-primary-foreground/50 block shrink-0 text-xs uppercase text-muted-foreground no-underline hover:text-foreground" href="/swap/NS-SUI">
                                    Swap
                                  </a>
                                </div>
                                <p className="text-muted-foreground font-mono text-xs font-normal">
                                  ${getPrice('NS')}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle h-16 pl-0">
                            <div className="flex flex-col items-end gap-1" style={{ textAlign: 'right' }}>
                              <p className="text-foreground font-mono text-sm font-normal text-right">
                                0
                              </p>
                              <p className="text-muted-foreground font-mono text-xs font-normal text-right">
                                $0
                              </p>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-transparent cursor-default">
                          <td className="p-4 align-middle h-16 pr-0">
                            <div className="flex flex-row items-center gap-3" style={{ justifyContent: 'flex-start', width: '100%' }}>
                              <div className="relative shrink-0" style={{width: '28px', height: '28px'}}>
                                <img className="relative z-[1] rounded-[50%]" src="https://api.movepump.com/uploads/DALLA_E_2024_09_14_20_36_43_A_cute_cartoonish_octopus_designed_as_a_profile_picture_The_octopus_has_a_round_friendly_face_with_big_adorable_eyes_and_a_cheerful_smile_It_is_pr_b57590d63d.webp" alt="OCTO" style={{width: '28px', height: '28px'}} />
                              </div>
                              <div className="flex flex-col gap-1" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
                                  <p className="text-foreground font-mono text-sm font-normal">
                                    OCTO
                                  </p>
                                  <a className="font-medium decoration-foreground/50 transition-colors hover:decoration-primary-foreground/50 block shrink-0 text-xs uppercase text-muted-foreground no-underline hover:text-foreground" href="/swap/0x4b6d48afff2948c3ccc67191cf0ef175637472b007c1a8601fa18e16e236909c::octo::OCTO-SUI">
                                    Swap
                                  </a>
                                </div>
                                <p className="text-muted-foreground font-mono text-xs font-normal">
                                  --
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle h-16 pl-0">
                            <div className="flex flex-col items-end gap-1" style={{ textAlign: 'right' }}>
                              <p className="text-foreground font-mono text-sm font-normal text-right">
                                0
                              </p>
                              <p className="text-muted-foreground font-mono text-xs font-normal text-right">
                                $0
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
        ) : (
          <div className="sidebar789">
            <div className="flex w-full shrink-0 flex-col gap-8">
              <div className="border bg-card text-unset w-full overflow-hidden rounded-sm shadow-none card789" data-sentry-element="CardRoot" data-sentry-component="Card" data-sentry-source-file="Card.tsx" style={{backgroundImage: 'url("https://d29k09wtkr1a3e.cloudfront.net/suilend/leaderboard/header.png")', backgroundPosition: 'center center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 255, 255, 0.2)', backgroundColor: 'var(--light-bg)'}}>
                <div className="flex flex-col items-center justify-center gap-4 bg-card/75 p-4" style={{padding: '24px', height: '200px'}}>
                  <p className="font-mono text-sm font-normal text-center uppercase text-foreground" style={{textShadow: '0 0 4px #00ffff', marginBottom: '16px'}}>Start earning rewards</p>
                  <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-foreground bg-transparent hover:bg-foreground/20 h-8 rounded-sm px-3 py-2 gap-1" onClick={() => setIsConnectModalOpen(true)} style={{borderColor: '#00b7eb', background: 'linear-gradient(to right, #00ffff20, #00b7eb20)', transition: 'all 0.3s ease', marginBottom: '16px'}}>
                    <p className="font-mono font-normal text-sm text-inherit transition-colors uppercase" style={{color: '#00ffff'}}>Connect wallet</p>
                  </button>
                </div>
              </div>
              <div className="border bg-card text-unset w-full overflow-hidden rounded-sm shadow-none card789" data-sentry-element="CardRoot" data-sentry-component="Card" data-sentry-source-file="Card.tsx" style={{border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 255, 255, 0.2)', backgroundColor: 'var(--light-bg)'}}>
                <div className="p-4 flex flex-col gap-2 space-y-0">
                  <div className="flex h-5 flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-1">
                      <div className="">
                        <h2 className="text-primary font-mono text-xs font-normal flex flex-row items-center gap-2 uppercase w-full" data-sentry-element="TTitle" data-sentry-component="TitleWithIcon" data-sentry-source-file="TitleWithIcon.tsx" style={{color: '#3B82F6', textShadow: '0 0 4px #00b7eb'}}>Account</h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 pt-0" data-sentry-element="CardContent" data-sentry-source-file="AccountPositionCard.tsx">
                  <p className="text-muted-foreground font-sans text-xs font-normal" style={{color: '#d1d5db', textAlign: 'center'}}>Get started by connecting your wallet.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalOpen && selectedAsset && (
        <AssetModal asset={selectedAsset} onClose={closeModal} />
      )}
      <ConnectModal trigger={<div></div>} open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen} walletFilter={walletFilter} />
    </div>
  );
};

export default Market;