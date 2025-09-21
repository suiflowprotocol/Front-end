import { SuiClient } from "@mysten/sui/client";

export const tokens = [
  {
    symbol: "SEA",
    address: "",
    icon: "https://bafybeidtawvlj55bsc4mn2l2j3f22wcydzg7pga73hyddad5d74b4scz6y.ipfs.w3s.link/sea.png",
    description: "SEA Token",
    decimals: 9,
  },
  {
    symbol: "SEAL",
    address: "0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f::usdc::USDC",
    icon: "https://i.meee.com.tw/SdliTGK.png",
    description: "SEAL TOKEN",
    decimals: 6,
  },
  {
    symbol: "USDC",
    address: "0xb3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba::NS::NS",
    icon: "data:image/png;base64,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",
    description: "USDC Token",
    decimals: 6,
  },
];

interface Token {
  symbol: string;
  address: string;
  icon: string;
  description: string;
  decimals: number;
}

interface TokenModalProps {
  showTokenModal: string | null;
  setShowTokenModal: React.Dispatch<React.SetStateAction<string | null>>;
  tokens: Token[];
  importedTokens: Token[];
  activeList: string;
  setActiveList: React.Dispatch<React.SetStateAction<string>>;
  importAddress: string;
  setImportAddress: React.Dispatch<React.SetStateAction<string>>;
  importError: string;
  setImportError: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  selectToken: (token: Token, type: string) => void;
  balances: { [key: string]: string };
  importToken: () => Promise<void>;
}

const TokenModal: React.FC<TokenModalProps> = ({
  showTokenModal,
  setShowTokenModal,
  tokens,
  importedTokens,
  activeList,
  setActiveList,
  importAddress,
  setImportAddress,
  importError,
  setImportError,
  searchQuery,
  setSearchQuery,
  selectToken,
  balances,
  importToken,
}) => {
  const filteredTokens = (activeList === "Imported" ? importedTokens : tokens).filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickTokens = [
    { symbol: "SEA", icon: "https://bafybeidtawvlj55bsc4mn2l2j3f22wcydzg7pga73hyddad5d74b4scz6y.ipfs.w3s.link/sea.png" },
    { symbol: "SEAL", icon: "https://i.meee.com.tw/SdliTGK.png" },
    { symbol: "USDC", icon: "data:image/png;base64,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" },

  ];

  const handleQuickSelect = (symbol: string) => {
    const allTokens = [...tokens, ...importedTokens];
    const selectedToken = allTokens.find(
      (t) => t.symbol.toUpperCase() === symbol.toUpperCase() || t.description.toUpperCase() === symbol.toUpperCase()
    );
    if (selectedToken && showTokenModal) {
      selectToken(selectedToken, showTokenModal);
      setShowTokenModal(null);
    }
  };

  return (
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
              src="https://bafybeiawrwpry44l2oxgqhoh2l3hj6yxj3zctheebrlyrc75p7kln33q2e.ipfs.w3s.link/search%20(4).svg"
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
            {importAddress && !filteredTokens.length && (
              <button className="import-button" onClick={importToken}>
                Import Token
              </button>
            )}
          </div>
          <div className="quick-tokens">
            {quickTokens.map((qt) => (
              <button
                key={qt.symbol}
                className="quick-token-button"
                onClick={() => handleQuickSelect(qt.symbol)}
              >
                <img src={qt.icon} alt={qt.symbol} className="quick-token-icon" />
                <span className="quick-token-text">{qt.symbol}</span>
              </button>
            ))}
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
            {filteredTokens.length ? (
              filteredTokens.map((token) => (
                <div
                  className="token-list-item"
                  key={token.address}
                  onClick={() => selectToken(token, showTokenModal!)}
                >
                  <img src={token.icon} alt={token.symbol} className="token-list-icon" />
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
  );
};

export default TokenModal;