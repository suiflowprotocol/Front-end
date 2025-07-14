import { useState } from "react";

interface Token {
  symbol: string;
  address: string;
  icon: string;
  description: string;
  decimals: number;
}

interface CreatePoolProps {
  newPoolToken1: string;
  setNewPoolToken1: (value: string) => void;
  newPoolToken2: string;
  setNewPoolToken2: (value: string) => void;
  feeRate: string;
  setFeeRate: (value: string) => void;
  onClose: () => void;
}

const tokens: Token[] = [
  {
    symbol: "SUI",
    address: "0x2::sui::SUI",
    icon: "https://archive.cetus.zone/assets/image/sui/sui.png",
    description: "SUI Token",
    decimals: 9,
  },
  {
    symbol: "USDC",
    address: "0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f::usdc::USDC",
    icon: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
    description: "Native USDC",
    decimals: 6,
  },
  {
    symbol: "NS",
    address: "0xb3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba::NS::NS",
    icon: "https://example.com/ns-icon.png",
    description: "SuiNS Token",
    decimals: 6,
  },
  {
    symbol: "NAVX",
    address: "0xa16e100fcb99689d481f31a2315519923fdf45916a4fa18c5513008f5101237d::navx::NAVX",
    icon: "https://archive.cetus.zone/assets/image/sui/navx.png",
    description: "NAVX Token",
    decimals: 6,
  },
  {
    symbol: "CETUS",
    address: "0xd52c440f67dd960bc76f599a16065abd5fbc251b78f18d9dce3578ccc44462a9::cetus::CETUS",
    icon: "https://example.com/cetus-icon.png",
    description: "CETUS Token",
    decimals: 6,
  },
];

