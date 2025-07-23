import { useState, useEffect } from "react";
import { ConnectButton, useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Link, Route, Routes } from "react-router-dom";
import Pool from "./Pool";
import TokenModal, { tokens } from "./TokenModal";
import CoverPage from "./CoverPage";
import "./App.css";
import "./App2.css";

function App() {
  const [showTokenModal, setShowTokenModal] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeList, setActiveList] = useState("Default");
  const [importedTokens, setImportedTokens] = useState<any[]>([]);
  const [importAddress, setImportAddress] = useState("");
  const [importError, setImportError] = useState("");
  const [showSlippageModal, setShowSlippageModal] = useState(false);
  const [customSlippage, setCustomSlippage] = useState("");
  const [expiration, setExpiration] = useState("1 Day");
  const [searchQuery, setSearchQuery] = useState("");
  const [useAggregator, setUseAggregator] = useState(false);
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
  const [prices, setPrices] = useState<{ [key: string]: { price: number; change_24h: number } }>({});
  const [priceDifference, setPriceDifference] = useState("0.00");
  const [isLoadingOutput, setIsLoadingOutput] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [priceHistory, setPriceHistory] = useState<{ [key: string]: { x: number; y: number }[] }>({});

  const PACKAGE_ID = "0xb90158d50ac951784409a6876ac860e24564ed5257e51944d3c693efb9fdbd78";
  const POOL_REGISTRY = "0xfc8c69858d070b639b3db15ff0f78a10370950434c5521c83eaa7e2285db8d2a";
  const CETUS_AGGREGATOR = "0x...";
  const COINGECKO_API = "https://api.coingecko.com/api/v3";

  const coinGeckoIds: { [key: string]: string } = {
    SUI: "sui",
    USDC: "usd-coin",
    USDT: "tether",
    BTC: "bitcoin",
    ARB: "arbitrum",
    SOL: "solana",
    APT: "aptos",
    SEI: "sei",
    AVAX: "avalanche",
    TIA: "celestia",
    POL: "matic-network",
    BLUE: "blue",
    DEEP: "deep",
    SEND: "send",
    AUSD: "ausd",
    AFSUI: "afsui",
    HASUI: "hasui",
    VSUI: "vsui",
    NAVX: "navx",
    SCA: "scallop",
    USDY: "usdy",
    FUD: "fud",
    BUCK: "buck",
    CETUS: "cetus-protocol",
    HAEDAL: "haedal",
  };

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const utc8Offset = 8 * 60;
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
        id: importAddress,
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
    const fetchPrices = async () => {
      try {
        const newPrices: { [key: string]: { price: number; change_24h: number } } = {};
        const tokensToFetch = [...tokens, ...importedTokens].filter(
          (token) => token.address && !token.address.includes("...")
        );

        const coinGeckoTokens = tokensToFetch.filter(
          (token) => coinGeckoIds[token.symbol.toUpperCase()]
        );
        if (coinGeckoTokens.length > 0) {
          const coinGeckoIdsToFetch = coinGeckoTokens
            .map((token) => coinGeckoIds[token.symbol.toUpperCase()])
            .join(",");
          const response = await fetch(
            `${COINGECKO_API}/simple/price?ids=${coinGeckoIdsToFetch}&vs_currencies=usd&include_24hr_change=true`
          );
          if (!response.ok) {
            throw new Error(`CoinGecko API responded with status ${response.status}`);
          }
          const data = await response.json();
          coinGeckoTokens.forEach((token) => {
            const cgId = coinGeckoIds[token.symbol.toUpperCase()];
            if (data[cgId]?.usd) {
              newPrices[token.symbol.toLowerCase()] = {
                price: data[cgId].usd,
                change_24h: data[cgId].usd_24h_change,
              };
            }
          });
        }

        if (Object.keys(newPrices).length === 0) {
          setError("Unable to fetch price data from CoinGecko");
        } else {
          setPrices(newPrices);
          setError("");
        }
      } catch (err) {
        console.error("Failed to fetch prices:", err);
        setError("Failed to fetch price data from CoinGecko");
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [importedTokens]);

  const fetchPriceHistory = async (tokenSymbol: string) => {
    const cgId = coinGeckoIds[tokenSymbol.toUpperCase()];
    if (!cgId) return null;
    try {
      const response = await fetch(
        `${COINGECKO_API}/coins/${cgId}/market_chart?vs_currency=usd&days=1&interval=hourly`
      );
      if (!response.ok) {
        throw new Error(`CoinGecko market chart API responded with status ${response.status}`);
      }
      const data = await response.json();
      return data.prices.map(([timestamp, price]: [number, number]) => ({
        x: timestamp,
        y: price,
      }));
    } catch (err) {
      console.error(`Failed to fetch price history for ${tokenSymbol}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchTokenPriceHistory = async () => {
      const symbols = [getTokenInfo(tokenX).symbol, getTokenInfo(tokenY).symbol];
      const newPriceHistory: { [key: string]: { x: number; y: number }[] } = {};

      for (const symbol of symbols) {
        const data = await fetchPriceHistory(symbol);
        if (data) {
          newPriceHistory[symbol.toLowerCase()] = data;
        } else {
          newPriceHistory[symbol.toLowerCase()] = [];
        }
      }

      setPriceHistory(newPriceHistory);
    };

    fetchTokenPriceHistory();
  }, [tokenX, tokenY]);

  const generatePath = (symbol: string) => {
    const priceData = priceHistory[symbol.toLowerCase()] || [];
    if (!priceData || priceData.length < 2) return "M15,10L180,10";
    const minPrice = Math.min(...priceData.map((p) => p.y));
    const maxPrice = Math.max(...priceData.map((p) => p.y));
    const priceRange = maxPrice - minPrice || 1;
    const points = priceData.map((p, i) => {
      const x = 15 + (i / (priceData.length - 1)) * 150;
      const y = 16 - ((p.y - minPrice) / priceRange) * 12;
      return `${x},${y}`;
    });
    return `M${points.join("L")}`;
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
        setPriceDifference("0.00");
        setIsLoadingOutput(false);
        return;
      }

      try {
        setIsLoadingOutput(true);
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

        if (useAggregator) {
          const amountInValue = parseFloat(debouncedAmountIn) * 10 ** getTokenDecimals(isReverseSwap ? tokenY : tokenX);
          const outputDecimals = getTokenDecimals(isReverseSwap ? tokenX : tokenY);
          const amountOut = amountInValue * 0.99;
          const slippageMultiplier = 1 - parseFloat(slippage) / 100;
          const minOut = amountOut * slippageMultiplier;

          setExpectedOutput((amountOut / 10 ** outputDecimals).toFixed(4));
          setMinAmountOut((minOut / 10 ** outputDecimals).toFixed(4));
          setPriceImpact("0.50");
          setPriceDifference("0.30");
        } else if (poolId && debouncedAmountIn && parseFloat(debouncedAmountIn) > 0) {
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
            setPriceDifference("0.00");
            setIsLoadingOutput(false);
            return;
          }

          const reserveX = parseInt(poolContent.fields.reserve_x);
          const reserveY = parseInt(poolContent.fields.reserve_y);
          const feeRate = parseInt(poolContent.fields.fee_rate);

          if (isNaN(reserveX) || isNaN(reserveY) || isNaN(feeRate) || reserveX <= 0 || reserveY <= 0) {
            setError("Pool reserve or fee data invalid");
            setExpectedOutput("0.0");
            setMinAmountOut("1");
            setPriceImpact("0.00");
            setPriceDifference("0.00");
            setIsLoadingOutput(false);
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

          const tokenXSymbol = getTokenInfo(tokenX).symbol.toLowerCase();
          const tokenYSymbol = getTokenInfo(tokenY).symbol.toLowerCase();
          const marketPrice = prices[tokenXSymbol]?.price && prices[tokenYSymbol]?.price
            ? prices[tokenXSymbol].price / prices[tokenYSymbol].price
            : 0;
          const priceDiff = marketPrice ? Math.abs((spotPrice - marketPrice) / marketPrice) * 100 : 0;
          setPriceDifference(priceDiff.toFixed(2));

          const slippageMultiplier = 1 - parseFloat(slippage) / 100;
          const minOut = amountOut * slippageMultiplier;

          setExpectedOutput((amountOut / 10 ** outputDecimals).toFixed(4));
          setMinAmountOut((minOut / 10 ** outputDecimals).toFixed(4));
          setPriceImpact(priceImpactValue.toFixed(2));
        } else {
          setExpectedOutput("0.0");
          setMinAmountOut("0");
          setPriceImpact("0.00");
          setPriceDifference("0.00");
        }
      } catch (err) {
        console.error("Failed to fetch balances or output:", err);
        setError(`Unable to fetch balances or expected output: ${err instanceof Error ? err.message : "Unknown error"}`);
        setExpectedOutput("0.0");
        setMinAmountOut("0");
        setPriceImpact("0.00");
        setPriceDifference("0.00");
      } finally {
        setIsLoadingOutput(false);
      }
    };

    fetchBalancesAndOutput();
  }, [account, tokenX, tokenY, debouncedAmountIn, slippage, poolId, isReverseSwap, client, importedTokens, prices]);

  const handleSwapTokens = () => {
    setTokenX(tokenY);
    setTokenY(tokenX);
    setAmountIn("");
    setMinAmountOut("0");
    setExpectedOutput("0.0");
    setPriceImpact("0.00");
    setPriceDifference("0.00");
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
    setPriceDifference("0.00");
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
    if (!tokenX || !tokenY || !amountIn || parseFloat(amountIn) <= 0 || (!useAggregator && !poolId)) {
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
      const inputTokenInfo = getTokenInfo(inputToken);
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
        setError(`Insufficient ${inputTokenInfo.symbol} tokens found (at least ${amountIn} ${inputTokenInfo.symbol} required)`);
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

      if (useAggregator) {
        tx.moveCall({
          target: `${CETUS_AGGREGATOR}::aggregator::swap`,
          typeArguments: isReverseSwap ? [tokenY, tokenX] : [tokenX, tokenY],
          arguments: [
            tx.object(CETUS_AGGREGATOR),
            coinToSwap,
            tx.pure.u64(minAmountOutValue),
          ],
        });
      } else {
        tx.moveCall({
          target: `${PACKAGE_ID}::amm::${isReverseSwap ? "swap_reverse" : "swap"}`,
          typeArguments: isReverseSwap ? [tokenY, tokenX] : [tokenX, tokenY],
          arguments: [
            tx.object(poolId),
            coinToSwap,
            tx.pure.u64(minAmountOutValue),
          ],
        });
      }

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
            setPriceDifference("0.00");
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast({ message: "Address copied successfully!", type: "success" });
      setTimeout(() => setToast(null), 3000);
    }).catch(() => {
      setToast({ message: "Failed to copy address", type: "error" });
      setTimeout(() => setToast(null), 3000);
    });
  };

  const exchangeRate = prices[getTokenInfo(tokenX).symbol.toLowerCase()]?.price && prices[getTokenInfo(tokenY).symbol.toLowerCase()]?.price
    ? (prices[getTokenInfo(tokenX).symbol.toLowerCase()].price / prices[getTokenInfo(tokenY).symbol.toLowerCase()].price).toFixed(6)
    : "0.000000";

  return (
    <div className="container">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <p>{toast.message}</p>
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="header">
                <div className="header-top">
                  <div className="logo-container">
                    <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image" />
                    <span className="logo-text">Seal</span>
                  </div>
                  <div className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
                    <div className={`nav-item ${openDropdown === "trade" ? "open" : ""}`} onClick={() => toggleDropdown("trade")}>
                      <span className="nav-text">Trade</span>
                      <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                        <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                      </svg>
                      <div className={`dropdown ${openDropdown === "trade" ? "open" : ""}`}>
                        <Link to="/swap" className="dropdown-item">Swap</Link>
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
                    <ConnectButton />
                    <button className="hamburger-menu" onClick={toggleMenu}>
                      <svg className="hamburger-icon" viewBox="0 0 24 24" width="24px" height="24px">
                        <path d="M3 6h18M3 12h18M3 18h18" stroke="var(--text-color)" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="main-content">
                <div className="swap-panel">
                  <div className="swap-header">
                    <h2 className="swap-title">Swap</h2>
                    <div className="settings-row">
                      <div className="aggregator-toggle css-1ve64qd">
                        <label className="chakra-switch css-ghot30">
                          <input
                            type="checkbox"
                            id="aggregator-mode"
                            checked={useAggregator}
                            onChange={() => setUseAggregator(!useAggregator)}
                            className="chakra-switch__input"
                          />
                          <span className="chakra-switch__track css-1dfiea4">
                            <span className="chakra-switch__thumb css-1ws90af"></span>
                          </span>
                        </label>
                      </div>
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
                              {slippage !== "0.3" && slippage !== "1" && slippage !== "10" && (
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
                        <span className="price-text">${(parseFloat(balances[tokenX] || "0") * (prices[getTokenInfo(tokenX).symbol.toLowerCase()]?.price || 0)).toFixed(2)}</span>
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
                        <span className="price-text">${(parseFloat(balances[tokenY] || "0") * (prices[getTokenInfo(tokenY).symbol.toLowerCase()]?.price || 0)).toFixed(2)}</span>
                        <div className="balance-group">
                          <span>Balance: {balances[tokenY] || "0.0"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className={`action-button css-1y5noho ${isLoadingOutput ? "loading" : ""}`}
                    onClick={handleSwap}
                    disabled={!account || !amountIn || parseFloat(amountIn) <= 0 || (!useAggregator && !poolId) || parseFloat(balances["0x2::sui::SUI"] || "0") < 0.1 || tokenX === tokenY || isLoadingOutput}
                  >
                    {account ? (amountIn && parseFloat(amountIn) > 0 ? ((useAggregator || poolId) ? (parseFloat(balances["0x2::sui::SUI"] || "0") >= 0.1 ? (tokenX !== tokenY ? (isLoadingOutput ? "Loading..." : "Swap Now") : "Same Token") : "Insufficient SUI Balance") : "Invalid Trading Pair") : "Enter Valid Amount") : "Connect Wallet"}
                  </button>
                  {error && <div className="error">{error}</div>}
                  {success && <div className="success">{success}</div>}
                  {amountIn && parseFloat(amountIn) > 0 && (poolId || useAggregator) && (
                    <div className="info-panel css-1rg57k7">
                      <div className="info-section css-1hmocdy">
                        <div className="exchange-rate css-1hsegr7">
                          <div className="rate-container css-gmuwbf">
                            <div className="rate-details css-1txlnq4">
                              <div className="token-pair css-urzsqz">
                                <div className="token-icon-container css-12z0wuy">
                                  <div className="icon-wrapper css-kjafn5">
                                    <div className="icon css-3l2vxh">
                                      <img className="chakra-image css-rmmdki" src={getTokenInfo(tokenX).icon} alt={getTokenInfo(tokenX).symbol} />
                                    </div>
                                    <p className="chakra-text css-v4hq1a">{getTokenInfo(tokenX).symbol}</p>
                                  </div>
                                </div>
                                <p className="chakra-text css-3c533j">1</p>
                                <p className="chakra-text css-v4hq1a">≈</p>
                              </div>
                              <div className="rate-value css-759u60">
                                <p className="chakra-text css-1us4ioa">{exchangeRate}</p>
                                <div className="token-icon-container css-qbrse1">
                                  <div className="icon-wrapper css-kjafn5">
                                    <div className="icon css-3l2vxh">
                                      <img className="chakra-image css-rmmdki" src={getTokenInfo(tokenY).icon} alt={getTokenInfo(tokenY).symbol} />
                                    </div>
                                    <p className="chakra-text css-wiq74l">{getTokenInfo(tokenY).symbol}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="rate-arrow css-1qh2nrm">
                              <div className="arrow-icon css-1ke24j5">
                                <svg aria-hidden="true" fill="var(--text-secondary)" width="16px" height="16px" viewBox="0 0 24 24">
                                  <path d="M12 17l-5-5h10l-5 5z"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="info-row css-166fmvx">
                          <div className="info-label css-1qjyqx0">
                            <p className="chakra-text css-14htw7e">Minimum Received</p>
                          </div>
                          <div className="info-value css-1gkzamg">
                            <p className="chakra-text css-9imny6">{minAmountOut} {getTokenInfo(tokenY).symbol}</p>
                          </div>
                        </div>
                        <div className="info-row css-70zqv6">
                          <p className="chakra-text css-rc64l8">Auto Router</p>
                          <div className="router-info css-a5rwps">
                            <div className="router-details css-zqc767">
                              <div className="router-path css-2ndtyn">
                                <p className="chakra-text css-1eiyrn3">{getTokenInfo(tokenX).symbol} {">"} {getTokenInfo(tokenY).symbol}</p>
                                <div className="router-icon css-kjafn5">
                                  <div className="icon css-4jxs7j">
                                    <img className="chakra-image css-rmmdki" src="https://archive.cetus.zone/assets/image/sui/sui.png" alt="Cetus" />
                                  </div>
                                </div>
                                <div className="router-status css-166r45o">
                                  <svg aria-hidden="true" fill="var(--text-secondary)" width="16px" height="16px" viewBox="0 0 24 24">
                                    <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="price-diff-section css-mh0esh">
                        <div className="price-diff-header css-bzhmyh">
                          <p className="chakra-text css-1havq56">Price Difference</p>
                          <button
                            id="popover-trigger-price-diff"
                            aria-haspopup="dialog"
                            aria-expanded="false"
                            aria-controls="popover-content-price-diff"
                            className="css-0"
                          >
                            <div className="css-1ke24j5">
                              <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                              </svg>
                            </div>
                          </button>
                        </div>
                        <div className="price-diff-content css-5thc8w">
                          <div className="price-diff-value css-1414k4v">
                            <p className="chakra-text css-1dtrlpp">Within {priceDifference}%</p>
                            <div
                              id="popover-trigger-price-diff-info"
                              aria-haspopup="dialog"
                              aria-expanded="false"
                              aria-controls="popover-content-price-diff-info"
                              className="css-6su6fj"
                            >
                              <span className="price-source-tag coingecko">CoinGecko</span>
                            </div>
                            <div className="chakra-popover__popper css-1cyw1a8" style={{ visibility: "hidden", position: "absolute", minWidth: "max-content", inset: "0px auto auto 0px" }}>
                              <section
                                id="popover-content-price-diff-info"
                                tabIndex={-1}
                                role="dialog"
                                className="chakra-popover__content css-h7r0o8"
                                style={{ transformOrigin: "var(--popper-transform-origin)", opacity: 0, visibility: "hidden", transform: "scale(0.95)" }}
                              >
                                <p className="chakra-text css-1dtrlpp">Price difference compared to market price</p>
                              </section>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="price-reference-panel css-rrtj52">
                    <div className="price-reference-header css-f7m5r6">
                      <p className="chakra-text css-5z699w">Price Reference</p>
                      <button
                        id="popover-trigger-price-ref"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                        aria-controls="popover-content-price-ref"
                        className="css-1hohgv6"
                      >
                        <div className="css-1ke24j5">
                          <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                          </svg>
                        </div>
                      </button>
                    </div>
                    <div className="price-reference-content css-47ju1k">
                      {[{ token: tokenX, symbol: getTokenInfo(tokenX).symbol }, { token: tokenY, symbol: getTokenInfo(tokenY).symbol }].map(({ token, symbol }, index) => (
                        <div key={index} className="token-price css-tyic7d">
                          <div className="token-info css-1igwmid">
                            <div className="token-details css-token-details">
                              <div className="icon-wrapper css-kjafn5">
                                <div className="icon css-tkdzxl">
                                  <img className="chakra-image css-rmmdki" src={getTokenInfo(token).icon} alt={symbol} />
                                </div>
                              </div>
                              <div className="token-name-details css-token-name-details">
                                <div className="token-name-group css-token-name-group">
                                  <p className="chakra-text css-1f7xwte">{symbol}</p>
                                </div>
                                <div className="token-address css-t4u65q">
                                  <div className="address-details css-1a87bas">
                                    <p className="chakra-text css-43igym">{token.slice(0, 6)}...{token.slice(-4)}</p>
                                    <div className="css-1ke24j5" onClick={() => copyToClipboard(token)}>
                                      <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px" viewBox="0 0 24 24">
                                        <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m2 4v10h10V7H7m2 2h6v2H9V9m0 4h6v2H9v-2z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="price-info-container css-price-info-container">
                            <div className="price-info css-price-info">
                              <div className="price-source css-price-source">
                                <img
                                  className="chakra-image css-price-source-img"
                                  src="https://upload.wikimedia.org/wikipedia/commons/b/b0/CoinGecko_logo.png"
                                  alt="CoinGecko"
                                  style={{ width: "20px", height: "20px" }}
                                />
                                <p className="chakra-text css-v4hq1a">${(prices[symbol.toLowerCase()]?.price || 0).toFixed(3)}</p>
                                <p className={`chakra-text ${prices[symbol.toLowerCase()]?.change_24h >= 0 ? "css-1m1g51m" : "css-1ec3nbv"}`}>
                                  {(prices[symbol.toLowerCase()]?.change_24h || 0).toFixed(2)}%
                                </p>
                              </div>
                            </div>
                            <div className="price-chart css-1r938vg">
                              <div className="recharts-responsive-container" style={{ width: "100%", height: "100%", minWidth: "0" }}>
                                <div className="recharts-wrapper" style={{ position: "relative", cursor: "default", width: "100%", height: "100%", maxHeight: "20px", maxWidth: "180px" }}>
                                  <svg className="recharts-surface" width="180" height="20" viewBox="0 0 180 20" style={{ width: "100%", height: "100%" }}>
                                    <defs>
                                      <clipPath id={`recharts${index + 1}-clip`}>
                                        <rect x="15" y="4" height="12" width="150"></rect>
                                      </clipPath>
                                      <linearGradient id="priceLine" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="rgba(117, 200, 255, 1)"></stop>
                                        <stop offset="100%" stopColor="rgba(104, 255, 216, 1)"></stop>
                                      </linearGradient>
                                    </defs>
                                    <g className="recharts-layer recharts-line">
                                      <path
                                        stroke="url(#priceLine)"
                                        strokeWidth="2"
                                        fill="none"
                                        className="recharts-curve recharts-line-curve"
                                        d={generatePath(symbol)}
                                      />
                                      <g className="recharts-layer"></g>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
            </>
          }
        />
        <Route path="/pool" element={<Pool />} />
      </Routes>
    </div>
  );
}

export default App;