import { useEffect } from "react";
import { Token } from "./CreatePool";

interface Step1SelectPairProps {
  newPoolToken1: string;
  newPoolToken2: string;
  feeRate: string;
  setNewPoolToken1: (value: string) => void;
  setNewPoolToken2: (value: string) => void;
  setFeeRate: (value: string) => void;
  showTokenModal: string | null;
  setShowTokenModal: (value: string | null) => void;
  handleNextStep: () => void;
  tokens: Token[];
  importedTokens: Token[];
  selectToken: (token: Token, type: string) => void;
  balances: { [key: string]: string };
  activeList: string;
  setActiveList: React.Dispatch<React.SetStateAction<string>>;
  importAddress: string;
  setImportAddress: React.Dispatch<React.SetStateAction<string>>;
  importError: string;
  setImportError: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  importToken: () => Promise<void>;
}

function Step1SelectPair({
  newPoolToken1,
  newPoolToken2,
  feeRate,
  setNewPoolToken1,
  setNewPoolToken2,
  setFeeRate,
  showTokenModal,
  setShowTokenModal,
  handleNextStep,
  tokens,
  importedTokens,
  selectToken,
  balances,
  activeList,
  setActiveList,
  importAddress,
  setImportAddress,
  importError,
  setImportError,
  searchQuery,
  setSearchQuery,
  importToken,
}: Step1SelectPairProps) {
  const quoteTokens = tokens.filter(token => ["SUI", "USDC"].includes(token.symbol));

  const filteredTokens = (type: string) => {
    const tokenList = activeList === "Imported" ? importedTokens : (type === "token2" ? quoteTokens : tokens);
    return tokenList.filter(
      (token) =>
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="select-pair-container">
      <div className="steps-container">
        <div className="step-item">
          <div className="step-number">1</div>
          <div>
            <p className="step-text">Step 1</p>
            <p className="step-title">Select token & fee tier</p>
          </div>
        </div>
        <div className="step-divider" />
        <div className="step-item">
          <div className="step-number inactive">2</div>
          <div>
            <p className="step-text">Step 2</p>
            <p className="step-title">Set initial price</p>
          </div>
        </div>
        <div className="step-divider" />
        <div className="step-item">
          <div className="step-number inactive">3</div>
          <div>
            <p className="step-text">Step 3</p>
            <p className="step-title">Enter deposit amounts</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="select-pair-title">Select Pair</h2>
        <p className="select-pair-text">Choose the tokens for your liquidity pool.</p>
      </div>
      <div className="token-select-container">
        <div className="token-select" onClick={() => setShowTokenModal("token1")}>
          {newPoolToken1 ? (
            <>
              <img
                src={tokens.find(t => t.symbol === newPoolToken1)?.icon || "https://example.com/unknown-token.png"}
                alt={newPoolToken1}
              />
              <span>{newPoolToken1}</span>
            </>
          ) : (
            <span>Select Base Token</span>
          )}
        </div>
        <div className="token-select" onClick={() => setShowTokenModal("token2")}>
          {newPoolToken2 ? (
            <>
              <img
                src={tokens.find(t => t.symbol === newPoolToken2)?.icon || "https://example.com/unknown-token.png"}
                alt={newPoolToken2}
              />
              <span>{newPoolToken2}</span>
            </>
          ) : (
            <span>Select Quote Token</span>
          )}
        </div>
      </div>
      <div className="fee-tier-container">
        <p className="select-pair-text">Fee Tier - The percentage of fees you will earn.</p>
        <select
          className="fee-tier-select"
          value={feeRate}
          onChange={(e) => setFeeRate(e.target.value)}
        >
          <option value="0.01">0.01%</option>
          <option value="0.05">0.05%</option>
          <option value="0.20">0.20%</option>
          <option value="0.25">0.25%</option>
          <option value="1.00">1.00%</option>
          <option value="2.00">2.00%</option>
        </select>
      </div>
      <button
        className="continue-button"
        disabled={!newPoolToken1 || !newPoolToken2}
        onClick={handleNextStep}
      >
        Continue
      </button>
      {showTokenModal && (
        <div className="token-modal-container">
          <section className="token-modal-content" role="dialog" aria-modal="true">
            <header className="token-modal-header">
              <h2 className="token-modal-title">Select Token</h2>
              <button
                type="button"
                className="token-modal-close-btn"
                onClick={() => {
                  setShowTokenModal(null);
                  setSearchQuery("");
                  setImportAddress("");
                  setImportError("");
                }}
              >
                <svg viewBox="0 0 24 24" className="token-modal-close-icon">
                  <path
                    fill="currentColor"
                    d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
                  />
                </svg>
              </button>
            </header>
            <div className="token-modal-body">
              <div className="search-group">
                <img
                  src="/assets/images/search.svg"
                  alt="Search"
                  className="search-icon"
                />
                <input
                  placeholder="Search name, symbol or paste address"
                  className="search-input"
                  value={importAddress}
                  onChange={(e) => {
                    setImportAddress(e.target.value);
                    setSearchQuery(e.target.value);
                    setImportError("");
                  }}
                />
                {importError && <div className="error">{importError}</div>}
                {importAddress && !filteredTokens(showTokenModal).length && (
                  <button
                    className="import-button"
                    onClick={importToken}
                  >
                    Import Token
                  </button>
                )}
              </div>
              <div className="token-tabs">
                <div
                  className="token-tab"
                  data-active={activeList === "Default"}
                  onClick={() => setActiveList("Default")}
                >
                  <p className="token-tab-text">Default</p>
                </div>
                <div
                  className="token-tab"
                  data-active={activeList === "Imported"}
                  onClick={() => setActiveList("Imported")}
                >
                  <p className="token-tab-text">Imported</p>
                </div>
              </div>
              <div className="token-list">
                {filteredTokens(showTokenModal).length ? (
                  filteredTokens(showTokenModal).map((token) => (
                    <div
                      className="token-list-item"
                      key={token.address}
                      onClick={() => selectToken(token, showTokenModal)}
                    >
                      <img
                        src={token.icon}
                        alt={token.symbol}
                        className="token-list-icon"
                      />
                      <div className="token-info">
                        <div className="token-name-group">
                          <p className="token-name">{token.description}</p>
                          <img
                            src="https://app.mmt.finance/_next/image?url=%2Fassets%2Fimages%2Fverified.svg&w=32&q=75&dpl=dpl_4pNPYKwjBgiR5G9S61Tmqw59B2bA"
                            alt="Verified"
                            className="verified-icon"
                          />
                        </div>
                        <p className="token-symbol">{token.symbol}</p>
                      </div>
                      <div className="token-details">
                        <p className="token-balance">{balances[token.address] || "0.0"}</p>
                        <div className="token-address-group">
                          <p className="token-address">{token.address.slice(0, 6)}...{token.address.slice(-4)}</p>
                          <a
                            href={`https://suivision.xyz/coin/${token.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="token-link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-tokens">No tokens found</p>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Step1SelectPair;