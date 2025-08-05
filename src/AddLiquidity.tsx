import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { tokens, Token } from "./tokens";

interface Pool {
  pair: string;
  token1Address: string;
  token2Address: string;
  token1Symbol: string;
  token2Symbol: string;
  img1: string;
  img2: string;
  feeRate: string;
}

interface AddLiquidityModalProps {
  pool: Pool;
  tokens: Token[];
  onClose: () => void;
}

const AddLiquidityModal: React.FC<AddLiquidityModalProps> = ({ pool, tokens, onClose }) => {
  const [token1Amount, setToken1Amount] = useState("");
  const [token2Amount, setToken2Amount] = useState("");
  const [error, setError] = useState("");
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const location = useLocation();
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { pair, token1Address, token2Address, token1Symbol, token2Symbol, img1, img2, feeRate } = location.state || pool;

  // 获取代币精度
  const getTokenDecimals = (tokenAddress: string) => {
    const token = tokens.find((t) => t.address === tokenAddress);
    return token?.decimals || 6;
  };

  // 从链上获取余额
  useEffect(() => {
    const fetchBalances = async () => {
      if (!account) {
        setBalances({});
        setError("Please connect your wallet");
        return;
      }

      try {
        const newBalances: { [key: string]: string } = {};
        const allBalances = await client.getAllBalances({
          owner: account.address,
        });

        // 获取 token1 和 token2 的余额
        [token1Address, token2Address].forEach((tokenAddress) => {
          if (tokenAddress && !tokenAddress.includes("...")) {
            const balanceEntry = allBalances.find((b) => b.coinType === tokenAddress);
            const decimals = getTokenDecimals(tokenAddress);
            if (balanceEntry) {
              const balance = parseInt(balanceEntry.totalBalance) / 10 ** decimals;
              newBalances[tokenAddress] = balance.toFixed(4);
            } else {
              newBalances[tokenAddress] = "0.0000";
              console.warn(`No balance found for token: ${tokenAddress}`);
            }
          }
        });
        setBalances(newBalances);
        setError("");
      } catch (err) {
        console.error("Failed to fetch balances:", err);
        setError(`Unable to fetch balances: ${err instanceof Error ? err.message : "Unknown error"}`);
        setBalances({});
      }
    };

    fetchBalances();
  }, [account, token1Address, token2Address, client, tokens]);

  const handleToken1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToken1Amount(value);
    const token1Balance = parseFloat(balances[token1Address] || "0");
    if (value && !isNaN(Number(value)) && Number(value) <= token1Balance) {
      setToken2Amount((Number(value) * 2).toString()); // 假设 1:2 比例
      setError("");
    } else {
      setToken2Amount("");
      if (value) setError(`Invalid amount or exceeds balance (${token1Balance.toFixed(4)} ${token1Symbol})`);
    }
  };

  const handleToken2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToken2Amount(value);
    const token2Balance = parseFloat(balances[token2Address] || "0");
    if (value && !isNaN(Number(value)) && Number(value) <= token2Balance) {
      setToken1Amount((Number(value) / 2).toString()); // 反向 1:2 比例
      setError("");
    } else {
      setToken1Amount("");
      if (value) setError(`Invalid amount or exceeds balance (${token2Balance.toFixed(4)} ${token2Symbol})`);
    }
  };

  const handleSetPercentage = (token: "token1" | "token2", percentage: number) => {
    if (token === "token1") {
      const token1Balance = parseFloat(balances[token1Address] || "0");
      const amount = (token1Balance * percentage).toFixed(4);
      setToken1Amount(amount);
      setToken2Amount((Number(amount) * 2).toString());
    } else {
      const token2Balance = parseFloat(balances[token2Address] || "0");
      const amount = (token2Balance * percentage).toFixed(4);
      setToken2Amount(amount);
      setToken1Amount((Number(amount) / 2).toString());
    }
    setError("");
  };

  const handleAddLiquidity = () => {
    const token1Balance = parseFloat(balances[token1Address] || "0");
    const token2Balance = parseFloat(balances[token2Address] || "0");
    if (!token1Amount || !token2Amount) {
      setError("Please enter amounts for both tokens");
      return;
    }
    if (Number(token1Amount) > token1Balance || Number(token2Amount) > token2Balance) {
      setError("Insufficient balance");
      return;
    }
    // 模拟添加流动性
    console.log(`Adding liquidity: ${token1Amount} ${token1Symbol}, ${token2Amount} ${token2Symbol}`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            padding: 16px;
          }
          .modal-content {
            background: var(--card-bg);
            border-radius: 16px;
            width: 100%;
            max-width: 520px;
            padding: 20px;
            box-shadow: 0 8px 24px var(--shadow-color);
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            gap: 16px;
            animation: slideIn 0.3s ease-out;
          }
          @keyframes slideIn {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 12px;
          }
          .modal-title {
            font-size: 20px;
            font-weight: 700;
            color: var(--text-color);
            margin: 0;
          }
          .modal-close-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 6px;
            transition: all 0.2s ease;
          }
          .modal-close-btn:hover {
            transform: scale(1.1);
            color: var(--primary-color);
          }
          .modal-close-icon {
            width: 18px;
            height: 18px;
            color: var(--text-secondary);
          }
          .pool-info {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px;
            background: var(--modal-bg);
            border-radius: 10px;
            border: 1px solid var(--border-color);
          }
          .pool-icons {
            display: flex;
            align-items: center;
          }
          .pool-icons img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid var(--border-color);
            object-fit: cover;
            transition: transform 0.2s ease;
          }
          .pool-icons img:hover {
            transform: scale(1.1);
          }
          .pool-icons img:last-child {
            margin-left: -8px;
          }
          .pool-details {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .pool-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color);
          }
          .pool-fee {
            font-size: 13px;
            color: var(--text-secondary);
            background: var(--input-bg);
            padding: 3px 8px;
            border-radius: 10px;
            display: inline-block;
            border: 1px solid var(--border-color);
          }
          .input-container {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }
          .input-section {
            flex: 1;
            min-width: 220px;
            background: var(--modal-bg);
            border-radius: 10px;
            padding: 12px;
            border: 1px solid var(--border-color);
            box-shadow: 0 2px 6px var(--shadow-color);
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .input-section:hover {
            background: var(--hover-bg);
          }
          .input-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            font-weight: 500;
            color: var(--text-secondary);
          }
          .balance-text {
            font-size: 12px;
            color: var(--text-secondary);
          }
          .input-group {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .token-input {
            flex: 1;
            border: none;
            outline: none;
            font-size: 18px;
            font-weight: 500;
            background: transparent;
            color: var(--text-color);
            transition: all 0.2s ease;
          }
          .token-input:focus {
            color: var(--primary-color);
          }
          .token-info {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .token-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 1px solid var(--border-color);
          }
          .token-symbol {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-color);
          }
          .balance-buttons {
            display: flex;
            gap: 6px;
          }
          .balance-button {
            background: var(--input-bg);
            border: 1px solid var(--border-color);
            color: var(--primary-color);
            font-size: 11px;
            font-weight: 500;
            padding: 4px 10px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .balance-button:hover {
            background: var(--primary-color);
            color: #ffffff;
            transform: translateY(-1px);
          }
          .action-button {
            padding: 12px 16px;
            background: var(--primary-color);
            color: #ffffff;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.3s ease;
            text-align: center;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
          }
          .action-button:hover:not(:disabled) {
            background: var(--button-hover-bg);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          }
          .action-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .error-text {
            color: var(--error-color);
            font-size: 13px;
            text-align: center;
            margin-top: 8px;
          }
          @media (max-width: 768px) {
            .modal-content {
              max-width: 90%;
              padding: 16px;
            }
            .modal-title {
              font-size: 18px;
            }
            .pool-title {
              font-size: 15px;
            }
            .pool-icons img {
              width: 26px;
              height: 26px;
            }
            .input-container {
              flex-direction: column;
            }
            .input-section {
              min-width: 100%;
            }
            .token-input {
              font-size: 16px;
            }
            .action-button {
              padding: 10px 14px;
              font-size: 14px;
            }
          }
        `}</style>
        <div className="modal-header">
          <h2 className="modal-title">Add Liquidity - V2</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg className="modal-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="pool-info">
          <div className="pool-icons">
            <img src={img1} alt={token1Symbol} />
            <img src={img2} alt={token2Symbol} />
          </div>
          <div className="pool-details">
            <span className="pool-title">{pair}</span>
            <span className="pool-fee">Fee: {feeRate}</span>
          </div>
        </div>
        <div className="input-container">
          <div className="input-section">
            <div className="input-label">
              <span className="balance-text">Balance: {balances[token1Address] || "0.0000"} {token1Symbol}</span>
            </div>
            <div className="input-group">
              <input
                type="number"
                className="token-input"
                value={token1Amount}
                onChange={handleToken1Change}
                placeholder="0.00"
                step="0.01"
              />
              <div className="token-info">
                <img src={img1} alt={token1Symbol} className="token-icon" />
                <span className="token-symbol">{token1Symbol}</span>
              </div>
            </div>
            <div className="balance-buttons">
              <button
                className="balance-button"
                onClick={() => handleSetPercentage("token1", 0.5)}
              >
                50%
              </button>
              <button
                className="balance-button"
                onClick={() => handleSetPercentage("token1", 1)}
              >
                Max
              </button>
            </div>
          </div>
          <div className="input-section">
            <div className="input-label">
              <span className="balance-text">Balance: {balances[token2Address] || "0.0000"} {token2Symbol}</span>
            </div>
            <div className="input-group">
              <input
                type="number"
                className="token-input"
                value={token2Amount}
                onChange={handleToken2Change}
                placeholder="0.00"
                step="0.01"
              />
              <div className="token-info">
                <img src={img2} alt={token2Symbol} className="token-icon" />
                <span className="token-symbol">{token2Symbol}</span>
              </div>
            </div>
            <div className="balance-buttons">
              <button
                className="balance-button"
                onClick={() => handleSetPercentage("token2", 0.5)}
              >
                50%
              </button>
              <button
                className="balance-button"
                onClick={() => handleSetPercentage("token2", 1)}
              >
                Max
              </button>
            </div>
          </div>
        </div>
        {error && <div className="error-text">{error}</div>}
        <button
          className="action-button"
          onClick={handleAddLiquidity}
          disabled={!token1Amount || !token2Amount || Number(token1Amount) > parseFloat(balances[token1Address] || "0") || Number(token2Amount) > parseFloat(balances[token2Address] || "0")}
        >
          Add Liquidity
        </button>
      </div>
    </div>
  );
};

export default AddLiquidityModal;


