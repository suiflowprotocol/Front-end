import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import CreatePool from "./CreatePool";
import AddLiquidityModal from "./AddLiquidityModal";
import { tokens } from "./tokens";
import { useNavigate } from "react-router-dom";
import "./Pool.css";

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

interface PoolListProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCreatePoolOpen: boolean;
  handleCreatePool: () => void;
  handleCloseCreatePool: () => void;
  isAddLiquidityOpen: boolean;
  selectedPool: Pool | null;
  handleAddLiquidity: (pool: Pool, scroll?: boolean) => void;
  handleCloseAddLiquidityModal: () => void;
  newPoolToken1: string;
  newPoolToken2: string;
  feeRate: string;
  setNewPoolToken1: Dispatch<SetStateAction<string>>;
  setNewPoolToken2: Dispatch<SetStateAction<string>>;
  setFeeRate: Dispatch<SetStateAction<string>>;
  getTokenAddress: (symbol: string) => string;
}

function PoolList({
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
      img1: "https://www.haedal.xyz/images/stsui.png",
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
      img1: "https://assets.gemwallet.com/blockchains/sui/assets/0x6cd813061a3adf3602b76545f076205f0c8e7ec1d3b1eab9a1da7992c18c0524::sca::SCA/logo.png",
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

  const navigate = useNavigate();
  const [incentivizedOnly, setIncentivizedOnly] = useState(false);
  const [allPools, setAllPools] = useState(true);

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

        const fetchedPoolData: any[] = [];
        if (fetchedPoolData.length > 0) {
          setPools((prevPools) =>
            prevPools.map((pool) => {
              const fetched = fetchedPoolData.find((data) => data.pair === pool.pair);
              return fetched ? { ...pool, ...fetched } : pool;
            })
          );
        }
      } catch (error) {
        console.error("Error fetching pool data:", error);
      }
    };

    fetchPoolData();
  }, []);

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
          pools.map((pool, index) => (
            <div
              key={index}
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
                ${pool.tvl}
              </div>
              <div className="pool-data">
                <span className="data-label">Volume (24H)</span>
                ${pool.volume}
              </div>
              <div className="pool-data">
                <span className="data-label">Fees (24H)</span>
                ${pool.fees}
              </div>
              <div className="apr-container">
                <span className="data-label">APR</span>
                <span className="apr-text">{pool.apr}%</span>
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