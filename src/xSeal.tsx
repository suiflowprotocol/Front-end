import { useState, useEffect } from "react";
import { ConnectButton, useCurrentAccount, useSuiClient, useSignAndExecuteTransaction, lightTheme, WalletProvider, ThemeVars,useConnectWallet,useWallets,useDisconnectWallet,ConnectModal} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import "./App.css";
import "./App2.css";
import "./xSeal.css";


// 钱包名称到 Logo URL 的映射
const walletLogos = {
  'Slush': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYHwA15AKYWXvoSL-94ysbnJrmUX_oU1fJyw&s',
  'Suiet': 'https://framerusercontent.com/modules/6HmgaTsk3ODDySrS62PZ/a3c2R3qfkYJDxcZxkoVv/assets/eDZRos3xvCrlWxmLFr72sFtiyQ.png',
  'Martian': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhb6QLKfuQY_N8ZvpiKcdZlCnQKILXw7NArw&s',
  'Sui Wallet': 'https://assets.crypto.ro/logos/sui-sui-logo.png',
};
// Define custom theme
const customTheme: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(0)',
  },
  backgroundColors: {
    primaryButton: '#3b82f6',
    primaryButtonHover: '#4b9cfa',
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
  borderColors: {
    outlineButton: '#E4E4E7',
  },
  colors: {
    primaryButton: '#FFFFFF',
    outlineButton: '#373737',
    iconButton: '#000000',
    body: '#182435',
    bodyMuted: '#767A81',
    bodyDanger: '#FF794B',
  },
  radii: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
  },
  shadows: {
    primaryButton: '0 4px 12px rgba(0, 0, 0, 0.1)',
    walletItemSelected: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '700',
  },
  fontSizes: {
    small: '12px',
    medium: '14px',
    large: '16px',
    xlarge: '18px',
  },
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

  // 按钮基础样式，与 .icon-button 高度一致
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '120px', // 固定宽度，确保连接前后长度一致
    height: '36px', // 与 .icon-button 高度一致
    background: '#1e293b',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    padding: '6px',
    transition: 'all 0.3s ease',
    color: '#fff',
    fontSize: '14px',
  };

  // 截短钱包地址函数，显示更短地址
  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `0x${address.slice(2, 5)}...${address.slice(-3)}`;
  };

  // 未连接状态的内容
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

  // 已连接状态的内容，统一显示指定 Logo
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

  // 处理按钮点击
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentAccount) {
      setShowDisconnect(!showDisconnect);
    } else {
      setIsModalOpen(true);
    }
  };

  // 处理断开连接
  const handleDisconnect = () => {
    disconnect();
    setShowDisconnect(false);
  };

  // 钱包过滤器，包含 Mysten DApp Kit 默认钱包和 Martian Sui Wallet
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


// Constants for xSeal
const PACKAGE_ID = "0xb90158d50ac951784409a6876ac860e24564ed5257e51944d3c693efb9fdbd78";
const SEAL_TOKEN = "0x2::seal::SEAL";
const XSEAL_TOKEN = "0x2::xseal::XSEAL";

