// Pool.tsx
import React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Token, tokens } from "./tokens";
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
  lightTheme,
  WalletProvider,
  ThemeVars,
  useConnectWallet,
  useWallets,
  useDisconnectWallet,
  ConnectModal,
  useSuiClient,
} from "@mysten/dapp-kit";
import AddLiquidityModal from "./AddLiquidityModal";
import PoolList from "./PoolList";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./SidebarMenu";
import "./Pool.css";
import "./App.css";
import "./App2.css";
import "./SidebarMenu.css";
import { Transaction } from "@mysten/sui/transactions";

const PACKAGE_ID = "0xb90158d50ac951784409a6876ac860e24564ed5257e51944d3c693efb9fdbd78";
const POOL_REGISTRY = "0xfc8c69858d070b639b3db15ff0f78a10370950434c5521c83eaa7e2285db8d2a";

const ADDRESS_MAPPINGS = {
  "d52c440f67dd960bc76f599a16065abd5fbc251b78f18d9dce3578ccc44462a9": "0xd52c440f67dd960bc76f599a16065abd5fbc251b78f18d9dce3578ccc44462a9",
  "b3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba": "0xb3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba",
  "b677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f": "0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f",
  "a16e100fcb99689d481f31a2315519923fdf45916a4fa18c5513008f5101237d": "0xa16e100fcb99689d481f31a2315519923fdf45916a4fa18c5513008f5101237d",
};

const walletLogos = {
  'Slush': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYHwA15AKYWXvoSL-94ysbnJrmUX_oU1fJyw&s',
  'Suiet': 'https://framerusercontent.com/modules/6HmgaTsk3ODDySrS62PZ/a3c2R3qfkYJDxcZxkoVv/assets/eDZRos3xvCrlWxmLFr72sFtiyQ.png',
  'Martian': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhb6QLKfuQY_N8ZvpiKcdZlCnQKILXw7NArw&s',
  'Sui Wallet': 'https://assets.crypto.ro/logos/sui-sui-logo.png',
};

const customTheme: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(4px)',
  },
  backgroundColors: {
    primaryButton: 'linear-gradient(135deg, #4a5568, #2d3748)',
    primaryButtonHover: 'linear-gradient(135deg, #5a667a, #3d4858)',
    outlineButtonHover: '#F3F4F6',
    modalOverlay: 'rgba(15, 23, 42, 0.3)',
    modalPrimary: '#2d3748',
    modalSecondary: '#1a202c',
    iconButton: 'transparent',
    iconButtonHover: '#F0F1F2',
    dropdownMenu: '#FFFFFF',
    dropdownMenuSeparator: '#F3F6F8',
    walletItemSelected: '#ffffff',
    walletItemHover: '#E5E7EB',
  },
  borderColors: {
    outlineButton: '#D1D5DB',
  },
  colors: {
    primaryButton: '#FFFFFF',
    outlineButton: '#4B5563',
    iconButton: '#1F2937',
    body: '#111827',
    bodyMuted: '#6B7280',
    bodyDanger: '#EF4444',
  },
  radii: {
    small: '6px',
    medium: '10px',
    large: '14px',
    xlarge: '18px',
  },
  shadows: {
    primaryButton: '0 6px 16px rgba(0, 0, 0, 0.15)',
    walletItemSelected: '0 3px 10px rgba(0, 0, 0, 0.08)',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '700',
  },
  fontSizes: {
    small: '13px',
    medium: '15px',
    large: '17px',
    xlarge: '19px',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    lineHeight: '1.6',
    letterSpacing: '0.01em',
  },
};

export function CustomConnectButton() {
  const { mutate: disconnect } = useDisconnectWallet();
  const currentAccount = useCurrentAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '130px',
    height: '38px',
    background: '#1e293b',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '10px',
    cursor: 'pointer',
    padding: '8px',
    transition: 'all 0.3s ease',
    color: '#fff',
    fontSize: '15px',
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `0x${address.slice(2, 5)}...${address.slice(-3)}`;
  };

  const disconnectedContent = (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: '8px' }}
      >
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
      </svg>
      <span>Connect</span>
    </>
  );

  const connectedContent = (
    <>
      {currentAccount && (
        <img
          src="https://assets.crypto.ro/logos/sui-sui-logo.png"
          alt="Wallet Logo"
          style={{ width: '20px', height: '20px', marginRight: '8px' }}
        />
      )}
      <span>{truncateAddress(currentAccount?.address || '')}</span>
    </>
  );

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentAccount) {
      setShowDisconnect(!showDisconnect);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDisconnect(false);
  };

  const allowedWallets = ['Slush', 'Suiet', 'Martian', 'Sui Wallet', 'Martian Sui Wallet'];
  const walletFilter = (wallet: any) => allowedWallets.includes(wallet.name);

  return (
    <div style={{ position: 'relative' }}>
      <ConnectModal
        open={isModalOpen}
        trigger={
          <button
            onClick={handleButtonClick}
            style={baseStyle}
            aria-label={currentAccount ? 'Wallet Connected' : 'Connect Wallet'}
          >
            {currentAccount ? connectedContent : disconnectedContent}
          </button>
        }
        onOpenChange={(open) => setIsModalOpen(open)}
        walletFilter={walletFilter}
      />
      {showDisconnect && currentAccount && (
        <button
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: '#f0f0f0',
            color: '#333',
            padding: '5px 10px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            zIndex: 1000,
          }}
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      )}
    </div>
  );
}

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
  liquidity: string;
  volume: string;
  fees: string;
  apr: string;
}

