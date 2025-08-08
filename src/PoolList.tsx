import { useState, useEffect, Dispatch, SetStateAction } from "react";
import CreatePool from "./CreatePool";
import AddLiquidityModal from "./AddLiquidityModal";
import { useNavigate } from "react-router-dom";
import "./Pool.css";
import { PoolListProps } from "./Pool.tsx";

function PoolList({
  pools,
  activeTab,
  setActiveTab,
  isCreatePoolOpen,
  handleCreatePool,
  handleCloseCreatePool,
  isAddLiquidityOpen,
  selectedPool,
  handleAddLiquidity,
  handleCloseAddLiquidityModal,
  newPoolToken1,
  newPoolToken2,
  feeRate,
  setNewPoolToken1,
  setNewPoolToken2,
  setFeeRate,
  getTokenAddress,
}: PoolListProps) {
  const navigate = useNavigate();
  const [incentivizedOnly, setIncentivizedOnly] = useState(false);
  const [allPools, setAllPools] = useState(true);

  return (
    <>
      <div className="pool-header">
        <div className="tab-group">
          <button
            className={`tab-button ${activeTab === "pools" ? "active" : ""}`}
            onClick={() => setActiveTab("pools")}
          >
            Pools
          </button>
          <button
            className={`tab-button ${activeTab === "positions" ? "active" : ""}`}
            onClick={() => setActiveTab("positions")}
          >
            Positions
          </button>
        </div>
        <div className="button-group" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', border: 'none', boxShadow: 'none' }}>
          <button
            type="button"
            className="action-button create-pool-button"
            style={{
              maxWidth: '200px',
              height: '40px',
              padding: '10px 16px',
              background: 'linear-gradient(90deg, #007BFF 0%, #00B7FF 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.3s, transform 0.2s, box-shadow 0.2s',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            }}
            onClick={handleCreatePool}
          >
            Create New Pool
          </button>
          <button
            type="button"
            className="action-button add-liquidity-button"
            style={{
              maxWidth: '200px',
              height: '40px',
              padding: '10px 16px',
              background: 'transparent',
              color: '#007BFF',
              border: '2px solid #007BFF',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.3s, transform 0.2s, box-shadow 0.2s',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            }}
            onClick={() => handleAddLiquidity(pools[0], true)}
          >
            Add Liquidity
          </button>
        </div>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        margin: '0 48px',
        flexWrap: 'nowrap',
        padding: '12px 0'
      }}>
        <div style={{
          flex: '1',
          display: 'flex',
          alignItems: 'center',
          maxWidth: '300px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '8px 12px',
            gap: '8px'
          }}>
            <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
              <use xlinkHref="#icon-icon_search"></use>
            </svg>
            <input
              type="text"
              placeholder="Filter by token"
              style={{
                flex: '1',
                border: 'none',
                outline: 'none',
                fontSize: '13px',
                fontWeight: '400',
                color: '#FFFFFF',
                background: 'transparent'
              }}
            />
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '8px 12px'
          }}>
            <input
              type="checkbox"
              id="watchlist"
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer'
              }}
            />
            <label
              htmlFor="watchlist"
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#FFFFFF'
              }}
            >
              Watchlist
            </label>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '8px 12px'
          }}>
            <label
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#FFFFFF'
              }}
            >
              Incentivized Only
            </label>
            <label style={{
              display: 'inline-block',
              position: 'relative',
              width: '40px',
              height: '20px'
            }}>
              <input
                type="checkbox"
                checked={incentivizedOnly}
                onChange={() => setIncentivizedOnly(!incentivizedOnly)}
                style={{
                  border: '0',
                  clip: 'rect(0, 0, 0, 0)',
                  height: '1px',
                  width: '1px',
                  margin: '-1px',
                  padding: '0',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  position: 'absolute'
                }}
              />
              <span className="chakra-switch__track">
                <span className="chakra-switch__thumb"></span>
              </span>
            </label>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '8px 12px'
          }}>
            <label
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#FFFFFF'
              }}
            >
              All pools
            </label>
            <label style={{
              display: 'inline-block',
              position: 'relative',
              width: '40px',
              height: '20px'
            }}>
              <input
                type="checkbox"
                checked={allPools}
                onChange={() => setAllPools(!allPools)}
                style={{
                  border: '0',
                  clip: 'rect(0, 0, 0, 0)',
                  height: '1px',
                  width: '1px',
                  margin: '-1px',
                  padding: '0',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  position: 'absolute'
                }}
              />
              <span className="chakra-switch__track">
                <span className="chakra-switch__thumb"></span>
              </span>
            </label>
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            background: 'var(--card-bg)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Refresh_icon.svg/2048px-Refresh_icon.svg.png"
              alt="Refresh"
              style={{ width: '20px', height: '20px' }}
            />
          </button>
        </div>
      </div>
      <div className="pool-table-header">
        <div>Pool</div>
        <div>TVL</div>
        <div>Volume (24H)</div>
        <div>Fees (24H)</div>
        <div>APR</div>
        <div>Reward</div>
        <div></div>
      </div>
      <div className="pool-list">
        {pools.length === 0 ? (
          <div className="no-positions">No positions found</div>
        ) : (
          pools.map((pool) => (
            <div
              key={pool.poolAddress}
              className="pool-item"
              onClick={() => navigate(`/pool/${pool.pair}`)}
            >
              <div className="pool-token-info">
                <div className="token-images">
                  <img src={pool.img1} alt={pool.token1Symbol} />
                  <img src={pool.img2} alt={pool.token2Symbol} />
                </div>
                <div className="token-details">
                  <div className="token-pair">
                    <p>{pool.pair}</p>
                    <span>({pool.feeRate})</span>
                  </div>
                </div>
              </div>
              <div className="pool-data">
                <span className="data-label">TVL</span>
                {pool.tvl}
              </div>
              <div className="pool-data">
                <span className="data-label">Volume (24H)</span>
                {pool.volume}
              </div>
              <div className="pool-data">
                <span className="data-label">Fees (24H)</span>
                {pool.fees}
              </div>
              <div className="apr-container">
                <span className="data-label">APR</span>
                <span className="apr-text">{pool.apr}</span>
              </div>
              <div className="reward-container">
                <span className="data-label">Reward</span>
                <div className="reward-images">
                  <img src={pool.rewardImg} alt="Reward" />
                  <img src={pool.img1} alt={pool.token1Symbol} />
                  <img src={pool.img2} alt={pool.token2Symbol} />
                </div>
              </div>
              <div className="pool-action">
                <button
                  className="deposit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddLiquidity(pool);
                  }}
                >
                  Deposit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {isCreatePoolOpen && (
        <CreatePool
          isOpen={isCreatePoolOpen}
          onClose={handleCloseCreatePool}
          newPoolToken1={newPoolToken1}
          newPoolToken2={newPoolToken2}
          feeRate={feeRate}
          setNewPoolToken1={setNewPoolToken1}
          setNewPoolToken2={setNewPoolToken2}
          setFeeRate={setFeeRate}
        />
      )}
      {isAddLiquidityOpen && selectedPool && (
        <AddLiquidityModal
          isOpen={isAddLiquidityOpen}
          onClose={handleCloseAddLiquidityModal}
          pool={selectedPool}
        />
      )}
    </>
  );
}

export default PoolList;