const XSeal = () => {
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("stake"); // 控制右侧选项（质押、解除质押、领取奖励）
  const [vestingDuration, setVestingDuration] = useState(180);
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState("0h 0m 0s");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [showRpcPopover, setShowRpcPopover] = useState(false);
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const toggleDropdown = (menu: string | null) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 倒计时逻辑：每周一晚上 7 点 (UTC+8)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const utc8Offset = 8 * 60 * 60 * 1000;
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const utc8Time = new Date(utcTime + utc8Offset);
      const dayOfWeek = utc8Time.getDay();
      const daysUntilMonday = (dayOfWeek === 0 ? 1 : 8 - dayOfWeek);
      const nextMonday7PM = new Date(
        utc8Time.getFullYear(),
        utc8Time.getMonth(),
        utc8Time.getDate() + daysUntilMonday,
        19, 0, 0
      );
      const timeDiff = nextMonday7PM.getTime() - utc8Time.getTime();

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

  // 获取余额
  useEffect(() => {
    const fetchBalances = async () => {
      if (!account) {
        setBalances({});
        return;
      }
      try {
        const newBalances: { [key: string]: string } = {};
        const allBalances = await client.getAllBalances({
          owner: account.address,
        });

        for (const token of [SEAL_TOKEN, XSEAL_TOKEN]) {
          const balanceEntry = allBalances.find((b) => b.coinType === token);
          const decimals = 6;
          if (balanceEntry) {
            const balance = parseInt(balanceEntry.totalBalance) / 10 ** decimals;
            newBalances[token] = balance.toFixed(4);
          } else {
            newBalances[token] = "0.0000";
          }
        }
        setBalances(newBalances);
      } catch (err) {
        setError("Failed to fetch balances");
      }
    };

    fetchBalances();
  }, [account, client]);

  // 处理质押或解除质押
  const handleConvert = async () => {
    if (!account) {
      setError("Please connect wallet");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      const isConvertingToXSeal = activeTab === "stake";
      const inputToken = isConvertingToXSeal ? SEAL_TOKEN : XSEAL_TOKEN;
      const outputToken = isConvertingToXSeal ? XSEAL_TOKEN : SEAL_TOKEN;
      const decimals = 6;
      const amountValue = Math.floor(parseFloat(amount) * 10 ** decimals);

      const coins = await client.getCoins({
        owner: account.address,
        coinType: inputToken,
      });

      const coinObjectIds = coins.data
        .filter((coin) => parseInt(coin.balance) >= amountValue)
        .map((coin) => coin.coinObjectId);

      if (coinObjectIds.length === 0) {
        setError(`Insufficient ${isConvertingToXSeal ? "SEAL" : "XSEAL"} balance`);
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

      const [coinToConvert] = tx.splitCoins(mergedCoin, [amountValue]);

      tx.moveCall({
        target: `${PACKAGE_ID}::xseal::${
          isConvertingToXSeal ? "convert_to_xseal" : "redeem_seal"
        }`,
        typeArguments: [inputToken, outputToken],
        arguments: [
          tx.object(isConvertingToXSeal ? SEAL_TOKEN : XSEAL_TOKEN),
          coinToConvert,
          tx.pure.u64(amountValue),
          tx.pure.u64(vestingDuration * 24 * 60 * 60),
        ],
      });

      tx.setGasBudget(100000000);

      await signAndExecute(
        {
          transaction: tx as any,
          account,
        },
        {
          onSuccess: () => {
            setSuccess(
              `Successfully ${isConvertingToXSeal ? "staked SEAL" : "unstaked SEAL"}`
            );
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            setError("");
            setAmount("");
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

  // 处理领取奖励（示例逻辑，需根据实际合约实现）
  const handleClaimRewards = async () => {
    if (!account) {
      setError("Please connect wallet");
      return;
    }
    try {
      // 假设有一个 claim_rewards 函数，需替换为实际的 moveCall
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::xseal::claim_rewards`,
        typeArguments: [XSEAL_TOKEN],
        arguments: [tx.object(XSEAL_TOKEN)],
      });

      tx.setGasBudget(100000000);

      await signAndExecute(
        {
          transaction: tx as any,
          account,
        },
        {
          onSuccess: () => {
            setSuccess("Successfully claimed rewards");
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            setError("");
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

  const setHalfBalance = () => {
    const balance = parseFloat(balances[activeTab === "stake" ? SEAL_TOKEN : XSEAL_TOKEN] || "0");
    if (balance > 0) {
      setAmount((balance * 0.5).toFixed(4));
    }
  };

  const setMaxBalance = () => {
    const balance = parseFloat(balances[activeTab === "stake" ? SEAL_TOKEN : XSEAL_TOKEN] || "0");
    if (balance > 0) {
      setAmount(balance.toFixed(4));
    }
  };

  return (
    <div className="xseal-scope container">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      )}
      <div className="header">
        <div className="header-top">
          <div className="logo-container">
            <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image" />
            <span className="logo-text">Seal</span>
          </div>
          <div className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
            <div className={`nav-item ${openDropdown === "trade" ? "open" : ""}`} 
                 onMouseEnter={() => toggleDropdown("trade")} 
                 onMouseLeave={() => toggleDropdown(null)}>
              <span className="nav-text">Trade</span>
              <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
              </svg>
              <div className={`dropdown ${openDropdown === "trade" ? "open" : ""}`}>
                <Link to="/" className="dropdown-item">
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                    <use xlinkHref="#icon-a-icon_swap2"></use>
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
                  <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                    <use xlinkHref="#icon-icon_liquiditypools"></use>
                  </svg>
                  Pool
                </Link>
              </div>
            </div>
            <Link to="/xseal" className="nav-item">
              <span className="nav-text">xSeal</span>
            </Link>
            <div className={`nav-item ${openDropdown === "bridge" ? "open" : ""}`} 
                 onMouseEnter={() => toggleDropdown("bridge")} 
                 onMouseLeave={() => toggleDropdown(null)}>
              <span className="nav-text">Bridge</span>
              <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
              </svg>
              <div className={`dropdown ${openDropdown === "bridge" ? "open" : ""}`}>
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
            <div className={`nav-item ${openDropdown === "more" ? "open" : ""}`} 
                 onMouseEnter={() => toggleDropdown("more")} 
                 onMouseLeave={() => toggleDropdown(null)}>
              <span className="nav-text">More</span>
              <svg className="arrow-icon" viewBox="0 0 12 12" width="12px" height="12px">
                <path d="M6 8L2 4h8L6 8z" fill="var(--text-color)" />
              </svg>
              <div className={`dropdown ${openDropdown === "more" ? "open" : ""}`}>
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
                  <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.30-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24-.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
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
            <button className="hamburger-menu" onClick={toggleMenu}>
              <svg className="hamburger-icon" viewBox="0 0 24 24" width="24px" height="24px">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="var(--text-color)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="xseal-content">
        <div className="xseal-poster">
          <p className="poster-title">Stake $Seal to get Rewards</p>
          <a href="https://example.com/learn-more" target="_blank" rel="noopener noreferrer" className="learn-more-btn">
            Learn more
          </a>
        </div>
        <div className="metrics-grid">
          <div className="metric-card">
            <svg className="metric-icon" viewBox="0 0 24 24" fill="var(--text-color)">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <p className="metric-title">My total deSeal</p>
            <p className="metric-value">0</p>
          </div>
          <div className="metric-card">
            <svg className="metric-icon" viewBox="0 0 24 24" fill="var(--text-color)">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <p className="metric-title">Total deSeal</p>
            <p className="metric-value">0</p>
          </div>
          <div className="metric-card">
            <svg className="metric-icon" viewBox="0 0 24 24" fill="var(--text-color)">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <p className="metric-title">Reward Distribution Share</p>
            <p className="metric-value">0%</p>
          </div>
        </div>
        <div className="main-content">
          <div className="left-section">
            <p className="left-title">Stake $Seal to get reward</p>
            <p className="countdown-label">Reward distribution in:</p>
            <p className="countdown-text">{countdown}</p>
            <div className="rewards-metrics">
              <div className="metric-item">
                <p className="metric-label">est.APR</p>
                <p className="metric-value">≈15.50%</p>
              </div>
              <div className="metric-item">
                <p className="metric-label">Your Share</p>
                <p className="metric-value">≈0%</p>
              </div>
              <div className="metric-item">
                <p className="metric-label">Pending Yield</p>
                <p className="metric-value">$0</p>
              </div>
            </div>
          </div>
          <div className="right-section">
            <div className="options-toggle">
              <div
                className={`toggle-option ${activeTab === "stake" ? "active" : ""}`}
                onClick={() => setActiveTab("stake")}
              >
                质押 $Seal
              </div>
              <div
                className={`toggle-option ${activeTab === "unstake" ? "active" : ""}`}
                onClick={() => setActiveTab("unstake")}
              >
                解除 $Seal 质押
              </div>
              <div
                className={`toggle-option ${activeTab === "claim" ? "active" : ""}`}
                onClick={() => setActiveTab("claim")}
              >
                领取奖励
              </div>
            </div>
            {activeTab === "stake" && (
              <div className="input-section">
                <div className="input-card">
                  <p className="input-label">Stake Amount</p>
                  <div className="input-group">
                    <input
                      placeholder="0.0"
                      type="text"
                      value={amount}
                      inputMode="numeric"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
                          setAmount(value);
                        }
                      }}
                      className="amount-input"
                    />
                    <div className="token-display">
                      <img
                        className="token-icon"
                        src="https://7rgiihm5sisgewirofazpjddkpvmlwphumcg5lulriu6okgf5krq.arweave.net/_EyEHZ2SJGJZEXFBl6RjTwoCq2HpnmgkbqzhKC5GM4jY"
                        alt="SEAL"
                      />
                      <p className="token-symbol">SEAL</p>
                    </div>
                  </div>
                  <div className="input-footer">
                    <div className="balance-info">
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                        <use xlinkHref="#icon-icon_wallet" />
                      </svg>
                      <p className="balance-text">{balances[SEAL_TOKEN] || "0.0"}</p>
                    </div>
                    <div className="balance-buttons">
                      <button type="button" className="balance-btn" onClick={setHalfBalance}>HALF</button>
                      <button type="button" className="balance-btn" onClick={setMaxBalance}>MAX</button>
                    </div>
                  </div>
                </div>
                <div className="vesting-section">
                  <p className="vesting-title">Vesting duration</p>
                  <div className="vesting-options">
                    <p className="vesting-duration">{vestingDuration} Days</p>
                    <div className="duration-buttons">
                      {[15, 30, 90, 180].map((duration) => (
                        <div
                          key={duration}
                          className={`duration-option ${vestingDuration === duration ? "active" : ""}`}
                          onClick={() => setVestingDuration(duration)}
                        >
                          <p className="duration-text">{duration}D</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="15"
                      max="180"
                      value={vestingDuration}
                      onChange={(e) => setVestingDuration(parseInt(e.target.value))}
                      className="vesting-slider"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="action-btn"
                  disabled={!account || !amount || parseFloat(amount) <= 0}
                  onClick={handleConvert}
                >
                  {account ? (amount && parseFloat(amount) > 0 ? "Stake" : "Enter an amount") : "Connect Wallet"}
                </button>
              </div>
            )}
            {activeTab === "unstake" && (
              <div className="input-section">
                <div className="input-card">
                  <p className="input-label">Unstake Amount</p>
                  <div className="input-group">
                    <input
                      placeholder="0.0"
                      type="text"
                      value={amount}
                      inputMode="numeric"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
                          setAmount(value);
                        }
                      }}
                      className="amount-input"
                    />
                    <div className="token-display">
                      <img
                        className="token-icon"
                        src="https://uxcdefo3r2uemooidt2kk2stykakvwd2m6nasg5lhbfaxemm4i3a.arweave.net/pcQyFduOqEY5yBz0pWpTwoCq2HpnmgkbqzhKC5GM4jY"
                        alt="XSEAL"
                      />
                      <p className="token-symbol">XSEAL</p>
                    </div>
                  </div>
                  <div className="input-footer">
                    <div className="balance-info">
                      <svg aria-hidden="true" fill="var(--chakra-colors-text_paragraph)" width="20px" height="20px">
                        <use xlinkHref="#icon-icon_wallet" />
                      </svg>
                      <p className="balance-text">{balances[XSEAL_TOKEN] || "0.0"}</p>
                    </div>
                    <div className="balance-buttons">
                      <button type="button" className="balance-btn" onClick={setHalfBalance}>HALF</button>
                      <button type="button" className="balance-btn" onClick={setMaxBalance}>MAX</button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="action-btn"
                  disabled={!account || !amount || parseFloat(amount) <= 0}
                  onClick={handleConvert}
                >
                  {account ? (amount && parseFloat(amount) > 0 ? "Unstake" : "Enter an amount") : "Connect Wallet"}
                </button>
              </div>
            )}
            {activeTab === "claim" && (
              <div className="input-section">
                <p className="input-label">Claim Rewards</p>
                <p className="metric-value">$0</p>
                <button
                  type="button"
                  className="action-btn"
                  disabled={!account}
                  onClick={handleClaimRewards}
                >
                  {account ? "Claim Rewards" : "Connect Wallet"}
                </button>
              </div>
            )}
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
    </div>
  );
};

export default XSeal;