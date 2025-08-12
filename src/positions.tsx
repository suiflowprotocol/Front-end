// positions.tsx
import { useState } from "react";
import { ConnectButton, useCurrentAccount, useSuiClient, lightTheme, WalletProvider, ThemeVars, useConnectWallet, useWallets, useDisconnectWallet, ConnectModal } from "@mysten/dapp-kit";
import '@mysten/dapp-kit/dist/index.css';
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./SidebarMenu"; // Assuming SidebarMenu is shared
import "./positions.css"; // Import positions-specific CSS
import "./App.css"; // Import shared App CSS for consistency

// Wallet logos (same as App.tsx)
const walletLogos = {
  'Slush': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYHwA15AKYWXvoSL-94ysbnJrmUX_oU1fJyw&s',
  'Suiet': 'https://framerusercontent.com/modules/6HmgaTsk3ODDySrS62PZ/a3c2R3qfkYJDxcZxkoVv/assets/eDZRos3xvCrlWxmLFr72sFtiyQ.png',
  'Martian': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhb6QLKfuQY_N8ZvpiKcdZlCnQKILXw7NArw&s',
  'Sui Wallet': 'https://assets.crypto.ro/logos/sui-sui-logo.png',
};

// Custom theme (same as App.tsx)
const customTheme: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(4px)',
  },
  backgroundColors: {
    primaryButton: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    primaryButtonHover: 'linear-gradient(135deg, #4b9cfa, #3b82f6)',
    outlineButtonHover: '#F3F4F6',
    modalOverlay: 'rgba(15, 23, 42, 0.3)',
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
    small: '6px',
    medium: '10px',
    large: '14px',
    xlarge: '18px',
  },
  shadows: {
    primaryButton: '0 6px 16px rgba(0, 0, 0, 0.15)',
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

// CustomConnectButton (same as App.tsx)
export function CustomConnectButton() {
  const { mutate: disconnect } = useDisconnectWallet();
  const currentAccount = useCurrentAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '130px',
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

function Positions() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [showRpcPopover, setShowRpcPopover] = useState(false);
  const client = useSuiClient();
  const account = useCurrentAccount();
  const navigate = useNavigate();

  const toggleDropdown = (menu: string | null) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <WalletProvider theme={customTheme}>
      <div className="container">
        <div className="mosaic-background">
          {/* Mosaic background tiles, same as App.tsx */}
        </div>
        <div className="background-overlay"></div>
        <div className="background-glow"></div>
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
                    <Link to="/" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                      </svg>
                      Swap
                    </Link>
                    <Link to="/limit" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16" style={{transform: 'rotate(180deg)'}}>
                        <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/>
                      </svg>
                      Limit Order
                    </Link>
                    <a href="#" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                      </svg>
                      DCA
                    </a>
                    <a href="#" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                        <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                      </svg>
                      DeepBook
                    </a>
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
                    <Link to="/positions" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                        <path d="M5.68 5.792 7.345 7.75 5.681 9.708a2.75 2.75 0 1 1 0-3.916ZM8 6.978 6.416 5.113l-.014-.015a3.75 3.75 0 1 0 0 5.304l.014-.015L8 8.522l1.584 1.865.014.015a3.75 3.75 0 1 0 0-5.304l-.014.015zm.656.772 1.663-1.958a2.75 2.75 0 1 1 0 3.916z"/>
                      </svg>
                      Positions
                    </Link>
                    <a href="#" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                        <path d="M5.493 0a.5.5 0 0 1 .493.606L5.533 4.938A.498.498 0 0 1 5.038 5.5c-1.636 0-3.087.313-4.355.869l-.706 1.947A.5.5 0 0 1-.857 7.925l3.847 2.236c-.713 1.352-1.131 2.754-1.26 4.165a.5.5 0 0 1-.968-.326c.14-1.453.59-2.888 1.325-4.29L.41 8.008A.5.5 0 0 1 .824 7.05l1.934.708c.613-1.291 1.328-2.562 2.105-3.837h-2.808a.5.5 0 0 1 .5-.5h3.5zM12 5.5c1.636 0 3.087.313 4.355.869l.706 1.947a.5.5 0 0 1 .474.391l-3.847 2.236c.713 1.352 1.131 2.754 1.26 4.165a.5.5 0 0 1 .968-.326c-.14-1.453-.59-2.888-1.325-4.29l2.536-1.468a.5.5 0 0 1-.414-.958l-1.934.708c-.613-1.291-1.328-2.562-2.105-3.837h2.808a.5.5 0 0 1-.5.5h-3.5z"/>
                      </svg>
                      Farms
                    </a>
                    <Link to="/xseal" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                        <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42 .893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072 .56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048 .625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692a1.54 1.54 0 0 1 1.044-1.262c.658-.215 1.777-.562 2.887-.87z"/>
                        <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/>
                      </svg>
                      Vaults
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
                        <path d="M7.184 1.81a7 7 0 0 1-.905-.063l.221.066.233.054.208.053 1.794.513c1.14.326 2.326.43 3.488.29l.25-.024a7 7 0 0 1-.71 13.935l-.216-.064c-1.14-.326-2.326-.43-3.489-.29l-.223.064-.233-.054a7 7 0 0 1-1.794-.513c-1.14-.326-2.326-.43-3.488-.29l-.25.024a7 7 0 0 1 .71-13.935l.216.064c1.14.326 2.326.43 3.488.29zM5.64 3.505a6 6 0 1 0 4.722 4.99H5.64z"/>
                      </svg>
                      Compensation
                    </a>
                    <a href="#" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                        <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                      </svg>
                      Buy Crypto
                    </a>
                    <a href="#" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16" style={{transform: 'rotate(180deg)'}}>
                        <path d="M9.752 6.193c.599.6 1.73.437 2.528-.362s.96-1.932.362-2.531c-.599-.6-1.73-.438-2.528.361-.798.8-.96 1.933-.362 2.532"/>
                        <path d="M15.811 3.312c-.363 1.534-1.334 3.626-3.64 6.218l-.24 2.408a2.56 2.56 0 0 1-.732 1.526L8.817 15.85a.51.51 0 0 1-.867-.434l.27-1.899c.04-.28-.013-.593-.131-.956a9 9 0 0 0-.249-.657l-.082-.202c-.815-.197-1.578-.662-2.191-1.277-.614-.615-1.079-1.379-1.275-2.195l-.203-.083a10 10 0 0 0-.655-.248c-.363-.119-.675-.172-.955-.132l-1.896.27A.51.51 0 0 1 .15 7.17l2.382-2.386c.41-.41.947-.67 1.524-.734h.006l2.4-.238C9.005 1.55 11.087 .582 12.623 .208c.89-.217 1.59-.232 2.08-.188.244.023 .435.06 .57.093q.1.026.16.045c.184.06.279.13.351.295l.029.073a3.5 3.5 0 0 1 .157.721c.055.485.051 1.178-.159 2.065m-4.828 7.475.04-.04-.107 1.081a1.54 1.54 0 0 1-.44 .913l-1.298 1.3.054-.38c.072-.506-.034-.993-.172-1.418a9 9 0 0 0-.164-.45c.738-.065 1.462-.38 2.087-1.006M5.205 5c-.625 .626-.94 1.351-1.004 2.09a9 9 0 0 0-.45-.164c-.424-.138-.91-.244-1.416-.172l-.38.054 1.3-1.3c.245-.246.566-.401.91-.44l1.08-.107zm9.406-3.961c-.38-.034-.967-.027-1.746.163-1.558.38-3.917 1.496-6.937 4.521-.62.62-.799 1.34-.687 2.051.107.676.483 1.362 1.048 1.928.564.565 1.25.941 1.924 1.049.71.112 1.429-.067 2.048-.688 3.079-3.083 4.192-5.444 4.556-6.987.183-.771.18-1.345.138-1.713a3 3 0 0 0-.045-.283 3 3 0 0 0-.3-.041Z"/>
                        <path d="M7.009 12.139a7.6 7.6 0 0 1-1.804-1.352A7.6 7.6 0 0 1 3.794 8.86c-1.102.992-1.965 5.054-1.839 5.18.125.126 3.936-.896 5.054-1.902Z"/>
                      </svg>
                      Launchpad
                    </a>
                    <a href="#" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                        <path d="M6 9a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 6 9M3.854 4.146a.5.5 0 1 0-.708.708L4.793 6.5 3.146 8.146a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708z"/>
                        <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/>
                      </svg>
                      Cetus Terminal
                    </a>
                    <a href="#" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                        <path d="M7.5 1.018a7 7 0 0 0-4.79 11.566L7.5 7.793zm1 0V7.5h6.482A7 7 0 0 0 8.5 1.018M14.982 8.5H8.207l-4.79 4.79A7 7 0 0 0 14.982 8.5M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"/>
                      </svg>
                      Stats
                    </a>
                    <a href="#" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                        <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
                        <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
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
              <button
                id="popover-trigger-notification"
                className="icon-button css-fi49l4"
                onClick={() => setShowNotificationPopover(!showNotificationPopover)}
              >
                <div className="css-1ke24j5">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-1.1-.9-2-2-2s-2 .9-2 2v.68C6.63 5.36 5 7.92 5 11v5l-2 2v1h18v-1l-2-2z"></path>
                  </svg>
                </div>
              </button>
              <button
                id="popover-trigger-rpc"
                className="icon-button css-163hjq3"
                onClick={() => setShowRpcPopover(!showRpcPopover)}
              >
                <div className="css-1ke24j5">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.30-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
        {isMobile && (
          <Sidebar isOpen={isMenuOpen} onClose={toggleMenu} />
        )}
        <div className="main-content">
          <div className="chakra-stack css-1535ss">
            <div className="chakra-stack css-a37t44">
              <div className="chakra-stack css-xlwmla">
                <div className="css-18rti1w">
                  <div style={{width: '100%'}}>
                    <button id="popover-trigger-:r553:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r553:" className="css-1t2x70">
                      <div className="css-jn0mkj">
                        <div className="chakra-stack css-2qlcdh">
                          <div className="css-12xzxfu">
                            <div className="css-o5e85d">
                              <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                                <use xlinkHref="#icon-icon_search"></use>
                              </svg>
                            </div>
                            <p className="chakra-text css-1lher0p">Filter by token</p>
                          </div>
                          <div className="chakra-stack css-1igwmid"></div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="chakra-stack css-1igwmid">
                  <div className="css-3wh1mk">
                    <div className="chakra-stack css-yue1ly">
                      <div className="css-1ke24j5">
                        <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                          <use xlinkHref="#icon-icon_collapse"></use>
                        </svg>
                      </div>
                      <p className="chakra-text css-1v0j6vl">Collapse All</p>
                    </div>
                  </div>
                  <div className="css-1vpx1e5">
                    <div className="css-1pin1cu">
                      <div className="css-0">
                        <div className="css-0">
                          <div className="css-1ke24j5">
                            <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                              <use xlinkHref="#icon-icon_refresh"></use>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="css-10grt23"></div>
            <div className="chakra-stack css-1wgi00l">
              <div className="chakra-stack css-1jra5w9">
                <p className="chakra-text css-17xjxxf">Total Liquidity</p>
                <div className="chakra-skeleton css-a8ku0c">
                  <p className="chakra-text css-1ikb94c">$--</p>
                </div>
              </div>
              <div className="chakra-stack css-17na8xj">
                <p className="chakra-text css-17xjxxf">Pending Yield</p>
                <div className="chakra-skeleton css-cdkrf0">
                  <div className="chakra-stack css-1igwmid">
                    <div className="chakra-stack css-lpuqkz">
                      <button id="popover-trigger-:r55a:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r55a:" className="css-gmuwbf">
                        <p className="chakra-text css-bae340">$0</p>
                      </button>
                    </div>
                    <button type="button" className="chakra-button css-2h2e64" disabled>Claim All</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="chakra-stack css-dbr0lh">
              <img src="https://app.cetus.zone/images/img_nopositions@2x.png" className="chakra-image css-f5j44i" alt="No positions" />
              <p className="chakra-text css-dwkbww">No liquidity positions</p>
            </div>
          </div>
        </div>
      </div>
    </WalletProvider>
  );
}

export default Positions;