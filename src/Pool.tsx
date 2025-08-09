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
import Position from "./Position";
import PoolList from "./PoolList";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./SidebarMenu";
import "./Pool.css";
import "./App.css";
import "./App2.css";
import "./SidebarMenu.css";

const PACKAGE_ID = "0xb90158d50ac951784409a6876ac860e24564ed5257e51944d3c693efb9fdbd78";
const POOL_REGISTRY = "0xfc8c69858d070b639b3db15ff0f78a10370950434c5521c83eaa7e2285db8d2a";

const ADDRESS_MAPPINGS = {
  "d52c440f67dd960bc76f599a16065abd5fbc251b78f18d9dce3578ccc44462a9": "0xd52c440f67dd960bc76f599a16065abd5fbc251b78f18d9dce3578ccc44462a9",
  "b3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba": "0xb3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba",
  "b677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f": "0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f",
  "a16e100fcb99689d481f31a2315519923fdf45916a4fa18c5513008f5101237d":"0xa16e100fcb99689d481f31a2315519923fdf45916a4fa18c5513008f5101237d",
};

const tokenPrices: { [key: string]: number } = {
  "0x2::sui::SUI": 1.0,
  "0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f::usdc::USDC": 1.0,
  "0xb3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba::NS::NS": 0.5,
  "0xd52c440f67dd960bc76f599a16065abd5fbc251b78f18d9dce3578ccc44462a9::cetus::CETUS": 0.2,
  "0xa16e100fcb99689d481f31a2315519923fdf45916a4fa18c5513008f5101237d::navx::NAVX": 0.4,
  "0xe76d0a9c03e7e8e1ff3b8f70412b0e1e7b3a8f30b0f3f7d0b5b6f2e0a0c2b1f7::wal::WAL": 0.2,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::deep::DEEP": 0.1,
  "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::hasui::HASUI": 1.0,
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

const walletLogos = {
  'Slush': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYHwA15AKYWXvoSL-94ysbnJrmUX_oU1fJyw&s',
  'Suiet': 'https://framerusercontent.com/modules/6HmgaTsk3ODDySrS62PZ/a3c2R3qfkYJDxcZxkoVv/assets/eDZRos3xvCrlWxmLFr72sFtiyQ.png',
  'Martian': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhb6QLKfuQY_N8ZvpiKcdZlCnQKILXw7NArw&s',
  'Sui Wallet': 'https://assets.crypto.ro/logos/sui-sui-logo.png',
};

const customTheme: ThemeVars = {
  blurs: { modalOverlay: 'blur(0)' },
  backgroundColors: {
    primaryButton: '#FFFFFF',
    primaryButtonHover: '#F7F8F8',
    outlineButtonHover: '#E4E4E7',
    modalOverlay: 'rgba(24, 36, 53, 0.2)',
    modalPrimary: 'white',
    modalSecondary: '#F7F8F8',
    iconButton: 'transparent',
    iconButtonHover: '#F0F1F2',
    dropdownMenu: '#FFFFFF',
    dropdownMenuSeparator: '#F3F6F8',
    walletItemSelected: 'white',
    walletItemHover: '#3C424226',
  },
  borderColors: { outlineButton: '#E4E4E7' },
  colors: {
    primaryButton: '#182435',
    outlineButton: '#373737',
    iconButton: '#000000',
    body: '#182435',
    bodyMuted: '#767A81',
    bodyDanger: '#FF794B',
  },
  radii: { small: '4px', medium: '8px', large: '12px', xlarge: '16px' },
  shadows: {
    primaryButton: '0 4px 12px rgba(0, 0, 0, 0.1)',
    walletItemSelected: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  fontWeights: { normal: '400', medium: '500', bold: '700' },
  fontSizes: { small: '12px', medium: '14px', large: '16px', xlarge: '18px' },
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontStyle: 'normal',
    lineHeight: '1.5',
    letterSpacing: '0.02em',
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
    width: '120px',
    height: '36px',
    background: '#1e293b',
    border: '1px solid #808080',
    borderRadius: '8px',
    cursor: 'pointer',
    padding: '6px',
    transition: 'all 0.3s ease',
    color: '#FFFFFF',
    fontSize: '14px',
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
  tvl: string;
  volume: string;
  fees: string;
  apr: string;
  rewardImg: string;
  poolAddress: string;
}

export interface PoolListProps {
  pools: Pool[];
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
        pool.tvl === nextPool.tvl &&
        pool.volume === nextPool.volume &&
        pool.fees === nextPool.fees &&
        pool.apr === nextPool.apr &&
        pool.rewardImg === nextPool.rewardImg &&
        pool.poolAddress === nextPool.poolAddress
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
            const priceX = tokenPrices[tokenXAddress] || 1.0; // Fallback price
            const priceY = tokenPrices[tokenYAddress] || 1.0; // Fallback price
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
              img1: tokenX.logoURI,
              img2: tokenY.logoURI,
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
  const { pools, refresh } = usePoolData(client);
  const [newPoolToken1, setNewPoolToken1] = useState("");
  const [newPoolToken2, setNewPoolToken2] = useState("");
  const [feeRate, setFeeRate] = useState("0.25");
  const [activeTab, setActiveTab] = useState("pools");
  const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
  const [isAddLiquidityOpen, setIsAddLiquidityOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [showRpcPopover, setShowRpcPopover] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<"D" | "W" | "M">("D");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [volumeData, setVolumeData] = useState<{ date: string; volume: number; label: string }[]>([]);

  const generateVolumeData = (period: 'D' | 'W' | 'M') => {
    const data = [];
    const now = new Date(2025, 7, 10);
    let startDate;

    if (period === 'D') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const volume = Math.floor(Math.random() * 1000000);
        const label = date.getDate().toString();
        data.push({ date: date.toLocaleDateString(), volume, label });
      }
    } else if (period === 'W') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 84);
      for (let i = 0; i < 12; i++) {
        const weekStart = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        const volume = Math.floor(Math.random() * 7000000);
        const label = weekStart.getDate().toString();
        data.push({
          date: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          volume,
          label,
        });
      }
    } else if (period === 'M') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        const volume = Math.floor(Math.random() * 30000000);
        const label = monthDate.toLocaleString('default', { month: 'short', year: '2-digit' });
        data.push({ date: label, volume, label });
      }
    }

    return data;
  };

  useEffect(() => {
    const data = generateVolumeData(chartPeriod);
    setVolumeData(data);
  }, [chartPeriod]);

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

  const chartWidth = 733;
  const chartHeight = 228;
  const barWidth = volumeData.length > 0 ? (chartWidth / volumeData.length) * 0.5 : 0;
  const gap = volumeData.length > 0 ? (chartWidth / volumeData.length) * 0.5 : 0;
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
      >
        <title>{`${data.date}\nVolume: ${formatVolume(data.volume)}`}</title>
      </rect>
    );
  });

  const chartTitle = chartPeriod === 'D' ? 'Trading Volume (24H)' : chartPeriod === 'W' ? 'Trading Volume (7D)' : 'Trading Volume (30D)';

  return (
    <WalletProvider theme={customTheme}>
      <div className="container">
        <div className="header">
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
                    <Link to="/" className="dropdown-item">
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                        <use xlinkHref="#icon-a-icon_swap2"></use>
                      </svg>
                      Swap
                    </Link>
                    <Link to="/limit" className="dropdown-item">
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                        <use xlinkHref="#icon-a-icon_swap2"></use>
                      </svg>
                      Limit Order
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
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                        <use xlinkHref="#icon-icon_liquiditypools"></use>
                      </svg>
                      Pool
                    </Link>
                    <Link to="/veseal" className="dropdown-item">
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                        <use xlinkHref="#icon-icon_liquiditypools"></use>
                      </svg>
                      veSEAL
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
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                        <use xlinkHref="#icon-icon_sui"></use>
                      </svg>
                      Sui Bridge
                    </a>
                    <a href="https://bridge.cetus.zone/sui" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                        <use xlinkHref="#icon-icon_wormhole"></use>
                      </svg>
                      Wormhole
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
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                        <use xlinkHref="#icon-icon_docs"></use>
                      </svg>
                      Docs
                    </a>
                    <a href="#" className="dropdown-item">
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                        <use xlinkHref="#icon-icon_stats"></use>
                      </svg>
                      Leaderboard
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
              <button
                id="popover-trigger-notification"
                aria-haspopup="dialog"
                aria-expanded={showNotificationPopover}
                aria-controls="popover-content-notification"
                className="icon-button css-fi49l4"
                onClick={() => setShowNotificationPopover(!showNotificationPopover)}
              >
                <div className="css-1ke24j5">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-1.1-.9-2-2-2s-2 .9-2 2v.68C6.63 5.36 5 7.92 5 11v5l-2 2v1h18v-1l-2-2z"></path>
                  </svg>
                </div>
              </button>
              {showNotificationPopover && (
                <div className="chakra-popover__body css-1q40f86">
                  <div className="chakra-stack css-13uh600">
                    <img src="/images/logo_paw_sel@2x.png" alt="Pawtato" className="chakra-image css-1tq2rxf" />
                    <p className="chakra-text css-136jcmy">Visit Pawtato to manage notification settings for LP Range Alert</p>
                    <button type="button" className="chakra-button css-fpjdn4">Subscribe</button>
                  </div>
                </div>
              )}
              <button
                id="popover-trigger-rpc"
                aria-haspopup="dialog"
                aria-expanded={showRpcPopover}
                aria-controls="popover-content-rpc"
                className="icon-button css-163hjq3"
                onClick={() => setShowRpcPopover(!showRpcPopover)}
              >
                <div className="css-1ke24j5">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.30-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
                  </svg>
                </div>
              </button>
              {showRpcPopover && (
                <div className="chakra-popover__body css-1q40f86">
                  <div className="chakra-stack css-1opork5">
                    <div className="chakra-stack css-1ysm3zc">
                      <div className="css-1ke24j5">
                        <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </div>
                      <p className="chakra-text css-vcvc47">RPC Node</p>
                    </div>
                    <div className="css-122co4m">
                      {[
                        { name: "Sui Official", latency: "249ms", selected: true },
                        { name: "BlockVision", latency: "562ms" },
                        { name: "BlockVision 2", latency: "909ms" },
                        { name: "Suiet", latency: "553ms" },
                        { name: "Blast", latency: "554ms" },
                        { name: "Suiscan", latency: "3181ms" },
                        { name: "Triton", latency: "436ms" },
                        { name: "Custom RPC URL", latency: "" },
                      ].map((node, index) => (
                        <div key={index} className="chakra-stack css-k5o0vm">
                          <div className="chakra-stack css-1jjq5p5">
                            <div className="chakra-stack css-edyt6g">
                              <div className={node.selected ? "css-sopywd" : "css-empty-check"}>
                                {node.selected && (
                                  <div className="css-1ke24j5">
                                    <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px" viewBox="0 0 24 24">
                                      <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <p className={`chakra-text ${node.selected ? "css-swgav2" : "css-sezabi"}`}>{node.name}</p>
                            </div>
                            {node.latency && (
                              <div className="chakra-stack css-cp3a5l">
                                <div className="css-18uefe2"></div>
                                <p className="chakra-text css-1ec3nbv">{node.latency}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {isMobile && (
          <Sidebar isOpen={isMenuOpen} onClose={toggleMenu} />
        )}
        <div className="pool-container">
          <div className="summary-container">
            <div className="summary-left">
              <h1 className="summary-title">Liquidity Pools</h1>
              <div className="summary-metrics-card">
                <div className="metric-item">
                  <p className="metric-label">Total Value Locked</p>
                  <p className="metric-value">
                    ${pools.reduce((sum, pool) => sum + parseFloat(pool.tvl.slice(1).replace(/,/g, '')), 0).toLocaleString('en-US', {
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <p className="chart-title">{chartTitle}:</p>
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
                      <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#ADD8E6', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <g transform="translate(0, -30)">{bars}</g>
                  <g transform="translate(0, -30)">{xAxisLabels}</g>
                </svg>
              </div>
            </div>
          </div>
          {activeTab === "pools" ? (
            <PoolList
              pools={pools}
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
              refresh={refresh} isLoading={false}            />
          ) : (
            <Position
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleAddLiquidity={handleAddLiquidity}
            />
          )}
        </div>
      </div>
    </WalletProvider>
  );
}

export default Pool;