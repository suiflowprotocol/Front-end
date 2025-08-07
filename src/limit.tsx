import React, { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";
import TokenModal, { tokens } from "./TokenModal"; // 假设TokenModal已定义
import "./limit.css";

const LimitOrderPage: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const [showTokenModal, setShowTokenModal] = useState<string | null>(null);
  const [tokenX, setTokenX] = useState("0x2::sui::SUI");
  const [tokenY, setTokenY] = useState("0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f::usdc::USDC");

  // 选择代币的函数
  const selectToken = (token: any, type: string) => {
    if (type === "tokenX") {
      setTokenX(token.address);
    } else {
      setTokenY(token.address);
    }
    setShowTokenModal(null);
  };

  // 获取代币信息
  const getTokenInfo = (address: string) => {
    return tokens.find((token) => token.address === address) || tokens[0];
  };

  return (
    <div className="container">
      {/* 页眉，与Swap页面一致 */}
      <div className="header">
        <div className="header-top">
          <div className="logo-container">
            <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image" />
            <span className="logo-text">Seal</span>
          </div>
          <div className="nav-menu">
            <div className="nav-item">
              <Link to="/" className="nav-text">Trade</Link>
            </div>
            <div className="nav-item">
              <Link to="/pool" className="nav-text">Earn</Link>
            </div>
            <div className="nav-item">
              <span className="nav-text">Bridge</span>
            </div>
            <div className="nav-item">
              <span className="nav-text">More</span>
            </div>
          </div>
          <div className="wallet-actions">
            {currentAccount ? (
              <button className="wallet-button connected">
                <img src="https://assets.crypto.ro/logos/sui-sui-logo.png" alt="Wallet Logo" />
                {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </button>
            ) : (
              <button className="wallet-button">Connect Wallet</button>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="main-content">
        <div className="limit-panel">
          <div className="limit-header">
            <h2 className="limit-title">Limit Order</h2>
          </div>
          <div className="limit-content">
            <div className="chakra-stack css-ec25x4">
              {/* 选项卡 */}
              <div className="chakra-stack css-18fuz0p">
                <div className="chakra-stack css-5kt1vw">
                  <div className="chakra-stack css-1jjq5p5">
                    <div className="css-1rwgceg">
                      <div data-active="false" className="css-1grrz5v">
                        <p className="chakra-text css-1gjz30r" data-active="false">Swap</p>
                      </div>
                      <div data-active="true" className="css-1grrz5v">
                        <p className="chakra-text css-zxnh2z" data-active="true">Limit</p>
                      </div>
                      <div data-active="false" className="css-1grrz5v">
                        <p className="chakra-text css-1gjz30r" data-active="false">DCA</p>
                      </div>
                    </div>
                    <div className="chakra-stack css-rcj3dj">
                      <div className="css-gmuwbf">
                        <img src="/images/icon_lpro.png" className="chakra-image css-1i8jrez" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chakra-stack css-jkw8y9">
                  <button className="css-0">
                    <div className="css-gmuwbf">
                      <div className="css-951vyv">
                        <div className="css-1ke24j5">
                          <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                            <use xlinkHref="#icon-icon_kline"></use>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                  <button className="css-0">
                    <div className="css-gmuwbf">
                      <div className="css-951vyv">
                        <div className="css-1ke24j5">
                          <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                            <use xlinkHref="#icon-icon_order"></use>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 输入区域 */}
              <div className="chakra-stack css-ny024p">
                {/* You Pay */}
                <div className="css-8mpdcp">
                  <div className="chakra-stack css-1jjq5p5">
                    <p className="chakra-text css-1pm9ap2">You Pay</p>
                    <div className="chakra-stack css-4x3d3d"></div>
                  </div>
                  <div className="chakra-stack css-4qje1j">
                    <div className="chakra-input__group css-3z5rg1" data-group="true">
                      <div className="chakra-skeleton css-5xlugw">
                        <input placeholder="0.0" type="text" value="" inputMode="numeric" className="swap-input" />
                      </div>
                      <div className="chakra-input__right-addon css-1z0iubp">
                        <button type="button" className="chakra-button css-159ddi2" onClick={() => setShowTokenModal("tokenX")}>
                          <div className="css-1l3sdz4">
                            <div className="css-kjafn5">
                              <div className="css-1bfl2d">
                                <img className="chakra-image css-rmmdki" src="https://circle.com/usdc-icon" decoding="async" />
                              </div>
                            </div>
                          </div>
                          <p className="chakra-text css-swxx46">USDC</p>
                          <div className="css-3dpqkv">
                            <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="12px" height="12px">
                              <use xlinkHref="#icon-icon_arrow"></use>
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="chakra-stack css-rf2r47">
                      <p className="chakra-text css-1pzobe8"></p>
                      <div className="chakra-stack css-1sj51x8">
                        <div className="chakra-skeleton css-cdkrf0">
                          <div className="chakra-stack css-1mlvmbj">
                            <div className="css-1fk5yts">
                              <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                                <use xlinkHref="#icon-icon_wallet"></use>
                              </svg>
                            </div>
                            <p className="chakra-text css-1prvpli">0.0</p>
                          </div>
                        </div>
                        <button type="button" className="chakra-button css-1gwhxmg">HALF</button>
                        <button type="button" className="chakra-button css-1gwhxmg">MAX</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* You Receive */}
                <div className="css-8mpdcp">
                  <div className="chakra-stack css-1jjq5p5">
                    <p className="chakra-text css-1pm9ap2">You Receive</p>
                    <div className="chakra-stack css-4x3d3d"></div>
                  </div>
                  <div className="chakra-stack css-4qje1j">
                    <div className="chakra-input__group css-3z5rg1" data-group="true">
                      <div className="chakra-skeleton css-5xlugw">
                        <input placeholder="0.0" type="text" value="" inputMode="numeric" className="swap-input" />
                      </div>
                      <div className="chakra-input__right-addon css-1z0iubp">
                        <button type="button" className="chakra-button css-159ddi2" onClick={() => setShowTokenModal("tokenY")}>
                          <div className="css-1l3sdz4">
                            <div className="css-kjafn5">
                              <div className="css-1bfl2d">
                                <img className="chakra-image css-rmmdki" src="https://archive.cetus.zone/assets/image/sui/sui.png" decoding="async" />
                              </div>
                            </div>
                          </div>
                          <p className="chakra-text css-swxx46">SUI</p>
                          <div className="css-3dpqkv">
                            <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="12px" height="12px">
                              <use xlinkHref="#icon-icon_arrow"></use>
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="chakra-stack css-rf2r47">
                      <p className="chakra-text css-1pzobe8"></p>
                      <div className="chakra-stack css-1sj51x8">
                        <div className="chakra-skeleton css-cdkrf0">
                          <div className="chakra-stack css-1mlvmbj">
                            <div className="css-1fk5yts">
                              <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                                <use xlinkHref="#icon-icon_wallet"></use>
                              </svg>
                            </div>
                            <p className="chakra-text css-1prvpli">0.137574</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 交易图标 */}
                <div className="css-aqzf4q">
                  <div className="css-17fsxoc">
                    <svg aria-hidden="true" fill="var(--chakra-colors-text_caption)" width="12px" height="12px">
                      <use xlinkHref="#icon-a-icon_trade"></use>
                    </svg>
                  </div>
                </div>
              </div>

              {/* 限价和到期设置 */}
              <div className="chakra-stack css-n43gto">
                <div className="css-ozck8r">
                  <div className="chakra-stack css-19ctck2">
                    <div className="chakra-stack css-1jjq5p5">
                      <div className="chakra-stack css-1igwmid">
                        <p className="chakra-text css-6kyjl2">Buy SUI at rate</p>
                      </div>
                      <button type="button" className="chakra-button css-ozvovq">Market</button>
                    </div>
                    <div className="chakra-stack css-1jjq5p5">
                      <input placeholder="0.0" type="text" value="3.7463" inputMode="numeric" className="swap-input" />
                      <div className="chakra-stack css-1mlvmbj">
                        <p className="chakra-text css-j2a1iu">USDC</p>
                        <div className="css-1ke24j5">
                          <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                            <use xlinkHref="#icon-icon_swap1"></use>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button type="button" className="chakra-button css-kz9308" disabled>Enter an amount</button>
          </div>
        </div>
      </div>

      {/* 代币选择模态框 */}
      {showTokenModal && (
        <TokenModal
                  showTokenModal={showTokenModal}
                  setShowTokenModal={setShowTokenModal}
                  tokens={tokens}
                  selectToken={selectToken} importedTokens={[]} activeList={""} setActiveList={function (value: React.SetStateAction<string>): void {
                      throw new Error("Function not implemented.");
                  } } importAddress={""} setImportAddress={function (value: React.SetStateAction<string>): void {
                      throw new Error("Function not implemented.");
                  } } importError={""} setImportError={function (value: React.SetStateAction<string>): void {
                      throw new Error("Function not implemented.");
                  } } searchQuery={""} setSearchQuery={function (value: React.SetStateAction<string>): void {
                      throw new Error("Function not implemented.");
                  } } balances={{}} importToken={function (): Promise<void> {
                      throw new Error("Function not implemented.");
                  } }        />
      )}
    </div>
  );
};

export default LimitOrderPage;