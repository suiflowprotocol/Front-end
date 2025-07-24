import { useState, useEffect, useRef } from "react";
import { ConnectButton, useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Link, Route, Routes } from "react-router-dom";
import Pool from "./Pool";
import TokenModal, { tokens } from "./TokenModal";
import CoverPage from "./CoverPage";
import "./App.css";
import "./App2.css";
import Confetti from "react-confetti"; // 导入放礼花组件

// Main application component for token swapping
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
  const [priceHistory, setPriceHistory] = useState<{ [key: string]: { x: number; y: number }[] }>({});
  const [priceDifference, setPriceDifference] = useState("0.00");
  const [isLoadingOutput, setIsLoadingOutput] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const switchRef = useRef(null); // 创建一个 ref 来获取开关的位置

  useEffect(() => {
    if (useAggregator) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000); // 3秒后停止放礼花
      return () => clearTimeout(timer);
    }
  }, [useAggregator]);

  const PACKAGE_ID = "0xb90158d50ac951784409a6876ac860e24564ed5257e51944d3c693efb9fdbd78";
  const POOL_REGISTRY = "0xfc8c69858d070b639b3db15ff0f78a10370950434c5521c83eaa7e2285db8d2a";
  const CETUS_AGGREGATOR = "0xsome_cetus_aggregator_id"; // Replace with actual Cetus aggregator package ID
  const CRYPTOCOMPARE_API = "https://min-api.cryptocompare.com/data";

  // Cache for price and history data
  const priceCache = useRef<{ [key: string]: { price: number; change_24h: number; timestamp: number } }>({});
  const historyCache = useRef<{ [key: string]: { data: { x: number; y: number }[]; timestamp: number } }>({});
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Mapping of token symbols to CryptoCompare IDs
  const cryptoCompareIds: { [key: string]: string } = {
    SUI: "SUI",
    USDC: "USDC",
    USDT: "USDT",
    BTC: "BTC",
    ARB: "ARB",
    SOL: "SOL",
    APT: "APT",
    SEI: "SEI",
    AVAX: "AVAX",
    TIA: "TIA",
    POL: "MATIC",
    BLUE: "BLUE",
    AUSD: "AUSD",
    AFSUI: "AFSUI",
    VSUI: "VSUI",
    NAVX: "NAVX",
    USDY: "USDY",
    FUD: "FUD",
    HAEDAL: "HAEDAL",
    NS: "NS",
    CETUS: "CETUS",
    DEEP: "DEEP",
    WAL: "WAL",
    SCA: "SCA",
    HASUI: "HASUI",
    BUCK: "BUCK",
    "OKX_WRAPPED_BTC": "BTC",
    "TETHER_SUI_BRIDGE": "USDT"
  };

  // Update countdown timer for UTC+8
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

  // Custom hook for debouncing input
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

  // Get token decimals based on address
  const getTokenDecimals = (tokenAddress: string) => {
    const token = [...tokens, ...importedTokens].find((t) => t.address === tokenAddress);
    return token?.decimals || 6;
  };

  // Set input amount to half of balance
  const setHalfBalance = () => {
    const balance = parseFloat(balances[tokenX] || "0");
    if (balance > 0) {
      setAmountIn((balance * 0.5).toFixed(getTokenDecimals(tokenX)));
    }
  };

  // Set input amount to max balance
  const setMaxBalance = () => {
    const balance = parseFloat(balances[tokenX] || "0");
    if (balance > 0) {
      setAmountIn(balance.toFixed(getTokenDecimals(tokenX)));
    }
  };

  // Handle slippage selection
  const handleSlippageSelect = (value: string) => {
    if (value === "custom") {
      setCustomSlippage("");
    } else {
      setSlippage(value);
      setShowSlippageModal(false);
    }
  };

  // Handle custom slippage input
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

  // Import a new token by address
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
      setImportError("Failed to import token: Invalid address or metadata");
    }
  };

  // Retry logic for API calls
  const fetchWithRetry = async (url: string, retries = 3, delay = 1000): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json();
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  };

  // Fetch current price and 24h change for a token
  const fetchTokenPrice = async (symbol: string) => {
    const ccId = cryptoCompareIds[symbol.toUpperCase()];
    if (!ccId) {
      console.warn(`No CryptoCompare ID found for ${symbol}`);
      return null;
    }

    // Check cache first
    const cached = priceCache.current[symbol.toLowerCase()];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached;
    }

    try {
      const now = Math.floor(Date.now() / 1000);
      const twentyFourHoursAgo = now - 24 * 60 * 60;

      // Fetch current and historical prices concurrently
      const [currentData, historicalData] = await Promise.all([
        fetchWithRetry(`${CRYPTOCOMPARE_API}/price?fsym=${ccId}&tsyms=USD`),
        fetchWithRetry(`${CRYPTOCOMPARE_API}/pricehistorical?fsym=${ccId}&tsyms=USD&ts=${twentyFourHoursAgo}`)
      ]);

      const currentPrice = currentData.USD || 0;
      const pastPrice = historicalData[ccId]?.USD || 0;
      const change_24h = pastPrice > 0 ? ((currentPrice - pastPrice) / pastPrice * 100) : 0;

      const priceData = { price: currentPrice, change_24h, timestamp: Date.now() };
      priceCache.current[symbol.toLowerCase()] = priceData;
      return priceData;
    } catch (err) {
      console.error(`Failed to fetch price for ${symbol}:`, err);
      return null;
    }
  };

  // Fetch 7-day price history for a token
  const fetchPriceHistory = async (symbol: string) => {
    const ccId = cryptoCompareIds[symbol.toUpperCase()];
    if (!ccId) {
      console.warn(`No CryptoCompare ID found for ${symbol} (price history)`);
      return [];
    }

    // Check cache first
    const cached = historyCache.current[symbol.toLowerCase()];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const now = Math.floor(Date.now() / 1000);
      const promises = [];
      for (let i = 0; i < 7; i++) {
        const timestamp = now - (i * 24 * 60 * 60);
        promises.push(
          fetchWithRetry(`${CRYPTOCOMPARE_API}/pricehistorical?fsym=${ccId}&tsyms=USD&ts=${timestamp}`)
            .then(data => ({
              x: timestamp * 1000,
              y: data[ccId]?.USD || 0
            }))
        );
      }

      const prices = (await Promise.all(promises)).reverse();
      historyCache.current[symbol.toLowerCase()] = { data: prices, timestamp: Date.now() };
      return prices;
    } catch (err) {
      console.error(`Failed to fetch price history for ${symbol}:`, err);
      return [];
    }
  };

  // Fetch prices for all tokens concurrently
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const tokensToFetch = [...tokens, ...importedTokens].filter(
          (token) => token.address && !token.address.includes("...")
        );

        const pricePromises = tokensToFetch.map(token => 
          fetchTokenPrice(token.symbol).then(data => ({
            symbol: token.symbol.toLowerCase(),
            data
          }))
        );

        const results = await Promise.all(pricePromises);
        const newPrices: { [key: string]: { price: number; change_24h: number } } = {};

        results.forEach(({ symbol, data }) => {
          newPrices[symbol] = data || { price: 0, change_24h: 0 };
        });

        setPrices(newPrices);
        if (Object.keys(newPrices).length === 0) {
          setError("Unable to fetch price data for any token");
        } else {
          setError("");
        }
      } catch (err) {
        console.error("Failed to fetch prices:", err);
        setError("Unable to fetch price data");
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [importedTokens]);

  // Fetch price history for selected tokens concurrently
  useEffect(() => {
    const fetchTokenPriceHistory = async () => {
      const symbols = [getTokenInfo(tokenX).symbol, getTokenInfo(tokenY).symbol];
      const historyPromises = symbols.map(symbol => 
        fetchPriceHistory(symbol).then(data => ({
          symbol: symbol.toLowerCase(),
          data
        }))
      );

      const results = await Promise.all(historyPromises);
      const newPriceHistory: { [key: string]: { x: number; y: number }[] } = {};

      results.forEach(({ symbol, data }) => {
        newPriceHistory[symbol] = data || [];
      });

      setPriceHistory(newPriceHistory);
    };

    fetchTokenPriceHistory();
  }, [tokenX, tokenY]);

  // Generate SVG path for price chart with optimization
  const generatePath = (symbol: string) => {
    const priceData = priceHistory[symbol.toLowerCase()] || [];
    if (!priceData || priceData.length < 2) return "M15,10L180,10";
    
    // Downsample data for smoother rendering
    const sampledData = priceData.length > 20 
      ? priceData.filter((_, i) => i % Math.ceil(priceData.length / 20) === 0)
      : priceData;

    const minPrice = Math.min(...sampledData.map((p) => p.y));
    const maxPrice = Math.max(...sampledData.map((p) => p.y));
    const priceRange = maxPrice - minPrice || 1;
    
    const points = sampledData.map((p, i) => {
      const x = 15 + (i / (sampledData.length - 1)) * 150;
      const y = 16 - ((p.y - minPrice) / priceRange) * 12;
      return `${x},${y}`;
    });
    
    return `M${points.join("L")}`;
  };

  // Fetch pool ID for selected token pair
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
          setError("No matching trading pool found");
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

  // Fetch balances and calculate expected output
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
            setError("Invalid pool reserve or fee data");
            setExpectedOutput("0.0");
            setMinAmountOut("0");
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
        console.error("Failed to fetch balances or expected output:", err);
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

  // Swap token pair
  const handleSwapTokens = () => {
    setTokenX(tokenY);
    setTokenY(tokenX);
    setAmountIn("");
    setMinAmountOut("0");
    setExpectedOutput("0.0");
    setPriceImpact("0.00");
    setPriceDifference("0.00");
  };

  // Select a token for swapping
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

  // Get token information by address
  const getTokenInfo = (address: string) => {
    return [...tokens, ...importedTokens].find((token) => token.address === address) || tokens[0];
  };

  // Execute swap transaction
  const handleSwap = async () => {
    if (!account) {
      setError("Please connect wallet");
      return;
    }
    if (!tokenX || !tokenY || !amountIn || parseFloat(amountIn) <= 0 || (!useAggregator && !poolId)) {
      setError("Please enter a valid amount and select valid token pair");
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
        setError("Insufficient SUI balance for transaction fee (at least 0.1 SUI required)");
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
        setError(`No sufficient ${inputTokenInfo.symbol} tokens found (at least ${amountIn} ${inputTokenInfo.symbol} required)`);
        return;
      }

      const suiCoins = await client.getCoins({
        owner: account.address,
        coinType: "0x2::sui::SUI",
      });

      if (!suiCoins.data || suiCoins.data.length === 0) {
        setError("No SUI tokens found for gas payment");
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
          transaction: tx as any,
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

  // Toggle dropdown menu
  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast({ message: "Address copied successfully!", type: "success" });
      setTimeout(() => setToast(null), 3000);
    }).catch(() => {
      setToast({ message: "Failed to copy address", type: "error" });
      setTimeout(() => setToast(null), 3000);
    });
  };

  // Calculate exchange rate
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
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ position: "absolute", top: 0, left: 0 }} // 确保礼花覆盖整个窗口
        />
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
                      <div className="aggregator-toggle" ref={switchRef}>
                        <label className="chakra-form__label" htmlFor="aggregator-mode">Aggregator Mode</label>
                        <label className="chakra-switch">
                          <input
                            type="checkbox"
                            id="aggregator-mode"
                            checked={useAggregator}
                            onChange={() => setUseAggregator(!useAggregator)}
                            className="chakra-switch__input"
                          />
                          <span className="chakra-switch__track">
                            <span className="chakra-switch__thumb"></span>
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
                            <button onClick={setMaxBalance} className="balance-button">Max</button>
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
                    <div className="info-panel">
                      <p>
                        <span>Minimum Received</span>
                        <span>{minAmountOut} USDC</span>
                      </p>
                      <p>
                        <span>Auto Router</span>
                        <span>{tokenX} {'>'} {tokenY}</span>
                      </p>
                      <p>
                        <span>Price Difference</span>
                        <span>{priceDifference}% within</span>
                      </p>
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