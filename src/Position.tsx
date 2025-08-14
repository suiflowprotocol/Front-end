import { useState } from "react";
import "./Position.css";

interface PositionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleAddLiquidity: (pool: any, scroll?: boolean) => void;
}

function Position({ activeTab, setActiveTab, handleAddLiquidity }: PositionProps) {
  const [positions] = useState([]); // Empty state for no positions

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