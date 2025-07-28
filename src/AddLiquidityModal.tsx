import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration, ChartEvent, ActiveElement } from 'chart.js';
import './AddLiquidityModal.css';

// Define Pool interface directly since types file is missing
interface Pool {
  pair: string;
  token1Symbol: string;
  token2Symbol: string;
  img1: string;
  img2: string;
  feeRate: string;
  apr: string;
  tvl: string;
  volume: string;
  fees: string;
}

interface AddLiquidityModalProps {
  isOpen: boolean;
  pool: Pool;
  onClose: () => void;
}

// Register Chart.js components
Chart.register(...registerables);

const AddLiquidityModal: React.FC<AddLiquidityModalProps> = ({ pool, onClose }) => {
  const [rangeType, setRangeType] = useState('active');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [amountToken1, setAmountToken1] = useState('');
  const [amountToken2, setAmountToken2] = useState('');
  const [zapIn, setZapIn] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const currentPrice = 3.94599;
  const liquidityData = Array.from({ length: 100 }, (_, i) => ({
    price: currentPrice * (0.5 + i * 0.01),
    liquidity: Math.random() * 1000 + 500
  }));

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: liquidityData.map(d => d.price.toFixed(2)),
            datasets: [{
              label: 'Liquidity',
              data: liquidityData.map(d => d.liquidity),
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: { display: true, text: 'Price', color: '#ffffff' },
                grid: { display: false },
                ticks: { color: '#ffffff' }
              },
              y: {
                title: { display: true, text: 'Liquidity', color: '#ffffff' },
                grid: { color: '#333' },
                ticks: { color: '#ffffff' }
              }
            },
            plugins: {
              annotation: {
                annotations: {
                  currentPriceLine: {
                    type: 'line',
                    xMin: currentPrice.toFixed(2),
                    xMax: currentPrice.toFixed(2),
                    yMin: 0,
                    yMax: Math.max(...liquidityData.map(d => d.liquidity)) * 1.1,
                    borderColor: '#ff0000',
                    borderWidth: 2,
                    label: {
                      content: 'Current Price',
                      display: true,
                      position: 'top',
                      color: '#ff0000',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)'
                    }
                  },
                  minPriceLine: {
                    type: 'line',
                    xMin: minPrice || (currentPrice * 0.9).toFixed(2),
                    xMax: minPrice || (currentPrice * 0.9).toFixed(2),
                    yMin: 0,
                    yMax: Math.max(...liquidityData.map(d => d.liquidity)) * 1.1,
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    label: {
                      content: 'Min Price',
                      display: true,
                      position: 'top',
                      color: '#ffffff',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)'
                    }
                  },
                  maxPriceLine: {
                    type: 'line',
                    xMin: maxPrice || (currentPrice * 1.1).toFixed(2),
                    xMax: maxPrice || (currentPrice * 1.1).toFixed(2),
                    yMin: 0,
                    yMax: Math.max(...liquidityData.map(d => d.liquidity)) * 1.1,
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    label: {
                      content: 'Max Price',
                      display: true,
                      position: 'top',
                      color: '#ffffff',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)'
                    }
                  }
                }
              }
            },
            onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
              if ('offsetX' in event && typeof event.offsetX === 'number' && chart.scales.x) {
                const xValue = chart.scales.x.getValueForPixel(event.offsetX);
                if (typeof xValue === 'number') {
                  const minPriceNum = parseFloat(minPrice) || currentPrice * 0.9;
                  const maxPriceNum = parseFloat(maxPrice) || currentPrice * 1.1;
                  const diffToMin = Math.abs(xValue - minPriceNum);
                  const diffToMax = Math.abs(xValue - maxPriceNum);
                  
                  if (diffToMin < diffToMax) {
                    setMinPrice(xValue.toFixed(6));
                    setRangeType('custom');
                  } else {
                    setMaxPrice(xValue.toFixed(6));
                    setRangeType('custom');
                  }
                }
              }
            }
          }
        } as unknown as ChartConfiguration);
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [minPrice, maxPrice, currentPrice]);

  const setPredefinedRange = (type: string) => {
    setRangeType(type);
    if (type === 'active') {
      setMinPrice((currentPrice * 0.9).toFixed(6));
      setMaxPrice((currentPrice * 1.1).toFixed(6));
    } else if (type === 'conservative') {
      setMinPrice((currentPrice * 0.8).toFixed(6));
      setMaxPrice((currentPrice * 1.2).toFixed(6));
    } else if (type === 'full') {
      setMinPrice('0');
      setMaxPrice('Infinity');
    } else {
      setMinPrice('');
      setMaxPrice('');
    }
  };

  const connectWallet = () => {
    setIsWalletConnected(true);
  };

  const handleAddLiquidity = () => {
    if (!amountToken1 || !amountToken2) {
      alert('Please enter deposit amounts');
      return;
    }
    console.log(`Adding liquidity to ${pool.pair}: ${amountToken1} ${pool.token1Symbol}, ${amountToken2} ${pool.token2Symbol}`);
    console.log(`Price range: ${minPrice} - ${maxPrice}`);
    console.log(`Zap In: ${zapIn}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Liquidity to {pool.pair}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="left-column">
            <div className="token-pair">
              <div className="token-images">
                <img src={pool.img1} alt={pool.token1Symbol} className="token-logo" />
                <img src={pool.img2} alt={pool.token2Symbol} className="token-logo" />
              </div>
              <span className="token-pair-text">{pool.token1Symbol} / {pool.token2Symbol}</span>
              <span className="fee-rate">{pool.feeRate}</span>
            </div>
            <div className="pool-stats">
              <div>Pool APR: <span className="highlight">{pool.apr}</span></div>
              <div>TVL: <span className="highlight">{pool.tvl}</span></div>
              <div>Volume (24H): <span className="highlight">{pool.volume}</span></div>
              <div>Fees (24H): <span className="highlight">{pool.fees}</span></div>
            </div>
            <div className="deposit-section">
              <h3>Deposit Amounts</h3>
              <div className="deposit-input">
                <input
                  type="number"
                  value={amountToken1}
                  onChange={(e) => setAmountToken1(e.target.value)}
                  placeholder={`0.0 ${pool.token1Symbol}`}
                  disabled={zapIn}
                  className="deposit-input-field"
                />
                <img src={pool.img1} alt={pool.token1Symbol} className="token-logo-small" />
              </div>
              <div className="deposit-input">
                <input
                  type="number"
                  value={amountToken2}
                  onChange={(e) => setAmountToken2(e.target.value)}
                  placeholder={`0.0 ${pool.token2Symbol}`}
                  className="deposit-input-field"
                />
                <img src={pool.img2} alt={pool.token2Symbol} className="token-logo-small" />
              </div>
              <label className="zap-in-toggle">
                <input type="checkbox" checked={zapIn} onChange={() => setZapIn(!zapIn)} />
                <span>Zap In</span>
              </label>
            </div>
            <div className="action-button">
              {isWalletConnected ? (
                <button onClick={handleAddLiquidity} className="add-liquidity-btn">Add Liquidity</button>
              ) : (
                <button onClick={connectWallet} className="connect-wallet-btn">Connect Wallet</button>
              )}
            </div>
          </div>
          <div className="right-column">
            <div className="liquidity-chart-section">
              <h3>Liquidity Distribution</h3>
              <div className="chart-container">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
            <div className="price-range-section">
              <h3>Select Price Range</h3>
              <div className="current-price">
                Current Price: {currentPrice} {pool.token2Symbol} per {pool.token1Symbol}
              </div>
              <div className="range-buttons">
                <button onClick={() => setPredefinedRange('active')} className={rangeType === 'active' ? 'active' : ''}>Active</button>
                <button onClick={() => setPredefinedRange('conservative')} className={rangeType === 'conservative' ? 'active' : ''}>Conservative</button>
                <button onClick={() => setPredefinedRange('full')} className={rangeType === 'full' ? 'active' : ''}>Full Range</button>
                <button onClick={() => setPredefinedRange('custom')} className={rangeType === 'custom' ? 'active' : ''}>Custom</button>
              </div>
              {rangeType === 'custom' && (
                <div className="custom-range">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min Price"
                    className="price-input"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max Price"
                    className="price-input"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLiquidityModal;