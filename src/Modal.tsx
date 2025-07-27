import React from 'react';
import './Modal.css';

interface ModalProps {
  txHash?: string;
  errorMessage?: string;
  decreasedToken?: { address: string; symbol: string; icon: string; amount: string };
  increasedToken?: { address: string; symbol: string; icon: string; amount: string };
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ txHash, errorMessage, decreasedToken, increasedToken, onClose }) => {
  const isSuccess = !!txHash;
  const explorerLink = txHash ? `https://testnet.suivision.xyz/txblock/${txHash.split(': ').pop() || txHash}` : '';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
        <div className="message-section">
          <img 
            src="https://assets.crypto.ro/logos/sui-sui-logo.png" 
            alt="Sui Logo" 
            className="sui-logo" 
          />
          <h3>{isSuccess ? 'Transaction Submitted' : 'Transaction Failed'}</h3>
          {isSuccess ? (
            <>
              <p>
                <a href={explorerLink} target="_blank" rel="noopener noreferrer" className="explorer-link">
                  View on Blockchain Explorer
                </a>
              </p>
              <div className="token-changes">
                {decreasedToken && (
                  <div className="token-change decreased">
                    <img src={decreasedToken.icon} alt={decreasedToken.symbol} className="token-icon" />
                    <span>{`- ${decreasedToken.amount} ${decreasedToken.symbol}`}</span>
                  </div>
                )}
                {increasedToken && (
                  <div className="token-change increased">
                    <img src={increasedToken.icon} alt={increasedToken.symbol} className="token-icon" />
                    <span>{`+ ${increasedToken.amount} ${increasedToken.symbol}`}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="error">{errorMessage || 'Transaction failed, please try again later'}</p>
          )}
        </div>
        <div className="button-row">
          <button className="confirm-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;