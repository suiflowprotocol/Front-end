// PoolList.tsx
import { useState } from "react";
import CreatePool from "./CreatePool";
import AddLiquidityModal from "./AddLiquidityModal";
import "./Pool.css";
import { PoolListProps } from "./Pool";
import React from "react";

function PoolList({
  pools,
  prices,
  isLoading,
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
  refresh,
}: PoolListProps) {
  const [activeFilter, setActiveFilter] = useState('incentivized');

  // Filter pools based on activeFilter
  const filteredPools = pools; // Placeholder, add logic based on filter if data available

  // Fallback image URL
  const fallbackImage = "https://via.placeholder.com/20";

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImage;
  };

  return (
    <>
      
      
      {isLoading ? (
        <div className="loading-state100">Loading pools...</div>
      ) : (
        <div className="pool-table-header100">
          <div>Pools</div>
          <div>Liquidity</div>
          <div>Volume (24H)</div>
          <div>Fees (24H)</div>
          <div>Rewards</div>
          <div>APR</div>
          <div>Actions</div>
        </div>
      )}
      <div className="pool-list100">
        {isLoading ? null : filteredPools.length === 0 ? (
          <div className="no-positions100">No positions found</div>
        ) : (
          filteredPools.map((pool, index) => {
            const price1 = prices[pool.token1Symbol.toLowerCase()] || 1;
            const price2 = prices[pool.token2Symbol.toLowerCase()] || 1;
            const reserveXDecimal = Number(pool.reserveX) / 10 ** pool.decimals1;
            const reserveYDecimal = Number(pool.reserveY) / 10 ** pool.decimals2;
            const tvlNumber = reserveXDecimal * price1 + reserveYDecimal * price2;
            const tvlFormatted = `$${tvlNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            const volumeNumber = Number(pool.volume24h) / 10 ** pool.decimals1 * price1;
            const volumeFormatted = `$${volumeNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            const feesNumber = Number(pool.fees24h) / 10 ** pool.decimals1 * price1;
            const feesFormatted = `$${feesNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            const aprNumber = Number(pool.reserveX) > 0 ? (Number(pool.fees24h) * 36500 / Number(pool.reserveX)) : 0;
            const aprFormatted = `${aprNumber.toFixed(2)}%`;

            return (
              <div
                key={pool.poolAddress}
                className="pool-item100"
              >
                <div className="pool-token-info100">
                  <div className="token-images100" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <img
                      src={pool.img1}
                      alt={pool.token1Symbol}
                      style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                      onError={handleImageError}
                    />
                    <img
                      src={pool.img2}
                      alt={pool.token2Symbol}
                      style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                      onError={handleImageError}
                    />
                  </div>
                  <div className="token-details100">
                    <div className="token-pair100">
                      <p>{pool.pair}</p>
                      <span>({pool.feeRate})</span>
                    </div>
                  </div>
                </div>
                <div className="pool-data100">
                  {tvlFormatted}
                </div>
                <div className="pool-data100">
                  {volumeFormatted}
                </div>
                <div className="pool-data100">
                  {feesFormatted}
                </div>
                <div className="reward-container100">
                  <div className="reward-images100">
                    <img src={pool.rewardImg} alt="Reward" />
                  </div>
                </div>
                <div className="apr-container100">
                  <span className="apr-text100">{aprFormatted} ○</span>
                </div>
                <div className="pool-action100">
                  <button
                    className="deposit-button100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddLiquidity(pool);
                    }}
                  >
                    Deposit
                  </button>
                </div>
              </div>
            );
          })
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
          getTokenAddress={getTokenAddress}
          refresh={refresh}
        />
      )}
      {isAddLiquidityOpen && selectedPool}
    </>
  );
}

export default React.memo(PoolList);