export interface PoolListProps {
  pools: Pool[];
  prices: { [key: string]: number };
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  isAddLiquidityOpen: boolean;
  selectedPool: Pool | null;
  handleAddLiquidity: (pool: Pool | null, scroll?: boolean) => void;
  handleCloseAddLiquidityModal: () => void;
  refresh: () => void;
  isLoading: boolean;
}

async function getTokenPrice(symbol: string): Promise<number> {
  try {
    const url = `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`;
    const response = await fetch(url);
    const data = await response.json();
    return data.USD || 1.0;
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error);
    return 1.0;
  }
}

export function usePoolData(client: SuiClient): { pools: Pool[], isLoading: boolean, refresh: () => void } {
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        pool.fees24h === nextPool.fees24h &&
        pool.liquidity === nextPool.liquidity &&
        pool.volume === nextPool.volume &&
        pool.fees === nextPool.fees &&
        pool.apr === nextPool.apr
      );
    });
  };

  const normalizeAddress = (address: string): string => {
    for (const [named, actual] of Object.entries(ADDRESS_MAPPINGS)) {
      if (address.includes(named)) {
        console.log(`Normalizing address: ${address} -> ${actual}`);
        return address.replace(named, actual);
      }
    }
    console.warn(`Address ${address} not found in ADDRESS_MAPPINGS, returning as is`);
    return address;
  };

  const fetchPools = useCallback(async () => {
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
        setPools([]);
        return;
      }

      if (registryResponse.data?.content?.dataType !== "moveObject") {
        console.error("PoolRegistry is not a moveObject, received:", registryResponse.data?.content);
        setIsLoading(false);
        setPools([]);
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

      const poolAddrs = poolInfos.map((info: any) => info.pool_addr);
      const poolResponses = await client.multiGetObjects({
        ids: poolAddrs,
        options: { showContent: true },
      });

      const tokenMap = tokens.reduce((map, token) => {
        map[token.address] = token;
        return map;
      }, {} as { [key: string]: Token });
      console.log("Token Map:", tokenMap);

      const poolData = await Promise.all(
        poolInfos.map(async (poolInfo: any, index: number) => {
          try {
            const poolObject = poolResponses[index];

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

            let tokenXAddress = poolInfo.token_x?.fields?.name || '';
            let tokenYAddress = poolInfo.token_y?.fields?.name || '';

            if (!tokenXAddress || !tokenYAddress) {
              console.error(`Invalid token addresses for pool ${poolInfo.pool_addr}:`, {
                tokenXAddress,
                tokenYAddress,
              });
              return null;
            }

            tokenXAddress = normalizeAddress(tokenXAddress);
            tokenYAddress = normalizeAddress(tokenYAddress);
            console.log(`Normalized Token Addresses for pool ${poolInfo.pool_addr}:`, {
              tokenXAddress,
              tokenYAddress,
            });

            let tokenX = tokenMap[tokenXAddress];
            if (!tokenX) {
              console.log(`Token ${tokenXAddress} not in tokenMap, fetching metadata`);
              try {
                const metadata = await client.getCoinMetadata({ coinType: tokenXAddress });
                console.log(`Metadata for ${tokenXAddress}:`, metadata);
                if (metadata) {
                  tokenX = {
                    address: tokenXAddress,
                    name: metadata.name || `Unknown (${tokenXAddress.slice(0, 6)})`,
                    symbol: metadata.symbol || tokenXAddress.split('::').pop() || tokenXAddress.slice(0, 6),
                    decimals: metadata.decimals || 9,
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
              } catch (metadataError) {
                console.error(`Failed to fetch metadata for token ${tokenXAddress}:`, metadataError);
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
              console.log(`Token ${tokenYAddress} not in tokenMap, fetching metadata`);
              try {
                const metadata = await client.getCoinMetadata({ coinType: tokenYAddress });
                console.log(`Metadata for ${tokenYAddress}:`, metadata);
                if (metadata) {
                  tokenY = {
                    address: tokenYAddress,
                    name: metadata.name || `Unknown (${tokenYAddress.slice(0, 6)})`,
                    symbol: metadata.symbol || tokenYAddress.split('::').pop() || tokenYAddress.slice(0, 6),
                    decimals: metadata.decimals || 9,
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
              } catch (metadataError) {
                console.error(`Failed to fetch metadata for token ${tokenYAddress}:`, metadataError);
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
            const priceX = await getTokenPrice(tokenX.symbol);
            const priceY = await getTokenPrice(tokenY.symbol);
            console.log(`Token Decimals and Prices for pool ${poolInfo.pool_addr}:`, {
              decimalsX,
              decimalsY,
              priceX,
              priceY,
            });

            const reserveXDecimal = Number(reserveX) / Math.pow(10, decimalsX);
            const reserveYDecimal = Number(reserveY) / Math.pow(10, decimalsY);
            const liquidityNumber = reserveXDecimal * priceX + reserveYDecimal * priceY;
            const liquidityFormatted = `$${liquidityNumber.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
            console.log(`Liquidity Calculation for pool ${poolInfo.pool_addr}:`, {
              reserveXDecimal,
              reserveYDecimal,
              liquidityNumber,
              liquidityFormatted,
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
              img1: tokenX.logoURI,
              img2: tokenY.logoURI,
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
              liquidity: liquidityFormatted,
              volume: volumeFormatted,
              fees: feesFormatted,
              apr: aprFormatted,
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

      if (filteredPoolData.length === 0) {
        console.warn("All pool fetches failed or returned invalid data.");
      }

      const sortedPoolData = filteredPoolData.sort((a, b) => a.poolAddress.localeCompare(b.poolAddress));
      setPools((prevPools) => {
        if (arePoolsEqual(prevPools, sortedPoolData)) {
          console.log("No changes in pool data, skipping state update");
          return prevPools;
        }
        console.log("Pool data changed, updating state with", sortedPoolData.length, "pools");
        return sortedPoolData;
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching pools:", error);
      setIsLoading(false);
      setPools([]);
    }
  }, [client]);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  const refresh = useCallback(() => {
    fetchPools();
  }, [fetchPools]);

  return useMemo(() => ({ pools, isLoading, refresh }), [pools, isLoading, refresh]);
}

function Pool() {
  const client = useSuiClient();
  const { pools, refresh, isLoading } = usePoolData(client);
  const [activeTab, setActiveTab] = useState("pools");
  const [isAddLiquidityOpen, setIsAddLiquidityOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [chartPeriod, setChartPeriod] = useState<"D" | "W" | "M">("D");
  const [volumeData, setVolumeData] = useState<{ date: string; volume: number; label: string }[]>([]);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = (menu: string | null) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const generateVolumeData = (period: 'D' | 'W' | 'M') => {
    const data = [];
    const now = new Date(2025, 7, 12); // Updated to match current date
    let startDate;

    if (period === 'D') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const volume = Math.floor(Math.random() * 1000000 + 500000); // Adjusted for more realistic data
        const label = date.getDate().toString();
        data.push({ date: date.toLocaleDateString(), volume, label });
      }
    } else if (period === 'W') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 84);
      for (let i = 0; i < 12; i++) {
        const weekStart = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        const volume = Math.floor(Math.random() * 7000000 + 2000000);
        const label = weekStart.getDate().toString();
        data.push({
          date: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          volume,
          label,
        });
      }
    } else if (period === 'M') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        const volume = Math.floor(Math.random() * 30000000 + 10000000);
        const label = monthDate.toLocaleString('en-US', { month: 'short' });
        data.push({ date: label, volume, label });
      }
    }

    return data;
  };

  useEffect(() => {
    const data = generateVolumeData(chartPeriod);
    setVolumeData(data);
  }, [chartPeriod]);

  const totalVolume = useMemo(() => volumeData.reduce((sum, d) => sum + d.volume, 0), [volumeData]);

  const handleCreatePool = () => {
    navigate('/create-pool');
  };

  const handleAddLiquidity = (pool: Pool | null, scroll: boolean = false) => {
    setSelectedPool(pool);
    setIsAddLiquidityOpen(true);
    if (scroll) {
      const firstPoolElement = document.querySelector(".pool-item100");
      if (firstPoolElement) {
        firstPoolElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleCloseAddLiquidityModal = () => {
    setIsAddLiquidityOpen(false);
    setSelectedPool(null);
  };

  const chartWidth = 733;
  const chartHeight = 228;
  const fixedBarWidth = (chartWidth / 30) * 0.5;
  const barWidth = volumeData.length > 0 ? fixedBarWidth : 0;
  const gap = volumeData.length > 0 ? (chartWidth / volumeData.length) - barWidth : 0;
  const maxVolume = volumeData.length > 0 ? Math.max(...volumeData.map(d => d.volume)) : 1;

  const formatVolume = (volume: number) => {
    return `$${volume.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const xAxisLabels = volumeData.map((data, index) => {
    const showLabel = chartPeriod === 'D' ? index % 2 === 0 : true;
    if (!showLabel) return null;
    const x = index * (barWidth + gap) + barWidth / 2;
    return (
      <text
        key={index}
        x={x}
        y={chartHeight + 20}
        textAnchor="middle"
        fontSize="12"
        fill="#909CA4"
      >
        {data.label}
      </text>
    );
  }).filter(label => label !== null);

  const bars = volumeData.map((data, index) => {
    const barHeight = (data.volume / maxVolume) * chartHeight;
    const x = index * (barWidth + gap);
    const y = chartHeight - barHeight;
    return (
      <rect
        key={index}
        x={x}
        y={y}
        width={barWidth}
        height={barHeight}
        fill="url(#barGradient)"
        rx="4" // Added for rounded corners
        ry="4" // Added for rounded corners
      >
        <title>{`${data.date}\nVolume: ${formatVolume(data.volume)}`}</title>
      </rect>
    );
  });

  const chartTitle = chartPeriod === 'D' ? 'Trading Volume (24H)' : chartPeriod === 'W' ? 'Trading Volume (7D)' : 'Trading Volume (30D)';

  const logos = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqYyygKaispLzlgNY95kc5HBQd3qW7ugzAkg&s",
    "https://s2.coinmarketcap.com/static/img/coins/200x200/34187.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7PSlNuhwWmSkl8hUhvKcDI2sFhPN5izx9EQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyEbrXvJmpRWuhl4sKr6Uz2QcUqdp9A_3QDA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuyM97kd62m-EjaM66Mo_2bIN8yP2pzaG4wQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKEZG8ITXUh3I1FCfC4K2E5g6MtizSHKJF_A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXD5KutC2Bejkpf6igB2cmPVxV87_ezYxvBQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROKkNFn6cYC29l8MXEmZEXbXaj13LE9HZhOQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbiGb-G_KsIcCG_4pQNEwoKJUWFywbr-NAUQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_c8ST7JTdrKIS90tznsZIVt4ZaQ42LB3K0Q&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnwaCfj5XYzFZySTIxL7BN1eHABFqIUkuAXQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb68QfLt2aDOzW2dk-H1sdvh98nEOS5Uy74A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4IbguWBJU4ypOHKKdMw7kFnrn1d7WzHTbSA&s",
    "https://play-lh.googleusercontent.com/ladsNim2g-g_Yc8NUcF2fo3qdxDsg91ZmJZmgQe-GKrwlvm1Mpaalt8y4dlWe4TuaD8",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMQG3m5mz0C4h30kNIou_4Vnq5oPuv-6cgTg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxvCjJJoCU4zh4Xz5TLUPrsCXmBpaRUehl5A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfW7UPMh0MA58qOWZe5Mv5_SvrLME0c6Q9Hg&s",
    "https://avatars.githubusercontent.com/u/194261944?s=200&v=4",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNK5Dd0ahUta40pXXS-foPtlqwkKaxszKAmQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB2VQthDtGP_61Rk7QEN-HgdiuAxZFEwQgKA&s",
    "https://pbs.twimg.com/profile_images/1946262175850373120/s26duOOP_400x400.png",
    "https://static.chainbroker.io/mediafiles/projects/flowx-finance/flowx-finance.jpeg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFNsFeJJP1psoI-XZIj8HvNicR5WpOdXoiPw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbcKGWTYEUYvZuEHSUYJGOCqv0L2KMZa55cA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5vZMGhRDTiYHpqC3AjQ1N7M7NIMuGwpz0pQ&s",
    "https://s2.coinmarketcap.com/static/img/coins/200x200/25114.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB1Mass2PEeP8hXGhHmRpVBbrd7Mdryfw5kA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDn1pdMpOFqEVQxBcH_r5_Mr6aCLvokRQAKA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM2cTZ2RynkVJewgh-jofDoPwr5UjsOV0Vkg&s",
    "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIa3GDAlj9jCzDOu-MBV7_NRhZ4VlzN-i8pg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxvCjJJoCU4zh4Xz5TLUPrsCXmBpaRUehl5A&s",
    "https://s2.coinmarketcap.com/static/img/coins/200x200/32864.png",
    "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/buck.svg/public"
  ];

  const mosaicTiles = [];
  for (let i = 0; i < 200; i++) {
    mosaicTiles.push(logos[i % logos.length]);
  }

  return (
    <>
      <div className="mosaic-background">
        {mosaicTiles.map((logo, index) => (
          <img key={index} src={logo} alt="" className="mosaic-tile" />
        ))}
      </div>
      <div className="background-overlay"></div>
      <div className="header">
        <div className="background-glow"></div>
        <div className="header-top">
          <div className="logo-container">
            <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image" />
            <span className="logo-text">Seal</span>
          </div>
          {!isMobile ? (
            <div className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
              <div className={`nav-item ${openDropdown === "trade" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("trade")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">Trade</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={`dropdown ${openDropdown === "trade" ? "open" : ""}`}>
                  <Link to="/app" className="dropdown-item">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                    </svg>
                    Swap
                  </Link>
               
                 
                 
                </div>
              </div>
              <div className={`nav-item ${openDropdown === "earn" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("earn")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">Earn</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={`dropdown ${openDropdown === "earn" ? "open" : ""}`}>
                  <Link to="/pool" className="dropdown-item">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M5.68 5.792 7.345 7.75 5.681 9.708a2.75 2.75 0 1 1 0-3.916ZM8 6.978 6.416 5.113l-.014-.015a3.75 3.75 0 1 0 0 5.304l.014-.015L8 8.522l1.584 1.865.014.015a3.75 3.75 0 1 0 0-5.304l-.014.015zm.656.772 1.663-1.958a2.75 2.75 0 1 1 0 3.916z"/>
                    </svg>
                    Pools
                  </Link>
                 
                  <a href="#" className="dropdown-item">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M5.493 0a.5.5 0 0 1 .493.606L5.533 4.938A.498.498 0 0 1 5.038 5.5c-1.636 0-3.087.313-4.355.869l-.706 1.947A.5.5 0 0 1-.857 7.925l3.847 2.236c-.713 1.352-1.131 2.754-1.26 4.165a.5.5 0 0 1-.968-.326c.14-1.453.59-2.888 1.325-4.29L.41 8.008A.5.5 0 0 1 .824 7.05l1.934.708c.613-1.291 1.328-2.562 2.105-3.837h-2.808a.5.5 0 0 1 .5-.5h3.5zM12 5.5c1.636 0 3.087.313 4.355.869l.706 1.947a.5.5 0 0 1 .474.391l-3.847 2.236c.713 1.352 1.131 2.754 1.26 4.165a.5.5 0 0 1 .968-.326c-.14-1.453-.59-2.888-1.325-4.29l2.536-1.468a.5.5 0 0 1-.414-.958l-1.934.708c-.613-1.291-1.328-2.562-2.105-3.837h2.808a.5.5 0 0 1-.5.5h-3.5z"/>
                    </svg>
                    Rewards
                  </a>
                  <Link to="/xseal" className="dropdown-item">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42 .893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c .24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072 .56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048 .625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692a1.54 1.54 0 0 1 1.044-1.262c.658-.215 1.777-.562 2.887-.87z"/>
<path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/>
                    </svg>
                    Burn
                  </Link>
                </div>
              </div>
              <div className={`nav-item ${openDropdown === "bridge" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("bridge")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">Bridge</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={`dropdown ${openDropdown === "bridge" ? "open" : ""}`}>
                  <a href="https://bridge.sui.io/" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16" style={{transform: 'rotate(180deg)'}}>
                      <path fill-rule="evenodd" d="M7.21 .8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.12 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21 .8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
<path fill-rule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z"/>
                    </svg>
                    Sui Bridge
                  </a>
                  <a href="https://bridge.cetus.zone/sui" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342 .474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
                    </svg>
                    Wormhole
                  </a>
                  <a href="https://mayan.finance/" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M3 3h10v10H3z" fill="currentColor"/>
                    </svg>
                    Mayan
                  </a>
                </div>
              </div>
              <div className={`nav-item ${openDropdown === "more" ? "open" : ""}`} 
                   onMouseEnter={() => toggleDropdown("more")} 
                   onMouseLeave={() => toggleDropdown(null)}>
                <span className="nav-text">More</span>
                <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                  <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                </svg>
                <div className={`dropdown ${openDropdown === "more" ? "open" : ""}`}>
                  
                 
                  
                 
                  <a href="#" className="dropdown-item">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                      <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
<path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v3.5H11V4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                    </svg>
                    Docs
                  </a>
                  <a href="#" className="dropdown-item">
                    <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16" style={{transform: 'rotate(180deg)'}}>
                      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42 .893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c .24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072 .56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048 .625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692a1.54 1.54 0 0 1 1.044-1.262c.658-.215 1.777-.562 2.887-.87z"/>
<path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                    </svg>
                    Security
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <button className="hamburger-menu" onClick={toggleMenu}>
              <svg className="hamburger-icon" viewBox="0 0 24 24" width="24px" height="24px">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="var(--text-color)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <div className="wallet-actions">
            <CustomConnectButton />
            <a href="https://x.com/sealprotocol_" target="_blank" rel="noopener noreferrer" className="icon-button css-fi49l4">
              <div className="css-1ke24j5">
                <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1 2.25h7.28l4.71 6.23zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
            </a>
            <a href="https://t.me/sealprotocol" target="_blank" rel="noopener noreferrer" className="icon-button css-163hjq3">
              <div className="css-1ke24j5">
                <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                  <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.06L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
      {isMobile && (
        <Sidebar isOpen={isMenuOpen} onClose={toggleMenu} />
      )}
      <div className="container123">
        <div className="summary-container" style={{ maxHeight: '600px' }}>
          <div className="summary-left">
            <h1 className="summary-title">Liquidity Pools</h1>
            <div className="summary-metrics-card">
              <div className="metric-item">
                <p className="metric-label">Total Value Locked</p>
                <p className="metric-value">
                  ${pools.reduce((sum, pool) => sum + parseFloat(pool.liquidity.slice(1).replace(/,/g, '')), 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="metric-item">
                <p className="metric-label">Cumulative Volume</p>
                <p className="metric-value">
                  ${pools.reduce((sum, pool) => sum + parseFloat(pool.volume.slice(1).replace(/,/g, '')), 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="summary-right">
            <div className="chart-header">
              <div className="chart-title-container">
                <p className="chart-title">{chartTitle}</p>
                <p className="chart-volume">{formatVolume(totalVolume)}</p>
              </div>
              <div className="period-selector">
                <button
                  className={`period-button ${chartPeriod === "D" ? "active" : ""}`}
                  onClick={() => setChartPeriod("D")}
                >
                  D
                </button>
                <button
                  className={`period-button ${chartPeriod === "W" ? "active" : ""}`}
                  onClick={() => setChartPeriod("W")}
                >
                  W
                </button>
                <button
                  className={`period-button ${chartPeriod === "M" ? "active" : ""}`}
                  onClick={() => setChartPeriod("M")}
                >
                  M
                </button>
              </div>
            </div>
            <div className="chart-container" style={{ position: 'relative' }}>
              <svg width="100%" height={chartHeight + 30} viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}>
                <defs>
                  <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ADD8E6', stopOpacity: 0.8 }} />
                    <stop offset="100%" style={{ stopColor: '#87CEEB', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <g transform="translate(0, -30)">{bars}</g>
                <g transform="translate(0, -30)">{xAxisLabels}</g>
              </svg>
            </div>
          </div>
        </div>
        <div className="pool-header100">
          <div className="tab-wrapper">
            <div className="tab-group100">
              <button
                className={`tab-button100 ${activeTab === "pools" ? "active" : ""}`}
                onClick={() => setActiveTab("pools")}
              >
                <div data-active={activeTab === "pools"} className="css-1vz5i52">
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAwCAYAAABe6Vn9AAAAAXNSR0IArs4c6QAABW1JREFUaEPtmX9MlVUYxz+viaCJSAoxDDFBmFG6wLUcWGDNsmxhUJLxhxQ11x9ZgTgwWsvwR2JkW2urNFspOFGhtazVBENileSy1gJ/DZ0oohUqyq/xdh/ee/VygXvfc1+S5jjbu9299/k+5/me57zPOed7NG6wpt1gfBgm9H/P6HCGhjN0nUfAmyl3M/AQ8AgQAYTaHwm90f4cBb4CvgFaXThZxbsdIhVCdwP5wHzAz+TAtwF7gFV2eyv4g2b6NEMoHCgAFgMamqYTf4dGcjzETYPQCcbTk5/zxlN7GMqqofoPHV2XPnR7MBpoOgHxGkHJMC4OfENhlCQZ6GiE9ka4UAvNZdBSrcNV/DZgJdDgjpgnQpKNYiAAXx+dZQs1slIgONDMYEHxXliyATo6YYQvhC2DyVkwKtgcvuMsnNgAJzfqdLdLrC3A0/as9+vDHaEs4G1gBCkJULQUwkwGIl1tKIXlH4GuQ1AKRBWBX5g5Iq5WbSeh/hVo3in/dAM50kN/zgYiJGQKe6ZKQYZGngyKQhMy2R8agKkFcHueAtiN6fHVcGylTF+JO7s/Uv0Rkmn2ZQ+oJE9jUaJaMHt+gkfzjczcWQK3LlLDe7Ju2g6/pwkpeRa4Tj9XQlIAfu35ZgoyUM5MQxPMWAoXWgc3M64kjxfAsdfkrXxTM50LhSuhz4Fner6Z0tc9jVXf/9PXwta9xjczo1Qdr4I4lOr4prYC6Q6oMyFZZ2rx9YHDn2hKBUC8HTwCsS8a1Wz2Ye8LgFlSUihqpkn1E0ScRCA/nAntBpLJeQrWZZp1e81u4RtQ9gOE50DkOnW8N4gjK6BBCjES+xPOhGQ7cg5N8+VMiWZ6nXEE0XoFJqRCexfMOWN+nfGGhDNG1qmqEFl8JU0TZZvlyJCw20lCDFQVqXezaz+kvAkBCTCrSh1vBXFgDrTsFw8pwC4HoY+B5yh8AbJS1d1nvgObvobIQgiXJew6toZCOLJcOtwEZDoIVQCJVKyHRKmCii0pGyoPQWwFBCquW4pd9TH/uxJ+SZLXlUCSg1AdEEXdZoi6Tb2L6AyoPwWz62BMlDreCuJyPdREi4d6274z2kHoom2rM5aL5TB2tLp7bZ46pj/E3G7QPO2XXYBdl2Cfv7y8ZNsK+fcmdKEM/MeoBzdmAVzpUMc5IzQfmOuFj66LsG9cH0LWppwVKkcbIXIJ+E2FeDnoKrYBppy1oqAYQy/zb2thXi4EPgCx36l7GqAoWCvb6mFcQ2zcDS9/AKHPw3T7kUPF3wBl29rCqhKAq+39WfD9bxBTDCFp6p4GWFitbX3UwzAQp8/DpMWg+cJ95+AmCUOhudn6iBdrm1OFOK6a5m+b t7ZBcCrctUPdg5vNqTizdnxQDefEWYh+Fto6YNaPEHCPmgcTxwdxaO2ApxLSk6ugtApC0iHmMxWkYWvigCdm1o7gZsNaWwK5m41v5t4/wU9xu6VwBJeQrIkknkhtr4S01cbZckY5BD3mCdH7f0WRxAG2JmMNFOKaYli5xVCEpr0Lk5epkfFSxnIm5b3Q6BzqqXPw0vuwq9rITMQamLLCPJlBEBodnVmTgpv/gfU74L0ynfZOrUdAmf4phJjU6gZZCnaQ8izWTwkx9OvTfxli/c918EWNIdZ3dzvEemNnr43UCXxQY+J88I+D0REwcjzoXU5i/QFoLv9PxHrnaSHrlIh1D/e5TkmaCRWiT/Zpom6eBl61i4G59qLjY3K+OV/HDNp1imvf/V1YSRZH2a47Om1C+mWgybZQl9u157MuDm6xaWiP2y7DZgOxwCRgPNBl8sLM7VgoHg9NjusQmg0TGsLBN9X1cIZMDdMQGg1naAgH31TX/wKFcsNAOFcQtQAAAABJRU5ErkJggg==" className="chakra-image css-1or3okw" />
                  <p className="chakra-text css-19ucwcx" data-active={activeTab === "pools"}>Pools</p>
                  <div className="css-1gnvmfy">{pools.length}</div>
                </div>
              </button>
              <button
                className={`tab-button100 ${activeTab === "positions" ? "active" : ""}`}
                onClick={() => setActiveTab("positions")}
              >
                <div data-active={activeTab === "positions"} className="css-1vz5i52">
                  <img src="data:image/png;base64,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" className="chakra-image css-1or3okw" />
                  <p className="chakra-text css-19ucwcx" data-active={activeTab === "positions"}>Positions</p>
                  <div className="css-1gnvmfy">0</div>
                </div>
              </button>
            </div>
          </div>
          <div className="button-group100">
            {activeTab === "positions" ? (
              <>
                <button className="create-pool-button100" onClick={handleCreatePool}>
                  LP Burn
                </button>
                <button className="add-liquidity-button100" onClick={() => handleAddLiquidity(null)}>
                  Add Liquidity
                </button>
              </>
            ) : (
              <>
                <button className="create-pool-button100" onClick={handleCreatePool}>
                  Create a new pool
                </button>
                <button className="add-liquidity-button100" onClick={() => handleAddLiquidity(null)}>
                  Add Liquidity
                </button>
              </>
            )}
          </div>
        </div>
        {activeTab === "pools" ? (
          <PoolList
            pools={pools}
            prices={{}}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isAddLiquidityOpen={isAddLiquidityOpen}
            selectedPool={selectedPool}
            handleAddLiquidity={handleAddLiquidity}
            handleCloseAddLiquidityModal={handleCloseAddLiquidityModal}
            refresh={refresh}
            isLoading={isLoading}
          />
        ) : (
          <PositionComponent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleAddLiquidity={handleAddLiquidity}
            pools={pools}
          />
        )}
        
      </div>
    </>
  );
}

interface PositionProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  handleAddLiquidity: (pool: Pool | null, scroll?: boolean) => void;
  pools: Pool[];
}

interface Position extends Pool {
  liquidity: string;
  unclaimedFees: string;
  share: string;
  userLiquidity: string;
}

const PositionComponent = ({ activeTab, setActiveTab, handleAddLiquidity, pools }: PositionProps) => {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(true);
  const [totalLiquidity, setTotalLiquidity] = useState(0);
  const [pendingYield, setPendingYield] = useState(0);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const fetchPositions = useCallback(async () => {
    if (!currentAccount) {
      setPositions([]);
      setIsLoadingPositions(false);
      setTotalLiquidity(0);
      setPendingYield(0);
      return;
    }

    setIsLoadingPositions(true);
    const userPositions: Position[] = [];
    let totalLiq = 0;
    let totalPend = 0;

    for (const pool of pools) {
      try {
        const poolObj = await client.getObject({
          id: pool.poolAddress,
          options: { showContent: true },
        });
        if (poolObj.data?.content?.dataType !== "moveObject") continue;

        const fields = poolObj.data.content.fields as any;
        const total_liquidity = BigInt(fields.total_liquidity || 0);
        if (total_liquidity === 0n) continue;

        const user_shares_id = fields.user_shares?.fields?.id?.id;
        if (!user_shares_id) continue;

        const shareObjResponse = await client.getDynamicFieldObject({
          parentId: user_shares_id,
          name: { type: 'address', value: currentAccount.address },
        });

        if (!shareObjResponse || !shareObjResponse.data) continue;

        const user_liquidity = BigInt((shareObjResponse.data.content as any).fields.value || 0);
        if (user_liquidity === 0n) continue;

        const reserve_x = BigInt(fields.reserve_x || 0);
        const reserve_y = BigInt(fields.reserve_y || 0);
        const fee_balance_x = BigInt(fields.fee_balance_x || 0);
        const fee_balance_y = BigInt(fields.fee_balance_y || 0);

        const amount_x = (user_liquidity * reserve_x) / total_liquidity;
        const amount_y = (user_liquidity * reserve_y) / total_liquidity;
        const user_fee_x = (user_liquidity * fee_balance_x) / total_liquidity;
        const user_fee_y = (user_liquidity * fee_balance_y) / total_liquidity;

        const priceX = await getTokenPrice(pool.token1Symbol);
        const priceY = await getTokenPrice(pool.token2Symbol);

        const formatted_amount_x = Number(amount_x) / Math.pow(10, pool.decimals1);
        const formatted_amount_y = Number(amount_y) / Math.pow(10, pool.decimals2);
        const formatted_fee_x = Number(user_fee_x) / Math.pow(10, pool.decimals1);
        const formatted_fee_y = Number(user_fee_y) / Math.pow(10, pool.decimals2);
        const sharePercent = ((Number(user_liquidity) / Number(total_liquidity)) * 100).toFixed(2);

        const user_liquidity_usd = formatted_amount_x * priceX + formatted_amount_y * priceY;
        const user_fees_usd = formatted_fee_x * priceX + formatted_fee_y * priceY;

        const pos: Position = {
          ...pool,
          liquidity: `$${user_liquidity_usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          unclaimedFees: `$${user_fees_usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          share: `${sharePercent}%`,
          userLiquidity: user_liquidity.toString(),
        };

        userPositions.push(pos);
        totalLiq += user_liquidity_usd;
        totalPend += user_fees_usd;
      } catch (error) {
        console.error(`Error fetching position for pool ${pool.poolAddress}:`, error);
      }
    }

    setPositions(userPositions);
    setTotalLiquidity(totalLiq);
    setPendingYield(totalPend);
    setIsLoadingPositions(false);
  }, [currentAccount, client, pools]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const handleClaimAll = async () => {
    const tx = new Transaction();
    for (const pos of positions) {
      const unclaimed = parseFloat(pos.unclaimedFees.slice(1).replace(/,/g, ''));
      if (unclaimed > 0) {
        tx.moveCall({
          target: `${PACKAGE_ID}::amm::claim_fees`,
          typeArguments: [pos.token1Address, pos.token2Address],
          arguments: [tx.object(pos.poolAddress)],
        });
      }
    }
    await signAndExecute(
      { transaction: tx },
      { onSuccess: () => fetchPositions() }
    );
  };

  const handleClaimFees = async (pos: Position) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::amm::claim_fees`,
      typeArguments: [pos.token1Address, pos.token2Address],
      arguments: [tx.object(pos.poolAddress)],
    });
    await signAndExecute(
      { transaction: tx },
      { onSuccess: () => fetchPositions() }
    );
  };

  const handleRemoveAll = async (pos: Position) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::amm::remove_liquidity`,
      typeArguments: [pos.token1Address, pos.token2Address],
      arguments: [
        tx.object(pos.poolAddress),
        tx.pure.u128(pos.userLiquidity),
      ],
    });
    await signAndExecute(
      { transaction: tx },
      { onSuccess: () => fetchPositions() }
    );
  };

  if (isLoadingPositions) {
    return <div className="card-style no-positions">Loading positions...</div>;
  }

  return (
    <div className="positions-container">
      <div className="filter-row100">
        <div className="chakra-stack css-1igwmid">
          <div className="css-3wh1mk">
            <div className="chakra-stack css-yue5ly">
              <div className="css-1ke24j5">
                <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                  <use xlinkHref="#icon-icon_collapse"></use>
                </svg>
              </div>
            </div>
          </div>
          <div className="css-1vpx1e5">
            <button onClick={fetchPositions} className="css-1pin1cu">
              <div className="css-0">
                <div className="css-0">
                  <div className="css-1ke24j5">
                    <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                      <use xlinkHref="#icon-icon_refresh"></use>
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="card-container">
        <div className="card-style">
          <div className="chakra-stack css-1jra5w9">
            <p className="chakra-text css-17xjxxf">Total Liquidity</p>
            <p className="chakra-text css-1ikb94c">
              ${totalLiquidity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="card-style">
          <div className="chakra-stack css-17na8xj">
            <p className="chakra-text css-17xjxxf">Pending Yield</p>
            <div className="chakra-stack css-1igwmid">
              <div className="chakra-stack css-lpuqkz">
                <button id="popover-trigger-:r76t:" className="css-gmuwbf">
                  <p className="chakra-text css-bae340">
                    ${pendingYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </button>
              </div>
              <button 
                type="button" 
                className="chakra-button css-2h2e64" 
                disabled={pendingYield === 0}
                onClick={handleClaimAll}
              >
                Claim All
              </button>
            </div>
          </div>
        </div>
      </div>
      {positions.length === 0 ? (
        <div className="card-style no-positions">
          <img src="https://app.cetus.zone/images/img_nopositions@2x.png" className="chakra-image css-f5j44i" />
          <p className="chakra-text css-dwkbww">No liquidity positions</p>
        </div>
      ) : (
        <div className="positions-list">
          <div className="pool-table-header100">
            <div>Pool</div>
            <div>Liquidity</div>
            <div>Share</div>
            <div>Unclaimed Fees</div>
            <div>APR</div>
            <div>Actions</div>
          </div>
          {positions.map((pos, index) => (
            <div key={index} className="pool-item100">
              <div className="pool-token-info100">
                <div className="token-images100">
                  <img src={pos.img1} alt={pos.token1Symbol} />
                  <img src={pos.img2} alt={pos.token2Symbol} />
                </div>
                <div className="token-details100">
                  <div className="token-pair100">
                    <p>{pos.token1Symbol} / {pos.token2Symbol}</p>
                    <span>{pos.feeRate}</span>
                  </div>
                </div>
              </div>
              <div className="pool-data100">{pos.liquidity}</div>
              <div className="pool-data100">{pos.share}</div>
              <div className="pool-data100">{pos.unclaimedFees}</div>
              <div className="apr-container100">{pos.apr}</div>
              <div className="pool-action100">
                <button className="deposit-button100" onClick={() => handleAddLiquidity(pos)}>Add</button>
                <button 
                  className="deposit-button100" 
                  onClick={() => handleClaimFees(pos)}
                  disabled={parseFloat(pos.unclaimedFees.slice(1).replace(/,/g, '')) === 0}
                >Claim</button>
                <button className="deposit-button100" onClick={() => handleRemoveAll(pos)}>Remove All</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pool;