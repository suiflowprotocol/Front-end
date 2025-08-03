import { useState } from "react";
import "./Position.css";

interface Position {
  id: string;
  pair: string;
  liquidity: string;
  pendingYield: string;
}

interface PositionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleAddLiquidity: (pool: any, scroll?: boolean) => void;
}

function Position({ activeTab, setActiveTab, handleAddLiquidity }: PositionProps) {
  const [positions] = useState<Position[]>([]); // Empty state for no positions

  return (
    <div className="pos-container2">
      <div className="pos-summary-container2">
        <div className="pos-summary-left2">
          <h1 className="pos-summary-title2">Your Liquidity Positions</h1>
          <div className="pos-summary-metrics-card2">
            <div className="pos-metric-item2">
              <p className="pos-metric-label2">Total Liquidity</p>
              <div className="pos-chakra-skeleton2 pos-a8ku0c2">
                <p className="pos-metric-value2">$--</p>
              </div>
            </div>
            <div className="pos-metric-item2">
              <p className="pos-metric-label2">Pending Yield</p>
              <div className="pos-chakra-skeleton2 pos-cdkrf02">
                <div className="pos-chakra-stack2 pos-1igwmid2">
                  <p className="pos-metric-value2">$0</p>
                  <button type="button" className="pos-chakra-button2 pos-2h2e642" disabled>
                    Claim All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pos-summary-right2">
          <div className="pos-chart-header2">
            <p className="pos-chart-title2">Position Overview</p>
          </div>
          <div className="pos-chart-container2">
            <div className="pos-chakra-stack2 pos-dbr0lh2">
              <img
                src="/images/img_nopositions@2x.png"
                className="pos-chakra-image2 pos-f5j44i2"
                alt="No positions"
              />
              <p className="pos-chakra-text2 pos-dwkbww2">No liquidity positions</p>
            </div>
          </div>
        </div>
      </div>
      <div className="pos-header2">
        <div className="pos-tab-group2">
          <button
            className={`pos-tab-button2 ${activeTab === "pools" ? "active" : ""}`}
            onClick={() => setActiveTab("pools")}
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAwCAYAAABe6Vn9AAAAAXNSR0IArs4c6QAABW1JREFUaEPtmX9MlVUYxz+viaCJSAoxDDFBmFG6wLUcWGDNsmxhUJLxhxQ11x9ZgTgwWsvwR2JkW2urNFspOFGhtazVBENileSy1gJ/DZ0oohUqyq/xdh/ee/VygXvfc1+S5jjbu9299/k+5/me57zPOed7NG6wpt1gfBgm9H/P6HCGhjN0nUfAmyl3M/AQ8AgQAYTaHwm90f4cBb4CvgFaXThZxbsdIhVCdwP5wHzAz+TAtwF7gFV2eyv4g2b6NEMoHCgAFgMamqYTf4dGcjzETYPQCcbTk5/zxlN7GMqqofoPHV2XPnR7MBpoOgHxGkHJMC4OfENhlCQZ6GiE9ka4UAvNZdBSrcNV/DZgJdDgjpgnQpKNYiAAXx+dZQs1slIgONDMYEHxXliyATo6YYQvhC2DyVkwKtgcvuMsnNgAJzfqdLdLrC3A0/as9+vDHaEs4G1gBCkJULQUwkwGIl1tKIXlH4GuQ1AKRBWBX5g5Iq5WbSeh/hVo3in/dAM50kN/zgYiJGQKe6ZKQYZGngyKQhMy2R8agKkFcHueAtiN6fHVcGylTF+JO7s/Uv0Rkmn2ZQ+oJE9jUaJaMHt+gkfzjczcWQK3LlLDe7Ju2g6/pwkpeRa4Tj9XQlIAfu35ZgoyUM5MQxPMWAoXWgc3M64kjxfAsdfkrXxTM50LhSuhz4Fner6Z0tc9jVXf/9PXwta9xjczo1Qdr4I4lOr4prYC6Q6oMyFZZ2rx9YHDn2hKBUC8HTwCsS8a1Wz2Ye8LgFlSUihqpkn1E0ScRCA/nAntBpLJeQrWZZp1e81u4RtQ9gOE50DkOnW8N4gjK6BBCjES+xPOhGQ7cg5N8+VMiWZ6nXEE0XoFJqRCexfMOWN+nfGGhDNG1qmqEFl8JU0TZZvlyJCw20lCDFQVqXezaz+kvAkBCTCrSh1vBXFgDrTsFw8pwC4HoY+B5yh8AbJS1d1nvgObvobIQgiXJew6toZCOLJcOtwEZDoIVQCJVKyHRKmCii0pGyoPQWwFBCquW4pd9TH/uxJ+SZLXlUCSg1AdEEXdZoi6Tb2L6AyoPwWz62BMlDreCuJyPdREi4d6274z2kHoom2rM5aL5TB2tLp7bZ46pj/E3G7QPO2XXYBdl2Cfv7y8ZNsK+fcmdKEM/MeoBzdmAVzpUMc5IzQfmOuFj66LsG9cH0LWppwVKkcbIXIJ+E2FeDnoKrYBppy1oqAYQy/zb2thXi4EPgCx36l7GqAoWCvb6mFcQ2zcDS9/AKHPw3T7kUPF3wBl29rCqhKAq+39WfD9bxBTDCFp6p4GWFitbX3UwzAQp8/DpMWg+cJ95+AmCUOhudn6iBdrm1OFOK6a5m+Bt7ZBcCrctUPdg5vNqTizdnxQDefEWYh+Fto6YNaPEHCPmgcTxwdxaO2ApxLSk6ugtApC0iHmMxWkYWvigCdm1o7gZsNaWwK5m41v5t4/wU9xu6VwBJeQrIkknkhtr4S01cbZckY5BD3mCdH7f0WRxAG2JmMNFOKaYli5xVCEpr0Lk5epkfFSxnIm5b3Q6BzqqXPw0vuwq9rITMQamLLCPJlBEBodnVmTgpv/gfU74L0ynfZOrUdAmf4phJjU6gZZCnaQ8izWTwkx9OvTfxli/c918EWNIdZ3dzvEemNnr43UCXxQY+J88I+D0REwcjzoXU5i/QFoLv9PxHrnaSHrlIh1D/e5TkmaCRWiT/Zpom6eBl61i4G59qLjY3K+OV/HDNp1imvf/V1YSRZH2a47Om1C+mWgybZQl9u157MuDm6xaWiP2y7DZgOxwCRgPNBl8sLM7VgoHg9NjusQmg0TGsLBN9X1cIZMDdMQGg1naAgH31TX/wKFcsNAOFcQtQAAAABJRU5ErkJggg=="
              className="pos-chakra-image2 pos-1or3okw2"
            />
            <p className="pos-chakra-text2">Pools</p>
          </button>
          <button
            className={`pos-tab-button2 ${activeTab === "positions" ? "active" : ""}`}
            onClick={() => setActiveTab("positions")}
          >
            <img
              src="data:image/png;base64,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"
              className="pos-chakra-image2 pos-1or3okw2"
            />
            <p className="pos-chakra-text2">Positions</p>
            <div className="pos-position-count2">0</div>
          </button>
        </div>
        <div className="pos-button-group2">
          <button className="pos-action-button2 pos-create-pool-button2">LP Burn</button>
          <button
            className="pos-action-button2 pos-add-liquidity-button2"
            onClick={() => handleAddLiquidity(null, true)}
          >
            Add Liquidity
          </button>
        </div>
      </div>
      <div className="pos-filter-row2">
        <div className="pos-filter-container2">
          <button className="pos-filter-button2">
            <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
              <use xlinkHref="#icon-icon_search"></use>
            </svg>
            <p>Filter by token</p>
          </button>
        </div>
        <div className="pos-filter-container2">
          <button className="pos-refresh-button2">
            <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
              <use xlinkHref="#icon-icon_refresh"></use>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Position;