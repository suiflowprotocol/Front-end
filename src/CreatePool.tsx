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
  const [step, setStep] = useState<1 | 2 | 3>(1);
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
    if (step < 3) setStep((step + 1) as 1 | 2 | 3);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep((step - 1) as 1 | 2 | 3);
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
    }else {
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
        :root {
          --card-bg: #0f172a;
          --modal-bg: #1e293b;
          --text-color: #f8fafc;
          --text-secondary: #94a3b8;
          --primary-color: #3b82f6;
          --button-hover-bg: #2563eb;
          --border-color: #334155;
          --shadow-color: rgba(0, 0, 0, 0.2);
          --success-color: #10b981;
          --input-bg: #2d3748;
          --hover-bg: #334155;
        }

        .create-pool-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .modal-content {
          background: var(--modal-bg);
          color: var(--text-color);
          padding: 12px;
          border-radius: 10px;
          width: 100%;
          max-width: 460px;
          max-height: 85vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 16px var(--shadow-color);
          animation: fadeIn 0.3s ease-out;
          scrollbar-width: thin;
          scrollbar-color: var(--border-color) var(--modal-bg);
          border: 1px solid var(--border-color);
        }
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }
        .modal-content::-webkit-scrollbar-track {
          background: var(--modal-bg);
        }
        .modal-content::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
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
          gap: 6px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.2s ease, transform 0.1s;
        }
        .back-button:hover {
          color: var(--text-color);
          transform: translateX(-2px);
        }
        .steps-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .step-number {
          width: 24px;
          height: 24px;
          background-color: var(--primary-color);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }
        .step-number.inactive {
          background-color: var(--border-color);
        }
        .step-divider {
          flex: 1;
          height: 2px;
          background-color: var(--border-color);
          border-radius: 1px;
        }
        .step-text {
          font-size: 11px;
          color: var(--text-secondary);
          font-weight: 400;
        }
        .step-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-color);
        }
        .select-pair-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 200px;
        }
        .select-pair-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-color);
          margin: 0;
        }
        .select-pair-text {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 400;
          line-height: 1.4;
          margin: 4px 0;
        }
        .token-select-container {
          display: flex;
          gap: 8px;
        }
        .token-select {
          flex: 1;
          padding: 8px 10px;
          background-color: var(--input-bg);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          color: var(--text-color);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .token-select:hover {
          background-color: var(--hover-bg);
          border-color: var(--border-color);
        }
        .token-select img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
        .fee-tier-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .fee-tier-select {
          padding: 8px 10px;
          background-color: var(--input-bg);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          color: var(--text-color);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .fee-tier-select:hover {
          background-color: var(--hover-bg);
          border-color: var(--border-color);
        }
        .token-pair-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background-color: var(--input-bg);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .token-pair-images {
          display: flex;
          align-items: center;
        }
        .token-pair-images img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--modal-bg);
        }
        .token-pair-images img:last-child {
          margin-left: -8px;
        }
        .token-pair-info {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        .token-pair-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-color);
          margin: 0;
        }
        .fee-rate {
          background-color: var(--primary-color);
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 11px;
          color: #ffffff;
          font-weight: 500;
        }
        .edit-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .edit-button:hover {
          color: var(--text-color);
        }
        .input-group {
          display: flex;
          align-items: center;
          background-color: var(--input-bg);
          border-radius: 8px;
          padding: 8px;
          border: 1px solid var(--border-color);
          transition: border-color 0.2s ease;
        }
        .input-group:hover {
          border-color: var(--border-color);
        }
        .input-field {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-color);
          font-size: 14px;
          font-weight: 500;
          outline: none;
          padding: 4px;
        }
        .input-addon {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
          padding-right: 8px;
        }
        .price-range-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .price-range-tabs {
          display: flex;
          gap: 6px;
        }
        .price-range-tab {
          padding: 6px 10px;
          background-color: var(--input-bg);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          color: var(--text-color);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .price-range-tab.active {
          background-color: var(--primary-color);
          color: #ffffff;
        }
        .price-range-inputs {
          display: flex;
          gap: 8px;
        }
        .price-range-input-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background-color: var(--input-bg);
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .price-range-input-group p {
          font-size: 12px;
          color: var(--text-secondary);
          text-align: center;
          margin: 0;
        }
        .price-range-input-group input {
          background: none;
          border: none;
          color: var(--text-color);
          font-size: 12px;
          font-weight: 500;
          outline: none;
          text-align: center;
          width: 100%;
        }
        .deposit-input-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .deposit-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background-color: var(--input-bg);
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 6px var(--shadow-color);
          border: 1px solid var(--border-color);
        }
        .deposit-input {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .deposit-input input {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-color);
          font-size: 18px;
          font-weight: 600;
          outline: none;
        }
        .deposit-addon {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .deposit-addon img {
          width: 22px;
          height: 22px;
          border-radius: 50%;
        }
        .deposit-addon p {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-color);
        }
        .deposit-display {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background-color: var(--modal-bg);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .deposit-display p {
          flex: 1;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .total-amount {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: var(--input-bg);
          border-radius: 8px;
          box-shadow: 0 2px 6px var(--shadow-color);
          border: 1px solid var(--border-color);
        }
        .total-amount p:first-child {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .total-amount p:last-child {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-color);
        }
        .deposit-ratio {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 10px;
          background-color: var(--input-bg);
          border-radius: 8px;
          box-shadow: 0 2px 6px var(--shadow-color);
          border: 1px solid var(--border-color);
        }
        .ratio-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ratio-item img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
        .ratio-item p {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-color);
        }
        .continue-button {
          padding: 10px;
          background-color: var(--primary-color);
          color: #ffffff;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: background-color 0.2s ease, transform 0.1s;
          box-shadow: 0 2px 6px var(--shadow-color);
        }
        .continue-button:disabled {
          background-color: var(--border-color);
          cursor: not-allowed;
          box-shadow: none;
        }
        .continue-button:hover:not(:disabled) {
          background-color: var(--button-hover-bg);
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
          background: var(--modal-bg);
          border-radius: 10px;
          width: 100%;
          max-width: 360px;
          max-height: 60vh;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 16px var(--shadow-color);
          border: 1px solid var(--border-color);
          overflow-y: auto;
        }
        .token-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .token-modal-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-color);
          margin: 0;
        }
        .token-modal-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          transition: color 0.2s ease;
        }
        .token-modal-close-btn:hover {
          color: var(--text-color);
        }
        .token-modal-close-icon {
          width: 18px;
          height: 18px;
        }
        .token-modal-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .search-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .search-icon {
          width: 16px;
          height: 16px;
          position: absolute;
          top: 50%;
          left: 8px;
          transform: translateY(-50%);
        }
        .search-input {
          padding: 8px 8px 8px 32px;
          background-color: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-color);
          font-size: 12px;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .search-input:hover, .search-input:focus {
          border-color: var(--border-color);
        }
        .error {
          color: #ff5555;
          font-size: 10px;
          text-align: center;
        }
        .import-button {
          padding: 8px;
          background-color: var(--primary-color);
          color: #ffffff;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }
        .import-button:hover {
          background-color: var(--button-hover-bg);
        }
        .token-tabs {
          display: flex;
          gap: 6px;
          border-bottom: 1px solid var(--border-color);
        }
        .token-tab {
          padding: 6px 10px;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .token-tab[data-active="true"] {
          color: var(--text-color);
          border-bottom: 2px solid var(--primary-color);
        }
        .token-tab:hover {
          color: var(--text-color);
        }
        .token-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 160px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--border-color) var(--modal-bg);
        }
        .token-list::-webkit-scrollbar {
          width: 6px;
        }
        .token-list::-webkit-scrollbar-track {
          background: var(--modal-bg);
        }
        .token-list::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }
        .token-list-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background-color: var(--input-bg);
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border: 1px solid var(--border-color);
        }
        .token-list-item:hover {
          background-color: var(--hover-bg);
        }
        .token-list-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .token-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .token-name-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .token-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-color);
          margin: 0;
        }
        .verified-icon {
          width: 12px;
          height: 12px;
        }
        .token-symbol {
          font-size: 11px;
          color: var(--text-secondary);
          margin: 0;
        }
        .token-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        .token-balance {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-color);
          margin: 0;
        }
        .token-address-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .token-address {
          font-size: 10px;
          color: var(--text-secondary);
          margin: 0;
        }
        .token-link svg {
          width: 10px;
          height: 10px;
          stroke: var(--text-secondary);
          transition: stroke 0.2s ease;
        }
        .token-link:hover svg {
          stroke: var(--text-color);
        }
        .no-tokens {
          text-align: center;
          color: var(--text-secondary);
          font-size: 12px;
          margin: 10px 0;
        }
        @media (max-width: 768px) {
          .modal-content {
            padding: 10px;
            max-width: 95%;
          }
          .select-pair-title {
            font-size: 14px;
          }
          .select-pair-text {
            font-size: 11px;
          }
          .token-select-container {
            flex-direction: column;
            gap: 6px;
          }
          .token-select {
            padding: 6px 8px;
            font-size: 12px;
          }
          .token-select img {
            width: 18px;
            height: 18px;
          }
          .fee-tier-select {
            padding: 6px 8px;
            font-size: 12px;
          }
          .continue-button {
            padding: 8px;
            font-size: 13px;
          }
          .token-modal-content {
            max-width: 95%;
            padding: 10px;
            max-height: 65vh;
          }
          .token-modal-title {
            font-size: 14px;
          }
          .search-input {
            padding: 6px 6px 6px 28px;
            font-size: 11px;
          }
          .search-icon {
            width: 14px;
            height: 14px;
            left: 6px;
          }
          .token-list-item {
            padding: 6px;
          }
          .token-list-icon {
            width: 22px;
            height: 22px;
          }
          .token-name {
            font-size: 12px;
          }
          .token-symbol {
            font-size: 10px;
          }
          .token-balance {
            font-size: 12px;
          }
          .token-address {
            font-size: 9px;
          }
          .token-pair-header {
            padding: 6px;
            gap: 6px;
          }
          .token-pair-images img {
            width: 20px;
            height: 20px;
          }
          .token-pair-name {
            font-size: 12px;
          }
          .fee-rate {
            padding: 2px 6px;
            font-size: 10px;
          }
          .edit-button {
            font-size: 11px;
          }
          .edit-button svg {
            width: 16px;
            height: 16px;
          }
          .input-group {
            padding: 6px;
          }
          .input-field {
            font-size: 13px;
            padding: 3px;
          }
          .input-addon {
            font-size: 11px;
          }
          .price-range-tabs {
            gap: 4px;
          }
          .price-range-tab {
            padding: 4px 8px;
            font-size: 11px;
          }
          .price-range-inputs {
            gap: 6px;
            flex-direction: column;
          }
          .price-range-input-group {
            padding: 6px;
          }
          .price-range-input-group p {
            font-size: 11px;
          }
          .price-range-input-group input {
            font-size: 11px;
          }
        }
      `}</style>
      <div className="modal-content">
        <div className="modal-header">
          <button className="back-button" onClick={onClose}>
            <svg aria-hidden="true" fill="var(--text-secondary)" width="16px" height="16px">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
            Back
          </button>
        </div>
        {step === 1 && (
          <div className="select-pair-container">
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
                <div className={`step-number ${step as number === 2 ? '' : 'inactive'}`}>2</div>
                <div>
                  <p className="step-text">Step 2</p>
                  <p className="step-title">Set initial price</p>
                </div>
              </div>
              <div className="step-divider" />
              <div className="step-item">
                <div className={`step-number ${step as number === 3 ? '' : 'inactive'}`}>3</div>
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
              <button className="edit-button" onClick={() => setStep(1)}>
                <svg aria-hidden="true" fill="var(--text-secondary)" width="16px" height="16px">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                Edit
              </button>
            </div>
            <div>
              <h2 className="select-pair-title">Set Initial Price</h2>
              <p className="select-pair-text">Please set an initial price for this new pool to start.</p>
              <div className="input-group">
                <input
                  className="input-field"
                  type="text"
                  inputMode="numeric"
                  placeholder="0.0"
                  value={initialPrice}
                  onChange={(e) => setInitialPrice(e.target.value)}
                  style={{ width: 'calc(100% - 8px)', fontVariant: 'tabular-nums' }}
                />
                <span className="input-addon">{newPoolToken2} per {newPoolToken1}</span>
              </div>
            </div>
            <div className="price-range-container">
              <h2 className="select-pair-title">Set Price Range</h2>
              <div className="price-range-tabs">
                <div className="price-range-tab active">Full Range</div>
                <div className="price-range-tab" style={{ opacity: 0.5, cursor: 'not-allowed' }}>Custom Range</div>
              </div>
              <div className="price-range-inputs">
                <div className="price-range-input-group">
                  <p>Min Price</p>
                  <input value="0" readOnly />
                  <p>{newPoolToken2} per {newPoolToken1}</p>
                </div>
                <div className="price-range-input-group">
                  <p>Max Price</p>
                  <input value="∞" readOnly />
                  <p>{newPoolToken2} per {newPoolToken1}</p>
                </div>
              </div>
            </div>
            <button
              className="continue-button"
              disabled={!isStep2Valid}
              onClick={handleNextStep}
            >
              Enter Initial Price
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="select-pair-container">
            <div className="steps-container">
              <div className="step-item">
                <div className={`step-number ${step as number === 1 ? '' : 'inactive'}`}>1</div>
                <div>
                  <p className="step-text">Step 1</p>
                  <p className="step-title">Select token & fee tier</p>
                </div>
              </div>
              <div className="step-divider" />
              <div className="step-item">
                <div className={`step-number ${step as number === 2 ? '' : 'inactive'}`}>2</div>
                <div>
                  <p className="step-text">Step 2</p>
                  <p className="step-title">Set initial price</p>
                </div>
              </div>
              <div className="step-divider" />
              <div className="step-item">
                <div className={`step-number ${step as number === 3 ? '' : 'inactive'}`}>3</div>
                <div>
                  <p className="step-text">Step 3</p>
                  <p className="step-title">Enter deposit amounts</p>
                </div>
              </div>
            </div>
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
                                width="10"
                                height="10"
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