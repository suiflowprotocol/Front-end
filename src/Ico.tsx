import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient, WalletProvider, ThemeVars } from '@mysten/dapp-kit';
import { CustomConnectButton } from './App';
import { Link } from 'react-router-dom';
import Sidebar from './SidebarMenu';
import './Ico.css';

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
    fontFamily: '"Inter", Arial, sans-serif', // Updated to a modern font stack
    fontStyle: 'normal',
    lineHeight: '1.5',
    letterSpacing: '0.02em',
  },
};

const Ico: React.FC = () => {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [suiAmount, setSuiAmount] = useState<string>('');
  const [sealAmount, setSealAmount] = useState<string>('0');
  const [suiBalance, setSuiBalance] = useState<string>('0');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [showRpcPopover, setShowRpcPopover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const exchangeRate = 5000; // Updated to match displayed rate: 1 SUI = 5,000 SEAL

  // Fetch user SUI balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        try {
          const balance = await client.getBalance({
            owner: account.address,
            coinType: '0x2::sui::SUI',
          });
          setSuiBalance((parseInt(balance.totalBalance) / 1e9).toFixed(4));
        } catch (error) {
          console.error('Failed to fetch SUI balance:', error);
        }
      }
    };
    fetchBalance();
  }, [account, client]);

  // Handle SUI input change and calculate SEAL amount
  const handleSuiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setSuiAmount(value);
      setSealAmount(value ? (parseFloat(value) * exchangeRate).toFixed(0) : '0');
    }
  };

  // Exchange button click event (placeholder)
  const handleExchange = () => {
    if (!account) {
      console.log('Please connect your wallet first');
      return;
    }
    if (!suiAmount || parseFloat(suiAmount) <= 0) {
      console.log('Please enter a valid SUI amount');
      return;
    }
    console.log('Exchanging', suiAmount, 'SUI for', sealAmount, 'SEAL');
    // Add smart contract interaction logic here
  };

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle dropdown menu
  const toggleDropdown = (menu: string | null) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  // Handle window size changes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <WalletProvider theme={customTheme}>
      <div className="container-ico min-h-screen bg-gray-50">
        <div className="header">
          <div className="header-top">
            <div className="logo-container">
              <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image" />
              <span className="logo-text">Seal</span>
            </div>
            {!isMobile ? (
              <div className="nav-menu">
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
                <Link to="/ico" className="nav-item">
                  <span className="nav-text">Ico</span>
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
            ) : (
              <button className="hamburger-menu" onClick={toggleMenu}>
                <svg className="hamburger-icon" viewBox="0 0 24 24" width="24px" height="24px">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="var(--text-color)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
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
            </div>
          </div>
        </div>
        {isMobile && <Sidebar isOpen={isMenuOpen} onClose={toggleMenu} />}
        <div className="main-content-ico flex flex-row items-start justify-between py-12 px-4 sm:px-6 lg:px-8">
          <div className="ico-info-content w-full max-w-md bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">SEAL TOKEN ICO</h2>
            <div className="space-y-6">
              <div className="flex items-center">
                <img src="https://www.svgrepo.com/show/431413/alert.svg" alt="Alert" className="alert-icon mr-3" />
                <p className="text-gray-700 text-base">SEAL TOKEN is the equity token of SEAL DEX, staked in the xSEAL module, allowing you to share 100% of the transaction fees collected from user trades.</p>
              </div>
              <div className="flex items-center">
                <img src="https://www.svgrepo.com/show/431413/alert.svg" alt="Alert" className="alert-icon mr-3" />
                <p className="text-gray-700 text-base">During the ICO, users have the right to purchase SEAL tokens at a discounted price. The total issuance of SEAL tokens in the ICO is 600 million, accounting for 60% of the total supply.</p>
              </div>
              <div className="flex items-center">
                <img src="https://www.svgrepo.com/show/431413/alert.svg" alt="Alert" className="alert-icon mr-3" />
                <p className="text-gray-700 text-base">Funds raised through the ICO, along with VC investments, will be used to build SEAL's liquidity pool (established on SEAL DEX).</p>
              </div>
            </div>
          </div>
          <div className="ico-hero max-w-4xl w-full"></div>
          <div className="swap-panel ico-panel-ico w-full max-w-md bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
            <div className="input-section space-y-4">
              <div className="input-card bg-gray-50 p-4 rounded-xl">
                <div className="input-label text-sm font-medium text-gray-600 mb-2">From</div>
                <div className="input-group flex items-center bg-white border border-gray-200 rounded-lg">
                  <input
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    type="text"
                    value={suiAmount}
                    onChange={handleSuiChange}
                    placeholder="0.0"
                    className="swap-input flex-1 p-3 text-lg text-gray-900 focus:outline-none"
                  />
                  <div className="token-selector flex items-center space-x-2 pr-3">
                    <img src="https://assets.crypto.ro/logos/sui-sui-logo.png" alt="SUI" className="token-icon w-6 h-6" />
                    <span className="text-gray-700 font-medium">SUI</span>
                  </div>
                </div>
                <div className="input-footer flex justify-between mt-2 text-sm text-gray-600">
                  <span className="price-text">${suiAmount && parseFloat(suiAmount) > 0 ? (parseFloat(suiAmount) * 1).toFixed(2) : "0.00"}</span>
                  <div className="balance-group">
                    <span>Balance: {suiBalance}</span>
                  </div>
                </div>
              </div>
              <div className="swap-icon flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="swap-arrow text-gray-500"><path d="m3 16 4 4 4-4"></path><path d="M7 20V4"></path><path d="m21 8-4-4-4 4"></path><path d="M17 4v16"></path></svg>
              </div>
              <div className="input-card bg-gray-50 p-4 rounded-xl">
                <div className="input-label text-sm font-medium text-gray-600 mb-2">To</div>
                <div className="input-group flex items-center bg-white border border-gray-200 rounded-lg">
                  <input
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    type="text"
                    value={sealAmount}
                    disabled
                    placeholder="0.0"
                    className="swap-input flex-1 p-3 text-lg text-gray-900 focus:outline-none"
                  />
                  <div className="token-selector flex items-center space-x-2 pr-3">
                    <img src="https://i.meee.com.tw/SdliTGK.png" alt="SEAL" className="token-icon w-6 h-6" />
                    <span className="text-gray-700 font-medium">SEAL</span>
                  </div>
                </div>
                <div className="input-footer flex justify-between mt-2 text-sm text-gray-600">
                  <span className="price-text">${sealAmount && parseFloat(sealAmount) > 0 ? (parseFloat(sealAmount) * 0).toFixed(2) : "0.00"}</span>
                  <div className="balance-group">
                    <span>Balance: 0.0</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="action-button w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 mt-6" onClick={handleExchange}>
              Exchange
            </button>
          </div>
        </div>
      </div>
    </WalletProvider>
  );
};

export default Ico;