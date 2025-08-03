import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { ConnectButton, useCurrentAccount, useSuiClient, useSignAndExecuteTransaction, lightTheme, WalletProvider, ThemeVars, useConnectWallet, useWallets, useDisconnectWallet, ConnectModal } from "@mysten/dapp-kit";
import CreatePool from "./CreatePool";
import AddLiquidityModal from "./AddLiquidityModal";
import Position from "./Position"; // New import
import PoolList from "./PoolList"; // Updated import
import { tokens, Token } from "./tokens";
import { Link, useNavigate } from "react-router-dom";
import "./Pool.css";

const walletLogos = {
  'Slush': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYHwA15AKYWXvoSL-94ysbnJrmUX_oU1fJyw&s',
  'Suiet': 'https://framerusercontent.com/modules/6HmgaTsk3ODDySrS62PZ/a3c2R3qfkYJDxcZxkoVv/assets/eDZRos3xvCrlWxmLFr72sFtiyQ.png',
  'Martian': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhb6QLKfuQY_N8ZvpiKcdZlCnQKILXw7NArw&s',
  'Sui Wallet': 'https://assets.crypto.ro/logos/sui-sui-logo.png',
};

const customTheme1: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(0)',
  },
  backgroundColors: {
    primaryButton: '#3b82f6',
    primaryButtonHover: '#4b9cfa',
    outlineButtonHover: '#E4E4E7',
    modalOverlay: 'rgba(24, 36, 53, 0.2)',
    modalPrimary: 'white',
    modalSecondary: '#F7F8F8',
    iconButton: 'transparent',
    iconButtonHover: '#F0F1F2',
    dropdownMenu: '#FFFFFF',
    dropdownMenuSeparator: '#F3F6F8',
    walletItemSelected: 'white',
    walletItemHover: '#3C424226',
  },
  borderColors: {
    outlineButton: '#E4E4E7',
  },
  colors: {
    primaryButton: '#FFFFFF',
    outlineButton: '#373737',
    iconButton: '#000000',
    body: '#182435',
    bodyMuted: '#767A81',
    bodyDanger: '#FF794B',
  },
  radii: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
  },
  shadows: {
    primaryButton: '0 4px 12px rgba(0, 0, 0, 0.1)',
    walletItemSelected: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '700',
  },
  fontSizes: {
    small: '12px',
    medium: '14px',
    large: '16px',
    xlarge: '18px',
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontStyle: 'normal',
    lineHeight: '1.5',
    letterSpacing: '0.02em',
  },
};

export function CustomConnectButton() {
  const { mutate: disconnect } = useDisconnectWallet();
  const currentAccount = useCurrentAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '120px',
    height: '36px',
    background: '#1e293b',
    border: '1px solid #808080',
    borderRadius: '8px',
    cursor: 'pointer',
    padding: '6px',
    transition: 'all 0.3s ease',
    color: '#FFFFFF',
    fontSize: '14px',
  };

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
    <div style={{ position: 'relative' }}>
      <ConnectModal
        open={isModalOpen}
        trigger={
          <button
            onClick={handleButtonClick}
            style={baseStyle}
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
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: '#f0f0f0',
            color: '#333',
            padding: '5px 10px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            zIndex: 1000,
          }}
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      )}
    </div>
  );
}

const customTheme: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(0)',
  },
  backgroundColors: {
    primaryButton: '#FFFFFF',
    primaryButtonHover: '#F7F8F8',
    outlineButtonHover: '#E4E4E7',
    modalOverlay: 'rgba(24, 36, 53, 0.2)',
    modalPrimary: 'white',
    modalSecondary: '#F7F8F8',
    iconButton: 'transparent',
    iconButtonHover: '#F0F1F2',
    dropdownMenu: '#FFFFFF',
    dropdownMenuSeparator: '#F3F6F8',
    walletItemSelected: 'white',
    walletItemHover: '#3C424226',
  },
  borderColors: {
    outlineButton: '#E4E4E7',
  },
  colors: {
    primaryButton: '#182435',
    outlineButton: '#373737',
    iconButton: '#000000',
    body: '#182435',
    bodyMuted: '#767A81',
    bodyDanger: '#FF794B',
  },
  radii: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
  },
  shadows: {
    primaryButton: '0 4px 12px rgba(0, 0, 0, 0.1)',
    walletItemSelected: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '700',
  },
  fontSizes: {
    small: '12px',
    medium: '14px',
    large: '16px',
    xlarge: '18px',
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontStyle: 'normal',
    lineHeight: '1.5',
    letterSpacing: '0.02em',
  },
};

