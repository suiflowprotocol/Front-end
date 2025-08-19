// App.tsx
import { useState, useEffect, useRef } from "react";
import { ConnectButton, useCurrentAccount, useSuiClient, useSignAndExecuteTransaction, lightTheme, WalletProvider, ThemeVars, useConnectWallet, useWallets, useDisconnectWallet, ConnectModal } from "@mysten/dapp-kit";
import '@mysten/dapp-kit/dist/index.css';
import { Transaction } from "@mysten/sui/transactions";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Pool from "./Pool";
import Position from "./positions.tsx";
import XSeal from "./xSeal";
import TokenModal, { tokens } from "./TokenModal";
import CoverPage from "./CoverPage";
import Sidebar from "./SidebarMenu";
import "./App.css";
import "./App2.css";
import Modal from './Modal';
import SettingsPage from './SettingsPage';
import SwapPreview from './SwapPreview';
import WaitingConfirmation from './WaitingConfirmation';
import LimitOrderPage from "./limit";
import LaunchPage from "./LaunchPage";
import FaucetPage from "./FaucetPage";


// Wallet logos
const walletLogos = {
  'Slush': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYHwA15AKYWXvoSL-94ysbnJrmUX_oU1fJyw&s',
  'Suiet': 'https://framerusercontent.com/modules/6HmgaTsk3ODDySrS62PZ/a3c2R3qfkYJDxcZxkoVv/assets/eDZRos3xvCrlWxmLFr72sFtiyQ.png',
  'Martian': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhb6QLKfuQY_N8ZvpiKcdZlCnQKILXw7NArw&s',
  'Sui Wallet': 'https://assets.crypto.ro/logos/sui-sui-logo.png',
};

