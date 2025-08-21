import React, { useState } from 'react';
import './SwapPreview.css';

interface SwapPreviewProps {
  amountIn: string;
  amountOut: string;
  tokenX: { symbol: string; icon: string };
  tokenY: { symbol: string; icon: string };
  slippage: string;
  priceDifference: string;
  minAmountOut: string;
  onConfirm: () => void;
  onClose: () => void;
}

const SwapPreview: React.FC<SwapPreviewProps> = ({
  amountIn,
  amountOut,
  tokenX,
  tokenY,
  slippage,
  priceDifference,
  minAmountOut,
  onConfirm,
  onClose,
}) => {
  const [isSwapped, setIsSwapped] = useState(false);

  const exchangeRate = parseFloat(amountOut) / parseFloat(amountIn) || 0;
  const reverseExchangeRate = parseFloat(amountIn) / parseFloat(amountOut) || 0;

  const handleSwapRate = () => {
    setIsSwapped(!isSwapped);
  };

  return (
    <div className="modal-overlay visible">
      <section className="chakra-modal__content css-xnqtk411" role="dialog" tabIndex={-1} aria-modal="true">
        <header className="chakra-modal__header css-10h09dx11">
          <h2 className="chakra-heading css-1cowq8v11">Swap</h2>
          <button type="button" aria-label="Close" className="chakra-modal__close-btn css-14njbx11" onClick={onClose}>
            <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi" aria-hidden="true">
              <path
                fill="currentColor"
                d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
              />
            </svg>
          </button>
        </header>
        <div className="chakra-modal__body css-hgczei11">
          <div className="chakra-stack css-1veteyv11">
            <div className="chakra-stack css-1xgnfuh11">
              <div className="token-section11">
                <div className="token-box">
                  <div className="token-amount">
                    <p className="chakra-text css-1dis6eq11">{amountIn}</p>
                    <p className="chakra-text css-18eiei211">{tokenX.symbol}</p>
                  </div>
                  <img className="chakra-image css-rmmdki11" src={tokenX.icon} alt={tokenX.symbol} />
                </div>
                <div className="arrow-container">
                  <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </div>
                <div className="token-box">
                  <div className="token-amount">
                    <p className="chakra-text css-1dis6eq11">{amountOut}</p>
                    <p className="chakra-text css-18eiei211">{tokenY.symbol}</p>
                  </div>
                  <img className="chakra-image css-rmmdki11" src={tokenY.icon} alt={tokenY.symbol} />
                </div>
              </div>
              <div className="exchange-rate-section11">
                <div className="exchange-rate11">
                  {isSwapped ? (
                    <p className="chakra-text css-v4hq1a11">
                      <img className="small-token-icon" src={tokenY.icon} alt={tokenY.symbol} />
                      1 {tokenY.symbol} ≈ {reverseExchangeRate.toFixed(6)} {tokenX.symbol}
                      <img className="small-token-icon" src={tokenX.icon} alt={tokenX.symbol} />
                    </p>
                  ) : (
                    <p className="chakra-text css-v4hq1a11">
                      <img className="small-token-icon" src={tokenX.icon} alt={tokenX.symbol} />
                      1 {tokenX.symbol} ≈ {exchangeRate.toFixed(6)} {tokenY.symbol}
                      <img className="small-token-icon" src={tokenY.icon} alt={tokenY.symbol} />
                    </p>
                  )}
                  <button className="swap-rate-button11" onClick={handleSwapRate}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                      <polyline points="17 1 21 5 17 9"></polyline>
                      <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                      <polyline points="7 23 3 19 7 15"></polyline>
                      <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="info-section11">
                <div className="info-row11">
                  <p className="chakra-text css-1k06fd211">Slippage Tolerance</p>
                  <p className="chakra-text css-dfqnbt11">{slippage}%</p>
                </div>
                <div className="info-row11">
                  <p className="chakra-text css-1k06fd211">Minimum Received</p>
                  <p className="chakra-text css-dfqnbt11">{minAmountOut} {tokenY.symbol}</p>
                </div>
                <div className="info-row11">
                  <p className="chakra-text css-1k06fd211">Price Difference <span className="info-icon">ⓘ</span></p>
                  <p className="chakra-text css-dfqnbt11 price-diff-value">{priceDifference}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="warning-accept-row">
            <div className="warning-message">
              <span className="warning-icon">⚠️</span>
              <p className="chakra-text css-1k06fd211">Price updated</p>
            </div>
            <button type="button" className="chakra-button css-1tn2n5q11" onClick={onConfirm}>
              Accept
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SwapPreview;