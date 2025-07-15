import { Token } from "./CreatePool";

interface Step2SetPriceProps {
  newPoolToken1: string;
  newPoolToken2: string;
  feeRate: string;
  initialPrice: string;
  setInitialPrice: (value: string) => void;
  setStep: (step: 1 | 2 | 3) => void;
  handleNextStep: () => void;
  isStep2Valid: boolean;
  tokens: Token[];
}

function Step2SetPrice({
  newPoolToken1,
  newPoolToken2,
  feeRate,
  initialPrice,
  setInitialPrice,
  setStep,
  handleNextStep,
  isStep2Valid,
  tokens,
}: Step2SetPriceProps) {
  return (
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
  );
}

export default Step2SetPrice;