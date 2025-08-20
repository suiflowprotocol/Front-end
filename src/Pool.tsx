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
import CreatePool from "./CreatePool";
import AddLiquidityModal from "./AddLiquidityModal";
import PoolList from "./PoolList";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./SidebarMenu";
import "./Pool.css";
import "./App.css";
import "./App2.css";
import "./SidebarMenu.css";
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';

const PACKAGE_ID = "0xb90158d50ac951784409a6876ac860e24564ed5257e51944d3c693efb9fdbd78";
const POOL_REGISTRY = "0xfc8c69858d070b639b3db15ff0f78a10370950434c5521c83eaa7e2285db8d2a";

const ADDRESS_MAPPINGS = {
  "d52c440f67dd960bc76f599a16065abd5fbc251b78f18d9dce3578ccc44462a9": "0xd52c440f67dd960bc76f599a16065abd5fbc251b78f18d9dce3578ccc44462a9",
  "b3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba": "0xb3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba",
  "b677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f": "0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f",
  "a16e100fcb99689d481f31a2315519923fdf45916a4fa18c5513008f5101237d":"0xa16e100fcb99689d481f31a2315519923fdf45916a4fa18c5513008f5101237d",
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
    primaryButton: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    primaryButtonHover: 'linear-gradient(135deg, #4b9内核9cfa, #3b82f6)',
    outlineButtonHover: '#F3F4F6',
    modalOverlay: 'rgba(15, 23, 42, 0.3)',
    modalPrimary: '#ffffff',
    modalSecondary: '#F9FAFB',
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
}