interface Pool {
  pair: string;
  token1: string;
  token2: string;
  token1Symbol: string;
  token2Symbol: string;
  img1: string;
  img2: string;
  feeRate: string;
  tvl: string;
  volume: string;
  fees: string;
  apr: string;
  rewardImg: string;
}

function Pool() {
  const [newPoolToken1, setNewPoolToken1] = useState("");
  const [newPoolToken2, setNewPoolToken2] = useState("");
  const [feeRate, setFeeRate] = useState("0.25");
  const [activeTab, setActiveTab] = useState("pools");
  const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
  const [isAddLiquidityOpen, setIsAddLiquidityOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [countdown, setCountdown] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [showRpcPopover, setShowRpcPopover] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<"D" | "W" | "M">("D");
  const navigate = useNavigate();

  const toggleDropdown = (menu: string | null) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getTokenAddress = (symbol: string): string => {
    const token = tokens.find(t => t.symbol === symbol);
    if (!token) {
      console.error(`Token ${symbol} not found in tokens list`);
      return "0x0";
    }
    return token.address;
  };

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const utc8Offset = 8 * 60;
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const utc8Time = new Date(utcTime + utc8Offset * 60000);
      const nextMidnight = new Date(
        utc8Time.getFullYear(),
        utc8Time.getMonth(),
        utc8Time.getDate() + 1,
        0, 0, 0
      );
      const timeDiff = nextMidnight.getTime() - utc8Time.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCreatePool = () => {
    setIsCreatePoolOpen(true);
  };

  const handleCloseCreatePool = () => {
    setIsCreatePoolOpen(false);
  };

  const handleAddLiquidity = (pool: Pool | null, scroll: boolean = false) => {
    setSelectedPool(pool);
    setIsAddLiquidityOpen(true);
    if (scroll) {
      const firstPoolElement = document.querySelector(".pool-item");
      if (firstPoolElement) {
        firstPoolElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleCloseAddLiquidityModal = () => {
    setIsAddLiquidityOpen(false);
    setSelectedPool(null);
  };

  return (
    <WalletProvider theme={customTheme}>
      <div className="container">
        <div className="header">
          <div className="header-top">
            <div className="logo-container">
              <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image" />
              <span className="logo-text">Seal</span>
            </div>
            <div className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
              <div
                className={["nav-item", openDropdown === "trade" ? "open" : ""].join(" ")}
                onMouseEnter={() => toggleDropdown("trade")}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <span className="nav-text">Trade</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={["dropdown", openDropdown === "trade" ? "open" : ""].join(" ")}>
                  <Link to="/" className="dropdown-item">
                    <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                      <use xlinkHref="#icon-a-icon_swap2"></use>
                    </svg>
                    Swap
                  </Link>
                </div>
              </div>
              <div
                className={["nav-item", openDropdown === "earn" ? "open" : ""].join(" ")}
                onMouseEnter={() => toggleDropdown("earn")}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <span className="nav-text">Earn</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={["dropdown", openDropdown === "earn" ? "open" : ""].join(" ")}>
                  <Link to="/pool" className="dropdown-item">
                    <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                      <use xlinkHref="#icon-icon_liquiditypools"></use>
                    </svg>
                    Pool
                  </Link>
                </div>
              </div>
              <Link to="/xseal" className="nav-item">
                <span className="nav-text">xSEAL</span>
              </Link>
              <div
                className={["nav-item", openDropdown === "bridge" ? "open" : ""].join(" ")}
                onMouseEnter={() => toggleDropdown("bridge")}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <span className="nav-text">Bridge</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={["dropdown", openDropdown === "bridge" ? "open" : ""].join(" ")}>
                  <a href="https://bridge.sui.io/" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                      <use xlinkHref="#icon-icon_sui"></use>
                    </svg>
                    Sui Bridge
                  </a>
                  <a href="https://bridge.cetus.zone/sui" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                      <use xlinkHref="#icon-icon_wormhole"></use>
                    </svg>
                    Wormhole
                  </a>
                </div>
              </div>
              <div
                className={["nav-item", openDropdown === "more" ? "open" : ""].join(" ")}
                onMouseEnter={() => toggleDropdown("more")}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <span className="nav-text">More</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={["dropdown", openDropdown === "more" ? "open" : ""].join(" ")}>
                  <a href="#" className="dropdown-item">
                    <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                      <use xlinkHref="#icon-icon_docs"></use>
                    </svg>
                    Docs
                  </a>
                  <a href="#" className="dropdown-item">
                    <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                      <use xlinkHref="#icon-icon_stats"></use>
                    </svg>
                    Leaderboard
                  </a>
                </div>
              </div>
            </div>
            <div className="wallet-actions">
              <CustomConnectButton />
              <button
                id="popover-trigger-notification"
                aria-haspopup="dialog"
                aria-expanded={showNotificationPopover}
                aria-controls="popover-content-notification"
                className="icon-button css-fi49l4"
                onClick={() => setShowNotificationPopover(!showNotificationPopover)}
              >
                <div className="css-1ke24j5">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-1.1-.9-2-2-2s-2 .9-2 2v.68C6.63 5.36 5 7.92 5 11v5l-2 2v1h18v-1l-2-2z"></path>
                  </svg>
                </div>
              </button>
              {showNotificationPopover && (
                <div className="chakra-popover__body css-1q40f86">
                  <div className="chakra-stack css-13uh600">
                    <img src="/images/logo_paw_sel@2x.png" alt="Pawtato" className="chakra-image css-1tq2rxf" />
                    <p className="chakra-text css-136jcmy">Visit Pawtato to manage notification settings for LP Range Alert</p>
                    <button type="button" className="chakra-button css-fpjdn4">Subscribe</button>
                  </div>
                </div>
              )}
              <button
                id="popover-trigger-rpc"
                aria-haspopup="dialog"
                aria-expanded={showRpcPopover}
                aria-controls="popover-content-rpc"
                className="icon-button css-163hjq3"
                onClick={() => setShowRpcPopover(!showRpcPopover)}
              >
                <div className="css-1ke24j5">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.30-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
                  </svg>
                </div>
              </button>
              {showRpcPopover && (
                <div className="chakra-popover__body css-1q40f86">
                  <div className="chakra-stack css-1opork5">
                    <div className="chakra-stack css-1ysm3zc">
                      <div className="css-1ke24j5">
                        <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </div>
                      <p className="chakra-text css-vcvc47">RPC Node</p>
                    </div>
                    <div className="css-122co4m">
                      {[
                        { name: "Sui Official", latency: "249ms", selected: true },
                        { name: "BlockVision", latency: "562ms" },
                        { name: "BlockVision 2", latency: "909ms" },
                        { name: "Suiet", latency: "553ms" },
                        { name: "Blast", latency: "554ms" },
                        { name: "Suiscan", latency: "3181ms" },
                        { name: "Triton", latency: "436ms" },
                        { name: "Custom RPC URL", latency: "" },
                      ].map((node, index) => (
                        <div key={index} className="chakra-stack css-k5o0vm">
                          <div className="chakra-stack css-1jjq5p5">
                            <div className="chakra-stack css-edyt6g">
                              <div className={node.selected ? "css-sopywd" : "css-empty-check"}>
                                {node.selected && (
                                  <div className="css-1ke24j5">
                                    <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                                      <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <p className={`chakra-text ${node.selected ? "css-swgav2" : "css-sezabi"}`}>{node.name}</p>
                            </div>
                            {node.latency && (
                              <div className="chakra-stack css-cp3a5l">
                                <div className="css-18uefe2"></div>
                                <p className="chakra-text css-1ec3nbv">{node.latency}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <button className="hamburger-menu" onClick={toggleMenu}>
                <svg className="hamburger-icon" viewBox="0 0 24 24" width="24px" height="24px">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="var(--text-color)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="pool-container">
          <div className="summary-container">
            <div className="summary-left">
              <h1 className="summary-title">Liquidity Pools</h1>
              <div className="summary-metrics-card">
                <div className="metric-item">
                  <p className="metric-label">Total Value Locked</p>
                  <p className="metric-value">$114,541,220.45</p>
                </div>
                <div className="metric-item">
                  <p className="metric-label">Cumulative Volume</p>
                  <p className="metric-value">$68,622,910,890.96</p>
                </div>
              </div>
            </div>
            <div className="summary-right">
              <div className="chart-header">
                <p className="chart-title">Trading Volume (24H)</p>
                <div className="chart-volume-container">
                  <p className="chart-volume">$273,688,627.57</p>
                  <div className="period-selector">
                    <button
                      className={`period-button ${chartPeriod === "D" ? "active" : ""}`}
                      onClick={() => setChartPeriod("D")}
                    >
                      D
                    </button>
                    <button
                      className={`period-button ${chartPeriod === "W" ? "active" : ""}`}
                      onClick={() => setChartPeriod("W")}
                    >
                      W
                    </button>
                    <button
                      className={`period-button ${chartPeriod === "M" ? "active" : ""}`}
                      onClick={() => setChartPeriod("M")}
                    >
                      M
                    </button>
                  </div>
                </div>
              </div>
              <div className="chart-container">
                <svg width="100%" height="258" viewBox="0 0 733 258">
                  <defs>
                    <clipPath id="chart-clip">
                      <rect x="5" y="5" width="723" height="218"></rect>
                    </clipPath>
                  </defs>
                  <g className="recharts-cartesian-axis recharts-xAxis">
                    <g>
                      {['05', '26', '16', '07', '28', '18', '09', '30', '20', '10', '03', '24', '14', '05', '26', '16', '07', '28'].map((label, index) => (
                        <g key={index} transform={`translate(${16.661 + index * 40.722},231)`}>
                          <text x="0" y="0" dy="16" textAnchor="middle" fill="#909CA4" fontSize="12" fontFamily="Inter">{label}</text>
                        </g>
                      ))}
                    </g>
                  </g>
                  <g clipPath="url(#chart-clip)">
                    <g>
                      <rect x="10.83" y="152.71" width="11" height="70.29" fill="#007BFF" />
                      <rect x="34.15" y="182.52" width="11" height="40.48" fill="#007BFF" />
                      <rect x="57.48" y="174.29" width="11" height="48.71" fill="#007BFF" />
                      <rect x="80.80" y="157.22" width="11" height="65.78" fill="#007BFF" />
                      <rect x="104.12" y="170.40" width="11" height="52.60" fill="#007BFF" />
                      <rect x="127.44" y="148.29" width="11" height="74.71" fill="#007BFF" />
                      <rect x="150.77" y="139.43" width="11" height="83.57" fill="#007BFF" />
                      <rect x="174.09" y="146.01" width="11" height="76.99" fill="#007BFF" />
                      <rect x="197.41" y="182.24" width="11" height="40.76" fill="#007BFF" />
                      <rect x="220.73" y="167.43" width="11" height="55.57" fill="#007BFF" />
                      <rect x="244.06" y="154.11" width="11" height="68.89" fill="#007BFF" />
                      <rect x="267.38" y="146.95" width="11" height="76.05" fill="#007BFF" />
                      <rect x="290.70" y="151.32" width="11" height="71.68" fill="#007BFF" />
                      <rect x="314.02" y="96.07" width="11" height="126.93" fill="#007BFF" />
                      <rect x="337.35" y="80.80" width="11" height="142.20" fill="#007BFF" />
                      <rect x="360.67" y="130.78" width="11" height="92.22" fill="#007BFF" />
                      <rect x="383.99" y="140.73" width="11" height="82.27" fill="#007BFF" />
                      <rect x="407.31" y="27.38" width="11" height="195.62" fill="#007BFF" />
                      <rect x="430.64" y="15.38" width="11" height="207.62" fill="#007BFF" />
                      <rect x="453.96" y="81.78" width="11" height="141.22" fill="#007BFF" />
                      <rect x="477.28" y="73.91" width="11" height="149.09" fill="#007BFF" />
                      <rect x="500.60" y="42.21" width="11" height="180.79" fill="#007BFF" />
                      <rect x="523.93" y="140.45" width="11" height="82.55" fill="#007BFF" />
                      <rect x="547.25" y="119.63" width="11" height="103.37" fill="#007BFF" />
                      <rect x="570.57" y="85.64" width="11" height="137.36" fill="#007BFF" />
                      <rect x="593.90" y="28.69" width="11" height="194.31" fill="#007BFF" />
                      <rect x="617.22" y="54.97" width="11" height="168.03" fill="#007BFF" />
                      <rect x="640.54" y="60.76" width="11" height="162.24" fill="#007BFF" />
                      <rect x="663.86" y="42.10" width="11" height="180.90" fill="#007BFF" />
                      <rect x="687.19" y="86.14" width="11" height="136.86" fill="#007BFF" />
                      <rect x="710.51" y="195.86" width="11" height="27.14" fill="#007BFF" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          {activeTab === "pools" ? (
            <PoolList
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isCreatePoolOpen={isCreatePoolOpen}
              handleCreatePool={handleCreatePool}
              handleCloseCreatePool={handleCloseCreatePool}
              isAddLiquidityOpen={isAddLiquidityOpen}
              selectedPool={selectedPool}
              handleAddLiquidity={handleAddLiquidity}
              handleCloseAddLiquidityModal={handleCloseAddLiquidityModal}
              newPoolToken1={newPoolToken1}
              newPoolToken2={newPoolToken2}
              feeRate={feeRate}
              setNewPoolToken1={setNewPoolToken1}
              setNewPoolToken2={setNewPoolToken2}
              setFeeRate={setFeeRate}
              getTokenAddress={getTokenAddress}
            />
          ) : (
            <Position
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleAddLiquidity={handleAddLiquidity}
            />
          )}
        </div>
      </div>
    </WalletProvider>
  );
}

export default Pool;