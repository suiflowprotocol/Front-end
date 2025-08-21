import { useState, useEffect, useMemo } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { tokens, Token } from "./tokens";
import { SuiClient } from "@mysten/sui/client";

const PACKAGE_ID = "0xb90158d50ac951784409a6876ac860e24564ed5257e51944d3c693efb9fdbd78";
const POOL_REGISTRY = "0xfc8c69858d070b639b3db15ff0f78a10370950434c5521c83eaa7e2285db8d2a";

interface Pool {
  pair: string;
  token1: string;
  token2: string;
  token1Symbol: string;
  token2Symbol: string;
  img1: string;
  img2: string;
  feeRate: string;
  rewardImg: string;
  poolAddress: string;
  token1Address: string;
  token2Address: string;
  decimals1: number;
  decimals2: number;
  reserveX: bigint;
  reserveY: bigint;
  volume24h: bigint;
  fees24h: bigint;
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
        pool.rewardImg === nextPool.rewardImg &&
        pool.poolAddress === nextPool.poolAddress &&
        pool.token1Address === nextPool.token1Address &&
        pool.token2Address === nextPool.token2Address &&
        pool.decimals1 === nextPool.decimals1 &&
        pool.decimals2 === nextPool.decimals2 &&
        pool.reserveX === nextPool.reserveX &&
        pool.reserveY === nextPool.reserveY &&
        pool.volume24h === nextPool.volume24h &&
        pool.fees24h === nextPool.fees24h
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

            const poolData = {
              pair: `${tokenX.symbol}/${tokenY.symbol}`,
              token1: tokenX.name,
              token2: tokenY.name,
              token1Symbol: tokenX.symbol,
              token2Symbol: tokenY.symbol,
              img1: tokenX.logoURI || "https://via.placeholder.com/20",
              img2: tokenY.logoURI || "https://via.placeholder.com/20",
              feeRate: `${(feeRate / 100).toFixed(2)}%`,
              rewardImg: "https://i.meee.com.tw/SdliTGK.png",
              poolAddress: poolInfo.pool_addr,
              token1Address: tokenXAddress,
              token2Address: tokenYAddress,
              decimals1: decimalsX,
              decimals2: decimalsY,
              reserveX: reserveX,
              reserveY: reserveY,
              volume24h: volume24h,
              fees24h: fees24h,
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