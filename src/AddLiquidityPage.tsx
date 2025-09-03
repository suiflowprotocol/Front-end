// AddLiquidityPage.tsx
import React, { useState, useEffect } from "react";
import { useCurrentAccount, useDisconnectWallet, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { ConnectModal } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";
import TokenModal, { tokens } from "./TokenModal";
import "./AddLiquidityPage.css";
import Sidebar from "./SidebarMenu";
import { Transaction } from "@mysten/sui/transactions";

const PACKAGE_ID = "0xb90158d50ac951784409a6876ac860e24564ed5257e51944d3c693efb9fdbd78";
const POOL_REGISTRY = "0xfc8c69858d070b639b3db15ff0f78a10370950434c5521c83eaa7e2285db8d2a";

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
      <span>Connect</span>
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

const AddLiquidityPage: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showEffects: true,
        },
      }),
  });
  const [showTokenModal, setShowTokenModal] = useState<string | null>(null);
  const [baseToken, setBaseToken] = useState<any>(tokens.find(t => t.symbol === "SUI"));
  const [quoteToken, setQuoteToken] = useState<any>(tokens.find(t => t.symbol === "suiUSDT")); // Assuming suiUSDT is in tokens
  const [feeTier, setFeeTier] = useState<string>("0.25%");
  const [zapIn, setZapIn] = useState(false);
  const [depositBase, setDepositBase] = useState('');
  const [depositQuote, setDepositQuote] = useState('');
  const [currentPrice, setCurrentPrice] = useState('3.446774');
  const [minPrice, setMinPrice] = useState('2.53972');
  const [maxPrice, setMaxPrice] = useState('5.953691');
  const [leverage, setLeverage] = useState('5.21x');
  const [rangeType, setRangeType] = useState('active');
  const [period, setPeriod] = useState('30D');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tab, setTab] = useState('provide');

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

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSetRangeType = (type: string) => {
    setRangeType(type);
    // Adjust min/max based on type, but for demo, keep static
  };

  const adjustPrice = (setter: any, value: string, delta: number) => {
    const num = parseFloat(value) || 0;
    setter((num + delta).toFixed(6));
  };

  const handleBaseChange = (e: { target: { value: string } }) => {
    setDepositBase(e.target.value);
  };

  const handleQuoteChange = (e: { target: { value: string } }) => {
    setDepositQuote(e.target.value);
  };

  const handleAddLiquidity = async () => {
    if (!currentAccount || !baseToken || !quoteToken) return;

    // Placeholder for add liquidity logic
    const txb = new Transaction();
    // Implement add_liquidity call similar to create pool
    await signAndExecute({
      transaction: txb,
      chain: 'sui:testnet',
    });
  };

  // Define fee tiers
  const feeTiers = [
    { value: "0.01%", status: "Not Created" },
    // ... other tiers
    { value: "0.25%", status: "Created" },
    // ...
  ];

  return (
    <div className="container1234312">
      <header className="header4312">
        <div className="background-glow4312"></div>
        <div className="header-top4312">
          <div className="header-left4312">
            <div className="logo-container4312">
              <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image4312" />
              <span className="logo-text4312">SuiFlow</span>
            </div>
          </div>
          {!isMobile ? (
            <nav className={`nav-menu4312 ${isMenuOpen ? "open4312" : ""}`}>
              {/* Same nav as CreatePoolPage */}
              <div className={`nav-item4312 ${openDropdown === "trade" ? "open4312" : ""}`} 
                   onMouseEnter={() => toggleDropdown("trade")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text4312">Trade</span>
                <svg className="arrow-icon4312" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="#94a3b8" />
                </svg>
                <div className={`dropdown4312 ${openDropdown === "trade" ? "open4312" : ""}`}>
                  <Link to="/app" className="dropdown-item4312">
                    <svg aria-hidden="true" fill="#e2e8f0" width="20px" height="20px" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                    </svg>
                    Swap
                  </Link>
                </div>
              </div>
              {/* Earn, Bridge, More as in reference */}
            </nav>
          ) : (
            <button className="hamburger-menu4312" onClick={toggleMenu}>
              <svg className="hamburger-icon4312" viewBox="0 0 24 24" width="24px" height="24px">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <div className="wallet-actions4312">
            <CustomConnectButton />
            <a href="https://x.com/SuiFlowprotocol_" target="_blank" rel="noopener noreferrer" className="icon-button4312">
              <svg aria-hidden="true" fill="#94a3b8" width="20px" height="20px" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1 2.25h7.28l4.71 6.23zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://t.me/SuiFlowprotocol" target="_blank" rel="noopener noreferrer" className="icon-button4312">
              <svg aria-hidden="true" fill="#94a3b8" width="20px" height="20px" viewBox="0 0 24 24">
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.06L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
              </svg>
            </a>
          </div>
        </div>
      </header>
      {isMobile && <Sidebar isOpen={isMenuOpen} onClose={toggleMenu} />}

      <main className="main-content4312">
        <div className="card-container4312">
          <div className="content-section4312">
            <div className="content-header4312">
              <Link to="/pool" className="back-button4312">
                <svg aria-hidden="true" fill="#94a3b8" width="20px" height="20px" viewBox="0 0 24 24">
                  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
                </svg>
                Back
              </Link>
              <div className="header-icons4312">
                <button className="icon-btn4312">
                  <svg aria-hidden="true" fill="#94a3b8" width="18px" height="18px" viewBox="0 0 24 24">
                    <path d="M12 3l-1.5 1.5L15 9H3v2h12l-4.5 4.5L12 21l9-9z"/>
                  </svg>
                </button>
                <button className="icon-btn4312">
                  <svg aria-hidden="true" fill="#94a3b8" width="16px" height="16px" viewBox="0 0 24 24">
                    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-5 5z"/>
                  </svg>
                </button>
                <button className="refresh-button4312" onClick={handleRefresh}>
                  <svg aria-hidden="true" fill="#94a3b8" width="20px" height="20px" viewBox="0 0 24 24">
                    <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="pool-header4312">
              <div className="token-pair4312">
                <img src={baseToken.icon} alt={baseToken.symbol} className="token-icon4312" />
                <span>{baseToken.symbol}</span>
                <svg className="dot4312" viewBox="0 0 4 4"><circle cx="2" cy="2" r="2" fill="#94a3b8" /></svg>
                <img src={quoteToken.icon} alt={quoteToken.symbol} className="token-icon4312" />
                <span>{quoteToken.symbol}</span>
                <svg className="dot4312" viewBox="0 0 4 4"><circle cx="2" cy="2" r="2" fill="#94a3b8" /></svg>
                <span>Fee Tier {feeTier}</span>
              </div>
            </div>
            <div className="pool-stats4312">
              <div className="stat-item4312">
                <span>Pool APR</span>
                <span>5.72%</span>
              </div>
              <div className="stat-item4312">
                <span>TVL</span>
                <span>$18,778.93</span>
              </div>
              <div className="stat-item4312">
                <span>Volume (24H)</span>
                <span>$1,177.28</span>
              </div>
              <div className="stat-item4312">
                <span>Fees (24H)</span>
                <span>$2.94</span>
              </div>
            </div>
            <div className="tabs4312">
              <button className={`tab4312 ${tab === 'provide' ? 'active4312' : ''}`} onClick={() => setTab('provide')}>Provide Liquidity</button>
              <button className={`tab4312 ${tab === 'positions' ? 'active4312' : ''}`} onClick={() => setTab('positions')}>My Positions</button>
              <button className={`tab4312 ${tab === 'analytics' ? 'active4312' : ''}`} onClick={() => setTab('analytics')}>Analytics</button>
            </div>
            {tab === 'provide' && (
              <>
                <div className="range-section4312">
                  <div className="range-header4312">
                    <h2 className="section-title4312">Select Range</h2>
                    <div className="token-toggle4312">
                      <button className={`token-btn4312 ${true ? 'active4312' : ''}`}>
                        <img src={baseToken.icon} alt={baseToken.symbol} className="token-icon4312" />
                        <span>{baseToken.symbol}</span>
                      </button>
                      <button className={`token-btn4312 ${false ? 'active4312' : ''}`}>
                        <img src={quoteToken.icon} alt={quoteToken.symbol} className="token-icon4312" />
                        <span>{quoteToken.symbol}</span>
                      </button>
                    </div>
                  </div>
                  <div className="current-price4312">
                    <span>Current Price</span>
                    <span>{currentPrice} {quoteToken.symbol} per {baseToken.symbol}</span>
                  </div>
                  <div className="range-types4312">
                    <button className={`range-type4312 ${rangeType === 'active' ? 'active4312' : ''}`} onClick={() => handleSetRangeType('active')}>Active</button>
                    <button className={`range-type4312 ${rangeType === 'conservative' ? 'active4312' : ''}`} onClick={() => handleSetRangeType('conservative')}>Conservative</button>
                    <button className={`range-type4312 ${rangeType === 'full' ? 'active4312' : ''}`} onClick={() => handleSetRangeType('full')}>Full Range</button>
                    <button className={`range-type4312 ${rangeType === 'custom' ? 'active4312' : ''}`} onClick={() => handleSetRangeType('custom')}>Custom</button>
                  </div>
                  <div className="range-chart4312">
                    {/* Placeholder for chart */}
                    <div style={{ height: '200px', background: '#1e293b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span>Chart Placeholder</span>
                    </div>
                  </div>
                  <div className="price-range-info4312">
                    <div className="price-range4312">
                      <span>{period} Price Range</span>
                      <span>3.170987 - 4.463913</span>
                    </div>
                    <div className="period-selectors4312">
                      <button className={`period-btn4312 ${period === '24H' ? 'active4312' : ''}`} onClick={() => setPeriod('24H')}>24H</button>
                      <button className={`period-btn4312 ${period === '7D' ? 'active4312' : ''}`} onClick={() => setPeriod('7D')}>7D</button>
                      <button className={`period-btn4312 ${period === '30D' ? 'active4312' : ''}`} onClick={() => setPeriod('30D')}>30D</button>
                    </div>
                  </div>
                  <div className="leverage-info4312">
                    <span>Leverage</span>
                    <span>{leverage}</span>
                  </div>
                  <div className="price-inputs4312">
                    <div className="price-input4312">
                      <span>Min Price</span>
                      <div className="input-group4312">
                        <button onClick={() => adjustPrice(setMinPrice, minPrice, -0.01)}>-</button>
                        <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                        <button onClick={() => adjustPrice(setMinPrice, minPrice, 0.01)}>+</button>
                      </div>
                      <span>{quoteToken.symbol} per {baseToken.symbol}</span>
                    </div>
                    <div className="price-input4312">
                      <span>Max Price</span>
                      <div className="input-group4312">
                        <button onClick={() => adjustPrice(setMaxPrice, maxPrice, -0.01)}>-</button>
                        <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                        <button onClick={() => adjustPrice(setMaxPrice, maxPrice, 0.01)}>+</button>
                      </div>
                      <span>{quoteToken.symbol} per {baseToken.symbol}</span>
                    </div>
                  </div>
                </div>
                <div className="deposit-section4312">
                  <div className="deposit-header4312">
                    <h2 className="section-title4312">Deposit Amounts</h2>
                    <div className="zap-toggle4312">
                      <span>Zap In</span>
                      <label className="switch4312">
                        <input type="checkbox" checked={zapIn} onChange={() => setZapIn(!zapIn)} />
                        <span className="slider4312"></span>
                      </label>
                    </div>
                  </div>
                  <div className="deposit-inputs4312">
                    <div className="deposit-input4312">
                      <input
                        type="text"
                        value={depositBase}
                        onChange={handleBaseChange}
                        placeholder="0.0"
                        className="deposit-field4312"
                      />
                      <div className="token-display4312">
                        <img src={baseToken.icon} alt={baseToken.symbol} className="token-icon4312" />
                        <span>{baseToken.symbol}</span>
                      </div>
                    </div>
                    <div className="deposit-input4312">
                      <input
                        type="text"
                        value={depositQuote}
                        onChange={handleQuoteChange}
                        placeholder="0.0"
                        className="deposit-field4312"
                      />
                      <div className="token-display4312">
                        <img src={quoteToken.icon} alt={quoteToken.symbol} className="token-icon4312" />
                        <span>{quoteToken.symbol}</span>
                      </div>
                    </div>
                  </div>
                  <button className="connect-wallet-btn4312" disabled={!!currentAccount} onClick={handleAddLiquidity}>
                    {currentAccount ? 'Add Liquidity' : 'Connect Wallet'}
                  </button>
                  <div className="deposit-summary4312">
                    <div className="summary-item4312">
                      <span>Total Amount</span>
                      <span>--</span>
                    </div>
                    <div className="summary-item4312">
                      <span>Deposit Ratio</span>
                      <div className="ratio-display4312">
                        <div className="ratio-item4312">
                          <img src={baseToken.icon} alt={baseToken.symbol} className="token-icon4312" />
                          <span>{baseToken.symbol} 62.81%</span>
                        </div>
                        <div className="ratio-item4312">
                          <img src={quoteToken.icon} alt={quoteToken.symbol} className="token-icon4312" />
                          <span>{quoteToken.symbol} 37.19%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

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
          importToken={async () => {}}
        />
      )}
    </div>
  );
};

export default AddLiquidityPage;