function CreatePool({ newPoolToken1, setNewPoolToken1, newPoolToken2, setNewPoolToken2, feeRate, setFeeRate, onClose }: CreatePoolProps) {
  const [step, setStep] = useState(1);
  const [initialPrice, setInitialPrice] = useState("");
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [showTokenModal, setShowTokenModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [importAddress, setImportAddress] = useState("");
  const [importError, setImportError] = useState("");
  const [activeList, setActiveList] = useState("Default");
  const [importedTokens, setImportedTokens] = useState<Token[]>([]);
  const [balances] = useState<{ [key: string]: string }>({
    "0x2::sui::SUI": "100.0",
    "0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f::usdc::USDC": "500.0",
    "0xb3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba::NS::NS": "200.0",
    "0xa16e100fcb99689d481f31a2315519923fdf45916a4fa18c5513008f5101237d::navx::NAVX": "150.0",
    "0xd52c440f67dd960bc76f599a16065abd5fbc251b78f18d9dce3578ccc44462a9::cetus::CETUS": "300.0",
  });

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreatePool = () => {
    console.log(`创建池子: ${newPoolToken1}-${newPoolToken2}，费率 ${feeRate}%`);
    onClose();
  };

  const handleAmount1Change = (value: string) => {
    setAmount1(value);
    if (value && initialPrice) {
      const amount1Num = parseFloat(value);
      const initialPriceNum = parseFloat(initialPrice);
      if (!isNaN(amount1Num) && !isNaN(initialPriceNum)) {
        setAmount2((amount1Num * initialPriceNum).toFixed(4));
      } else {
        setAmount2("");
      }
    } else {
      setAmount2("");
    }
  };

  const selectToken = (token: Token, type: string) => {
    if (type === "token1") {
      setNewPoolToken1(token.symbol);
    } else {
      setNewPoolToken2(token.symbol);
    }
    setShowTokenModal(null);
    setSearchQuery("");
    setImportAddress("");
    setImportError("");
  };

  const importToken = async () => {
    if (!importAddress) {
      setImportError("Please enter a valid token address");
      return;
    }
    // Mock token import logic
    const newToken: Token = {
      symbol: `TOKEN${importedTokens.length + 1}`,
      address: importAddress,
      icon: "https://example.com/unknown-token.png",
      description: `Imported Token ${importedTokens.length + 1}`,
      decimals: 6,
    };
    setImportedTokens([...importedTokens, newToken]);
    setActiveList("Imported");
    setImportAddress("");
    setImportError("");
  };

  const filteredTokens = (activeList === "Imported" ? importedTokens : tokens).filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isStep2Valid = initialPrice !== "";
  const isStep3Valid = amount1 !== "";

  return (
    <div className="create-pool-modal">
      <style>{`
        .create-pool-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .modal-content {
          background-color: #1A1F2B;
          color: #FFFFFF;
          padding: 24px;
          border-radius: 16px;
          width: 100%;
          max-width: 520px;
          max-height: 80vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          animation: fadeIn 0.3s ease-out;
          scrollbar-width: thin;
          scrollbar-color: #2A3435 #1A1F2B;
        }
        .modal-content::-webkit-scrollbar {
          width: 8px;
        }
        .modal-content::-webkit-scrollbar-track {
          background: #1A1F2B;
        }
        .modal-content::-webkit-scrollbar-thumb {
          background: #2A3435;
          border-radius: 4px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modal-header {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #A0AEC0;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease, transform 0.1s;
        }
        .back-button:hover {
          color: #FFFFFF;
          transform: translateX(-2px);
        }
        .steps-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .step-number {
          width: 28px;
          height: 28px;
          background-color: #2F80ED;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }
        .step-number.inactive {
          background-color: #2A3435;
        }
        .step-divider {
          flex: 1;
          height: 3px;
          background-color: #2A3435;
          border-radius: 2px;
        }
        .step-text {
          font-size: 12px;
          color: #A0AEC0;
          font-weight: 400;
        }
        .step-title {
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
        }
        .select-pair-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 300px;
        }
        .select-pair-title {
          font-size: 20px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }
        .select-pair-text {
          font-size: 14px;
          color: #A0AEC0;
          font-weight: 400;
          line-height: 1.5;
        }
        .token-select-container {
          display: flex;
          gap: 12px;
        }
        .token-select {
          flex: 1;
          padding: 12px 16px;
          background-color: #232D2E;
          border-radius: 10px;
          border: 1px solid #2A3435;
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .token-select:hover {
          background-color: #2A3435;
          border-color: #3B4A4C;
        }
        .token-select img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .fee-tier-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .fee-tier-select {
          padding: 12px 16px;
          background-color: #232D2E;
          border-radius: 10px;
          border: 1px solid #2A3435;
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .fee-tier-select:hover {
          background-color: #2A3435;
          border-color: #3B4A4C;
        }
        .token-pair-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background-color: #232D2E;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .token-pair-images {
          display: flex;
          align-items: center;
        }
        .token-pair-images img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #1A1F2B;
        }
        .token-pair-images img:last-child {
          margin-left: -12px;
        }
        .token-pair-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .token-pair-name {
          font-size: 18px;
          font-weight: 600;
          color: #FFFFFF;
          margin: 0;
        }
        .fee-rate {
          background-color: #2F80ED;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 13px;
          color: #FFFFFF;
          font-weight: 500;
          display: inline-block;
        }
        .input-group {
          display: flex;
          align-items: center;
          background-color: #232D2E;
          border-radius: 10px;
          padding: 12px;
          border: 1px solid #2A3435;
          transition: border-color 0.2s ease;
        }
        .input-group:hover {
          border-color: #3B4A4C;
        }
        .input-field {
          flex: 1;
          background: none;
          border: none;
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 500;
          outline: none;
          padding: 8px;
        }
        .input-addon {
          font-size: 14px;
          color: #A0AEC0;
          font-weight: 500;
          padding-right: 12px;
        }
        .current-price {
          font-size: 14px;
          color: #A0AEC0;
          font-weight: 400;
          text-align: center;
          margin-top: 8px;
        }
        .deposit-input-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .deposit-input-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background-color: #232D2E;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .deposit-input {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .deposit-input input {
          flex: 1;
          background: none;
          border: none;
          color: #FFFFFF;
          font-size: 24px;
          font-weight: 600;
          outline: none;
        }
        .deposit-addon {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .deposit-addon img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }
        .deposit-addon p {
          font-size: 16px;
          font-weight: 500;
          color: #FFFFFF;
        }
        .deposit-display {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background-color: #1A1F2B;
          border-radius: 10px;
        }
        .deposit-display p {
          flex: 1;
          font-size: 24px;
          font-weight: 600;
          color: #A0AEC0;
        }
        .total-amount {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background-color: #232D2E;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .total-amount p:first-child {
          font-size: 14px;
          font-weight: 500;
          color: #A0AEC0;
        }
        .total-amount p:last-child {
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
        }
        .deposit-ratio {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background-color: #232D2E;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .ratio-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ratio-item img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .ratio-item p {
          font-size: 14px;
          font-weight: 500;
          color: #FFFFFF;
        }
        .continue-button {
          padding: 14px;
          background-color: #2F80ED;
          color: #FFFFFF;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: background-color 0.2s ease, transform 0.1s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .continue-button:disabled {
          background-color: #2A3435;
          cursor: not-allowed;
          box-shadow: none;
        }
        .continue-button:hover:not(:disabled) {
          background-color: #1A5ECC;
          transform: translateY(-2px);
        }
        .token-modal-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1100;
        }
        .token-modal-content {
          background-color: #1A1F2B;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        .token-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .token-modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }
        .token-modal-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #A0AEC0;
          transition: color 0.2s ease;
        }
        .token-modal-close-btn:hover {
          color: #FFFFFF;
        }
        .token-modal-close-icon {
          width: 24px;
          height: 24px;
        }
        .token-modal-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .search-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .search-icon {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
        }
        .search-input {
          padding: 12px 12px 12px 40px;
          background-color: #232D2E;
          border: 1px solid #2A3435;
          border-radius: 10px;
          color: #FFFFFF;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .search-input:hover, .search-input:focus {
          border-color: #3B4A4C;
        }
        .error {
          color: #FF5555;
          font-size: 12px;
          text-align: center;
        }
        .import-button {
          padding: 12px;
          background-color: #2F80ED;
          color: #FFFFFF;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }
        .import-button:hover {
          background-color: #1A5ECC;
        }
        .token-tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #2A3435;
        }
        .token-tab {
          padding: 8px 16px;
          cursor: pointer;
          color: #A0AEC0;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .token-tab[data-active="true"] {
          color: #FFFFFF;
          border-bottom: 2px solid #2F80ED;
        }
        .token-tab:hover {
          color: #FFFFFF;
        }
        .token-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #2A3435 #1A1F2B;
        }
        .token-list::-webkit-scrollbar {
          width: 8px;
        }
        .token-list::-webkit-scrollbar-track {
          background: #1A1F2B;
        }
        .token-list::-webkit-scrollbar-thumb {
          background: #2A3435;
          border-radius: 4px;
        }
        .token-list-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background-color: #232D2E;
          border-radius: 10px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .token-list-item:hover {
          background-color: #2A3435;
        }
        .token-list-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        .token-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .token-name-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .token-name {
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          margin: 0;
        }
        .verified-icon {
          width: 16px;
          height: 16px;
        }
        .token-symbol {
          font-size: 14px;
          color: #A0AEC0;
          margin: 0;
        }
        .token-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        .token-balance {
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          margin: 0;
        }
        .token-address-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .token-address {
          font-size: 12px;
          color: #A0AEC0;
          margin: 0;
        }
        .token-link svg {
          width: 12px;
          height: 12px;
          stroke: #A0AEC0;
          transition: stroke 0.2s ease;
        }
        .token-link:hover svg {
          stroke: #FFFFFF;
        }
        .no-tokens {
          text-align: center;
          color: #A0AEC0;
          font-size: 14px;
          margin: 16px 0;
        }
      `}</style>
      <div className="modal-content">
        <div className="modal-header">
          <button className="back-button" onClick={onClose}>
            <svg aria-hidden="true" fill="#A0AEC0" width="20px" height="20px">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
            Back
          </button>
        </div>
        <div className="steps-container">
          <div className="step-item">
            <div className={`step-number ${step === 1 ? '' : 'inactive'}`}>1</div>
            <div>
              <p className="step-text">Step 1</p>
              <p className="step-title">Select token & fee tier</p>
            </div>
          </div>
          <div className="step-divider" />
          <div className="step-item">
            <div className={`step-number ${step === 2 ? '' : 'inactive'}`}>2</div>
            <div>
              <p className="step-text">Step 2</p>
              <p className="step-title">Set initial price</p>
            </div>
          </div>
          <div className="step-divider" />
          <div className="step-item">
            <div className={`step-number ${step === 3 ? '' : 'inactive'}`}>3</div>
            <div>
              <p className="step-text">Step 3</p>
              <p className="step-title">Enter deposit amounts</p>
            </div>
          </div>
        </div>
        {step === 1 && (
          <div className="select-pair-container">
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
                <option value="0.03">0.03%</option>
                <option value="0.25">0.25%</option>
                <option value="1.00">1.00%</option>
              </select>
            </div>
            <button
              className="continue-button"
              disabled={!newPoolToken1 || !newPoolToken2}
              onClick={handleNextStep}
            >
              Continue
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="select-pair-container">
            <div className="token-pair-header">
              <div className="token-pair-images">
                <img
                  src={tokens.find(t => t.symbol === newPoolToken1)?.icon || "https://example.com/unknown-token.png"}
                  alt={newPoolToken1}
                />
                <img
                  src={tokens.find(t => t.symbol === newPoolToken2)?.icon || "https://example.com/unknown-token.png"}
                  alt={newPoolToken2}
                />
              </div>
              <div className="token-pair-info">
                <p className="token-pair-name">{newPoolToken1} - {newPoolToken2}</p>
                <span className="fee-rate">{feeRate}%</span>
              </div>
            </div>
            <div>
              <h2 className="select-pair-title">Set Initial Price</h2>
              <div className="input-group">
                <input
                  className="input-field"
                  type="number"
                  placeholder="0.0"
                  value={initialPrice}
                  onChange={(e) => setInitialPrice(e.target.value)}
                />
                <span className="input-addon">{newPoolToken2} per {newPoolToken1}</span>
              </div>
              <p className="current-price">
                {initialPrice ? `Current Price: 1 ${newPoolToken1} = ${initialPrice} ${newPoolToken2}` : "Current Price: --"}
              </p>
            </div>
            <button
              className="continue-button"
              disabled={!isStep2Valid}
              onClick={handleNextStep}
            >
              Continue
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="select-pair-container">
            <div className="token-pair-header">
              <div className="token-pair-images">
                <img
                  src={tokens.find(t => t.symbol === newPoolToken1)?.icon || "https://example.com/unknown-token.png"}
                  alt={newPoolToken1}
                />
                <img
                  src={tokens.find(t => t.symbol === newPoolToken2)?.icon || "https://example.com/unknown-token.png"}
                  alt={newPoolToken2}
                />
              </div>
              <div className="token-pair-info">
                <p className="token-pair-name">{newPoolToken1} - {newPoolToken2}</p>
                <span className="fee-rate">{feeRate}%</span>
              </div>
            </div>
            <div className="deposit-input-container">
              <h2 className="select-pair-title">Deposit Amounts</h2>
              <div className="deposit-input-group">
                <div className="deposit-input">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={amount1}
                    onChange={(e) => handleAmount1Change(e.target.value)}
                    className="deposit-input"
                  />
                  <div className="deposit-addon">
                    <img
                      src={tokens.find(t => t.symbol === newPoolToken1)?.icon || "https://example.com/unknown-token.png"}
                      alt={newPoolToken1}
                    />
                    <p>{newPoolToken1}</p>
                  </div>
                </div>
              </div>
              <div className="deposit-input-group">
                <div className="deposit-display">
                  <p>{amount2 || "0.0"}</p>
                  <div className="deposit-addon">
                    <img
                      src={tokens.find(t => t.symbol === newPoolToken2)?.icon || "https://example.com/unknown-token.png"}
                      alt={newPoolToken2}
                    />
                    <p>{newPoolToken2}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="total-amount">
              <p>Total Amount</p>
              <p>--</p>
            </div>
            <div className="deposit-ratio">
              <p className="select-pair-text">Deposit Ratio</p>
              <div className="ratio-item">
                <img
                  src={tokens.find(t => t.symbol === newPoolToken1)?.icon || "https://example.com/unknown-token.png"}
                  alt={newPoolToken1}
                />
                <p>{newPoolToken1} 50%</p>
              </div>
              <div className="ratio-item">
                <img
                  src={tokens.find(t => t.symbol === newPoolToken2)?.icon || "https://example.com/unknown-token.png"}
                  alt={newPoolToken2}
                />
                <p>{newPoolToken2} 50%</p>
              </div>
            </div>
            <button
              className="continue-button"
              disabled={!isStep3Valid}
              onClick={handleCreatePool}
            >
              Create Pool
            </button>
          </div>
        )}
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
                  {importAddress && !filteredTokens.length && (
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
                  {filteredTokens.length ? (
                    filteredTokens.map((token) => (
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
    </div>
  );
}

export default CreatePool;