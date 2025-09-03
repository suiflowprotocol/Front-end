import React, { useState } from "react";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { ConnectModal } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";
import TokenModal, { tokens } from "./TokenModal";
import "./limit.css";

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
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    padding: '6px',
    transition: 'all 0.3s ease',
    color: '#fff',
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

const LimitOrderPage: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const [showTokenModal, setShowTokenModal] = useState<string | null>(null);
  const [tokenX, setTokenX] = useState("0x2::sui::SUI");
  const [tokenY, setTokenY] = useState("0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f::usdc::USDC");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [showRpcPopover, setShowRpcPopover] = useState(false);

  const selectToken = (token: any, type: string) => {
    if (type === "tokenX") {
      setTokenX(token.address);
    } else {
      setTokenY(token.address);
    }
    setShowTokenModal(null);
  };

  const getTokenInfo = (address: string) => {
    return tokens.find((token) => token.address === address) || tokens[0];
  };

  const toggleDropdown = (menu: string | null) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="header-top">
          <div className="logo-container">
            <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image" />
            <span className="logo-text">SuiFlow</span>
          </div>
          <div className="nav-menu">
            <div className={`nav-item ${openDropdown === "trade" ? "open" : ""}`} 
                 onMouseEnter={() => toggleDropdown("trade")} 
                 onMouseLeave={() => toggleDropdown(null)}>
              <span className="nav-text">Trade</span>
              <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
              </svg>
              <div className={`dropdown ${openDropdown === "trade" ? "open" : ""}`}>
                <Link to="/" className="dropdown-item">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                    <use xlinkHref="#icon-a-icon_swap2"></use>
                  </svg>
                  Swap
                </Link>
                <Link to="/limit" className="dropdown-item active">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                    <use xlinkHref="#icon-a-icon_swap2"></use>
                  </svg>
                  Limit Order
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
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                    <use xlinkHref="#icon-icon_liquiditypools"></use>
                  </svg>
                  Pool
                </Link>
                <Link to="/veSuiFlow" className="dropdown-item">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                    <use xlinkHref="#icon-icon_liquiditypools"></use>
                  </svg>
                  veSuiFlow
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
            <div className={`nav-item ${openDropdown === "more" ? "open" : ""}`} 
                 onMouseEnter={() => toggleDropdown("more")} 
                 onMouseLeave={() => toggleDropdown(null)}>
              <span className="nav-text">More</span>
              <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
              </svg>
              <div className={`dropdown ${openDropdown === "more" ? "open" : ""}`}>
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
              className="icon-button css-fi49l418"
              onClick={() => setShowNotificationPopover(!showNotificationPopover)}
            >
              <div className="css-1ke24j518">
                <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-1.1-.9-2-2-2s-2 .9-2 2v.68C6.63 5.36 5 7.92 5 11v5l-2 2v1h18v-1l-2-2z"></path>
                </svg>
              </div>
            </button>
            {showNotificationPopover && (
              <div className="chakra-popover__body18 css-1q40f8618">
                <div className="chakra-stack18 css-13uh60018">
                  <img src="/images/logo_paw_sel@2x.png" alt="Pawtato" className="chakra-image18 css-1tq2rxf18" />
                  <p className="chakra-text18 css-136jcmy18">Visit Pawtato to manage notification settings for LP Range Alert</p>
                  <button type="button" className="chakra-button18 css-fpjdn418">Subscribe</button>
                </div>
              </div>
            )}
            <button
              id="popover-trigger-rpc"
              aria-haspopup="dialog"
              aria-expanded={showRpcPopover}
              aria-controls="popover-content-rpc"
              className="icon-button css-163hjq318"
              onClick={() => setShowRpcPopover(!showRpcPopover)}
            >
              <div className="css-1ke24j518">
                <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                  <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.30-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
                </svg>
              </div>
            </button>
            {showRpcPopover && (
              <div className="chakra-popover__body18 css-1q40f8618">
                <div className="chakra-stack18 css-1opork518">
                  <div className="chakra-stack18 css-1ysm3zc18">
                    <div className="css-1ke24j518">
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    </div>
                    <p className="chakra-text18 css-vcvc4718">RPC Node</p>
                  </div>
                  <div className="css-122co4m18">
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
                      <div key={index} className="chakra-stack18 css-k5o0vm18">
                        <div className="chakra-stack18 css-1jjq5p518">
                          <div className="chakra-stack18 css-edyt6g18">
                            <div className={node.selected ? "css-sopywd18" : "css-empty-check18"}>
                              {node.selected && (
                                <div className="css-1ke24j518">
                                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                                    <path d="M20 6L9 17l-5-5"></path>
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p className={`chakra-text18 ${node.selected ? "css-swgav218" : "css-sezabi18"}`}>{node.name}</p>
                          </div>
                          {node.latency && (
                            <div className="chakra-stack18 css-cp3a5l18">
                              <div className="css-18uefe218"></div>
                              <p className="chakra-text18 css-1ec3nbv18">{node.latency}</p>
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

      {/* Main content */}
      <div className="main-content">
        <div className="swap-panel">
          <h2 className="swap-title">Limit Order</h2>
          <div className="input-section">
            <div className="input-card">
              <div className="input-label">
                <span>You Pay</span>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  value="1"
                  readOnly
                  className="swap-input"
                />
                <div className="token-selector" onClick={() => setShowTokenModal("tokenX")}>
                  <img src="https://circle.com/usdc-icon" alt="USDC" className="token-icon" />
                  <span>USDC</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-down">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </div>
              </div>
              <div className="input-footer">
                <span className="price-text">$0.99</span>
                <div className="balance-group">
                  <div className="balance-buttons">
                    <button className="balance-button">HALF</button>
                    <button className="balance-button">MAX</button>
                  </div>
                  <span>Balance: 0.0</span>
                </div>
              </div>
            </div>
            <div className="swap-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="swap-arrow">
                <path d="m3 16 4 4 4-4"></path>
                <path d="M7 20V4"></path>
                <path d="m21 8-4-4-4 4"></path>
                <path d="M17 4v16"></path>
              </svg>
            </div>
            <div className="input-card">
              <div className="input-label">
                <span>You Receive</span>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  value=""
                  readOnly
                  className="swap-input"
                />
                <div className="token-selector" onClick={() => setShowTokenModal("tokenY")}>
                  <img src="https://archive.cetus.zone/assets/image/sui/sui.png" alt="SUI" className="token-icon" />
                  <span>SUI</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-down">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </div>
              </div>
              <div className="input-footer">
                <span className="price-text"></span>
                <div className="balance-group">
                  <span>Balance: 0.137574</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rate-and-expiry-wrapper">
            <div className="rate-section">
              <div className="chakra-stack css-19ctck2">
                <div className="chakra-stack css-1jjq5p5">
                  <div className="chakra-stack css-1igwmid">
                    <p className="chakra-text css-6kyjl2">Buy SUI at rate</p>
                  </div>
                  <button type="button" className="chakra-button css-ozvovq">Market</button>
                </div>
                <div className="chakra-stack css-1jjq5p5" style={{ alignItems: 'center' }}>
                  <input
                    type="text"
                    value="3.8685"
                    readOnly
                    className="swap-input"
                    style={{ width: '100px', marginRight: '8px' }}
                  />
                  <p className="chakra-text css-j2a1iu">USDC</p>
                </div>
              </div>
            </div>
            <div className="expiry-section">
              <div className="chakra-stack css-4ex5kz">
                <button id="popover-trigger-:r59:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r59:" className="css-018">
                  <div className="chakra-stack css-1mlvmbj">
                    <p className="chakra-text css-6kyjl2">Expires in</p>
                    <div className="css-1ke24j5">
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                        <use xlinkHref="#icon-icon_tips"></use>
                      </svg>
                    </div>
                  </div>
                </button>
                <button type="button" className="chakra-button chakra-menu__menu-button css-1k58e60" id="menu-button-:r5b:" aria-expanded="false" aria-haspopup="menu" aria-controls="menu-list-:r5b:">
                  <span className="css-xl71ch">
                    <div className="css-gmuwbf">
                      <p className="chakra-text css-jrv7u6">7 Days</p>
                      <div className="css-1svtaf2">
                        <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="12px" height="12px">
                          <use xlinkHref="#icon-icon_arrow"></use>
                        </svg>
                      </div>
                    </div>
                  </span>
                </button>
                <div className="css-1oh83t7" style={{ visibility: 'hidden', position: 'absolute', minWidth: 'max-content', inset: '0px auto auto 0px' }}>
                  <div className="chakra-menu__menu-list css-1xtg0da" tabIndex={-1} role="menu" id="menu-list-:r5b:" aria-orientation="vertical" style={{ transformOrigin: 'var(--popper-transform-origin)', opacity: 0, visibility: 'hidden', transform: 'scale(0.8)' }}></div>
                </div>
              </div>
            </div>
          </div>
          <button type="button" className="action-button css-kz9308" disabled>Enter an amount</button>
        </div>
      </div>

      {/* Token selection modal */}
      {showTokenModal && (
        <TokenModal
          showTokenModal={showTokenModal}
          setShowTokenModal={setShowTokenModal}
          tokens={tokens}
          selectToken={selectToken}
          importedTokens={[]}
          activeList={""}
          setActiveList={(value: React.SetStateAction<string>) => {
            throw new Error("Function not implemented.");
          }}
          importAddress={""}
          setImportAddress={(value: React.SetStateAction<string>) => {
            throw new Error("Function not implemented.");
          }}
          importError={""}
          setImportError={(value: React.SetStateAction<string>) => {
            throw new Error("Function not implemented.");
          }}
          searchQuery={""}
          setSearchQuery={(value: React.SetStateAction<string>) => {
            throw new Error("Function not implemented.");
          }}
          balances={{}}
          importToken={() => {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
};

export default LimitOrderPage;