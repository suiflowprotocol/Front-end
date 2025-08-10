import React, { useState } from 'react';


// Define Pool interface directly since types file is missing
interface Pool {
  pair: string;
  token1Symbol: string;
  token2Symbol: string;
  img1: string;
  img2: string;
  feeRate: string;
  apr: string;
  tvl: string;
  volume: string;
  fees: string;
}

interface AddLiquidityModalProps {
  isOpen: boolean;
  pool: Pool | null;
  onClose: () => void;
}

const AddLiquidityModal: React.FC<AddLiquidityModalProps> = ({ pool, onClose, isOpen }) => {
  const [amountToken1, setAmountToken1] = useState('');
  const [amountToken2, setAmountToken2] = useState('');
  const [zapIn, setZapIn] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = () => {
    setIsWalletConnected(true);
  };

  const handleAddLiquidity = () => {
    if (!pool) {
      alert('No pool selected');
      return;
    }
    if (!amountToken1 || !amountToken2) {
      alert('Please enter deposit amounts');
      return;
    }
    console.log(`Adding liquidity to ${pool.pair}: ${amountToken1} ${pool.token1Symbol}, ${amountToken2} ${pool.token2Symbol}`);
    onClose();
  };

  if (!isOpen || !pool) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Liquidity to {pool.pair}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="left-column">
            <div className="token-pair">
              <div className="token-images">
                <img src={pool.img1} alt={pool.token1Symbol} className="token-logo" />
                <img src={pool.img2} alt={pool.token2Symbol} className="token-logo" />
              </div>
              <span className="token-pair-text">{pool.token1Symbol} / {pool.token2Symbol}</span>
              <span className="fee-rate">{pool.feeRate}</span>
            </div>
            <div className="pool-stats">
              <div>Pool APR: <span className="highlight">{pool.apr}</span></div>
              <div>TVL: <span className="highlight">{pool.tvl}</span></div>
              <div>Volume (24H): <span className="highlight">{pool.volume}</span></div>
              <div>Fees (24H): <span className="highlight">{pool.fees}</span></div>
            </div>
            <div className="deposit-section">
              <div className="deposit-amounts-header">
                <h3>Deposit Amounts</h3>
                <label className="zap-in-toggle">
                  <input type="checkbox" checked={zapIn} onChange={() => setZapIn(!zapIn)} />
                  <span>Zap In</span>
                </label>
              </div>
              <div className="deposit-input">
                <input
                  type="number"
                  value={amountToken1}
                  onChange={(e) => setAmountToken1(e.target.value)}
                  placeholder={`0.0 ${pool.token1Symbol}`}
                  disabled={zapIn}
                  className="deposit-input-field"
                />
                <div className="token-info">
                  <img src={pool.img1} alt={pool.token1Symbol} className="token-logo-small" />
                  <span className="token-symbol">{pool.token1Symbol}</span>
                </div>
              </div>
              <div className="deposit-input">
                <input
                  type="number"
                  value={amountToken2}
                  onChange={(e) => setAmountToken2(e.target.value)}
                  placeholder={`0.0 ${pool.token2Symbol}`}
                  className="deposit-input-field"
                />
                <div className="token-info">
                  <img src={pool.img2} alt={pool.token2Symbol} className="token-logo-small" />
                  <span className="token-symbol">{pool.token2Symbol}</span>
                </div>
              </div>
            </div>
            <div className="action-button">
              {isWalletConnected ? (
                <button onClick={handleAddLiquidity} className="add-liquidity-btn">Add Liquidity</button>
              ) : (
                <button onClick={connectWallet} className="connect-wallet-btn">Connect Wallet</button>
              )}
            </div>
            <div className="summary-section">
              <div className="summary-item">
                <span className="summary-label">Total Amount</span>
                <span className="summary-value">--</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Deposit Ratio</span>
                <div className="ratio-info">
                  <div className="token-ratio">
                    <img src={pool.img1} alt={pool.token1Symbol} className="token-logo-tiny" />
                    <span>{pool.token1Symbol} 35.76%</span>
                  </div>
                  <div className="token-ratio">
                    <img src={pool.img2} alt={pool.token2Symbol} className="token-logo-tiny" />
                    <span>{pool.token2Symbol} 64.24%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLiquidityModal;