import { Token } from "./CreatePool";

interface Step3DepositAmountsProps {
  newPoolToken1: string;
  newPoolToken2: string;
  feeRate: string;
  amount1: string;
  amount2: string;
  handleAmount1Change: (value: string) => void;
  handleCreatePool: () => void;
  isStep3Valid: boolean;
  step: 1 | 2 | 3;
  tokens: Token[];
}

function Step3DepositAmounts({
  newPoolToken1,
  newPoolToken2,
  feeRate,
  amount1,
  amount2,
  handleAmount1Change,
  handleCreatePool,
  isStep3Valid,
  step,
  tokens,
}: Step3DepositAmountsProps) {
  return (
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
  );
}

export default Step3DepositAmounts;