// Custom theme with refined colors for a more elegant look
const customTheme: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(4px)', // Softer blur for overlays
  },
  backgroundColors: {
    primaryButton: 'linear-gradient(135deg, #3b82f6, #2563eb)', // Gradient for buttons
    primaryButtonHover: 'linear-gradient(135deg, #4b9cfa, #3b82f6)',
    outlineButtonHover: '#F3F4F6',
    modalOverlay: 'rgba(15, 23, 42, 0.3)', // Softer modal overlay
    modalPrimary: '#ffffff',
    modalSecondary: '#F9FAFB',
    iconButton: 'transparent',
    iconButtonHover: '#F0F1F2',
    dropdownMenu: '#FFFFFF',
    dropdownMenuSeparator: '#F3F6F8',
    walletItemSelected: '#ffffff',
    walletItemHover: '#E5E7EB',
  },
  borderColors: {
    outlineButton: '#D1D5DB',
  },
  colors: {
    primaryButton: '#FFFFFF',
    outlineButton: '#4B5563',
    iconButton: '#1F2937',
    body: '#111827',
    bodyMuted: '#6B7280',
    bodyDanger: '#EF4444',
  },
  radii: {
    small: '6px', // Slightly larger radii for softer edges
    medium: '10px',
    large: '14px',
    xlarge: '18px',
  },
  shadows: {
    primaryButton: '0 6px 16px rgba(0, 0, 0, 0.15)', // Deeper shadows for depth
    walletItemSelected: '0 3px 10px rgba(0, 0, 0, 0.08)',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '700',
  },
  fontSizes: {
    small: '13px',
    medium: '15px',
    large: '17px',
    xlarge: '19px',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    lineHeight: '1.6',
    letterSpacing: '0.01em',
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
    width: '130px', // Slightly wider for better touch targets
    height: '38px',
    background: '#1e293b',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '10px',
    cursor: 'pointer',
    padding: '8px',
    transition: 'all 0.3s ease',
    color: '#fff',
    fontSize: '15px',
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

// Settings Modal Component with refined styling
const SettingsModal = ({ isOpen, onClose, slippage, setSlippage, customSlippage, setCustomSlippage, transactionMode, setTransactionMode, mevProtection, setMevProtection }: {
  isOpen: boolean;
  onClose: () => void;
  slippage: string;
  setSlippage: (value: string) => void;
  customSlippage: string;
  setCustomSlippage: (value: string) => void;
  transactionMode: string;
  setTransactionMode: (mode: string) => void;
  mevProtection: boolean;
  setMevProtection: (value: boolean) => void;
}) => {
  if (!isOpen) return null;

  const handleSlippageSelect = (value: string) => {
    setSlippage(value);
    setCustomSlippage("");
  };

  const handleCustomSlippage = () => {
    const value = parseFloat(customSlippage);
    if (isNaN(value) || value < 0 || value > 100) {
      alert("Please enter a valid slippage percentage (0-100)");
      return;
    }
    setSlippage(value.toString());
    setCustomSlippage("");
  };

  return (
    <section
      className="chakra-modal__content css-xnqtk4"
      role="dialog"
      tabIndex={-1}
      aria-modal="true"
      style={{ opacity: 1, transform: 'none' }}
    >
      <header className="chakra-modal__header css-14957o2">Settings</header>
      <button
        type="button"
        aria-label="Close"
        className="chakra-modal__close-btn css-14njbx"
        onClick={onClose}
      >
        <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi" aria-hidden="true">
          <path
            fill="currentColor"
            d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0 1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0 1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439,0.44L14.3,7.7a.25.25,0,0 1-.354,0L4.561,0.44A1.5,1.5,0,0,0,2.439,2.561L9.7,11.823a.25.25,0,0 1,0,.354Z"
          ></path>
        </svg>
      </button>
      <div className="chakra-modal__body css-86c2jf">
        <div className="css-8atqhb">
          <div className="css-0">
            <div className="css-1coeexk">
              <div className="css-1lvuolp">
                <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                  <use xlinkHref="#icon-icon_verticalslider"></use>
                </svg>
              </div>
              <p className="chakra-text css-naweef">Slippage Tolerance</p>
            </div>
            <div className="css-1xmosrt">
              <div className="chakra-stack css-axc57z">
                <div className="css-1f2l1um">
                  <div className={`css-x9odoj ${slippage === "0.1" ? "active" : ""}`}>
                    <p className="chakra-text css-wcx758" onClick={() => handleSlippageSelect("0.1")}>0.1%</p>
                  </div>
                  <div className={`css-1qok38h ${slippage === "0.5" ? "active" : ""}`}>
                    <p className="chakra-text css-30r1rg" onClick={() => handleSlippageSelect("0.5")}>0.5%</p>
                  </div>
                  <div className={`css-x9odoj ${slippage === "1" ? "active" : ""}`}>
                    <p className="chakra-text css-wcx758" onClick={() => handleSlippageSelect("1")}>1%</p>
                  </div>
                </div>
                <div className="chakra-input__group css-l7gn1b" data-group="true">
                  <p className="chakra-text css-2s2d1k">Custom</p>
                  <input
                    placeholder="0.0"
                    className="chakra-input css-kqgvne"
                    value={customSlippage}
                    onChange={(e) => setCustomSlippage(e.target.value)}
                  />
                  <div className="chakra-input__right-element css-2f1rc5">
                    <p className="chakra-text css-p3865w">%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="chakra-stack css-1sea5oz">
              <div className="chakra-stack css-1jjq5p5">
                <div className="chakra-stack css-1igwmid">
                  <div className="css-1ke24j5">
                    <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                      <use xlinkHref="#icon-icon_mode"></use>
                    </svg>
                  </div>
                  <p className="chakra-text css-ry2o2l">Transaction Mode</p>
                </div>
                <div className="css-jbrw85">
                  <div data-active={transactionMode === "Default"} className="css-1xgmac1">
                    <p
                      className="chakra-text css-13grdye"
                      data-active={transactionMode === "Default"}
                      onClick={() => setTransactionMode("Default")}
                    >
                      Default
                    </p>
                  </div>
                  <div data-active={transactionMode === "Fast Mode"} className="css-10kw1gl">
                    <div className="css-166r45o">
                      <svg aria-hidden="true" fill="#909CA4" width="16px" height="16px">
                        <use xlinkHref="#icon-icon_flash"></use>
                      </svg>
                    </div>
                    <p
                      className="chakra-text css-10a6rwu"
                      data-active={transactionMode === "Fast Mode"}
                      onClick={() => setTransactionMode("Fast Mode")}
                    >
                      Fast Mode
                    </p>
                  </div>
                </div>
              </div>
              <p className="chakra-text css-95x0qv">Standard gas based on real-time network conditions</p>
            </div>
            <div className="chakra-stack css-1e9nw6s">
              <div className="chakra-stack css-l84rf0">
                <div className="css-1ke24j5">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                    <use xlinkHref="#icon-icon_mev"></use>
                  </svg>
                </div>
                <p className="chakra-text css-k30qlv">MEV Protect</p>
              </div>
              <div className="chakra-stack css-1jjq5p5">
                <div className="chakra-stack css-1mlvmbj">
                  <p className="chakra-text css-10k4bnn">Enable MEV Protection</p>
                  <button className="chakra-stack css-1hohgv6" id="popover-trigger-:r6oh:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r6oh:">
                    <div className="css-1ke24j5">
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                        <use xlinkHref="#icon-icon_tips"></use>
                      </svg>
                    </div>
                  </button>
                </div>
                <label data-checked={mevProtection ? "" : undefined} className="chakra-switch css-ghot30">
                  <input
                    className="chakra-switch__input"
                    type="checkbox"
                    checked={mevProtection}
                    onChange={(e) => setMevProtection(e.target.checked)}
                  />
                  <span className="chakra-switch__track css-1dfiea4">
                    <span className="chakra-switch__thumb css-1ws90af" data-checked={mevProtection ? "" : undefined}></span>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="css-1cb33c5">
            <button type="button" className="chakra-button css-frin98" onClick={onClose}>Cancel</button>
            <button type="button" className="chakra-button css-10j9e9a" onClick={() => { handleCustomSlippage(); onClose(); }}>Save</button>
          </div>
        </div>
      </div>
    </section>
  );
};

function App() {
  const [showTokenModal, setShowTokenModal] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeList, setActiveList] = useState("Default");
  const [importedTokens, setImportedTokens] = useState<any[]>([]);
  const [importAddress, setImportAddress] = useState("");
  const [importError, setImportError] = useState("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [customSlippage, setCustomSlippage] = useState("");
  const [transactionMode, setTransactionMode] = useState("Default");
  const [mevProtection, setMevProtection] = useState(false);
  const [expiration, setExpiration] = useState("1 Day");
  const [searchQuery, setSearchQuery] = useState("");
  const [useAggregator, setUseAggregator] = useState(true);
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [tokenX, setTokenX] = useState("0x2::sui::SUI");
  const [tokenY, setTokenY] = useState("0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f::usdc::USDC");
  const [amountIn, setAmountIn] = useState("");
  const [minAmountOut, setMinAmountOut] = useState("0");
  const [error, setError] = useState("");
  const [poolId, setPoolId] = useState("");
  const [isReverseSwap, setIsReverseSwap] = useState(false);
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [exactBalances, setExactBalances] = useState<{ [key: string]: bigint }>({});
  const [expectedOutput, setExpectedOutput] = useState("0.0");
  const [priceImpact, setPriceImpact] = useState("0.00");
  const [countdown, setCountdown] = useState("0h 0m 0s");
  const [prices, setPrices] = useState<{ [key: string]: { price: number; change_24h: number } }>({});
  const [priceHistory, setPriceHistory] = useState<{ [key: string]: { x: number; y: number }[] }>({});
  const [priceDifference, setPriceDifference] = useState("0.00");
  const [isLoadingOutput, setIsLoadingOutput] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showWaitingConfirmation, setShowWaitingConfirmation] = useState(false);

  type ModalProps = {
    txHash?: string;
    decreasedToken?: {
      address: string;
      symbol: string;
      icon: string;
      amount: string;
    };
    increasedToken?: {
      address: string;
      symbol: string;
      icon: string;
      amount: string;
    };
    errorMessage?: string;
    onClose: () => void;
  };

  const [modalProps, setModalProps] = useState<ModalProps | null>(null);

  const switchRef = useRef(null);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [showRpcPopover, setShowRpcPopover] = useState(false);

  // Detect screen size for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const PACKAGE_ID = "0xb90158d50ac951784409a6876ac860e24564ed5257e51944d3c693efb9fdbd78";
  const POOL_REGISTRY = "0xfc8c69858d070b639b3db15ff0f78a10370950434c5521c83eaa7e2285db8d2a";
  const CRYPTOCOMPARE_API = "https://min-api.cryptocompare.com/data";
  const SUI_TYPE = "0x2::sui::SUI";

  const priceCache = useRef<{ [key: string]: { price: number; change_24h: number; timestamp: number } }>({});
  const historyCache = useRef<{ [key: string]: { data: { x: number; y: number }[]; timestamp: number } }>({});
  const CACHE_DURATION = 2 * 60 * 1000;

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

      if (timeDiff <= 0) {
        setCountdown("0h 0m 0s");
        return;
      }

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedAmountIn = useDebounce(amountIn, 300);

  const getTokenDecimals = (tokenAddress: string) => {
    const token = [...tokens, ...importedTokens].find((t) => t.address === tokenAddress);
    return token?.decimals || 6;
  };

  const setHalfBalance = () => {
    const exactBalance = exactBalances[tokenX] || 0n;
    if (exactBalance > 0n) {
      const decimals = getTokenDecimals(tokenX);
      const halfExact = exactBalance / 2n;
      const integer = halfExact / (10n ** BigInt(decimals));
      let fractionStr = (halfExact % (10n ** BigInt(decimals))).toString();
      fractionStr = fractionStr.padStart(decimals, '0').replace(/0+$/, '');
      let amountStr = integer.toString();
      if (fractionStr) {
        amountStr += '.' + fractionStr;
      }
      setAmountIn(amountStr);
    }
  };

  const setMaxBalance = () => {
    const exactBalance = exactBalances[tokenX] || 0n;
    if (exactBalance > 0n) {
      const decimals = getTokenDecimals(tokenX);
      let maxExact = exactBalance;
      if (tokenX === SUI_TYPE) {
        const gasReserve = 100000000n;
        maxExact -= gasReserve;
        if (maxExact < 0n) maxExact = 0n;
      }
      const integer = maxExact / (10n ** BigInt(decimals));
      let fractionStr = (maxExact % (10n ** BigInt(decimals))).toString();
      fractionStr = fractionStr.padStart(decimals, '0').replace(/0+$/, '');
      let amountStr = integer.toString();
      if (fractionStr) {
        amountStr += '.' + fractionStr;
      }
      setAmountIn(amountStr);
    }
  };

  const importToken = async () => {
    if (!importAddress) {
      setImportError("Please enter a valid token address");
      return;
    }
    try {
      const tokenData = await client.getObject({
        id: importAddress,
        options: { showContent: true },
      });
      const content = tokenData.data?.content as any;
      if (!content?.fields?.symbol || !content?.fields?.decimals) {
        setImportError("Unable to fetch token metadata");
        return;
      }
      const newToken = {
        symbol: content.fields.symbol,
        address: importAddress,
        icon: "https://via.placeholder.com/32",
        description: content.fields.name || `Imported Token (${content.fields.symbol})`,
        decimals: parseInt(content.fields.decimals),
      };
      setImportedTokens([...importedTokens, newToken]);
      setImportError("");
      setImportAddress("");
      setActiveList("Imported");
    } catch (err) {
      setImportError("Failed to import token: Invalid address or metadata");
    }
  };

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
      return null;
    }

    const cached = priceCache.current[symbol.toLowerCase()];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached;
    }

    try {
      const now = Math.floor(Date.now() / 1000);
      const twentyFourHoursAgo = now - 24 * 60 * 60;

      const [currentData, historicalData] = await Promise.all([
        fetchWithRetry(`${CRYPTOCOMPARE_API}/price?fsym=${ccId}&tsyms=USD`),
        fetchWithRetry(`${CRYPTOCOMPARE_API}/pricehistorical?fsym=${ccId}&tsyms=USD&ts=${twentyFourHoursAgo}`)
      ]);

      const currentPrice = currentData.USD || 0;
      const pastPrice = historicalData[ccId]?.USD || 0;
      const change_24h = pastPrice > 0 ? ((currentPrice - pastPrice) / pastPrice * 100) : 0;

      const priceData = { price: currentPrice, change_24h, timestamp: Date.now() };
      priceCache.current[symbol.toLowerCase()] = priceData;
      return priceData;
    } catch (err) {
      console.error(`Failed to fetch price for ${symbol}:`, err);
      return null;
    }
  };

  const fetchPriceHistory = async (symbol: string) => {
    const ccId = cryptoCompareIds[symbol.toUpperCase()];
    if (!ccId) {
      console.warn(`No CryptoCompare ID found for ${symbol} (price history)`);
      return [];
    }

    const cached = historyCache.current[symbol.toLowerCase()];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const now = Math.floor(Date.now() / 1000);
      const promises = [];
      for (let i = 0; i < 7; i++) {
        const timestamp = now - (i * 24 * 60 * 60);
        promises.push(
          fetchWithRetry(`${CRYPTOCOMPARE_API}/pricehistorical?fsym=${ccId}&tsyms=USD&ts=${timestamp}`)
            .then(data => ({
              x: timestamp * 1000,
              y: data[ccId]?.USD || 0
            }))
        );
      }

      const prices = (await Promise.all(promises)).reverse();
      historyCache.current[symbol.toLowerCase()] = { data: prices, timestamp: Date.now() };
      return prices;
    } catch (err) {
      console.error(`Failed to fetch price history for ${symbol}:`, err);
      return [];
    }
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const tokensToFetch = [...tokens, ...importedTokens].filter(
          (token) => token.address && !token.address.includes("...")
        );

        const pricePromises = tokensToFetch.map(token => 
          fetchTokenPrice(token.symbol).then(data => ({
            symbol: token.symbol.toLowerCase(),
            data
          }))
        );

        const results = await Promise.all(pricePromises);
        const newPrices: { [key: string]: { price: number; change_24h: number } } = {};

        results.forEach(({ symbol, data }) => {
          newPrices[symbol] = data || { price: 0, change_24h: 0 };
        });

        setPrices(newPrices);
        if (Object.keys(newPrices).length === 0) {
          setError("Unable to fetch price data for any token");
        } else {
          setError("");
        }
      } catch (err) {
        console.error("Failed to fetch prices:", err);
        setError("Unable to fetch price data");
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [importedTokens, refreshTrigger]);

  useEffect(() => {
    const fetchTokenPriceHistory = async () => {
      const symbols = [getTokenInfo(tokenX).symbol, getTokenInfo(tokenY).symbol];
      const historyPromises = symbols.map(symbol => 
        fetchPriceHistory(symbol).then(data => ({
          symbol: symbol.toLowerCase(),
          data
        }))
      );

      const results = await Promise.all(historyPromises);
      const newPriceHistory: { [key: string]: { x: number; y: number }[] } = {};

      results.forEach(({ symbol, data }) => {
        newPriceHistory[symbol] = data || [];
      });

      setPriceHistory(newPriceHistory);
    };

    fetchTokenPriceHistory();
  }, [tokenX, tokenY, refreshTrigger]);

  const generatePath = (symbol: string) => {
    const priceData = priceHistory[symbol.toLowerCase()] || [];
    if (!priceData || priceData.length < 2) return "M15,10L180,10";
    
    const validData = priceData.filter(p => p.y !== null && p.y !== undefined && !isNaN(p.y));
    if (validData.length < 2) return "M15,10L180,10";

    const sampledData = validData.length > 20 
      ? validData.filter((_, i) => i % Math.ceil(validData.length / 20) === 0)
      : validData;

    const minPrice = Math.min(...sampledData.map(p => p.y));
    const maxPrice = Math.max(...sampledData.map(p => p.y));
    const priceRange = maxPrice - minPrice || 1;
    
    const points = sampledData.map((p, i) => {
      const x = 15 + (i / (sampledData.length - 1)) * 150;
      const y = 16 - ((p.y - minPrice) / priceRange) * 12;
      return `${x},${y}`;
    });
    
    return `M${points.join("L")}`;
  };

  useEffect(() => {
    const fetchPoolId = async () => {
      if (!tokenX || !tokenY) {
        setPoolId("");
        setIsReverseSwap(false);
        return;
      }

      if (tokenX === tokenY) {
        setError("Cannot select the same token for trading");
        setPoolId("");
        setIsReverseSwap(false);
        return;
      }

      try {
        const registry = await client.getObject({
          id: POOL_REGISTRY,
          options: { showContent: true },
        });

        const content = registry.data?.content as any;
        if (!content?.fields?.pools) {
          console.error("Pool registry fields or pools not found:", JSON.stringify(content, null, 2));
          setError("Unable to fetch pool registry");
          setPoolId("");
          return;
        }

        const pools = content.fields.pools;
        let foundPoolId = "";
        let reverse = false;

        for (const pool of pools) {
          const poolTokenX = pool.fields.token_x.fields.name;
          const poolTokenY = pool.fields.token_y.fields.name;
          const poolFeeRate = parseInt(pool.fields.fee_rate);
          const poolAddr = pool.fields.pool_addr;

          const formattedPoolTokenX = `0x${poolTokenX}`;
          const formattedPoolTokenY = `0x${poolTokenY}`;

          if (
            (formattedPoolTokenX === tokenX && formattedPoolTokenY === tokenY && poolFeeRate === 25) ||
            (formattedPoolTokenX === tokenY && formattedPoolTokenY === tokenX && poolFeeRate === 25)
          ) {
            foundPoolId = poolAddr;
            reverse = formattedPoolTokenX === tokenY && formattedPoolTokenY === tokenX;
            break;
          }
        }

        if (foundPoolId) {
          setPoolId(foundPoolId);
          setIsReverseSwap(reverse);
          setError("");
        } else {
          setPoolId("");
          setError("No matching trading pool found");
          setIsReverseSwap(false);
        }
      } catch (err) {
        console.error("Failed to fetch pool ID:", err);
        setError("Unable to fetch pool ID");
        setPoolId("");
      }
    };

    fetchPoolId();
  }, [tokenX, tokenY, client, refreshTrigger]);

  useEffect(() => {
    const fetchBalancesAndOutput = async () => {
      if (!account) {
        setBalances({});
        setExactBalances({});
        setExpectedOutput("0.0");
        setMinAmountOut("0");
        setPriceImpact("0.00");
        setPriceDifference("0.00");
        setIsLoadingOutput(false);
        return;
      }

      try {
        setIsLoadingOutput(true);
        const newBalances: { [key: string]: string } = {};
        const newExactBalances: { [key: string]: bigint } = {};
        const allBalances = await client.getAllBalances({
          owner: account.address,
        });

        for (const token of [...tokens, ...importedTokens]) {
          if (token.address && !token.address.includes("...")) {
            const balanceEntry = allBalances.find((b) => b.coinType === token.address);
            const decimals = getTokenDecimals(token.address);
            if (balanceEntry) {
              newExactBalances[token.address] = BigInt(balanceEntry.totalBalance);
              const balance = Number(BigInt(balanceEntry.totalBalance)) / 10 ** decimals;
              newBalances[token.address] = balance.toFixed(4);
            } else {
              newExactBalances[token.address] = 0n;
              newBalances[token.address] = "0.0000";
            }
          }
        }
        setBalances(newBalances);
        setExactBalances(newExactBalances);

        if (debouncedAmountIn === "" || parseFloat(debouncedAmountIn) === 0) {
          setExpectedOutput("0.0");
          setMinAmountOut("0");
          setPriceImpact("0.00");
          setPriceDifference("0.00");
          setIsLoadingOutput(false);
          return;
        }

        if (poolId && debouncedAmountIn && parseFloat(debouncedAmountIn) > 0) {
          const pool = await client.getObject({
            id: poolId,
            options: { showContent: true },
          });

          const poolContent = pool.data?.content as any;
          if (!poolContent?.fields || !poolContent.fields.reserve_x || !poolContent.fields.reserve_y || !poolContent.fields.fee_rate) {
            setError("Unable to fetch pool reserve information");
            setExpectedOutput("0.0");
            setMinAmountOut("0");
            setPriceImpact("0.00");
            setPriceDifference("0.00");
            setIsLoadingOutput(false);
            return;
          }

          const reserveX = parseInt(poolContent.fields.reserve_x);
          const reserveY = parseInt(poolContent.fields.reserve_y);
          const feeRate = parseInt(poolContent.fields.fee_rate);

          if (isNaN(reserveX) || isNaN(reserveY) || isNaN(feeRate) || reserveX <= 0 || reserveY <= 0) {
            setError("Invalid pool reserve or fee data");
            setExpectedOutput("0.0");
            setMinAmountOut("0");
            setPriceImpact("0.00");
            setPriceDifference("0.00");
            setIsLoadingOutput(false);
            return;
          }

          const inputDecimals = getTokenDecimals(tokenX);
          const outputDecimals = getTokenDecimals(tokenY);
          const amountInValue = parseFloat(debouncedAmountIn) * 10 ** inputDecimals;

          let amountOut;
          if (isReverseSwap) {
            const amountInWithFee = (amountInValue * (10000 - feeRate)) / 10000;
            amountOut = (amountInWithFee * reserveX) / (reserveY + amountInWithFee);
          } else {
            const amountInWithFee = (amountInValue * (10000 - feeRate)) / 10000;
            amountOut = (amountInWithFee * reserveY) / (reserveX + amountInWithFee);
          }

          const spotPrice = isReverseSwap ? reserveX / reserveY : reserveY / reserveX;
          const effectivePrice = amountOut / amountInValue;
          const priceImpactValue = Math.abs((spotPrice - effectivePrice) / spotPrice) * 100;

          const tokenXSymbol = getTokenInfo(tokenX).symbol.toLowerCase();
          const tokenYSymbol = getTokenInfo(tokenY).symbol.toLowerCase();
          const marketPrice = prices[tokenXSymbol]?.price && prices[tokenYSymbol]?.price
            ? prices[tokenXSymbol].price / prices[tokenYSymbol].price
            : 0;
          const priceDiff = marketPrice ? Math.abs((spotPrice - marketPrice) / marketPrice) * 100 : 0;
          setPriceDifference(priceDiff.toFixed(2));

          const slippageMultiplier = 1 - parseFloat(slippage) / 100;
          const minOut = amountOut * slippageMultiplier;

          setExpectedOutput((amountOut / 10 ** outputDecimals).toFixed(4));
          setMinAmountOut((minOut / 10 ** outputDecimals).toFixed(4));
          setPriceImpact(priceImpactValue.toFixed(2));
        } else {
          setExpectedOutput("0.0");
          setMinAmountOut("0");
          setPriceImpact("0.00");
          setPriceDifference("0.00");
        }
      } catch (err) {
        console.error("Failed to fetch balances or expected output:", err);
        
        setExpectedOutput("0.0");
        setMinAmountOut("0");
        setPriceImpact("0.00");
        setPriceDifference("0.00");
      } finally {
        setIsLoadingOutput(false);
      }
    };

    fetchBalancesAndOutput();
  }, [account, tokenX, tokenY, debouncedAmountIn, slippage, poolId, isReverseSwap, client, importedTokens, prices, refreshTrigger]);

  useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, [account?.address]);

  const handleSwapTokens = () => {
    setTokenX(tokenY);
    setTokenY(tokenX);
    setAmountIn("");
    setMinAmountOut("0");
    setExpectedOutput("0.0");
    setPriceImpact("0.00");
    setPriceDifference("0.00");
  };

  const selectToken = (token: any, type: string) => {
    const newTokenAddress = token.address;
    if (type === "tokenX" && newTokenAddress === tokenY) {
      setError("Cannot select the same token");
      return;
    }
    if (type === "tokenY" && newTokenAddress === tokenX) {
      setError("Cannot select the same token");
      return;
    }
    if (type === "tokenX") {
      setTokenX(newTokenAddress);
    } else {
      setTokenY(newTokenAddress);
    }
    setShowTokenModal(null);
    setAmountIn("");
    setMinAmountOut("0");
    setExpectedOutput("0.0");
    setPriceImpact("0.00");
    setPriceDifference("0.00");
    setError("");
  };

  const getTokenInfo = (address: string) => {
    return [...tokens, ...importedTokens].find((token) => token.address === address) || tokens[0];
  };

  const handleShowPreview = () => {
    if (!account) {
      setError("Please connect wallet");
      return;
    }
    if (!amountIn || parseFloat(amountIn) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (tokenX === tokenY) {
      setError("Cannot select the same token for trading");
      return;
    }
    if (!poolId) {
      setError("No matching trading pool found");
      return;
    }
    if ((exactBalances[SUI_TYPE] || 0n) < 100000000n) {
      setError("Insufficient SUI balance for transaction fee (at least 0.1 SUI required)");
      return;
    }
    setShowPreview(true);
  };

  const handleSwap = async () => {
    if (!account) {
      setError("Please connect wallet");
      return;
    }
    if (!tokenX || !tokenY || !amountIn || parseFloat(amountIn) <= 0 || !poolId) {
      setError("Please enter a valid amount and select valid token pair");
      return;
    }
    if (tokenX === tokenY) {
      setError("Cannot select the same token for trading");
      return;
    }

    try {
      const suiBalance = await client.getBalance({
        owner: account.address,
        coinType: SUI_TYPE,
      });
      const totalSuiBalance = BigInt(suiBalance.totalBalance);
      const gasBudgetBigInt = 100000000n;
      if (totalSuiBalance < gasBudgetBigInt) {
        setError("Insufficient SUI balance for transaction fee (at least 0.1 SUI required)");
        return;
      }

      const inputToken = tokenX;
      const outputToken = tokenY;
      const inputDecimals = getTokenDecimals(inputToken);
      const parts = amountIn.split('.');
      let amountStr = parts[0] || '0';
      if (parts.length > 1) {
        amountStr += parts[1].padEnd(inputDecimals, '0').slice(0, inputDecimals);
      } else {
        amountStr += '0'.repeat(inputDecimals);
      }
      const amountInBigInt = BigInt(amountStr);

      // Similarly for minAmountOut
      const minParts = minAmountOut.split('.');
      let minAmountStr = minParts[0] || '0';
      if (minParts.length > 1) {
        const outputDecimals = getTokenDecimals(tokenY);
        minAmountStr += minParts[1].padEnd(outputDecimals, '0').slice(0, outputDecimals);
      } else {
        minAmountStr += '0'.repeat(inputDecimals);
      }
      const minAmountOutBigInt = BigInt(minAmountStr);

      const inputCoinsResponse = await client.getCoins({
        owner: account.address,
        coinType: inputToken,
      });
      const inputCoins = inputCoinsResponse.data;

      const totalInputBalance = inputCoins.reduce((sum, coin) => sum + BigInt(coin.balance), 0n);

      if (totalInputBalance < amountInBigInt) {
        setError(`Insufficient ${getTokenInfo(inputToken).symbol} balance`);
        return;
      }

      const inputCoinIds = inputCoins
        .filter((coin) => BigInt(coin.balance) > 0n)
        .map((coin) => coin.coinObjectId);

      if (inputCoinIds.length === 0) {
        setError(`No ${getTokenInfo(inputToken).symbol} tokens found`);
        return;
      }

      if (inputToken === SUI_TYPE && totalInputBalance < amountInBigInt + gasBudgetBigInt) {
        setError("Insufficient SUI for swap and gas fee");
        return;
      }

      const suiCoinsResponse = await client.getCoins({
        owner: account.address,
        coinType: SUI_TYPE,
      });
      const suiCoins = suiCoinsResponse.data;

      if (suiCoins.length === 0) {
        setError("No SUI tokens found for gas payment");
        return;
      }

      const tx = new Transaction();

      // Merge input coins if necessary
      if (inputCoinIds.length > 0) {
        const primaryInputCoin = tx.object(inputCoinIds[0]);
        if (inputCoinIds.length > 1) {
          tx.mergeCoins(primaryInputCoin, inputCoinIds.slice(1).map(id => tx.object(id)));
        }
        const [coinToSwap] = tx.splitCoins(primaryInputCoin, [amountInBigInt]);

        tx.moveCall({
          target: `${PACKAGE_ID}::amm::${isReverseSwap ? "swap_reverse" : "swap"}`,
          typeArguments: isReverseSwap ? [tokenY, tokenX] : [tokenX, tokenY],
          arguments: [
            tx.object(poolId),
            coinToSwap,
            tx.pure.u64(minAmountOutBigInt),
          ],
        });
      }

      // Check if need to merge SUI for gas
      const maxSuiBalance = suiCoins.reduce((max, coin) => BigInt(coin.balance) > max ? BigInt(coin.balance) : max, 0n);
      if (maxSuiBalance < gasBudgetBigInt && suiCoins.length > 1) {
        const primarySuiCoin = tx.object(suiCoins[0].coinObjectId);
        tx.mergeCoins(primarySuiCoin, suiCoins.slice(1).map(coin => tx.object(coin.coinObjectId)));
      }

      tx.setGasBudget(gasBudgetBigInt);

      await signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            setShowWaitingConfirmation(false);
            setModalProps({
              txHash: result.digest,
              decreasedToken: {
                address: tokenX,
                symbol: getTokenInfo(tokenX).symbol,
                icon: getTokenInfo(tokenX).icon,
                amount: amountIn,
              },
              increasedToken: {
                address: tokenY,
                symbol: getTokenInfo(tokenY).symbol,
                icon: getTokenInfo(tokenY).icon,
                amount: expectedOutput,
              },
              onClose: () => setModalProps(null),
            });
            setError("");
            setAmountIn("");
            setRefreshTrigger(prev => prev + 1);
          },
          onError: (err: any) => {
            setShowWaitingConfirmation(false);
            setModalProps({
              errorMessage: `Transaction failed: ${err.message}`,
              onClose: () => setModalProps(null),
            });
          },
        }
      );
    } catch (err) {
      setShowWaitingConfirmation(false);
      setModalProps({
        errorMessage: `Transaction preparation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        onClose: () => setModalProps(null),
      });
    }
  };

  const toggleDropdown = (menu: string | null) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast({ message: "Address copied successfully!", type: "success" });
      setTimeout(() => setToast(null), 3000);
    }).catch(() => {
      setToast({ message: "Failed to copy address", type: "error" });
      setTimeout(() => setToast(null), 3000);
    });
  };

  const exchangeRate = prices[getTokenInfo(tokenX).symbol.toLowerCase()]?.price && prices[getTokenInfo(tokenY).symbol.toLowerCase()]?.price
    ? (prices[getTokenInfo(tokenX).symbol.toLowerCase()].price / prices[getTokenInfo(tokenY).symbol.toLowerCase()].price).toFixed(6)
    : "0.000000";

  const inputValue = parseFloat(amountIn) * (prices[getTokenInfo(tokenX).symbol.toLowerCase()]?.price || 0);
  const outputValue = parseFloat(expectedOutput) * (prices[getTokenInfo(tokenY).symbol.toLowerCase()]?.price || 0);
  const profitLoss = outputValue - inputValue;
  const profitLossPercentage = inputValue > 0 ? ((profitLoss / inputValue) * 100).toFixed(2) : 0;
  const profitLossColor = profitLoss >= 0 ? 'green' : 'red';

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
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxvCjJJoCU4zh4Xz5TLUPrsCXmBpaRUehl5A&s",
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

  return (
    <WalletProvider theme={customTheme}>
      <div className="container">
        <div className="mosaic-background">
          {Array.from({ length: 400 }).map((_, i) => (
            <img
              key={i}
              src={logos[i % logos.length]}
              alt={`logo-${i}`}
              className="mosaic-tile"
            />
          ))}
        </div>
        <div className="background-overlay"></div>
        <div className="background-glow"></div>
        {toast && (
          <div className={`toast toast-${toast.type}`}>
            <p>{toast.message}</p>
          </div>
        )}
        
        <Routes>
          <Route path="/" element={<LaunchPage />} />
          <Route path="/faucet" element={<FaucetPage />} />
          <Route
            path="/app"
            element={
              <>
                <div className="header">
                  <div className="background-glow header-glow"></div>
                  <div className="header-top">
                    <div className="logo-container">
                      <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image" />
                      <span className="logo-text">Seal</span>
                    </div>
                    {!isMobile ? (
                      <div className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
                        <div className={`nav-item ${openDropdown === "trade" ? "open" : ""}`} 
                             onMouseEnter={() => toggleDropdown("trade")} 
                             onMouseLeave={() => toggleDropdown(null)}>
                          <span className="nav-text">Trade</span>
                          <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                            <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                          </svg>
                          <div className={`dropdown ${openDropdown === "trade" ? "open" : ""}`}>
                            <Link to="/app" className="dropdown-item">
                              <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
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
                            <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                          </svg>
                          <div className={`dropdown ${openDropdown === "earn" ? "open" : ""}`}>
                            <Link to="/pool" className="dropdown-item">
                              <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                                <path d="M5.68 5.792 7.345 7.75 5.681 9.708a2.75 2.75 0 1 1 0-3.916ZM8 6.978 6.416 5.113l-.014-.015a3.75 3.75 0 1 0 0 5.304l.014-.015L8 8.522l1.584 1.865.014.015a3.75 3.75 0 1 0 0-5.304l-.014.015zm.656.772 1.663-1.958a2.75 2.75 0 1 1 0 3.916z"/>
                              </svg>
                              Pools
                            </Link>
                           
                            <a href="#" className="dropdown-item">
                              <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                                <path d="M5.493 0a.5.5 0 0 1 .493.606L5.533 4.938A.498.498 0 0 1 5.038 5.5c-1.636 0-3.087.313-4.355.869l-.706 1.947A.5.5 0 0 1-.857 7.925l3.847 2.236c-.713 1.352-1.131 2.754-1.26 4.165a.5.5 0 0 1-.968-.326c.14-1.453.59-2.888 1.325-4.29L.41 8.008A.5.5 0 0 1 .824 7.05l1.934.708c.613-1.291 1.328-2.562 2.105-3.837h-2.808a.5.5 0 0 1 .5-.5h3.5zM12 5.5c1.636 0 3.087.313 4.355.869l.706 1.947a.5.5 0 0 1 .474.391l-3.847 2.236c.713 1.352 1.131 2.754 1.26 4.165a.5.5 0 0 1 .968-.326c-.14-1.453-.59-2.888-1.325-4.29l2.536-1.468a.5.5 0 0 1-.414-.958l-1.934.708c-.613-1.291-1.328-2.562-2.105-3.837h2.808a.5.5 0 0 1-.5.5h-3.5z"/>
                              </svg>
                              Rewards
                            </a>
                            <Link to="/xseal" className="dropdown-item">
                              <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                                <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42 .893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072 .56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048 .625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692a1.54 1.54 0 0 1 1.044-1.262c.658-.215 1.777-.562 2.887-.87z"/>
  <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/>
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
                            <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                          </svg>
                          <div className={`dropdown ${openDropdown === "bridge" ? "open" : ""}`}>
                            <a href="https://bridge.sui.io/" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                              <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16" style={{transform: 'rotate(180deg)'}}>
                                <path fill-rule="evenodd" d="M7.21 .8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21 .8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
  <path fill-rule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z"/>
                              </svg>
                              Sui Bridge
                            </a>
                            <a href="https://bridge.cetus.zone/sui" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                              <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342 .474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
                              </svg>
                              Wormhole
                            </a>
                            <a href="https://mayan.finance/" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                              <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                                <path d="M3 3h10v10H3z" fill="currentColor"/>
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
                            <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                          </svg>
                          <div className={`dropdown ${openDropdown === "more" ? "open" : ""}`}>
                            
                           
                            
                           
                            <a href="#" className="dropdown-item">
                              <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                                <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
  <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v3.5H11V4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                              </svg>
                              Docs
                            </a>
                            <a href="#" className="dropdown-item">
                              <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16" style={{transform: 'rotate(180deg)'}}>
                                <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42 .893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072 .56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048 .625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692a1.54 1.54 0 0 1 1.044-1.262c.658-.215 1.777-.562 2.887-.87z"/>
  <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
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
                <div className="main-content">
                  <div className="swap-panel">
                    <div className="swap-header">
                      <h2 className="swap-title">Swap</h2>
                      <div className="settings-row">
                        <div className="aggregator-toggle" ref={switchRef}>
                          <label className="chakra-form__label gradient-text" htmlFor="aggregator-mode">Mine $SEAL</label>
                          <label className="chakra-switch">
                            <input
                              type="checkbox"
                              id="aggregator-mode"
                              checked={useAggregator}
                              onChange={() => setUseAggregator(!useAggregator)}
                              className="chakra-switch__input"
                            />
                            <span className="chakra-switch__track">
                              <span className="chakra-switch__thumb"></span>
                            </span>
                          </label>
                        </div>
                        <div className="settings-button-container">
                          <button
                            className="settings-button"
                            onClick={() => setShowSettings(true)}
                          >
                            {slippage}% <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="settings-icon"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><circle cx="12" cy="12" r="4"></circle></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="input-section">
                      <div className="input-card">
                        <div className="input-label">
                          <span>From</span>
                        </div>
                        <div className="input-group">
                          <input
                            inputMode="decimal"
                            pattern="[0-9]*\.?[0-9]*"
                            type="text"
                            value={amountIn}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
                                setAmountIn(value);
                              }
                            }}
                            placeholder="0.0"
                            className="swap-input"
                          />
                          <div className="token-selector" onClick={() => setShowTokenModal("tokenX")}>
                            <img src={getTokenInfo(tokenX).icon} alt={getTokenInfo(tokenX).symbol} className="token-icon" />
                            <span>{getTokenInfo(tokenX).symbol}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-down"><path d="m6 9 6 6 6-6"></path></svg>
                          </div>
                        </div>
                        <div className="input-footer">
                          <span className="price-text">
                            ${amountIn && parseFloat(amountIn) > 0 
                              ? (parseFloat(amountIn) * (prices[getTokenInfo(tokenX).symbol.toLowerCase()]?.price || 0)).toFixed(2) 
                              : "0.00"}
                          </span>
                          <div className="balance-group">
                            <div className="balance-buttons">
                              <button onClick={setHalfBalance} className="balance-button">50%</button>
                              <button onClick={setMaxBalance} className="balance-button">Max</button>
                            </div>
                            <span>Balance: {balances[tokenX] || "0.0"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="swap-icon" onClick={handleSwapTokens}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="swap-arrow"><path d="m3 16 4 4 4-4"></path><path d="M7 20V4"></path><path d="m21 8-4-4-4 4"></path><path d="M17 4v16"></path></svg>
                      </div>
                      <div className="input-card">
                        <div className="input-label">
                          <span>To</span>
                        </div>
                        <div className="input-group">
                          <input
                            inputMode="decimal"
                            pattern="[0-9]*\.?[0-9]*"
                            type="text"
                            value={expectedOutput}
                            disabled
                            placeholder="0.0"
                            className="swap-input"
                          />
                          <div className="token-selector" onClick={() => setShowTokenModal("tokenY")}>
                            <img src={getTokenInfo(tokenY).icon} alt={getTokenInfo(tokenY).symbol} className="token-icon" />
                            <span>{getTokenInfo(tokenY).symbol}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-down"><path d="m6 9 6 6 6-6"></path></svg>
                          </div>
                        </div>
                        <div className="input-footer">
                          <span className="price-text">
                            ${(
                              parseFloat(expectedOutput) * (prices[getTokenInfo(tokenY).symbol.toLowerCase()]?.price || 0)
                            ).toFixed(2)}
                            {amountIn && parseFloat(amountIn) > 0 && outputValue > 0 && (
                              <span style={{ color: profitLossColor }}>
                                ({profitLoss >= 0 ? `+${profitLossPercentage}%` : `${profitLossPercentage}%`})
                              </span>
                            )}
                          </span>
                          <div className="balance-group">
                            <span>Balance: {balances[tokenY] || "0.0"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className={`action-button css-1y5noho ${isLoadingOutput ? "loading" : ""}`}
                      onClick={handleShowPreview}
                      disabled={!account || !amountIn || parseFloat(amountIn) <= 0 || !poolId || (exactBalances[SUI_TYPE] || 0n) < 100000000n || tokenX === tokenY || isLoadingOutput}
                    >
                      {account ? (amountIn && parseFloat(amountIn) > 0 ? (poolId ? ((exactBalances[SUI_TYPE] || 0n) >= 100000000n ? (tokenX !== tokenY ? (isLoadingOutput ? "Loading..." : "Swap Now") : "Same Token") : "Insufficient SUI Balance") : "Invalid Trading Pair") : "Enter Valid Amount") : "Connect Wallet"}
                    </button>
                    {error && <div className="error">{error}</div>}
                    {modalProps && <Modal {...modalProps} />}
                    {showPreview && (
                      <SwapPreview
                        amountIn={amountIn}
                        amountOut={expectedOutput}
                        tokenX={{ symbol: getTokenInfo(tokenX).symbol, icon: getTokenInfo(tokenX).icon }}
                        tokenY={{ symbol: getTokenInfo(tokenY).symbol, icon: getTokenInfo(tokenY).icon }}
                        slippage={slippage}
                        priceDifference={priceDifference}
                        minAmountOut={minAmountOut}
                        onConfirm={() => {
                          setShowPreview(false);
                          setShowWaitingConfirmation(true);
                          handleSwap();
                        }}
                        onClose={() => setShowPreview(false)}
                      />
                    )}
                    {showWaitingConfirmation && (
                      <WaitingConfirmation
                        amountIn={amountIn}
                        amountOut={expectedOutput}
                        tokenXSymbol={getTokenInfo(tokenX).symbol}
                        tokenYSymbol={getTokenInfo(tokenY).symbol}
                        onClose={() => setShowWaitingConfirmation(false)}
                      />
                    )}
                    <div className="price-reference-panel css-rrtj52">
                      <div className="price-reference-header css-f7m5r6">
                        <p className="chakra-text css-5z699w">Price Reference</p>
                        <button
                          id="popover-trigger-price-ref"
                          aria-haspopup="dialog"
                          aria-expanded="false"
                          aria-controls="popover-content-price-ref"
                          className="css-1hohgv6"
                        >
                          <div className="css-1ke24j5">
                            <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                            </svg>
                          </div>
                        </button>
                      </div>
                      <div className="price-reference-content css-47ju1k">
                        {[{ token: tokenX, symbol: getTokenInfo(tokenX).symbol }, { token: tokenY, symbol: getTokenInfo(tokenY).symbol }].map(({ token, symbol }, index) => (
                          <div key={index} className="token-price css-tyic7d">
                            <div className="token-info css-1igwmid">
                              <div className="token-details css-token-details">
                                <div className="icon-wrapper css-kjafn5">
                                  <div className="icon css-tkdzxl">
                                    <img className="chakra-image css-rmmdki" src={getTokenInfo(token).icon} alt={symbol} />
                                  </div>
                                </div>
                                <div className="token-name-details css-token-name-details">
                                  <div className="token-name-group css-token-name-group">
                                    <p className="chakra-text css-1f7xwte">{symbol}</p>
                                  </div>
                                  <div className="token-address css-t4u65q">
                                    <div className="address-details css-1a87bas">
                                      <p className="chakra-text css-43igym">{token.slice(0, 6)}...{token.slice(-4)}</p>
                                      <div className="css-1ke24j5" onClick={() => copyToClipboard(token)}>
                                        <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px" viewBox="0 0 24 24">
                                          <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m2 4v10h10V7H7m2 2h6v2H9V9m0 4h6v2H9v-2z"></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="price-info-container css-price-info-container">
                              <div className="price-info css-price-info">
                                <div className="price-source css-price-source">
                                  <img
                                    className="chakra-image css-price-source-img"
                                    src="https://upload.wikimedia.org/wikipedia/commons/b/b0/CoinGecko_logo.png"
                                    alt="CoinGecko"
                                    style={{ width: "20px", height: "20px" }}
                                  />
                                  <p className="chakra-text css-v4hq1a">${(prices[symbol.toLowerCase()]?.price || 0).toFixed(3)}</p>
                                  <p className={`chakra-text ${prices[symbol.toLowerCase()]?.change_24h >= 0 ? "css-1m1g51m" : "css-1ec3nbv"}`}>
                                    {(prices[symbol.toLowerCase()]?.change_24h || 0).toFixed(2)}%
                                  </p>
                                </div>
                              </div>
                              <div className="recharts-responsive-container" style={{ width: "100%", height: "100%", minWidth: "0" }}>
                                <div className="recharts-wrapper" style={{ position: "relative", cursor: "default", width: "100%", height: "100%", maxHeight: "20px", maxWidth: "180px" }}>
                                  <div className="price-chart css-1r938vg"> <svg className="recharts-surface" width="180" height="20" viewBox="0 0 180 20" style={{ width: "100%", height: "100%" }}>
                                      <defs>
                                        <clipPath id={`recharts${index + 1}-clip`}>
                                          <rect x="15" y="4" height="12" width="150"></rect>
                                        </clipPath>
                                        <linearGradient id="priceLine" x1="0" y1="0" x2="1" y2="0">
                                          <stop offset="0%" stopColor="rgba(117, 200, 255, 1)"></stop>
                                          <stop offset="100%" stopColor="rgba(104, 255, 255, 1)"></stop>
                                        </linearGradient>
                                      </defs>
                                      <g className="recharts-layer recharts-line">
                                        <path
                                          stroke="url(#priceLine)"
                                          strokeWidth="2"
                                          fill="none"
                                          className="recharts-curve recharts-line-curve"
                                          d={generatePath(symbol)}
                                        />
                                        <g className="recharts-layer"></g>
                                      </g>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {showTokenModal && (
                      <TokenModal
                        showTokenModal={showTokenModal}
                        setShowTokenModal={setShowTokenModal}
                        tokens={tokens}
                        importedTokens={importedTokens}
                        activeList={activeList}
                        setActiveList={setActiveList}
                        importAddress={importAddress}
                        setImportAddress={setImportAddress}
                        importError={importError}
                        setImportError={setImportError}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectToken={selectToken}
                        balances={balances}
                        importToken={importToken}
                      />
                    )}
                    {showSettings && <SettingsPage onClose={() => setShowSettings(false)} slippage={slippage} setSlippage={setSlippage} />}
                    <SettingsModal
                      isOpen={showSettingsModal}
                      onClose={() => setShowSettingsModal(false)}
                      slippage={slippage}
                      setSlippage={setSlippage}
                      customSlippage={customSlippage}
                      setCustomSlippage={setCustomSlippage}
                      transactionMode={transactionMode}
                      setTransactionMode={setTransactionMode}
                      mevProtection={mevProtection}
                      setMevProtection={setMevProtection}
                    />
                  </div>
                </div>
              </>
            }
          />
          <Route path="/settings" element={<SettingsPage onClose={() => { throw new Error("Function not implemented."); }} slippage={slippage} setSlippage={setSlippage} />} />
          <Route path="/pool" element={<Pool />} />
          <Route path="/xseal" element={<XSeal />} />
          <Route path="/limit" element={<LimitOrderPage />} />
          <Route path="/positions" element={<Position activeTab={""} setActiveTab={function (tab: string): void {
            throw new Error("Function not implemented.");
          } } handleAddLiquidity={function (pool: any, scroll?: boolean): void {
            throw new Error("Function not implemented.");
          } } />} />
        </Routes>
        
      </div>
    </WalletProvider>
  );
}

export default App;