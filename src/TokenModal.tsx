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
    symbol: "USDS",
    address: "0xb3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba::NS::NS",
    icon: "https://bafybeic3vdhnw3hdpstzybcta42xdikbobsdkyw2go7ekoiva7z5nwi5je.ipfs.w3s.link/USDS-Photoroom.png",
    description: "USDS Token",
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
    { symbol: "USDS", icon: "https://bafybeic3vdhnw3hdpstzybcta42xdikbobsdkyw2go7ekoiva7z5nwi5je.ipfs.w3s.link/USDS-Photoroom.png" },

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