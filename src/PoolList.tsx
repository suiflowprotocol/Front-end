import { useState } from "react";
import CreatePool from "./CreatePool";
import AddLiquidityModal from "./AddLiquidityModal";
import "./Pool.css";
import { PoolListProps } from "./Pool.tsx";
import React from "react";

function PoolList({
  pools,
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
}: PoolListProps & { isLoading: boolean }) {
  const [activeFilter, setActiveFilter] = useState('incentivized');

  // Filter pools based on activeFilter
  const filteredPools = pools; // Placeholder, add logic based on filter if data available

  // Fallback image URL
  const fallbackImage = "https://via.placeholder.com/20";

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImage;
  };

  function refresh(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      
      <div className="filter-row100">
        <button className={`filter-button100 ${activeFilter === 'stables' ? 'active' : ''}`} onClick={() => setActiveFilter('stables')}>Stables</button>
        <button className={`filter-button100 ${activeFilter === 'auto' ? 'active' : ''}`} onClick={() => setActiveFilter('auto')}>Auto</button>
        <button className={`filter-button100 ${activeFilter === 'incentivized' ? 'active' : ''}`} onClick={() => setActiveFilter('incentivized')}>Incentivized</button>
        <button className={`filter-button100 ${activeFilter === 'verified' ? 'active' : ''}`} onClick={() => setActiveFilter('verified')}>Verified</button>
        <button className={`filter-button100 ${activeFilter === 'btcfi' ? 'active' : ''}`} onClick={() => setActiveFilter('btcfi')}>BTCFI</button>
        <div className="filter-container100">
          <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
            <use xlinkHref="#icon-icon_search"></use>
          </svg>
          <input
            type="text"
            placeholder="Search"
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
      {isLoading ? (
        <div className="loading-state100">Loading pools...</div>
      ) : (
        <div className="pool-table-header100">
          <div>#</div>
          <div>Pools</div>
          <div>TVL</div>
          <div>24h Volume</div>
          <div>24h Fees</div>
          <div>24h APR</div>
          <div>Actions</div>
        </div>
      )}
      <div className="pool-list100">
        {isLoading ? null : filteredPools.length === 0 ? (
          <div className="no-positions100">No positions found</div>
        ) : (
          filteredPools.map((pool, index) => (
            <div
              key={pool.poolAddress}
              className="pool-item100"
            >
              <div>{index + 1}</div>
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
                {pool.tvl}
              </div>
              <div className="pool-data100">
                {pool.volume}
              </div>
              <div className="pool-data100">
                {pool.fees}
              </div>
              <div className="apr-container100">
                <span className="apr-text100">{pool.apr}</span>
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
          getTokenAddress={getTokenAddress}
          refresh={refresh}
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

export default React.memo(PoolList);