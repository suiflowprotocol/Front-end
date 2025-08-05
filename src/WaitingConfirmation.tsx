import React from 'react';
import './WaitingConfirmation.css';

interface WaitingConfirmationProps {
  amountIn: string;
  amountOut: string;
  tokenXSymbol: string;
  tokenYSymbol: string;
  onClose: () => void;
}

const WaitingConfirmation: React.FC<WaitingConfirmationProps> = ({
  amountIn,
  amountOut,
  tokenXSymbol,
  tokenYSymbol,
  onClose,
}) => {
  return (
    <div className="chakra-modal__container">
      <section className="chakra-modal__content css-xnqtk412" role="dialog" tabIndex={-1} aria-modal="true">
        <header className="chakra-modal__header css-10h09dx12">
          <h2 className="chakra-heading css-1cowq8v12">Waiting for Confirmation</h2>
        </header>
        <button type="button" aria-label="Close" className="chakra-modal__close-btn css-14njbx12" onClick={onClose}>
          <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi" aria-hidden="true">
            <path
              fill="currentColor"
              d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
            />
          </svg>
        </button>
        <div className="chakra-modal__body css-athbri12">
          <div className="chakra-stack css-1xgnfuh12">
            <div className="chakra-stack css-1clehp312">
              <div className="chakra-spinner css-mehe3e12">
                <span className="css-8b45rq12">Loading...</span>
              </div>
              <p className="chakra-text css-136jcmy12">
                Swapping {amountIn} {tokenXSymbol} for {amountOut} {tokenYSymbol}
              </p>
            </div>
            <p className="chakra-text css-1prvpli12">Confirm this transaction in your wallet</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WaitingConfirmation;