import React from 'react';
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
  const exchangeRate = parseFloat(amountOut) / parseFloat(amountIn) || 0;

  return (
    <section className="chakra-modal__content css-xnqtk4" role="dialog" tabIndex={-1} aria-modal="true">
      <header className="chakra-modal__header css-10h09dx">
        <h2 className="chakra-heading css-1cowq8v">Swap</h2>
      </header>
      <button type="button" aria-label="Close" className="chakra-modal__close-btn css-14njbx" onClick={onClose}>
        <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon css-onkibi" aria-hidden="true">
          <path
            fill="currentColor"
            d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
          />
        </svg>
      </button>
      <div className="chakra-modal__body css-hgczei">
        <div className="chakra-stack css-1veteyv">
          <div className="chakra-stack css-1xgnfuh">
            <div className="chakra-stack css-9wtx3r">
              <div className="chakra-stack css-h5j056">
                <div className="chakra-stack css-1jjq5p5">
                  <div className="chakra-stack css-19lo8rc">
                    <div className="chakra-stack css-2aixpv">
                      <p className="chakra-text css-1dis6eq">{amountIn}</p>
                    </div>
                    <p className="chakra-text css-18eiei2">{tokenX.symbol}</p>
                  </div>
                  <div className="chakra-stack css-1g49xc">
                    <div className="css-kjafn5">
                      <div className="css-1s8ou6k">
                        <img className="chakra-image css-rmmdki" src={tokenX.icon} decoding="async" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr aria-orientation="horizontal" className="chakra-divider css-1w0qemm" />
              <div className="chakra-stack css-h5j056">
                <div className="chakra-stack css-1jjq5p5">
                  <div className="chakra-stack css-19lo8rc">
                    <div className="chakra-stack css-2aixpv">
                      <p className="chakra-text css-1dis6eq">{amountOut}</p>
                    </div>
                    <p className="chakra-text css-18eiei2">{tokenY.symbol}</p>
                  </div>
                  <div className="chakra-stack css-1g49xc">
                    <div className="css-kjafn5">
                      <div className="css-1s8ou6k">
                        <img className="chakra-image css-rmmdki" src={tokenY.icon} decoding="async" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="css-14hn8e">
                <div className="css-1smttaj">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_caption)" width="12px" height="12px">
                    <use xlinkHref="#icon-a-icon_trade" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="chakra-stack css-g4ufl5">
              <div className="css-gmuwbf">
                <div className="css-1txlnq4">
                  <div className="css-urzsqz">
                    <div className="css-12z0wuy">
                      <div className="css-kjafn5">
                        <div className="css-3l2vxh">
                          <img className="chakra-image css-rmmdki" src={tokenX.icon} decoding="async" />
                        </div>
                      </div>
                    </div>
                    <div className="chakra-stack css-1igwmid">
                      <p className="chakra-text css-v4hq1a">1</p>
                      <p className="chakra-text css-v4hq1a">{tokenX.symbol}</p>
                    </div>
                    <p className="chakra-text css-3c533j">&nbsp;≈&nbsp;</p>
                  </div>
                  <div className="css-759u60">
                    <p className="chakra-text css-1us4ioa">{exchangeRate.toFixed(6)}</p>
                    <p className="chakra-text css-wiq74l">{tokenY.symbol}</p>
                    <div className="css-qbrse1">
                      <div className="css-kjafn5">
                        <div className="css-3l2vxh">
                          <img className="chakra-image css-rmmdki" src={tokenY.icon} decoding="async" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="css-1qh2nrm">
                  <div className="css-1ke24j5">
                    <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="16px" height="16px">
                      <use xlinkHref="#icon-icon_swap1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="chakra-stack css-mzuswq">
              <div className="chakra-stack css-1qjyqx0">
                <p className="chakra-text css-1k06fd2">Slippage Tolerance</p>
              </div>
              <div className="chakra-stack css-1gkzamg">
                <p className="chakra-text css-dfqnbt">{slippage}%</p>
              </div>
            </div>
            <div className="chakra-stack css-mzuswq">
              <div className="chakra-stack css-1qjyqx0">
                <p className="chakra-text css-1k06fd2">Minimum Received</p>
              </div>
              <div className="chakra-stack css-1gkzamg">
                <p className="chakra-text css-dfqnbt">{minAmountOut} {tokenY.symbol}</p>
              </div>
            </div>
            <div className="chakra-stack css-mh0esh">
              <div className="chakra-stack css-bzhmyh">
                <p className="chakra-text css-1havq56">Price Difference</p>
                <button className="css-0">
                  <div className="css-gmuwbf">
                    <div className="css-1ke24j5">
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                        <use xlinkHref="#icon-icon_tips" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
              <div className="chakra-skeleton css-5thc8w">
                <div className="chakra-stack css-1414k4v">
                  <p className="chakra-text css-1dtrlpp">{priceDifference}% better than</p>
                  <div className="css-6su6fj">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAk1BMVEUAAADn2v/m2//r2//v4//n2v/55P/n2v/o3P//+P/m2v/n2f/n2v/n2v/n2v/n2v/n2v/o2//p2//n3f/o3v/n2f/n2v/n2v/n2v/n2v/n2//o2v/q3f/r4f/u3f/n2v/o2v/n2//p3P/o3P/m2v/n2v/n2f/n2v/o2f/n2//r3f/t3P/n2v/m2v/o2v/r3v/m2f/tUDLHAAAAMHRSTlMAl5oyFNMJqSwFhvvr5d7Yr2FGNSD0zb2lkIltOhkOxoJoT0D48aJzWFYlHeB8Wief0nHAAAABSElEQVQ4y52Q53LCMBCEZWK5g0swBpveQknZ93+6rFxAHkSYyf6x9+67JqHLKxOZRzJJbWHStkCn0Fo8pG0XuvJv0dciBjVZb+dZeoxABb38MlbpXeucr5z2QwdUf8vX1h0ByLT9aAeCGlez4Ozw5zoE4nvFBJB0yymUhqp0B2DT5ec0O+YlWlUMJsCqAwJA8jNV1W4RAnuvqepeYwWsOR/AkfM9ji8YjYBTC3wCZyEq1jvKnoCQP8X90j0wF2IGuM2jArjUE8sWAPAmxACwavtDf623XJsBtoqa2zcm4MI8Ag7iNZkBeAcVc8cUOPhPgJjP4I/UzkYgKtWxpQqaAGfMvvUATIUBaOQHAEb2M2CZcj4OnrhJasDYXYVQ9Vpe2LJ/BeWyf4/oAXlC25e9uI0IqswRJulX/BOwXgG2JPCCIPA3sXmM/QK1PTc8LGCPoAAAAABJRU5ErkJggg=="
                      className="chakra-image css-f81823"
                    />
                  </div>
                  <div className="css-6su6fj">
                    <img
                      src="data:image/png;base64,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"
                      className="chakra-image css-f81823"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type="button" className="chakra-button css-1tn2n5q" onClick={onConfirm}>
          Confirm Swap
        </button>
      </div>
    </section>
  );
};

export default SwapPreview;