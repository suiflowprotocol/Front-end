import { useState, useEffect, useMemo } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { tokens, Token } from "./tokens";
import { SuiClient } from "@mysten/sui/client";

const PACKAGE_ID = "0xb90158d50ac951784409a6876ac860e24564ed5257e51944d3c693efb9fdbd78";
const POOL_REGISTRY = "0xfc8c69858d070b639b3db15ff0f78a10370950434c5521c83eaa7e2285db8d2a";

const tokenPrices: { [key: string]: number } = {
  "0x2::sui::SUI": 1.0,
  "0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f::usdc::USDC": 1.0,
  "0xb3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba::NS::NS": 0.5,
  "0xd52c440f67dd960bc76f599a16065abd5fbc251b78f18d9dce3578ccc44462a9::cetus::CETUS": 0.2,
  "0xa16e100fcb99689d481f31a2315519923fdf45916a4fa18c5513008f5101237d::navx::NAVX": 0.4,
  "0xc060006111016b8a020ad5b15c1e32d4d9f8b7c1b8b3590b1a5f1c0e67a46e3b::coin::COIN": 1.0,
  "0xe76d0a9c03e7e8e1ff3b8f70412b0e1e7b3a8f30b0f3f7d0b5b6f2e0a0c2b1f7::wal::WAL": 0.2,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::deep::DEEP": 0.1,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::HASUI::HASUI": 1.0,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::lbtc::LBTC": 60000,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::wbtc::WBTC": 60000,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::xbtc::XBTC": 60000,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::hawal::HAWAL": 0.3,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::eth::ETH": 2500,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::buck::BUCK": 1.0,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::wusdt::WUSDT": 1.0,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::ausd::AUSD": 1.0,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::usdy::USDY": 1.0,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::sca::SCA": 0.5,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::lofi::LOFI": 0.1,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::vsui::VSUI": 1.0,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::stsui::STSUI": 1.0,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::haedal::HAEDAL": 0.3,
};

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
  poolAddress: string;
}

