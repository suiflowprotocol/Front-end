import { useState, useEffect } from "react";
import { ConnectButton, useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Link, Route, Routes } from "react-router-dom";
import Pool from "./Pool";
import TokenModal, { tokens } from "./TokenModal";
import "./App.css";

function App() {
  const [showTokenModal, setShowTokenModal] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeList, setActiveList] = useState("Default");
  const [importedTokens, setImportedTokens] = useState<any[]>([]);
  const [importAddress, setImportAddress] = useState("");
  const [importError, setImportError] = useState("");
  const [showSlippageModal, setShowSlippageModal] = useState(false);
  const [customSlippage, setCustomSlippage] = useState("");
  const [expiration, setExpiration] = useState("1 Day");
  const [searchQuery, setSearchQuery] = useState("");
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [tokenX, setTokenX] = useState("0x2::sui::SUI");
  const [tokenY, setTokenY] = useState("0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f::usdc::USDC");
  const [amountIn, setAmountIn] = useState("");
  const [minAmountOut, setMinAmountOut] = useState("0");
  const [slippage, setSlippage] = useState("0.5");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [poolId, setPoolId] = useState("");
  const [isReverseSwap, setIsReverseSwap] = useState(false);
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [expectedOutput, setExpectedOutput] = useState("0.0");
  const [priceImpact, setPriceImpact] = useState("0.00");
  const [countdown, setCountdown] = useState("0h 0m 0s");

  const PACKAGE_ID = "0xb90158d50ac951784409a6876ac860e24564ed5257e51944d3c693efb9fdbd78";
  const POOL_REGISTRY = "0xfc8c69858d070b639b3db15ff0f78a10370950434c5521c83eaa7e2285db8d2a";

  // Countdown timer logic for UTC+8 midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const utc8Offset = 8 * 60; // UTC+8 in minutes
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const utc8Time = new Date(utcTime + utc8Offset * 60000);
      const nextMidnight = new Date(
        utc8Time.getFullYear(),
        utc8Time.getMonth(),
        utc8Time.getDate() + 1,
        0, 0, 0
      );
      const timeDiff = nextMidnight.getTime() - utc8Time.getTime();
      
      if (timeDiff <= 0) {
        setCountdown("0h 0m 0s");
        return;
      }

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Custom debounce hook
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedAmountIn = useDebounce(amountIn, 300);

  const getTokenDecimals = (tokenAddress: string) => {
    const token = [...tokens, ...importedTokens].find((t) => t.address === tokenAddress);
    return token?.decimals || 6;
  };

  const setHalfBalance = () => {
    const balance = parseFloat(balances[tokenX] || "0");
    if (balance > 0) {
      setAmountIn((balance * 0.5).toFixed(getTokenDecimals(tokenX)));
    }
  };

  const setMaxBalance = () => {
    const balance = parseFloat(balances[tokenX] || "0");
    if (balance > 0) {
      setAmountIn(balance.toFixed(getTokenDecimals(tokenX)));
    }
  };

  const handleSlippageSelect = (value: string) => {
    if (value === "customastar") {
      setCustomSlippage("");
    } else {
      setSlippage(value);
      setShowSlippageModal(false);
    }
  };

  const handleCustomSlippage = () => {
    const value = parseFloat(customSlippage);
    if (isNaN(value) || value < 0 || value > 100) {
      setError("Please enter a valid slippage percentage (0-100)");
      return;
    }
    setSlippage(value.toString());
    setShowSlippageModal(false);
    setCustomSlippage("");
  };

  const importToken = async () => {
    if (!importAddress) {
      setImportError("Please enter a valid token address");
      return;
    }
    try {
      const tokenData = await client.getObject({
        id:importAddress,
        options: { showContent: true },
      });
      const content = tokenData.data?.content as any;
      if (!content?.fields?.symbol || !content?.fields?.decimals) {
        setImportError("Unable to fetch token metadata");
        return;
      }
      const newToken = {
        symbol: content.fields.symbol,
        address: importAddress,
        icon: "https://via.placeholder.com/32",
        description: content.fields.name || `Imported Token (${content.fields.symbol})`,
        decimals: parseInt(content.fields.decimals),
      };
      setImportedTokens([...importedTokens, newToken]);
      setImportError("");
      setImportAddress("");
      setActiveList("Imported");
    } catch (err) {
      setImportError("Unable to import token: Invalid address or metadata");
    }
  };

  useEffect(() => {
    const fetchPoolId = async () => {
      if (!tokenX || !tokenY) {
        setPoolId("");
        setIsReverseSwap(false);
        return;
      }

      if (tokenX === tokenY) {
        setError("Cannot select the same token for trading");
        setPoolId("");
        setIsReverseSwap(false);
        return;
      }

      try {
        const registry = await client.getObject({
          id: POOL_REGISTRY,
          options: { showContent: true },
        });

        const content = registry.data?.content as any;
        if (!content?.fields?.pools) {
          console.error("Pool registry fields or pools not found:", JSON.stringify(content, null, 2));
          setError("Unable to fetch pool registry");
          setPoolId("");
          return;
        }

        const pools = content.fields.pools;
        let foundPoolId = "";
        let reverse = false;

        for (const pool of pools) {
          const poolTokenX = pool.fields.token_x.fields.name;
          const poolTokenY = pool.fields.token_y.fields.name;
          const poolFeeRate = parseInt(pool.fields.fee_rate);
          const poolAddr = pool.fields.pool_addr;

          const formattedPoolTokenX = `0x${poolTokenX}`;
          const formattedPoolTokenY = `0x${poolTokenY}`;

          if (
            (formattedPoolTokenX === tokenX && formattedPoolTokenY === tokenY && poolFeeRate === 25) ||
            (formattedPoolTokenX === tokenY && formattedPoolTokenY === tokenX && poolFeeRate === 25)
          ) {
            foundPoolId = poolAddr;
            reverse = formattedPoolTokenX === tokenY && formattedPoolTokenY === tokenX;
            break;
          }
        }

        if (foundPoolId) {
          setPoolId(foundPoolId);
          setIsReverseSwap(reverse);
          setError("");
        } else {
          setPoolId("");
          setError("No corresponding pool found");
          setIsReverseSwap(false);
        }
      } catch (err) {
        console.error("Failed to fetch pool ID:", err);
        setError("Unable to fetch pool ID");
        setPoolId("");
      }
    };

    fetchPoolId();
  }, [tokenX, tokenY, client]);

  useEffect(() => {
    const fetchBalancesAndOutput = async () => {
      if (!account) {
        setBalances({});
        setExpectedOutput("0.0");
        setMinAmountOut("0");
        setPriceImpact("0.00");
        return;
      }

      try {
        const newBalances: { [key: string]: string } = {};
        const allBalances = await client.getAllBalances({
          owner: account.address,
        });

        for (const token of [...tokens, ...importedTokens]) {
          if (token.address && !token.address.includes("...")) {
            const balanceEntry = allBalances.find((b) => b.coinType === token.address);
            const decimals = getTokenDecimals(token.address);
            if (balanceEntry) {
              const balance = parseInt(balanceEntry.totalBalance) / 10 ** decimals;
              newBalances[token.address] = balance.toFixed(4);
            } else {
              newBalances[token.address] = "0.0000";
              console.warn(`No balance found for token: ${token.symbol} (${token.address})`);
            }
          }
        }
        setBalances(newBalances);

        if (poolId && debouncedAmountIn && parseFloat(debouncedAmountIn) > 0) {
          const pool = await client.getObject({
            id: poolId,
            options: { showContent: true },
          });

          const poolContent = pool.data?.content as any;
          if (!poolContent?.fields || !poolContent.fields.reserve_x || !poolContent.fields.reserve_y || !poolContent.fields.fee_rate) {
            setError("Unable to fetch pool reserve information");
            setExpectedOutput("0.0");
            setMinAmountOut("0");
            setPriceImpact("0.00");
            return;
          }

          const reserveX = parseInt(poolContent.fields.reserve_x);
          const reserveY = parseInt(poolContent.fields.reserve_y);
          const feeRate = parseInt(poolContent.fields.fee_rate);

          if (isNaN(reserveX) || isNaN(reserveY) || isNaN(feeRate) || reserveX <= 0 || reserveY <= 0) {
            setError("Pool reserve or fee data invalid");
            setExpectedOutput("0.0");
            setMinAmountOut("0");
            setPriceImpact("0.00");
            return;
          }

          const inputDecimals = getTokenDecimals(isReverseSwap ? tokenY : tokenX);
          const outputDecimals = getTokenDecimals(isReverseSwap ? tokenX : tokenY);
          const amountInValue = parseFloat(debouncedAmountIn) * 10 ** inputDecimals;

          let amountOut;
          if (isReverseSwap) {
            const amountInWithFee = (amountInValue * (10000 - feeRate)) / 10000;
            amountOut = (amountInWithFee * reserveX) / (reserveY + amountInWithFee);
          } else {
            const amountInWithFee = (amountInValue * (10000 - feeRate)) / 10000;
            amountOut = (amountInWithFee * reserveY) / (reserveX + amountInWithFee);
          }

          const spotPrice = isReverseSwap ? reserveX / reserveY : reserveY / reserveX;
          const effectivePrice = amountOut / amountInValue;
          const priceImpactValue = Math.abs((spotPrice - effectivePrice) / spotPrice) * 100;

          const slippageMultiplier = 1 - parseFloat(slippage) / 100;
          const minOut = amountOut * slippageMultiplier;

          setExpectedOutput((amountOut / 10 ** outputDecimals).toFixed(4));
          setMinAmountOut((minOut / 10 ** outputDecimals).toFixed(4));
          setPriceImpact(priceImpactValue.toFixed(2));
        } else {
          setExpectedOutput("0.0");
          setMinAmountOut("0");
          setPriceImpact("0.00");
        }
      } catch (err) {
        console.error("Failed to fetch balances or output:", err);
        setError(`Unable to fetch balances or expected output: ${err instanceof Error ? err.message : "Unknown error"}`);
        setExpectedOutput("0.0");
        setMinAmountOut("0");
        setPriceImpact("0.00");
      }
    };

    fetchBalancesAndOutput();
  }, [account, tokenX, tokenY, debouncedAmountIn, slippage, poolId, isReverseSwap, client, importedTokens]);

  const handleSwapTokens = () => {
    setTokenX(tokenY);
    setTokenY(tokenX);
    setAmountIn("");
    setMinAmountOut("0");
    setExpectedOutput("0.0");
    setPriceImpact("0.00");
  };

  const selectToken = (token: any, type: string) => {
    const newTokenAddress = token.address;
    if (type === "tokenX" && newTokenAddress === tokenY) {
      setError("Cannot select the same token");
      return;
    }
    if (type === "tokenY" && newTokenAddress === tokenX) {
      setError("Cannot select the same token");
      return;
    }
    if (type === "tokenX") {
      setTokenX(newTokenAddress);
    } else {
      setTokenY(newTokenAddress);
    }
    setShowTokenModal(null);
    setAmountIn("");
    setMinAmountOut("0");
    setExpectedOutput("0.0");
    setPriceImpact("0.00");
    setError("");
  };

  const getTokenInfo = (address: string) => {
    return [...tokens, ...importedTokens].find((token) => token.address === address) || tokens[0];
  };

  const handleSwap = async () => {
    if (!account) {
      setError("Please connect wallet");
      return;
    }
    if (!tokenX || !tokenY || !amountIn || parseFloat(amountIn) <= 0 || !poolId) {
      setError("Please enter a valid input amount and select a valid trading pair");
      return;
    }
    if (tokenX === tokenY) {
      setError("Cannot select the same token for trading");
      return;
    }

    try {
      const suiBalance = await client.getBalance({
        owner: account.address,
        coinType: "0x2::sui::SUI",
      });
      if (parseInt(suiBalance.totalBalance) < 100000000) {
        setError("SUI balance is insufficient to cover transaction fees (at least 0.1 SUI required)");
        return;
      }

      const inputToken = isReverseSwap ? tokenY : tokenX;
      const inputDecimals = getTokenDecimals(inputToken);
      const amountInValue = Math.floor(parseFloat(amountIn) * 10 ** inputDecimals);

      const coins = await client.getCoins({
        owner: account.address,
        coinType: inputToken,
      });

      const coinObjectIds = coins.data
        .filter((coin) => parseInt(coin.balance) >= amountInValue)
        .map((coin) => coin.coinObjectId);

      if (coinObjectIds.length === 0) {
        setError(`Insufficient ${getTokenInfo(inputToken).symbol} tokens found (at least ${amountIn} ${getTokenInfo(inputToken).symbol} required)`);
        return;
      }

      const suiCoins = await client.getCoins({
        owner: account.address,
        coinType: "0x2::sui::SUI",
      });

      if (!suiCoins.data || suiCoins.data.length === 0) {
        setError("No available SUI tokens found for gas fees");
        return;
      }

      const tx = new Transaction();
      const [primaryCoin] = coinObjectIds;
      const mergedCoin = tx.object(primaryCoin);

      if (coinObjectIds.length > 1) {
        tx.mergeCoins(mergedCoin, coinObjectIds.slice(1).map((id) => tx.object(id)));
      }

      const [coinToSwap] = tx.splitCoins(mergedCoin, [amountInValue]);

      const outputDecimals = getTokenDecimals(isReverseSwap ? tokenX : tokenY);
      const minAmountOutValue = Math.floor(parseFloat(minAmountOut) * 10 ** outputDecimals);

      tx.moveCall({
        target: `${PACKAGE_ID}::amm::${isReverseSwap ? "swap_reverse" : "swap"}`,
        typeArguments: isReverseSwap ? [tokenY, tokenX] : [tokenX, tokenY],
        arguments: [
          tx.object(poolId),
          coinToSwap,
          tx.pure.u64(minAmountOutValue),
        ],
      });

      tx.setGasBudget(100000000);

      signAndExecute(
        {
          transaction: tx,
          account,
        },
        {
          onSuccess: (result: any) => {
            setSuccess(`Transaction successful: ${result.digest}`);
            setError("");
            setAmountIn("");
            setMinAmountOut("0");
            setExpectedOutput("0.0");
            setPriceImpact("0.00");
          },
          onError: (err: any) => {
            setError(`Transaction failed: ${err.message}`);
            setSuccess("");
          },
        }
      );
    } catch (err) {
      setError(`Transaction preparation failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image" />
          <span className="logo-text">Seal</span>
        </div>
        <div className="nav-menu">
          <div className={`nav-item ${openDropdown === "trade" ? "open" : ""}`} onClick={() => toggleDropdown("trade")}>
            <span className="nav-text">Trade</span>
            <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
              <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
            </svg>
            <div className={`dropdown ${openDropdown === "trade" ? "open" : ""}`}>
              <Link to="/" className="dropdown-item">Swap</Link>
            </div>
          </div>
          <div className={`nav-item ${openDropdown === "earn" ? "open" : ""}`} onClick={() => toggleDropdown("earn")}>
            <span className="nav-text">Earn</span>
            <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
              <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
            </svg>
            <div className={`dropdown ${openDropdown === "earn" ? "open" : ""}`}>
              <Link to="/pool" className="dropdown-item">Pool</Link>
            </div>
          </div>
          <div className={`nav-item ${openDropdown === "bridge" ? "open" : ""}`} onClick={() => toggleDropdown("bridge")}>
            <span className="nav-text">Bridge</span>
            <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
              <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
            </svg>
            <div className={`dropdown ${openDropdown === "bridge" ? "open" : ""}`}>
              <a href="https://bridge.sui.io/" target="_blank" rel="noopener noreferrer" className="dropdown-item">Sui Bridge</a>
              <a href="https://bridge.cetus.zone/sui" target="_blank" rel="noopener noreferrer" className="dropdown-item">Wormhole</a>
            </div>
          </div>
          <div className={`nav-item ${openDropdown === "more" ? "open" : ""}`} onClick={() => toggleDropdown("more")}>
            <span className="nav-text">More</span>
            <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
              <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
            </svg>
            <div className={`dropdown ${openDropdown === "more" ? "open" : ""}`}>
              <a href="#" className="dropdown-item">Docs</a>
              <a href="#" className="dropdown-item">Leaderboard</a>
            </div>
          </div>
        </div>
        <div className="wallet-actions">
          <div className="wallet-button">
            <img
              src="https://assets.crypto.ro/logos/sui-sui-logo.png"
              alt="wallet logo"
            />
            <span>{account ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : "Connect Wallet"}</span>
          </div>
          <ConnectButton />
          <button className="icon-button">
            <svg className="icon-button-svg" viewBox="0 0 20 20" width="20px" height="20px">
              <path d="M10 3a7 7 0 100 14 7 7 0 000-14zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a1 1 0 00-1 1v3a1 1 0 002 0V8a1 1 0 00-1-1z" fill="var(--text-color)" />
            </svg>
          </button>
        </div>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div className="main-content">
              <div className="reward-announcement-container">
                <div className="reward-announcement">
                  <img
                    src="https://i.meee.com.tw/SdliTGK.png"
                    alt="$Seal"
                  />
                  <span>🎁 Using the swap service to earn extra $Seal token rewards!</span>
                  <span className="countdown-time">{countdown}</span>
                </div>
              </div>
              <div className="swap-panel">
                <div className="swap-header">
                  <h2 className="swap-title">Swap</h2>
                  <div className="settings-button-container">
                    <button
                      className="settings-button"
                      aria-haspopup="dialog"
                      onClick={() => setShowSlippageModal(!showSlippageModal)}
                    >
                      {slippage}% <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="settings-icon"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><circle cx="12" cy="12" r="4"></circle></svg>
                    </button>
                    {showSlippageModal && (
                      <div className="slippage-modal">
                        <div className="slippage-modal-content">
                          <h3 className="slippage-modal-title">Slippage Tolerance</h3>
                          <div className="slippage-options">
                            {["0.3", "1", "10"].map((value) => (
                              <button
                                key={value}
                                className={`slippage-option ${slippage === value ? "active" : ""}`}
                                onClick={() => handleSlippageSelect(value)}
                              >
                                {value}%
                              </button>
                            ))}
                          </div>
                          {slippage !== "0.3" && slippage !== "1" && slippage !== "10"  && (
                            <div className="custom-slippage">
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                value={customSlippage}
                                onChange={(e) => setCustomSlippage(e.target.value)}
                                placeholder="0.0"
                                className="custom-slippage-input"
                              />
                              <button className="custom-slippage-submit" onClick={handleCustomSlippage}>
                                Save
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="input-section">
                  <div className="input-card">
                    <div className="input-label">
                      <span>From</span>
                    </div>
                    <div className="input-group">
                      <input
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        type="text"
                        value={amountIn}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
                            setAmountIn(value);
                          }
                        }}
                        placeholder="0.0"
                        className="swap-input"
                      />
                      <div className="token-selector" onClick={() => setShowTokenModal("tokenX")}>
                        <img src={getTokenInfo(tokenX).icon} alt={getTokenInfo(tokenX).symbol} className="token-icon" />
                        <span>{getTokenInfo(tokenX).symbol}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-down"><path d="m6 9 6 6 6-6"></path></svg>
                      </div>
                    </div>
                    <div className="input-footer">
                      <span className="price-text">${(parseFloat(balances[tokenX] || "0") * (getTokenInfo(tokenX).symbol === "SUI" ? 3.92 : 1)).toFixed(2)}</span>
                      <div className="balance-group">
                        <span>Balance: {balances[tokenX] || "0.0"}</span>
                        <div className="balance-buttons">
                          <button onClick={setHalfBalance} className="balance-button">50%</button>
                          <button onClick={setMaxBalance} className="balance-button">MAX</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="swap-icon" onClick={handleSwapTokens}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="swap-arrow"><path d="m3 16 4 4 4-4"></path><path d="M7 20V4"></path><path d="m21 8-4-4-4 4"></path><path d="M17 4v16"></path></svg>
                  </div>
                  <div className="input-card">
                    <div className="input-label">
                      <span>To</span>
                    </div>
                    <div className="input-group">
                      <input
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        type="text"
                        value={expectedOutput}
                        disabled
                        placeholder="0.0"
                        className="swap-input"
                      />
                      <div className="token-selector" onClick={() => setShowTokenModal("tokenY")}>
                        <img src={getTokenInfo(tokenY).icon} alt={getTokenInfo(tokenY).symbol} className="token-icon" />
                        <span>{getTokenInfo(tokenY).symbol}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-down"><path d="m6 9 6 6 6-6"></path></svg>
                      </div>
                    </div>
                    <div className="input-footer">
                      <span className="price-text">${(parseFloat(balances[tokenY] || "0") * (getTokenInfo(tokenY).symbol === "SUI" ? 3.92 : 1)).toFixed(2)}</span>
                      <div className="balance-group">
                        <span>Balance: {balances[tokenY] || "0.0"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="action-button"
                  onClick={handleSwap}
                  disabled={!account || !amountIn || parseFloat(amountIn) <= 0 || !poolId || parseFloat(balances["0x2::sui::SUI"] || "0") < 0.1 || tokenX === tokenY}
                >
                  {account ? (amountIn && parseFloat(amountIn) > 0 ? (poolId ? (parseFloat(balances["0x2::sui::SUI"] || "0") >= 0.1 ? (tokenX !== tokenY ? "Swap Now" : "Same Token") : "Insufficient SUI Balance") : "Invalid Trading Pair") : "Enter Valid Amount") : "Connect Wallet"}
                </button>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <div className="info-panel">
                  <p>
                    <span>Expected Output</span>
                    <span>{expectedOutput} {getTokenInfo(tokenY).symbol}</span>
                  </p>
                  <p>
                    <span>Price Impact</span>
                    <span>{priceImpact}%</span>
                  </p>
                  <p>
                    <span>Minimum Received</span>
                    <span>{minAmountOut} {getTokenInfo(tokenY).symbol}</span>
                  </p>
                  <p>
                    <span>Order Routing</span>
                    <span>{getTokenInfo(tokenX).symbol} → {getTokenInfo(tokenY).symbol}</span>
                  </p>
                </div>
                {showTokenModal && (
                  <TokenModal
                    showTokenModal={showTokenModal}
                    setShowTokenModal={setShowTokenModal}
                    tokens={tokens}
                    importedTokens={importedTokens}
                    activeList={activeList}
                    setActiveList={setActiveList}
                    importAddress={importAddress}
                    setImportAddress={setImportAddress}
                    importError={importError}
                    setImportError={setImportError}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectToken={selectToken}
                    balances={balances}
                    importToken={importToken}
                  />
                )}
              </div>
            </div>
          }
        />
        <Route path="/pool" element={<Pool />} />
      </Routes>
    </div>
  );
}

export default App;