export interface PoolListProps {
  pools: Pool[];
  prices: { [key: string]: number };
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  isCreatePoolOpen: boolean;
  handleCreatePool: () => void;
  handleCloseCreatePool: () => void;
  isAddLiquidityOpen: boolean;
  selectedPool: Pool | null;
  handleAddLiquidity: (pool: Pool | null, scroll?: boolean) => void;
  handleCloseAddLiquidityModal: () => void;
  newPoolToken1: string;
  newPoolToken2: string;
  feeRate: string;
  setNewPoolToken1: React.Dispatch<React.SetStateAction<string>>;
  setNewPoolToken2: React.Dispatch<React.SetStateAction<string>>;
  setFeeRate: React.Dispatch<React.SetStateAction<string>>;
  getTokenAddress: (symbol: string) => string;
  refresh: () => void;
  isLoading: boolean;
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
        pool.fees24h === nextPool.fees24h
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
              decimals1: tokenX.decimals || 9,
              decimals2: tokenY.decimals || 9,
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
  const [newPoolToken1, setNewPoolToken1] = useState("");
  const [newPoolToken2, setNewPoolToken2] = useState("");
  const [feeRate, setFeeRate] = useState("0.25");
  const [activeTab, setActiveTab] = useState("pools");
  const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
  const [isAddLiquidityOpen, setIsAddLiquidityOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

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

  const getTokenAddress = (symbol: string): string => {
    const token = tokens.find(t => t.symbol === symbol);
    if (!token) {
      console.error(`Token ${symbol} not found in tokens list`);
      return "0x0";
    }
    return token.address;
  };

  const handleCreatePool = () => {
    setIsCreatePoolOpen(true);
  };

  const handleCloseCreatePool = () => {
    setIsCreatePoolOpen(false);
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
    AFSUI: "BLUE",
    VSUI: "BLUE",
    NAVX: "NAVX",
    USDY: "USDY",
    FUD: "FUD",
    HAEDAL: "HAEDAL",
    NS: "NS",
    CETUS: "CETUS",
    DEEP: "DEEP",
    WAL: "WAL",
    SCA: "SCA",
    HASUI: "BLUE",
    BUCK: "BUCK",
    "OKX_WRAPPED_BTC": "BTC",
    "TETHER_SUI_BRIDGE": "USDT"
  };

  useEffect(() => {
    const fetchPrices = async () => {
      const uniqueSymbols = new Set<string>();
      pools.forEach(pool => {
        uniqueSymbols.add(pool.token1Symbol.toUpperCase());
        uniqueSymbols.add(pool.token2Symbol.toUpperCase());
      });
      const symbols = Array.from(uniqueSymbols).filter(sym => cryptoCompareIds[sym]).join(',');
      if (!symbols) return;

      try {
        const response = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbols}&tsyms=USD`);
        const data = await response.json();
        const newPrices: { [key: string]: number } = {};
        for (const sym of Array.from(uniqueSymbols)) {
          const ccId = cryptoCompareIds[sym];
          const raw = data.RAW[ccId];
          if (raw && raw.USD && raw.USD.PRICE) {
            newPrices[sym.toLowerCase()] = raw.USD.PRICE;
          } else {
            newPrices[sym.toLowerCase()] = 1;
          }
        }
        setPrices(newPrices);
      } catch (err) {
        console.error('Failed to fetch prices:', err);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [pools]);

  const chartData = [
    { date: '20', volume: 120 },
    { date: '22', volume: 110 },
    { date: '24', volume: 100 },
    { date: '26', volume: 90 },
    { date: '28', volume: 80 },
    { date: '30', volume: 70 },
    { date: '01', volume: 60 },
    { date: '03', volume: 50 },
    { date: '05', volume: 40 },
    { date: '07', volume: 30 },
    { date: '09', volume: 20 },
    { date: '11', volume: 10 },
    { date: '13', volume: 20 },
    { date: '15', volume: 30 },
    { date: '17', volume: 40 },
    { date: '19', volume: 50 },
  ];

  const totalTVL = pools.reduce((sum, p) => {
    const price1 = prices[p.token1Symbol.toLowerCase()] || 1;
    const price2 = prices[p.token2Symbol.toLowerCase()] || 1;
    const rx = Number(p.reserveX) / 10 ** p.decimals1 * price1;
    const ry = Number(p.reserveY) / 10 ** p.decimals2 * price2;
    return sum + rx + ry;
  }, 0);

  const cumulativeVolume = 0;

  const tradingVolume = 206684958.77;

  const logos = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqYyygKaispLzlgNY95kc5HBQd3qW7ugzAkg&s",
    "https://s2.coinmarketcap.com/static/img/coins/200x200/34187.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7PSlNuhwWmSkl8hUhvKcDI2sFhPN5izx9EQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyEbrXvJmpRWuhl4sKr6Uz2QcUqdp9A_3QDA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcRuyM97kd62m-EjaM66Mo_2bIN8yP2pzaG4wQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcTKEZG8ITXUh3I1FCfC4K2E5g6MtizSHKJF_A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcSXD5KutC2Bejkpf6igB2cmPVxV87_ezYzhOQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcROKkNFn6cYC29l8MXEmZEXbXaj13LE9HZhOQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcTbiGb-G_KsIcCG_4pQNEwoKJUWFywbr-NAUQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcS4IbguWBJU4ypOHKKdMw7kFnrn1d7WzHThSA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcQnwaCfj5XYzFZySTIxL7BN1eHABFqIUkuAXQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcTb68QfLt2aDOzW2dk-H1sdvh98nEOS5Uy74A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcS4IbguWBJU4ypOHKKdMw7kFnrn1d7WzHThSA&s",
    "https://play-lh.googleusercontent.com/ladsNim2g-g_Yc8NUcF2fo3qdxDsg91ZmJZmgQe-GKrwlvm1Mpaalt8y4dlWe4TuaD8",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcTMQG3m5mz0C4h30kNIou_4Vnq5oPuv-6cgTg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcRxvCjJJoCU4zh4Xz5TLUPrsCXmBpaRUehl5A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcSfW7UPMh0MA58qOWZe5Mv5_SvrLME0c6Q9Hg&s",
    "https://avatars.githubusercontent.com/u/194261944?s=200&v=4",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcRNK5Dd0ahUta40pXXS-foPtlqwkKaxszKAmQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcTB2VQthDtGP_61Rk7QEN-HgdiuAxZFEwQgKA&s",
    "https://pbs.twimg.com/profile_images/1946262175850373120/s26duOOP_400x400.png",
    "https://static.chainbroker.io/mediafiles/projects/flowx-finance/flowx-finance.jpeg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcRFNsFeJJP1psoI-XZIj8HvNicR5WpOdXoiPw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcRbcKGWTYEUYvZuEHSUYJGOCqv0L2KMZa55cA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcQ5vZMGhRDTiYHpqC3AjQ1N7M7NIMuGwpz0pQ&s",
    "https://s2.coinmarketcap.com/static/img/coins/200x200/25114.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcRB1Mass2PEeP8hXGhHmRpVBbrd7Mdryfw5kA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcSDn1pdMpOFqEVQxBcH_r5_Mr6aCLvokRQAKA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcQM2cTZ2RynkVJewgh-jofDoPwr5UjsOV0Vkg&s",
    "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcTIa3GDAlj9jCzDOu-MBV7_NRhZ4VlzN-i8pg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=GcRxvCjJJoCU4zh4Xz5TLUPrsCXmBpaRUehl5A&s",
    "https://s2.coinmarketcap.com/static/img/coins/200x200/32864.png",
    "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/buck.svg/public"
  ];

  return (
    <WalletProvider theme={customTheme}>
      <div className="container">
        <div className="header">
          <div className="background-glow header-glow"></div>
          <div className="header-top">
            <div className="logo-container">
              <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image" />
              <span className="logo-text">Seal</span>
            </div>
            {!isMobile ? (
              <div className="nav-menu">
                <div
                  className={["nav-item", openDropdown === "trade" ? "open" : ""].join(" ")}
                  onMouseEnter={() => toggleDropdown("trade")}
                  onMouseLeave={() => toggleDropdown(null)}
                >
                  <span className="nav-text">Trade</span>
                  <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                    <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                  </svg>
                  <div className={["dropdown", openDropdown === "trade" ? "open" : ""].join(" ")}>
                    <Link to="/app" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                      </svg>
                      Swap
                    </Link>
                  </div>
                </div>
                <div
                  className={["nav-item", openDropdown === "earn" ? "open" : ""].join(" ")}
                  onMouseEnter={() => toggleDropdown("earn")}
                  onMouseLeave={() => toggleDropdown(null)}
                >
                  <span className="nav-text">Earn</span>
                  <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                    <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                  </svg>
                  <div className={["dropdown", openDropdown === "earn" ? "open" : ""].join(" ")}>
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
                        <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42 .893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072 .56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048 .625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692a1.54 1.54 0 0 1 1.044-1.262c.658-.215 1.777-.562 2.887-.87z"/>
                        <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/>
                      </svg>
                      Burn
                    </Link>
                  </div>
                </div>
                <div
                  className={["nav-item", openDropdown === "bridge" ? "open" : ""].join(" ")}
                  onMouseEnter={() => toggleDropdown("bridge")}
                  onMouseLeave={() => toggleDropdown(null)}
                >
                  <span className="nav-text">Bridge</span>
                  <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                    <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                  </svg>
                  <div className={["dropdown", openDropdown === "bridge" ? "open" : ""].join(" ")}>
                    <a href="https://bridge.sui.io/" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16" style={{transform: 'rotate(180deg)'}}>
                        <path fillRule="evenodd" d="M7.21 .8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21 .8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 9.75 3.72 7.623 1.82z"/>
                        <path fillRule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z"/>
                      </svg>
                      Sui Bridge
                    </a>
                    <a href="https://bridge.cetus.zone/sui" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                        <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
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
                <div
                  className={["nav-item", openDropdown === "more" ? "open" : ""].join(" ")}
                  onMouseEnter={() => toggleDropdown("more")}
                  onMouseLeave={() => toggleDropdown(null)}
                >
                  <span className="nav-text">More</span>
                  <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                    <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
                  </svg>
                  <div className={["dropdown", openDropdown === "more" ? "open" : ""].join(" ")}>
                    <a href="#" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm-1 11V9.5l6 3.6 6-3.6v4.3a1 1 0 0 0-1 1H2a1 1 0 0 0-1-1z"/>
                      </svg>
                      Docs
                    </a>
                    <a href="#" className="dropdown-item">
                      <svg aria-hidden="true" fill="currentColor" width="20px" height="20px" viewBox="0 0 16 16" style={{transform: 'rotate(180deg)'}}>
                        <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42 .893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072 .56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048 .625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692a1.54 1.54 0 0 1 1.044-1.262c.658-.215 1.777-.562 2.887-.87z"/>
                        <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                      </svg>
                      Security
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={toggleMenu} className="menu-toggle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            )}
            <div className="wallet-actions">
              <CustomConnectButton />
              <button
                id="popover-trigger-notification"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls="popover-content-notification"
                className="icon-button css-fi49l4"
              >
                <div className="css-1ke24j5">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-1.1-.9-2-2-2s-2 .9-2 2v.68C6.63 5.36 5 7.92 5 11v5l-2 2v1h18v-1l-2-2z"></path>
                  </svg>
                </div>
              </button>
              <button
                id="popover-trigger-rpc"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls="popover-content-rpc"
                className="icon-button css-163hjq3"
              >
                <div className="css-1ke24j5">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.30-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
        {isMobile && (
          <Sidebar isOpen={isMenuOpen} onClose={toggleMenu} />
        )}
        <div className="pool-container100">
          <div className="summary-container100" style={{ maxHeight: '600px' }}>
            <div className="summary-left100">
              <p className="chakra-text css-rtl097">Liquidity Pools</p>
              <div className="chakra-stack css-17eny3d card-style">
                <div className="chakra-stack css-17ivrr5 card-metric">
                  <p className="chakra-text css-1s14ber">Total Value Locked</p>
                  <div className="chakra-stack css-1igwmid">
                    <p className="chakra-text css-wg8tsw">${totalTVL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
                <div className="chakra-stack css-17ivrr5 card-metric">
                  <p className="chakra-text css-1s14ber">Cumulative Volume</p>
                  <div className="chakra-stack css-1igwmid">
                    <p className="chakra-text css-wg8tsw">$0.00</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="css-ziizt4 card-style">
              <div className="css-tjbszq">
                <div className="chakra-stack css-1jjq5p5 card-metric">
                  <div className="chakra-stack css-1rfq7px">
                    <p className="chakra-text css-9co0bh">Trading Volume (24H)</p>
                    <div className="chakra-skeleton css-gbrdq1">
                      <p className="chakra-text css-abv05r">${tradingVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  <div className="css-yswd5i">
                    <div data-active="true" className="css-7fe9c2">
                      <p className="chakra-text css-1kznzez" data-active="true">D</p>
                    </div>
                    <div data-active="false" className="css-1kilo2x">
                      <p className="chakra-text css-elj7q0" data-active="false">W</p>
                    </div>
                    <div data-active="false" className="css-1kilo2x">
                      <p className="chakra-text css-elj7q0" data-active="false">M</p>
                    </div>
                  </div>
                </div>
                <div className="css-xxk67h card-chart">
                  <ResponsiveContainer width="100%" height={258}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="date" stroke="#909CA4" fontSize={12} fontFamily="Inter" />
                      <Bar dataKey="volume" fill="#75C8FF" radius={0} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          <div className="pool-header100">
            <div className="tab-group100">
              <button
                className={`tab-button100 ${activeTab === "pools" ? "active" : ""}`}
                onClick={() => setActiveTab("pools")}
              >
                Pools ({pools.length})
              </button>
              <button
                className={`tab-button100 ${activeTab === "positions" ? "active" : ""}`}
                onClick={() => setActiveTab("positions")}
              >
                Positions (0)
              </button>
            </div>
            <button className="create-pool-button100" onClick={handleCreatePool}>
              Create a new pool
            </button>
          </div>
          {activeTab === "pools" ? (
            <PoolList
              pools={pools}
              prices={prices}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isCreatePoolOpen={isCreatePoolOpen}
              handleCreatePool={handleCreatePool}
              handleCloseCreatePool={handleCloseCreatePool}
              isAddLiquidityOpen={isAddLiquidityOpen}
              selectedPool={selectedPool}
              handleAddLiquidity={handleAddLiquidity}
              handleCloseAddLiquidityModal={handleCloseAddLiquidityModal}
              newPoolToken1={newPoolToken1}
              newPoolToken2={newPoolToken2}
              feeRate={feeRate}
              setNewPoolToken1={setNewPoolToken1}
              setNewPoolToken2={setNewPoolToken2}
              setFeeRate={setFeeRate}
              getTokenAddress={getTokenAddress}
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
          {isMobile && (
            <div className="bottom-nav100">
              <button>Spot</button>
              <button>Perps</button>
              <button>Pools</button>
              <button>Lend</button>
              <button>Portfolio</button>
            </div>
          )}
        </div>
      </div>
    </WalletProvider>
  );
}

interface PositionProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  handleAddLiquidity: (pool: Pool | null, scroll?: boolean) => void;
  pools: Pool[];
}

const PositionComponent = ({ activeTab, setActiveTab, handleAddLiquidity, pools }: PositionProps) => {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const [positions, setPositions] = useState<any[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(true);

  useEffect(() => {
    if (!currentAccount) {
      setPositions([]);
      setIsLoadingPositions(false);
      return;
    }

    const fetchPositions = async () => {
      setIsLoadingPositions(true);
      const userPositions = [];
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

          const formatted_amount_x = Number(amount_x) / Math.pow(10, pool.decimals1);
          const formatted_amount_y = Number(amount_y) / Math.pow(10, pool.decimals2);
          const formatted_fee_x = Number(user_fee_x) / Math.pow(10, pool.decimals1);
          const formatted_fee_y = Number(user_fee_y) / Math.pow(10, pool.decimals2);
          const sharePercent = ((Number(user_liquidity) / Number(total_liquidity)) * 100).toFixed(2);

          userPositions.push({
            ...pool,
            liquidity: `${formatted_amount_x.toFixed(2)} ${pool.token1Symbol} + ${formatted_amount_y.toFixed(2)} ${pool.token2Symbol}`,
            unclaimedFees: `${formatted_fee_x.toFixed(4)} ${pool.token1Symbol} + ${formatted_fee_y.toFixed(4)} ${pool.token2Symbol}`,
            share: `${sharePercent}%`,
          });
        } catch (error) {
          console.error(`Error fetching position for pool ${pool.poolAddress}:`, error);
        }
      }
      setPositions(userPositions);
      setIsLoadingPositions(false);
    };

    fetchPositions();
  }, [currentAccount, client, pools]);

  if (isLoadingPositions) {
    return <div className="no-positions100">Loading positions...</div>;
  }

  return (
    <div className="positions-container">
      <div className="chakra-stack css-1535ss">
        <div className="chakra-stack css-a37t44">
          <div className="chakra-stack css-xlwmla">
            <div className="css-18rti1w">
              <div style={{width: '100%'}}>
                <button id="popover-trigger-:r76o:" className="css-1t2x70">
                  <div className="css-jn0mkj">
                    <div className="chakra-stack css-2qlcdh">
                      <div className="css-12xzxfu">
                        <div className="css-o5e85d">
                          <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                            <use xlinkHref="#icon-icon_search"></use>
                          </svg>
                        </div>
                        <p className="chakra-text css-1lher0p">Filter by token</p>
                      </div>
                      <div className="chakra-stack css-1igwmid"></div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div className="chakra-stack css-1igwmid">
              <div className="css-3wh1mk">
                <div className="chakra-stack css-yue1ly">
                  <div className="css-1ke24j5">
                    <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                      <use xlinkHref="#icon-icon_collapse"></use>
                    </svg>
                  </div>
                  <p className="chakra-text css-1v0j6vl">Collapse All</p>
                </div>
              </div>
              <div className="css-1vpx1e5">
                <div className="css-1pin1cu">
                  <div className="css-0">
                    <div className="css-0">
                      <div className="css-1ke24j5">
                        <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                          <use xlinkHref="#icon-icon_refresh"></use>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="css-10grt23"></div>
        <div className="chakra-stack css-1wgi00l">
          <div className="chakra-stack css-1jra5w9">
            <p className="chakra-text css-17xjxxf">Total Liquidity</p>
            <div className="chakra-skeleton css-a8ku0c">
              <p className="chakra-text css-1ikb94c">$--</p>
            </div>
          </div>
          <div className="chakra-stack css-17na8xj">
            <p className="chakra-text css-17xjxxf">Pending Yield</p>
            <div className="chakra-skeleton css-cdkrf0">
              <div className="chakra-stack css-1igwmid">
                <div className="chakra-stack css-lpuqkz">
                  <button id="popover-trigger-:r76t:" className="css-gmuwbf">
                    <p className="chakra-text css-bae340">$0</p>
                  </button>
                </div>
                <button type="button" className="chakra-button css-2h2e64" disabled>Claim All</button>
              </div>
            </div>
          </div>
        </div>
        <div className="chakra-stack css-dbr0lh">
          <img src="/images/img_nopositions@2x.png" className="chakra-image css-f5j44i" />
          <p className="chakra-text css-dwkbww">No liquidity positions</p>
        </div>
      </div>
    </div>
  );
};

export default Pool;