export function usePoolData(client: SuiClient): {pools: Pool[], isLoading: boolean, refresh: () => void} {
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(prev => prev + 1);

  // Helper function for deep comparison of pool arrays
  const arePoolsEqual = (prev: Pool[], next: Pool[]): boolean => {
    if (prev.length !== next.length) return false;
    return prev.every((pool, index) => {
      const nextPool = next[index];
      return (
        pool.pair === nextPool.pair &&
        pool.token1 === nextPool.token1 &&
        pool.token2 === nextPool.token2 &&
        pool.token1Symbol === nextPool.token1Symbol &&
        pool.token2Symbol === nextPool.token2Symbol &&
        pool.img1 === nextPool.img1 &&
        pool.img2 === nextPool.img2 &&
        pool.feeRate === nextPool.feeRate &&
        pool.tvl === nextPool.tvl &&
        pool.volume === nextPool.volume &&
        pool.fees === nextPool.fees &&
        pool.apr === nextPool.apr &&
        pool.rewardImg === nextPool.rewardImg &&
        pool.poolAddress === nextPool.poolAddress
      );
    });
  };

  const fetchPools = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching pool registry, ID:", POOL_REGISTRY);
      const registryResponse = await client.getObject({
        id: POOL_REGISTRY,
        options: { showContent: true },
      });

      console.log("Registry Response:", registryResponse);

      if ('error' in registryResponse) {
        console.error("PoolRegistry fetch failed:", registryResponse.error);
        setIsLoading(false);
        return;
      }

      if (registryResponse.data?.content?.dataType !== "moveObject") {
        console.error("PoolRegistry is not a moveObject, received:", registryResponse.data?.content);
        setIsLoading(false);
        return;
      }

      const registryFields = registryResponse.data.content.fields as any;
      console.log("Registry Fields:", registryFields);

      const poolsField = registryFields.pools || [];
      const poolInfos = poolsField
        .map((pool: any) => pool.fields)
        .filter((info: any) => info && info.pool_addr && info.token_x && info.token_y);
      console.log("Extracted Pool Infos:", poolInfos);

      if (poolInfos.length === 0) {
        console.warn("No valid pools found in registry. Returning empty pools array.");
        setIsLoading(false);
        setPools([]);
        return;
      }

      const tokenMap = tokens.reduce((map, token) => {
        map[token.address] = token;
        return map;
      }, {} as { [key: string]: Token });
      console.log("Token Map:", tokenMap);

      const poolData = await Promise.all(
        poolInfos.map(async (poolInfo: any, index: number) => {
          try {
            console.log(`Fetching pool ${index + 1}, address:`, poolInfo.pool_addr);
            const poolObject = await client.getObject({
              id: poolInfo.pool_addr,
              options: { showContent: true },
            });

            console.log(`Pool Object for ${poolInfo.pool_addr}:`, poolObject);

            if ('error' in poolObject) {
              console.error(`Pool ${poolInfo.pool_addr} fetch failed:`, poolObject.error);
              return null;
            }

            if (poolObject.data?.content?.dataType !== "moveObject") {
              console.error(`Pool ${poolInfo.pool_addr} is not a moveObject, received:`, poolObject.data?.content);
              return null;
            }

            const fields = poolObject.data.content.fields as any;
            console.log(`Pool Fields for ${poolInfo.pool_addr}:`, fields);

            if (!fields.reserve_x || !fields.reserve_y || !fields.fee_rate) {
              console.error(`Invalid pool structure for ${poolInfo.pool_addr}:`, {
                reserve_x: fields.reserve_x,
                reserve_y: fields.reserve_y,
                fee_rate: fields.fee_rate,
              });
              return null;
            }

            const reserveX = BigInt(fields.reserve_x);
            const reserveY = BigInt(fields.reserve_y);
            const feeRate = parseInt(fields.fee_rate, 10);
            const volume24h = BigInt(fields.volume_24h || "0");
            const fees24h = BigInt(fields.fees_24h || "0");
            console.log(`Pool ${poolInfo.pool_addr} Metrics:`, {
              reserveX,
              reserveY,
              feeRate,
              volume24h,
              fees24h,
            });

            const tokenXAddress = poolInfo.token_x?.fields?.name || '';
            const tokenYAddress = poolInfo.token_y?.fields?.name || '';

            if (!tokenXAddress || !tokenYAddress) {
              console.error(`Invalid token addresses for pool ${poolInfo.pool_addr}:`, {
                tokenXAddress,
                tokenYAddress,
              });
              return null;
            }

            let tokenX = tokenMap[tokenXAddress];
            if (!tokenX) {
              const metadata = await client.getCoinMetadata({ coinType: tokenXAddress });
              if (metadata) {
                tokenX = {
                  address: tokenXAddress,
                  name: metadata.name,
                  symbol: metadata.symbol,
                  decimals: metadata.decimals,
                  logoURI: metadata.iconUrl || "https://via.placeholder.com/20",
                  image: metadata.iconUrl || "https://via.placeholder.com/20",
                };
              } else {
                const parts = tokenXAddress.split('::');
                const sym = parts.length === 3 ? parts[2] : tokenXAddress.slice(0, 6);
                tokenX = {
                  address: tokenXAddress,
                  name: `Unknown (${sym})`,
                  symbol: sym,
                  decimals: 9,
                  logoURI: "https://via.placeholder.com/20",
                  image: "https://via.placeholder.com/20",
                };
              }
            }

            let tokenY = tokenMap[tokenYAddress];
            if (!tokenY) {
              const metadata = await client.getCoinMetadata({ coinType: tokenYAddress });
              if (metadata) {
                tokenY = {
                  address: tokenYAddress,
                  name: metadata.name,
                  symbol: metadata.symbol,
                  decimals: metadata.decimals,
                  logoURI: metadata.iconUrl || "https://via.placeholder.com/20",
                  image: metadata.iconUrl || "https://via.placeholder.com/20",
                };
              } else {
                const parts = tokenYAddress.split('::');
                const sym = parts.length === 3 ? parts[2] : tokenYAddress.slice(0, 6);
                tokenY = {
                  address: tokenYAddress,
                  name: `Unknown (${sym})`,
                  symbol: sym,
                  decimals: 9,
                  logoURI: "https://via.placeholder.com/20",
                  image: "https://via.placeholder.com/20",
                };
              }
            }
            console.log(`Token Data for pool ${poolInfo.pool_addr}:`, { tokenX, tokenY });

            const decimalsX = tokenX.decimals || 9;
            const decimalsY = tokenY.decimals || 9;
            const priceX = tokenPrices[tokenXAddress] || 0;
            const priceY = tokenPrices[tokenYAddress] || 0;
            console.log(`Token Decimals and Prices for pool ${poolInfo.pool_addr}:`, {
              decimalsX,
              decimalsY,
              priceX,
              priceY,
            });

            const reserveXDecimal = Number(reserveX) / Math.pow(10, decimalsX);
            const reserveYDecimal = Number(reserveY) / Math.pow(10, decimalsY);
            const tvlNumber = reserveXDecimal * priceX + reserveYDecimal * priceY;
            const tvlFormatted = `$${tvlNumber.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
            console.log(`TVL Calculation for pool ${poolInfo.pool_addr}:`, {
              reserveXDecimal,
              reserveYDecimal,
              tvlNumber,
              tvlFormatted,
            });

            const volumeUSDNumber = (Number(volume24h) / Math.pow(10, decimalsX)) * priceX;
            const volumeFormatted = `$${volumeUSDNumber.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
            console.log(`Volume Calculation for pool ${poolInfo.pool_addr}:`, {
              volume24h,
              volumeUSDNumber,
              volumeFormatted,
            });

            const feesUSDNumber = (Number(fees24h) / Math.pow(10, decimalsX)) * priceX;
            const feesFormatted = `$${feesUSDNumber.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
            console.log(`Fees Calculation for pool ${poolInfo.pool_addr}:`, {
              fees24h,
              feesUSDNumber,
              feesFormatted,
            });

            const apr = reserveX > 0n ? (Number(fees24h) * 36500) / Number(reserveX) : 0;
            const aprFormatted = `${apr.toFixed(2)}%`;
            console.log(`APR Calculation for pool ${poolInfo.pool_addr}:`, { apr, aprFormatted });

            const poolData = {
              pair: `${tokenX.symbol}/${tokenY.symbol}`,
              token1: tokenX.name,
              token2: tokenY.name,
              token1Symbol: tokenX.symbol,
              token2Symbol: tokenY.symbol,
              img1: tokenX.logoURI || "https://via.placeholder.com/20",
              img2: tokenY.logoURI || "https://via.placeholder.com/20",
              feeRate: `${(feeRate / 100).toFixed(2)}%`,
              tvl: tvlFormatted,
              volume: volumeFormatted,
              fees: feesFormatted,
              apr: aprFormatted,
              rewardImg: "https://i.meee.com.tw/SdliTGK.png",
              poolAddress: poolInfo.pool_addr,
            };
            console.log(`Final Pool Data for ${poolInfo.pool_addr}:`, poolData);

            return poolData;
          } catch (error) {
            console.error(`Error fetching pool ${poolInfo.pool_addr}:`, error);
            return null;
          }
        })
      );

      const filteredPoolData = poolData.filter((pool): pool is Pool => pool !== null);
      console.log("Filtered Pool Data:", filteredPoolData);

      const sortedPoolData = filteredPoolData.sort((a, b) => a.poolAddress.localeCompare(b.poolAddress));
      setPools((prevPools) => {
        if (arePoolsEqual(prevPools, sortedPoolData)) {
          console.log("No changes in pool data, skipping state update");
          return prevPools;
        }
        console.log("Pool data changed, updating state");
        return sortedPoolData;
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching pools:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, [client, refreshKey]);

  // Memoize the pools array to ensure stable references
  return useMemo(() => ({pools, isLoading, refresh}), [pools, isLoading, refresh]);
}