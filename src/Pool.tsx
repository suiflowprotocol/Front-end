import { useState, useEffect } from "react";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import CreatePool from "./CreatePool";
import AddLiquidityModal from "./AddLiquidityModal";
import { tokens, Token } from "./tokens";

interface Pool {
  pair: string;
  token1: string;
  token2: string;
  token1Symbol: string;
  token2Symbol: string;
  img1: string;
  img2: string;
  feeRate: string;
  tvl: string;
  volume: string;
  fees: string;
  apr: string;
  rewardImg: string;
}

function Pool() {
  const [newPoolToken1, setNewPoolToken1] = useState("");
  const [newPoolToken2, setNewPoolToken2] = useState("");
  const [feeRate, setFeeRate] = useState("0.25");
  const [activeTab, setActiveTab] = useState("pools");
  const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
  const [isAddLiquidityOpen, setIsAddLiquidityOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [countdown, setCountdown] = useState("");

  // 查找代币地址并处理未找到的情况
  const getTokenAddress = (symbol: string): string => {
    const token = tokens.find(t => t.symbol === symbol);
    if (!token) {
      console.error(`Token ${symbol} not found in tokens list`);
      return "0x0"; // 占位地址，需替换为实际地址
    }
    return token.address;
  };

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
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const [pools, setPools] = useState<Pool[]>([
    {
      pair: "SUI-USDC",
      token1: getTokenAddress("SUI"),
      token2: getTokenAddress("USDC"),
      token1Symbol: "SUI",
      token2Symbol: "USDC",
      img1: "https://archive.cetus.zone/assets/image/sui/sui.png",
      img2: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "WAL-SUI",
      token1: getTokenAddress("WAL"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "WAL",
      token2Symbol: "SUI",
      img1: "https://file.coinexstatic.com/2025-03-26/43F8485DCB687E365E3187192861D19E.webp",
      img2: "https://archive.cetus.zone/assets/image/sui/sui.png",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "DEEP-SUI",
      token1: getTokenAddress("DEEP"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "DEEP",
      token2Symbol: "SUI",
      img1: "https://images.deepbook.tech/icon.svg",
      img2: "https://archive.cetus.zone/assets/image/sui/sui.png",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "suiUSDT-USDC",
      token1: getTokenAddress("Tether (Sui Bridge)"),
      token2: getTokenAddress("USDC"),
      token1Symbol: "suiUSDT",
      token2Symbol: "USDC",
      img1: "https://momentum-statics.s3.us-west-1.amazonaws.com/suiUSDT.png",
      img2: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
      feeRate: "0.01%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "HASUI-SUI",
      token1: getTokenAddress("HASUI"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "HASUI",
      token2Symbol: "SUI",
      img1: "https://encrypted-tbn0.gstatic.com/images?q=tbnn:9GcRvd9yv6JWLikNWB-MxU2OyErJiqffAcLi8mw&s",
      img2: "https://archive.cetus.zone/assets/image/sui/sui.png",
      feeRate: "0.01%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "LBTC-wBTC",
      token1: getTokenAddress("Lombard Staked BTC"),
      token2: getTokenAddress("Wrapped Bitcoin(Sui Bridge)"),
      token1Symbol: "LBTC",
      token2Symbol: "wBTC",
      img1: "https://www.lombard.finance/lbtc/LBTC.png",
      img2: "https://bridge-assets.sui.io/suiWBTC.png",
      feeRate: "0.01%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "LBTC-SUI",
      token1: getTokenAddress("Lombard Staked BTC"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "LBTC",
      token2Symbol: "SUI",
      img1: "https://www.lombard.finance/lbtc/LBTC.png",
      img2: "https://archive.cetus.zone/assets/image/sui/sui.png",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "xBTC-USDC",
      token1: getTokenAddress("XBTC"),
      token2: getTokenAddress("USDC"),
      token1Symbol: "xBTC",
      token2Symbol: "USDC",
      img1: "https://static.coinall.ltd/cdn/oksupport/common/20250512-095503.72e1f41d9b9a06.png",
      img2: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "xBTC-SUI",
      token1: getTokenAddress("XBTC"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "xBTC",
      token2Symbol: "SUI",
      img1: "https://static.coinall.ltd/cdn/oksupport/common/20250512-095503.72e1f41d9b9a06.png",
      img2: "https://archive.cetus.zone/assets/image/sui/sui.png",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "haWAL-WAL",
      token1: getTokenAddress("haWAL"),
      token2: getTokenAddress("WAL"),
      token1Symbol: "haWAL",
      token2Symbol: "WAL",
      img1: "https://assets.HAEDAL.xyz/logos/hawal.svg",
      img2: "https://file.coinexstatic.com/2025-03-26/43F8485DCB687E365E3187192861D19E.webp",
      feeRate: "0.01%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "xBTC-wBTC",
      token1: getTokenAddress("XBTC"),
      token2: getTokenAddress("Wrapped Bitcoin(Sui Bridge)"),
      token1Symbol: "xBTC",
      token2Symbol: "wBTC",
      img1: "https://static.coinall.ltd/cdn/oksupport/common/20250512-095503.72e1f41d9b9a06.png",
      img2: "https://bridge-assets.sui.io/suiWBTC.png",
      feeRate: "0.01%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "ETH-SUI",
      token1: getTokenAddress("Wrapped Ether(Wormhole)"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "ETH",
      token2Symbol: "SUI",
      img1: "https://momentum-statics.s3.us-west-1.amazonaws.com/WETH.png",
      img2: "https://archive.cetus.zone/assets/image/sui/sui.png",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "SUI-NS",
      token1: getTokenAddress("SUI"),
      token2: getTokenAddress("NS"),
      token1Symbol: "SUI",
      token2Symbol: "NS",
      img1: "https://archive.cetus.zone/assets/image/sui/sui.png",
      img2: "https://token-image.suins.io/icon.svg",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "BUCK-USDC",
      token1: getTokenAddress("BUCK"),
      token2: getTokenAddress("USDC"),
      token1Symbol: "BUCK",
      token2Symbol: "USDC",
      img1: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/buck.svg/public",
      img2: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
      feeRate: "0.01%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "ETH-USDC",
      token1: getTokenAddress("Wrapped Ether(Wormhole)"),
      token2: getTokenAddress("USDC"),
      token1Symbol: "ETH",
      token2Symbol: "USDC",
      img1: "https://momentum-statics.s3.us-west-1.amazonaws.com/WETH.png",
      img2: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "wUSDT-USDC",
      token1: getTokenAddress("wUSDT"),
      token2: getTokenAddress("USDC"),
      token1Symbol: "wUSDT",
      token2Symbol: "USDC",
      img1: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/images.png/public",
      img2: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
      feeRate: "0.01%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "AUSD-USDC",
      token1: getTokenAddress("AUSD"),
      token2: getTokenAddress("USDC"),
      token1Symbol: "AUSD",
      token2Symbol: "USDC",
      img1: "https://static.agora.finance/ausd-token-icon.svg",
      img2: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
      feeRate: "0.01%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "USDY-USDC",
      token1: getTokenAddress("Ondo US Dollar Yield"),
      token2: getTokenAddress("USDC"),
      token1Symbol: "USDY",
      token2Symbol: "USDC",
      img1: "https://ondo.finance/images/tokens/usdy.svg",
      img2: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
      feeRate: "0.01%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "wBTC-USDC",
      token1: getTokenAddress("Wrapped Bitcoin(Sui Bridge)"),
      token2: getTokenAddress("USDC"),
      token1Symbol: "wBTC",
      token2Symbol: "USDC",
      img1: "https://bridge-assets.sui.io/suiWBTC.png",
      img2: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "SCA-SUI",
      token1: getTokenAddress("SCA"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "SCA",
      token2Symbol: "SUI",
      img1: "https://encrypted-tbn0.gstatic.com/images?q=tbnn:9GcQkPpvd1akVvyP8sgi3PMYAwbCnWuuIS37OKg&s",
      img2: "https://archive.cetus.zone/assets/image/sui/sui.png",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "LOFI-SUI",
      token1: getTokenAddress("LOFI"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "LOFI",
      token2Symbol: "SUI",
      img1: "https://cdn.tusky.io/5ab323c3-19e1-48b1-a5e2-f01b2fb3a097",
      img2: "https://archive.cetus.zone/assets/image/sui/sui.png",
      feeRate: "1%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "vSUI-SUI",
      token1: getTokenAddress("Volo Staked SUI"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "vSUI",
      token2Symbol: "SUI",
      img1: "https://strapi-dev.scand.app/uploads/volo_SUI_Logo_f28ed9c6a1.png",
      img2: "https://archive.cetus.zone/assets/image/sui/sui.png",
      feeRate: "0.01%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "stSUI-SUI",
      token1: getTokenAddress("AlphaFi Staked SUI"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "stSUI",
      token2Symbol: "SUI",
      img1: "https://images.alphafi.xyz/stSUI.png",
      img2: "https://archive.cetus.zone/assets/image/sui/sui.png",
      feeRate: "0.01%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "WAL-USDC",
      token1: getTokenAddress("WAL"),
      token2: getTokenAddress("USDC"),
      token1Symbol: "WAL",
      token2Symbol: "USDC",
      img1: "https://file.coinexstatic.com/2025-03-26/43F8485DCB687E365E3187192861D19E.webp",
      img2: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "LBTC-USDC",
      token1: getTokenAddress("Lombard Staked BTC"),
      token2: getTokenAddress("USDC"),
      token1Symbol: "LBTC",
      token2Symbol: "USDC",
      img1: "https://www.lombard.finance/lbtc/LBTC.png",
      img2: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "WETH-ETH",
      token1: getTokenAddress("Wrapped Ether"),
      token2: getTokenAddress("suiETH"),
      token1Symbol: "WETH",
      token2Symbol: "suiETH",
      img1: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/weth.jpg/public",
      img2: "https://bridge-assets.sui.io/eth.png",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "HAEDAL-SUI",
      token1: getTokenAddress("HAEDAL"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "HAEDAL",
      token2Symbol: "SUI",
      img1: "https://node1.irys.xyz/Rp80fmqZS3qBDnfyxyKEvc65nVdTunjOG3NY8T6AjpI",
      img2: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/sui-coin.svg/public",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "NAVX-SUI",
      token1: getTokenAddress("NAVX"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "NAVX",
      token2Symbol: "SUI",
      img1: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/navi-new.jpeg/public",
      img2: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/sui-coin.svg/public",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "FDUSD-USDC",
      token1: getTokenAddress("FDUSD"),
      token2: getTokenAddress("USDC"),
      token1Symbol: "FDUSD",
      token2Symbol: "USDC",
      img1: "https://cdn.1stdigital.com/icon/fdusd.svg",
      img2: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/usdc.png/public",
      feeRate: "0.01%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "LOFI-SUI",
      token1: getTokenAddress("LOFI"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "LOFI",
      token2Symbol: "SUI",
      img1: "https://cdn.tusky.io/5ab323c3-19e1-48b1-a5e2-f01b2fb3a097",
      img2: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/sui-coin.svg/public",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
    {
      pair: "suiBTC-SUI",
      token1: getTokenAddress("suiBTC"),
      token2: getTokenAddress("SUI"),
      token1Symbol: "suiBTC",
      token2Symbol: "SUI",
      img1: "https://bridge-assets.sui.io/suiWBTC.png",
      img2: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/sui-coin.svg/public",
      feeRate: "0.25%",
      tvl: "0",
      volume: "0",
      fees: "0",
      apr: "0",
      rewardImg: "https://i.meee.com.tw/SdliTGK.png",
    },
  ]);

  const handleCreatePool = () => {
    setIsCreatePoolOpen(true);
  };

  const handleCloseCreatePool = () => {
    setIsCreatePoolOpen(false);
  };

  const handleAddLiquidity = (pool: Pool, scroll: boolean = false) => {
    setSelectedPool(pool);
    setIsAddLiquidityOpen(true);
    if (scroll) {
      const firstPoolElement = document.querySelector(".pool-item");
      if (firstPoolElement) {
        firstPoolElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleCloseAddLiquidityModal = () => {
    setIsAddLiquidityOpen(false);
    setSelectedPool(null);
  };

  useEffect(() => {
    const fetchPoolData = async () => {
      try {
        const client = new SuiClient({ url: getFullnodeUrl("testnet") });
        const packageId = "0xb90158d50ac951784409a6876ac860e24564ed5257e51944d3c693efb9fdbd78";
        const poolRegistryId = "0xfc8c69858d070b639b3db15ff0f78a10370950434c5521c83eaa7e2285db8d2a";

        const poolRegistry = await client.getObject({
          id: poolRegistryId,
          options: { showContent: true },
        });

        // 占位逻辑：根据链上数据更新 pools 的 tvl、volume 等字段
        const fetchedPoolData: any[] = []; // 替换为实际数据
        setPools((prevPools) =>
          prevPools.map((pool) => {
            const fetched = fetchedPoolData.find((data) => data.pair === pool.pair);
            return fetched ? { ...pool, ...fetched } : pool;
          })
        );
      } catch (error) {
        console.error("Error fetching pool data:", error);
      }
    };

    fetchPoolData();
  }, []);

  return (
    <div className="pool-container">
      <style>{`
        .pool-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 24px;
          background: var(--card-bg);
          color: var(--text-color);
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          border-radius: 16px;
          box-shadow: 0 4px 24px var(--shadow-color);
        }
        .reward-countdown-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #3b82f6, #10b981);
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
        }
        .reward-countdown-container:hover {
          transform: translateY(-2px);
        }
        .reward-countdown {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          padding: 10px 16px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          flex-wrap: wrap;
          justify-content: center;
        }
        .reward-countdown img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .reward-countdown span {
          color: #ffffff;
        }
        .reward-countdown .countdown-time {
          color: #ffd700;
          font-weight: 700;
        }
        .pool-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
          background: var(--modal-bg);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }
        .pool-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: var(--text-color);
          letter-spacing: -0.4px;
        }
        .tab-group {
          display: flex;
          gap: 6px;
          background: var(--search-bg);
          border-radius: 8px;
          padding: 4px;
          border: 1px solid var(--border-color);
          justify-content: center;
        }
        .tab-button {
          padding: 8px 16px;
          border-radius: 6px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
          text-align: center;
        }
        .tab Facile: 0
        .tab-button.active {
          background: var(--primary-color);
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
        }
        .tab-button:hover {
          background: var(--hover-bg);
          color: var(--text-color);
        }
        .button-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .action-button {
          padding: 10px 14px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
          min-width: 120px;
          text-align: center;
          touch-action: manipulation;
        }
        .action-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 12px var(--shadow-color);
        }
        .create-pool-button {
          background: var(--primary-color);
          color: #ffffff;
        }
        .create-pool-button:hover {
          background: var(--button-hover-bg);
        }
        .add-liquidity-button {
          background: transparent;
          color: var(--primary-color);
          border: 2px solid var(--primary-color);
        }
        .add-liquidity-button:hover {
          background: rgba(59, 130, 246, 0.1);
        }
        .pool-table-header {
          display: flex;
          background: var(--modal-bg);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          border: 1px solid var(--border-color);
        }
        .pool-table-header div {
          flex: 1;
          text-align: left;
        }
        .pool-table-header div:nth-child(1) {
          flex: 1.5;
        }
        .pool-table-header div:nth-child(7) {
          text-align: right;
        }
        .pool-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pool-item {
          display: flex;
          flex-direction: column;
          background: var(--modal-bg);
          border-radius: 10px;
          padding: 16px;
          transition: all 0.2s ease;
          cursor: pointer;
          border: 1px solid var(--border-color);
        }
        .pool-item:hover {
          background: var(--hover-bg);
          transform: translateY(-1px);
          box-shadow: 0 3px 12px var(--shadow-color);
        }
        .pool-token-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .token-images {
          display: flex;
          align-items: center;
        }
        .token-images img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--border-color);
          transition: transform 0.2s ease;
        }
        .token-images img:hover {
          transform: scale(1.1);
        }
        .token-images img:last-child {
          margin-left: -8px;
        }
        .token-details {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .token-pair {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 16px;
          font-weight: 600;
          white-space: nowrap;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .token-pair p {
          margin: 0;
          color: var(--text-color);
        }
        .token-pair span {
          color: var(--text-secondary);
          font-size: 16px;
        }
        .fee-rate {
          background: var(--input-bg);
          padding: 4px 10px;
          border-radius: 16px;
          font-size: 11px;
          color: var(--text-color);
          display: inline-block;
          border: 1px solid var(--border-color);
        }
        .pool-data {
          font-size: 14px;
          color: var(--text-color);
          font-weight: 500;
          margin-bottom: 8px;
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .data-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          display: none;
        }
        .apr-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .apr-text {
          font-size: 14px;
          color: var(--success-color);
          font-weight: 600;
        }
        .reward-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .reward-container .data-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          display: none;
        }
        .reward-container img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          transition: transform 0.2s ease;
        }
        .reward-container img:hover {
          transform: scale(1.1);
        }
        .reward-container img:not(:first-child) {
          margin-left: -8px;
        }
        .pool-action {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .deposit-button {
          padding: 10px;
          background: var(--primary-color);
          color: #ffffff;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
          width: 100%;
          max-width: 200px;
          text-align: center;
          touch-action: manipulation;
        }
        .deposit-button:hover {
          background: var(--button-hover-bg);
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
        }
        .no-positions {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
          background: var(--modal-bg);
          border-radius: 10px;
          font-size: 14px;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }
        @media (min-width: 1024px) {
          .pool-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .button-group {
            flex-wrap: nowrap;
            justify-content: flex-end;
          }
          .pool-item {
            flex-direction: row;
            align-items: center;
            gap: 12px;
          }
          .pool-token-info {
            flex: 1.5;
            margin-bottom: 0;
          }
          .pool-data {
            flex: 1;
            margin-bottom: 0;
          }
          .apr-container, .reward-container {
            flex: 1;
            margin-bottom: 0;
          }
          .pool-action {
            flex: 1;
            justify-content: flex-end;
          }
          .deposit-button {
            width: auto;
          }
        }
        @media (max-width: 768px) {
          .pool-container {
            padding: 16px;
            border-radius: 10px;
          }
          .pool-title {
            font-size: 20px;
            text-align: center;
          }
          .reward-countdown {
            font-size: 12px;
            padding: 8px;
            text-align: center;
          }
          .reward-countdown img {
            width: 20px;
            height: 20px;
          }
          .reward-countdown-container {
            padding: 8px;
          }
          .action-button {
            padding: 8px 10px;
            font-size: 12px;
            min-width: 100px;
          }
          .pool-table-header {
            display: none;
          }
          .pool-item {
            padding: 12px;
            gap: 12px;
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .token-images img {
            width: 28px;
            height: 28px;
          }
          .token-pair {
            font-size: 14px;
            white-space: nowrap;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .token-pair span {
            font-size: 14px;
          }
          .fee-rate {
            font-size: 10px;
            padding: 3px 8px;
          }
          .pool-data, .apr-text {
            font-size: 12px;
          }
          .data-label {
            display: inline;
          }
          .reward-container .data-label {
            display: inline;
          }
          .reward-container img {
            width: 20px;
            height: 20px;
          }
          .deposit-button {
            font-size: 12px;
            padding: 8px;
          }
        }
        @media (max-width: 480px) {
          .pool-container {
            padding: 12px;
            gap: 16px;
          }
          .pool-title {
            font-size: 18px;
          }
          .tab-group {
            flex-direction: column;
            gap: 4px;
          }
          .tab-button {
            padding: 6px;
            font-size: 12px;
            min-width: 0;
          }
          .action-button {
            padding: 6px 8px;
            font-size: 11px;
            min-width: 90px;
          }
          .reward-countdown {
            font-size: 11px;
            padding: 6px;
            gap: 6px;
          }
          .reward-countdown img {
            width: 18px;
            height: 18px;
          }
          .pool-item {
            padding: 10px;
          }
          .token-images img {
            width: 24px;
            height: 24px;
          }
          .token-pair {
            font-size: 13px;
            white-space: nowrap;
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .token-pair span {
            font-size: 13px;
          }
          .fee-rate {
            font-size: 9px;
          }
          .pool-data, .apr-text {
            font-size: 11px;
          }
          .data-label {
            font-size: 11px;
          }
          .reward-container .data-label {
            font-size: 11px;
          }
          .reward-container img {
            width: 18px;
            height: 18px;
          }
          .reward-container img:not(:first-child) {
            margin-left: -8px;
          }
          .deposit-button {
            font-size: 11px;
            padding: 6px;
            max-width: 150px;
          }
          .no-positions {
            font-size: 12px;
            height: 120px;
          }
        }
      `}</style>
      <div className="reward-countdown-container">
        <div className="reward-countdown">
          <img
            src="https://i.meee.com.tw/SdliTGK.png"
            alt="$Seal"
          />
          <span>🎁 Provide liquidity to pools to earn extra $Seal token rewards!</span>
          <span className="countdown-time">{countdown}</span>
        </div>
      </div>
      <div className="pool-header">
        <h1 className="pool-title">Liquidity Pools</h1>
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
            My Positions
          </button>
        </div>
        <div className="button-group">
          <button
            onClick={handleCreatePool}
            className="action-button create-pool-button"
          >
            Create New Pool
          </button>
          <button
            onClick={() => handleAddLiquidity(pools[0], true)}
            className="action-button add-liquidity-button"
          >
            Add Liquidity
          </button>
        </div>
      </div>
      {activeTab === "pools" && (
        <div className="pool-list">
          <div className="pool-table-header">
            <div>Pool</div>
            <div>Liquidity</div>
            <div>Volume (24H)</div>
            <div>Fee (24H)</div>
            <div>Reward</div>
            <div>APR</div>
            <div>Action</div>
          </div>
          {pools.map((pool, index) => (
            <div
              key={index}
              className="pool-item"
              role="presentation"
            >
              <div className="pool-token-info">
                <div className="token-images">
                  <img
                    alt={pool.token1Symbol}
                    loading="lazy"
                    src={pool.img1}
                    decoding="async"
                  />
                  <img
                    alt={pool.token2Symbol}
                    loading="lazy"
                    src={pool.img2}
                    decoding="async"
                  />
                </div>
                <div className="token-details">
                  <div className="token-pair">
                    <p>{pool.token1Symbol}</p>
                    <span>-</span>
                    <p>{pool.token2Symbol}</p>
                  </div>
                  <span className="fee-rate">{pool.feeRate}</span>
                </div>
              </div>
              <div className="pool-data"><span className="data-label">Liquidity:</span> {pool.tvl}</div>
              <div className="pool-data"><span className="data-label">Volume (24H):</span> {pool.volume}</div>
              <div className="pool-data"><span className="data-label">Fee (24H):</span> {pool.fees}</div>
              <div className="reward-container">
                <span className="data-label">Reward:</span>
                <img
                  alt="reward"
                  src={pool.rewardImg}
                  decoding="async"
                />
                <img
                  alt={pool.token1Symbol}
                  src={pool.img1}
                  decoding="async"
                />
                <img
                  alt={pool.token2Symbol}
                  src={pool.img2}
                  decoding="async"
                />
              </div>
              <div className="apr-container">
                <p className="apr-text"><span className="data-label">APR:</span> {pool.apr}</p>
              </div>
              <div className="pool-action">
                <button
                  className="deposit-button"
                  onClick={() => handleAddLiquidity(pool)}
                >
                  Deposit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === "positions" && (
        <div className="no-positions">
          <p>No position data available</p>
        </div>
      )}
      {isCreatePoolOpen && (
        <CreatePool
          newPoolToken1={newPoolToken1}
          setNewPoolToken1={setNewPoolToken1}
          newPoolToken2={newPoolToken2}
          setNewPoolToken2={setNewPoolToken2}
          feeRate={feeRate}
          setFeeRate={setFeeRate}
          onClose={handleCloseCreatePool}
        />
      )}
      {isAddLiquidityOpen && selectedPool && (
        <AddLiquidityModal
          pool={selectedPool}
          onClose={handleCloseAddLiquidityModal}
        />
      )}
    </div>
  );
}

export default Pool;