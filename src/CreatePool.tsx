import { useState } from "react";
import Step1SelectPair from "./Step1SelectPair";
import Step2SetPrice from "./Step2SetPrice";
import Step3DepositAmounts from "./Step3DepositAmounts";

export interface Token {
  symbol: string;
  address: string;
  icon: string;
  description: string;
  decimals: number;
}

interface CreatePoolProps {
  isOpen: boolean;
  onClose: () => void;
  newPoolToken1: string;
  newPoolToken2: string;
  feeRate: string;
  setNewPoolToken1: React.Dispatch<React.SetStateAction<string>>;
  setNewPoolToken2: React.Dispatch<React.SetStateAction<string>>;
  setFeeRate: React.Dispatch<React.SetStateAction<string>>;
  getTokenAddress: (symbol: string) => string;
  refresh: () => void;
}

const tokens: Token[] = [
  {
    symbol: "SUI",
    address: "0x2::sui::SUI",
    icon: "https://archive.cetus.zone/assets/image/sui/sui.png",
    description: "SUI Token",
    decimals: 9,
  },
  {
    symbol: "USDC",
    address: "0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f::usdc::USDC",
    icon: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
    description: "Native USDC",
    decimals: 6,
  },
  {
    symbol: "NS",
    address: "0xb3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba::NS::NS",
    icon: "https://example.com/ns-icon.png",
    description: "SuiNS Token",
    decimals: 6,
  },
  {
    symbol: "NAVX",
    address: "0xa16e100fcb99689d481f31a2315519923fdf45916a4fa18c5513008f5101237d::navx::NAVX",
    icon: "https://archive.cetus.zone/assets/image/sui/navx.png",
    description: "NAVX Token",
    decimals: 6,
  },
  {
    symbol: "CETUS",
    address: "0xd52c440f67dd960bc76f599a16065abd5fbc251b78f18d9dce3578ccc44462a9::cetus::CETUS",
    icon: "https://example.com/cetus-icon.png",
    description: "CETUS Token",
    decimals: 6,
  },
  {
    symbol: "DEEP",
    address: "0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP",
    icon: "https://images.deepbook.tech/icon.svg",
    description: "DeepBook Token",
    decimals: 6,
  },
  {
    symbol: "WAL",
    address: "0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL",
    icon: "https://file.coinexstatic.com/2025-03-26/43F8485DCB687E365E3187192861D19E.webp",
    description: "WAL Token",
    decimals: 6,
  },
  {
    symbol: "HAEDAL",
    address: "0x3a304c7feba2d819ea57c3542d68439ca2c386ba02159c740f7b406e592c62ea::HAEDAL::HAEDAL",
    icon: "https://s2.coinmarketcap.com/static/img/coins/200x200/36369.png",
    description: "HAEDAL Token",
    decimals: 6,
  },
  {
    symbol: "SCA",
    address: "0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbnn:9GcQkPpvd1akVvyP8sgi3PMYAwbCnWuuIS37OKg&s",
    description: "Scallop Token",
    decimals: 6,
  },
  {
    symbol: "HASUI",
    address: "0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::HASUI::HASUI",
    icon: "https://www.haedal.xyz/images/stsui.png",
    description: "HASUI Token",
    decimals: 6,
  },
  {
    symbol: "BUCK",
    address: "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK",
    icon: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/buck.svg/public",
    description: "Bucket USD",
    decimals: 6,
  },
  {
    symbol: "XBTC",
    address: "0x876a4b7bce8aeaef60464c11f4026903e9afacab79b9b142686158aa86560b50::xbtc::XBTC",
    icon: "https://static.coinall.ltd/cdn/oksupport/common/20250512-095503.72e1f41d9b9a06.png",
    description: "XBTC",
    decimals: 6,
  },
  {
    symbol: "Tether (Sui Bridge)",
    address: "0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT",
    icon: "https://momentum-statics.s3.us-west-1.amazonaws.com/suiUSDT.png",
    description: "suiUSDT",
    decimals: 6,
  },
  {
    symbol: "AUSD",
    address: "0x2053d08c1e2bd02791056171aab0fd12bd7cd7efad2ab8f6b9c8902f14df2ff2::ausd::AUSD",
    icon: "https://static.agora.finance/ausd-token-icon.svg",
    description: "AUSD",
    decimals: 6,
  },
  {
    symbol: "ALPHA Token",
    address: "0xfe3afec26c59e874f3c1d60b8203cb3852d2bb2aa415df9548b8d688e6683f93::alpha::ALPHA",
    icon: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/_MCfJKCnm7HFHwGk_JW1B-AU9kjOe3FtYe-ay75YcgI.png/public",
    description: "ALPHA",
    decimals: 6,
  },
  {
    symbol: "Sudo LP Token",
    address: "0xc44d97a4bc4e5a33ca847b72b123172c88a6328196b71414f32c3070233604b2::slp::SLP",
    icon: "https://arweave.net/_SEJoeyOw0uVJbu-kcJZ1BFP1E5j4OWOdQnv4s51rU0",
    description: "SLP",
    decimals: 6,
  },
  {
    symbol: "AlphaFi Staked SUI",
    address: "0xd1b72982e40348d069bb1ff701e634c117bb5f741f44dff91e472d3b01461e55::stsui::STSUI",
    icon: "https://images.alphafi.xyz/stSUI.png",
    description: "stSUI",
    decimals: 6,
  },
  {
    symbol: "SEND",
    address: "0xb45fcfcc2cc07ce0702cc2d229621e046c906ef14d9b25e8e4d25f6e8763fef7::send::SEND",
    icon: "https://suilend-assets.s3.us-east-2.amazonaws.com/SEND/SEND.svg",
    description: "SEND",
    decimals: 6,
  },
  {
    symbol: "ZO Perpetuals LP Token",
    address: "0xf7fade57462e56e2eff1d7adef32e4fd285b21fd81f983f407bb7110ca766cda::zlp::ZLP",
    icon: "https://img.zofinance.io/zlp.png",
    description: "ZLP",
    decimals: 6,
  },
  {
    symbol: "LOFI",
    address: "0xf22da9a24ad027cccb5f2d496cbe91de953d363513db08a3a734d361c7c17503::LOFI::LOFI",
    icon: "https://cdn.tusky.io/5ab323c3-19e1-48b1-a5e2-f01b2fb3a097",
    description: "LOFI",
    decimals: 6,
  },
  {
    symbol: "Lorenzo stBTC",
    address: "0x5f496ed5d9d045c5b788dc1bb85f54100f2ede11e46f6a232c29daada4c5bdb6::coin::COIN",
    icon: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/stBTC.png/public",
    description: "stBTC",
    decimals: 6,
  },
  {
    symbol: "Ondo US Dollar Yield",
    address: "0x960b531667636f39e85867775f52f6b1f220a058c4de786905bdf761e06a56bb::usdy::USDY",
    icon: "https://ondo.finance/images/tokens/usdy.svg",
    description: "USDY",
    decimals: 6,
  },
  {
    symbol: "wUSDT",
    address: "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN",
    icon: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/images.png/public",
    description: "wUSDT",
    decimals: 6,
  },
  {
    symbol: "Lombard Staked BTC",
    address: "0x3e8e9423d80e1774a7ca128fccd8bf5f1f7753be658c5e645929037f7c819040::lbtc::LBTC",
    icon: "https://www.lombard.finance/lbtc/LBTC.png",
    description: "LBTC",
    decimals: 6,
  },
  {
    symbol: "Attention",
    address: "0x0ef38abcdaaafedd1e2d88929068a3f65b59bf7ee07d7e8f573c71df02d27522::attn::ATTN",
    icon: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/attention.png/public",
    description: "ATTN",
    decimals: 6,
  },
  {
    symbol: "First Digital USD",
    address: "0xf16e6b723f242ec745dfd7634ad072c42d5c1d9ac9d62a39c381303eaa57693a::fdusd::FDUSD",
    icon: "https://cdn.1stdigital.com/icon/fdusd.svg",
    description: "FDUSD",
    decimals: 6,
  },
  {
    symbol: "sudeng",
    address: "0x8993129d72e733985f7f1a00396cbd055bad6f817fee36576ce495c8bbb8b87b::sudeng::SUDENG",
    icon: "https://i.imgur.com/j2EuFh5.png",
    description: "HIPPO",
    decimals: 6,
  },
  {
    symbol: "Wrapped Bitcoin(Sui Bridge)",
    address: "0xaafb102dd0902f5055cadecd687fb5b71ca82ef0e0285d90afde828ec58ca96b::btc::BTC",
    icon: "https://bridge-assets.sui.io/suiWBTC.png",
    description: "wBTC",
    decimals: 6,
  },
  {
    symbol: "haWAL",
    address: "0x8b4d553839b219c3fd47608a0cc3d5fcc572cb25d41b7df3833208586a8d2470::hawal::HAWAL",
    icon: "https://assets.HAEDAL.xyz/logos/hawal.svg",
    description: "haWAL",
    decimals: 6,
  },
  {
    symbol: "Volo Staked SUI",
    address: "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT",
    icon: "https://strapi-dev.scand.app/uploads/volo_SUI_Logo_f28ed9c6a1.png",
    description: "vSUI",
    decimals: 6,
  },
  {
    symbol: "Wrapped Ether(Wormhole)",
    address: "0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610efastanza57693a::fdusd::FDUSD",
    icon: "https://momentum-statics.s3.us-west-1.amazonaws.com/WETH.png",
    description: "wETH",
    decimals: 6,
  },
  {
    symbol: "Wrapped BTC",
    address: "0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN",
    icon: "https://strapi-dev.scand.app/uploads/Bitcoin_svg_3d3d928a26.png",
    description: "wBTC",
    decimals: 6,
  },
];

function CreatePool({ isOpen, onClose, newPoolToken1, setNewPoolToken1, newPoolToken2, setNewPoolToken2, feeRate, setFeeRate, getTokenAddress, refresh }: CreatePoolProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [initialPrice, setInitialPrice] = useState("");
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [showTokenModal, setShowTokenModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [importAddress, setImportAddress] = useState("");
  const [importError, setImportError] = useState("");
  const [activeList, setActiveList] = useState("Default");
  const [importedTokens, setImportedTokens] = useState<Token[]>([]);
  const [balances] = useState<{ [key: string]: string }>({
    "0x2::sui::SUI": "spiring.0",
    "0xb677ae5448d34da319289018e7dd67c556b094a5451d7029bd52396cdd8f192f::usdc::USDC": "500.0",
    "0xb3f153e6279045694086e8176c65e8e0f5d33aeeeb220a57b5865b849e5be5ba::NS::NS": "200.0",
    "0xa16e100fcb99689d481f31a2315519923fdf45916a4fa18c5513008f5101237d::navx::NAVX": "150.0",
    "0xd52c440f67dd960bc76f599a16065abd5fbc251b78f18d9dce3578ccc44462a9::cetus::CETUS": "300.0",
    "0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP": "100.0",
    "0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL": "200.0",
    "0x3a304c7feba2d819ea57c3542d68439ca2c386ba02159c740f7b406e592c62ea::HAEDAL::HAEDAL": "150.0",
    "0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA": "120.0",
    "0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::HASUI::HASUI": "180.0",
    "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK": "400.0",
    "0x876a4b7bce8aeaef60464c11f4026903e9afacab79b9b142686158aa86560b50::xbtc::XBTC": "50.0",
    "0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT": "600.0",
    "0x2053d08c1e2bd02791056171aab0fd12bd7cd7efad2ab8f6b9c8902f14df2ff2::ausd::AUSD": "300.0",
    "0xfe3afec26c59e874f3c1d60b8203cb3852d2bb2aa415df9548b8d688e6683f93::alpha::ALPHA": "80.0",
    "0xc44d97a4bc4e5a33ca847b72b123172c88a6328196b71414f32c3070233604b2::slp::SLP": "90.0",
    "0xd1b72982e40348d069bb1ff701e634c117bb5f741f44dff91e472d3b01461e55::stsui::STSUI": "110.0",
    "0xb45fcfcc2cc07ce0702cc2d229621e046c906ef14d9b25e8e4d25f6e8763fef7::send::SEND": "70.0",
    "0xf7fade57462e56e2eff1d7adef32e4fd285b21fd81f983f407bb7110ca766cda::zlp::ZLP": "60.0",
    "0xf22da9a24ad027cccb5f2d496cbe91de953d363513db08a3a734d361c7c17503::LOFI::LOFI": "40.0",
    "0x5f496ed5d9d045c5b788dc1bb85f54100f2ede11e46f6a232c29daada4c5bdb6::coin::COIN": "30.0",
    "0x960b531667636f39e85867775f52f6b1f220a058c4de786905bdf761e06a56bb::usdy::USDY": "200.0",
    "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN": "250.0",
    "0x3e8e9423d80e1774a7ca128fccd8bf5f1f7753be658c5e645929037f7c819040::lbtc::LBTC": "20.0",
    "0x0ef38abcdaaafedd1e2d88929068a3f65b59bf7ee07d7e8f573c71df02d27522::attn::ATTN": "15.0",
    "0xf16e6b723f242ec745dfd7634ad072c42d5c1d9ac9d62a39c381303eaa57693a::fdusd::FDUSD": "300.0",
    "0x8993129d72e733985f7f1a00396cbd055bad6f817fee36576ce483c8bbb8b87b::sudeng::SUDENG": "25.0",
    "0xaafb102dd0902f5055cadecd687fb5b71ca82ef0e0285d90afde828ec58ca96b::btc::BTC": "35.0",
    "0x8b4d553839b219c3fd47608a0cc3d5fcc572cb25d41b7df3833208586a8d2470::hawal::HAWAL": "45.0",
    "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT": "55.0",
    "0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN": "65.0",
    "0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN": "75.0",
  });

  const handleNextStep = () => {
    if (step < 3) setStep((step + 1) as 1 | 2 | 3);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep((step - 1) as 1 | 2 | 3);
  };

  const handleCreatePool = () => {
    console.log(`创建池子: ${newPoolToken1}-${newPoolToken2}，费率 ${feeRate}%`);
    onClose();
  };

  const handleAmount1Change = (value: string) => {
    setAmount1(value);
    if (value && initialPrice) {
      const amount1Num = parseFloat(value);
      const initialPriceNum = parseFloat(initialPrice);
      if (!isNaN(amount1Num) && !isNaN(initialPriceNum)) {
        setAmount2((amount1Num * initialPriceNum).toFixed(4));
      } else {
        setAmount2("");
      }
    } else {
      setAmount2("");
    }
  };

  const selectToken = (token: Token, type: string) => {
    if (type === "token1") {
      setNewPoolToken1(token.symbol);
    } else {
      setNewPoolToken2(token.symbol);
    }
    setShowTokenModal(null);
    setSearchQuery("");
    setImportAddress("");
    setImportError("");
  };

  const importToken = async () => {
    if (!importAddress) {
      setImportError("Please enter a valid token address");
      return;
    }
    const newToken: Token = {
      symbol: `TOKEN${importedTokens.length + 1}`,
      address: importAddress,
      icon: "https://example.com/unknown-token.png",
      description: `Imported Token ${importedTokens.length + 1}`,
      decimals: 6,
    };
    setImportedTokens([...importedTokens, newToken]);
    setActiveList("Imported");
    setImportAddress("");
    setImportError("");
  };

  const filteredTokens = (activeList === "Imported" ? importedTokens : tokens).filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isStep2Valid = initialPrice !== "";
  const isStep3Valid = amount1 !== "";

  return (
    <div className="create-pool-modal">
      <style>{`
        :root {
          --card-bg: #0f172a;
          --modal-bg: #1e293b;
          --text-color: #f8fafc;
          --text-secondary: #94a3b8;
          --primary-color: #3b82f6;
          --button-hover-bg: #2563eb;
          --border-color: #334155;
          --shadow-color: rgba(0, 0, 0, 0.2);
          --success-color: #10b981;
          --input-bg: #2d3748;
          --hover-bg: #334155;
        }

        .create-pool-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .modal-content {
          background: var(--modal-bg);
          color: var(--text-color);
          padding: 12px;
          border-radius: 10px;
          width: 100%;
          max-width: 460px;
          max-height: 85vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 16px var(--shadow-color);
          scrollbar-width: thin;
          scrollbar-color: var(--border-color) var(--modal-bg);
          border: 1px solid var(--border-color);
        }
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }
        .modal-content::-webkit-scrollbar-track {
          background: var(--modal-bg);
        }
        .modal-content::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modal-header {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .back-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.2s ease, transform 0.1s;
        }
        .back-button:hover {
          color: var(--text-color);
          transform: translateX(-2px);
        }
        .steps-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .step-number {
          width: 24px;
          height: 24px;
          background-color: var(--primary-color);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }
        .step-number.inactive {
          background-color: var(--border-color);
        }
        .step-divider {
          flex: 1;
          height: 2px;
          background-color: var(--border-color);
          border-radius: 1px;
        }
        .step-text {
          font-size: 11px;
          color: var(--text-secondary);
          font-weight: 400;
        }
        .step-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-color);
        }
        .select-pair-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 200px;
        }
        .select-pair-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-color);
          margin: 0;
        }
        .select-pair-text {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 400;
          line-height: 1.4;
          margin: 4px 0;
        }
        .token-select-container {
          display: flex;
          gap: 8px;
        }
        .token-select {
          flex: 1;
          padding: 8px 10px;
          background-color: var(--input-bg);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          color: var(--text-color);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .token-select:hover {
          background-color: var(--hover-bg);
          border-color: var(--border-color);
        }
        .token-select img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
        .fee-tier-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .fee-tier-select {
          padding: 8px 10px;
          background-color: var(--input-bg);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          color: var(--text-color);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .fee-tier-select:hover {
          background-color: var(--hover-bg);
          border-color: var(--border-color);
        }
        .token-pair-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background-color: var(--input-bg);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .token-pair-images {
          display: flex;
          align-items: center;
        }
        .token-pair-images img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--modal-bg);
        }
        .token-pair-images img:last-child {
          margin-left: -8px;
        }
        .token-pair-info {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        .token-pair-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-color);
          margin: 0;
        }
        .fee-rate {
          background-color: var(--primary-color);
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 11px;
          color: #ffffff;
          font-weight: 500;
        }
        .edit-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .edit-button:hover {
          color: var(--text-color);
        }
        .input-group {
          display: flex;
          align-items: center;
          background-color: var(--input-bg);
          border-radius: 8px;
          padding: 8px;
          border: 1px solid var(--border-color);
          transition: border-color 0.2s ease;
        }
        .input-group:hover {
          border-color: var(--border-color);
        }
        .input-field {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-color);
          font-size: 14px;
          font-weight: 500;
          outline: none;
          padding: 4px;
        }
        .input-addon {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
          padding-right: 8px;
        }
        .price-range-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .price-range-tabs {
          display: flex;
          gap: 6px;
        }
        .price-range-tab {
          padding: 6px 10px;
          background-color: var(--input-bg);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          color: var(--text-color);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .price-range-tab.active {
          background-color: var(--primary-color);
          color: #ffffff;
        }
        .price-range-inputs {
          display: flex;
          gap: 8px;
        }
        .price-range-input-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background-color: var(--input-bg);
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .price-range-input-group p {
          font-size: 12px;
          color: var(--text-secondary);
          text-align: center;
          margin: 0;
        }
        .price-range-input-group input {
          background: none;
          border: none;
          color: var(--text-color);
          font-size: 12px;
          font-weight: 500;
          outline: none;
          text-align: center;
          width: 100%;
        }
        .deposit-input-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .deposit-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background-color: var(--input-bg);
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 6px var(--shadow-color);
          border: 1px solid var(--border-color);
        }
        .deposit-input {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .deposit-input input {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-color);
          font-size: 18px;
          font-weight: 600;
          outline: none;
        }
        .deposit-addon {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .deposit-addon img {
          width: 22px;
          height: 22px;
          border-radius: 50%;
        }
        .deposit-addon p {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-color);
        }
        .deposit-display {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background-color: var(--modal-bg);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .deposit-display p {
          flex: 1;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .total-amount {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: var(--input-bg);
          border-radius: 8px;
          box-shadow: 0 2px 6px var(--shadow-color);
          border: 1px solid var(--border-color);
        }
        .total-amount p:first-child {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .total-amount p:last-child {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-color);
        }
        .deposit-ratio {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 6px var(--shadow-color);
          border: 1px solid var(--border-color);
        }
        .ratio-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ratio-item img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
        .ratio-item p {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-color);
        }
        .continue-button {
          padding: 10px;
          background-color: var(--primary-color);
          color: #ffffff;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: background-color 0.2s ease, transform 0.1s;
          box-shadow: 0 2px 6px var(--shadow-color);
        }
        .continue-button:disabled {
          background-color: var(--border-color);
          cursor: not-allowed;
          box-shadow: none;
        }
        .continue-button:hover:not(:disabled) {
          background-color: var(--button-hover-bg);
          transform: translateY(-2px);
        }
        .token-modal-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1100;
        }
        .token-modal-content {
          background: var(--modal-bg);
          border-radius: 10px;
          width: 100%;
          max-width: 360px;
          max-height: 60vh;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 16px var(--shadow-color);
          border: 1px solid var(--border-color);
          overflow-y: auto;
        }
        .token-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .token-modal-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-color);
          margin: 0;
        }
        .token-modal-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          transition: color 0.2s ease;
        }
        .token-modal-close-btn:hover {
          color: var(--text-color);
        }
        .token-modal-close-icon {
          width: 18px;
          height: 18px;
        }
        .token-modal-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .search-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .search-icon {
          width: 16px;
          height: 16px;
          position: absolute;
          top: 50%;
          left: 8px;
          transform: translateY(-50%);
        }
        .search-input {
          padding: 8px 8px 8px 32px;
          background-color: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-color);
          font-size: 12px;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .search-input:hover, .search-input:focus {
          border-color: var(--border-color);
        }
        .error {
          color: #ff5555;
          font-size: 10px;
          text-align: center;
        }
        .import-button {
          padding: 8px;
          background-color: var(--primary-color);
          color: #ffffff;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }
        .import-button:hover {
          background-color: var(--button-hover-bg);
        }
        .token-tabs {
          display: flex;
          gap: 6px;
          border-bottom: 1px solid var(--border-color);
        }
        .token-tab {
          padding: 6px 10px;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .token-tab[data-active="true"] {
          color: var(--text-color);
          border-bottom: 2px solid var(--primary-color);
        }
        .token-tab:hover {
          color: var(--text-color);
        }
        .token-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 160px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--border-color) var(--modal-bg);
        }
        .token-list::-webkit-scrollbar {
          width: 6px;
        }
        .token-list::-webkit-scrollbar-track {
          background: var(--modal-bg);
        }
        .token-list::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }
        .token-list-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background-color: var(--input-bg);
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border: 1px solid var(--border-color);
        }
        .token-list-item:hover {
          background-color: var(--hover-bg);
        }
        .token-list-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .token-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .token-name-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .token-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-color);
          margin: 0;
        }
        .verified-icon {
          width: 12px;
          height: 12px;
        }
        .token-symbol {
          font-size: 11px;
          color: var(--text-secondary);
          margin: 0;
        }
        .token-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        .token-balance {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-color);
          margin: 0;
        }
        .token-address-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .token-address {
          font-size: 10px;
          color: var(--text-secondary);
          margin: 0;
        }
        .token-link svg {
          width: 10px;
          height: 10px;
          stroke: var(--text-secondary);
          transition: stroke 0.2s ease;
        }
        .token-link:hover svg {
          stroke: var(--text-color);
        }
        .no-tokens {
          text-align: center;
          color: var(--text-secondary);
          font-size: 12px;
          margin: 10px 0;
        }
        @media (max-width: 768px) {
          .modal-content {
            padding: 10px;
            max-width: 95%;
          }
          .select-pair-title {
            font-size: 14px;
          }
          .select-pair-text {
            font-size: 11px;
          }
          .token-select-container {
            flex-direction: column;
            gap: 6px;
          }
          .token-select {
            padding: 6px 8px;
            font-size: 12px;
          }
          .token-select img {
            width: 18px;
            height: 18px;
          }
          .fee-tier-select {
            padding: 6px 8px;
            font-size: 12px;
          }
          .continue-button {
            padding: 8px;
            font-size: 13px;
          }
          .token-modal-content {
            max-width: 95%;
            padding: 10px;
            max-height: 65vh;
          }
          .token-modal-title {
            font-size: 14px;
          }
          .search-input {
            padding: 6px 6px 6px 28px;
            font-size: 11px;
          }
          .search-icon {
            width: 14px;
            height: 14px;
            left: 6px;
          }
          .token-list-item {
            padding: 6px;
          }
          .token-list-icon {
            width: 22px;
            height: 22px;
          }
          .token-name {
            font-size: 12px;
          }
          .token-symbol {
            font-size: 10px;
          }
          .token-balance {
            font-size: 12px;
          }
          .token-address {
            font-size: 9px;
          }
          .token-pair-header {
            padding: 6px;
            gap: 6px;
          }
          .token-pair-images img {
            width: 20px;
            height: 20px;
          }
          .token-pair-name {
            font-size: 12px;
          }
          .fee-rate {
            padding: 2px 6px;
            font-size: 10px;
          }
          .edit-button {
            font-size: 11px;
          }
          .edit-button svg {
            width: 16px;
            height: 16px;
          }
          .input-group {
            padding: 6px;
          }
          .input-field {
            font-size: 13px;
            padding: 3px;
          }
          .input-addon {
            font-size: 11px;
          }
          .price-range-tabs {
            gap: 4px;
          }
          .price-range-tab {
            padding: 4px 8px;
            font-size: 11px;
          }
          .price-range-inputs {
            gap: 6px;
            flex-direction: column;
          }
          .price-range-input-group {
            padding: 6px;
          }
          .price-range-input-group p {
            font-size: 11px;
          }
          .price-range-input-group input {
            font-size: 11px;
          }
        }
      `}</style>
      <div className="modal-content">
        <div className="modal-header">
          <button className="back-button" onClick={onClose}>
            <svg aria-hidden="true" fill="var(--text-secondary)" width="16px" height="16px">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
            Back
          </button>
        </div>
        {step === 1 && (
          <Step1SelectPair
            newPoolToken1={newPoolToken1}
            newPoolToken2={newPoolToken2}
            feeRate={feeRate}
            setNewPoolToken1={setNewPoolToken1}
            setNewPoolToken2={setNewPoolToken2}
            setFeeRate={setFeeRate}
            setShowTokenModal={setShowTokenModal}
            handleNextStep={handleNextStep}
            tokens={tokens}
            importedTokens={importedTokens}
            selectToken={selectToken}
            balances={balances}
            activeList={activeList}
            setActiveList={setActiveList}
            importAddress={importAddress}
            setImportAddress={setImportAddress}
            importError={importError}
            setImportError={setImportError}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            importToken={importToken}
            showTokenModal={showTokenModal}
          />
        )}
        {step === 2 && (
          <Step2SetPrice
            newPoolToken1={newPoolToken1}
            newPoolToken2={newPoolToken2}
            feeRate={feeRate}
            initialPrice={initialPrice}
            setInitialPrice={setInitialPrice}
            setStep={setStep}
            handleNextStep={handleNextStep}
            isStep2Valid={isStep2Valid}
            tokens={tokens}
          />
        )}
        {step === 3 && (
          <Step3DepositAmounts
            newPoolToken1={newPoolToken1}
            newPoolToken2={newPoolToken2}
            feeRate={feeRate}
            amount1={amount1}
            amount2={amount2}
            handleAmount1Change={handleAmount1Change}
            handleCreatePool={handleCreatePool}
            isStep3Valid={isStep3Valid}
            step={step}
            tokens={tokens}
          />
        )}
        {showTokenModal && (
          <div className="token-modal-container">
            <section className="token-modal-content" role="dialog" aria-modal="true">
              <header className="token-modal-header">
                <h2 className="token-modal-title">Select Token</h2>
                <button
                  type="button"
                  className="token-modal-close-btn"
                  onClick={() => {
                    setShowTokenModal(null);
                    setSearchQuery("");
                    setImportAddress("");
                    setImportError("");
                  }}
                >
                  <svg viewBox="0 0 24 24" className="token-modal-close-icon">
                    <path
                      fill="currentColor"
                      d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
                    />
                  </svg>
                </button>
              </header>
              <div className="token-modal-body">
                <div className="search-group">
                  <img
                    src="https://bafybeiawrwpry44l2oxgqhoh2l3hj6yxj3zctheebrlyrc75p7kln33q2e.ipfs.w3s.link/search%20(4).svg"
                    alt="Search"
                    className="search-icon"
                  />
                  <input
                    placeholder="Search name, symbol or paste address"
                    className="search-input"
                    value={importAddress}
                    onChange={(e) => {
                      setImportAddress(e.target.value);
                      setSearchQuery(e.target.value);
                      setImportError("");
                    }}
                  />
                  {importError && <div className="error">{importError}</div>}
                  {importAddress && !filteredTokens.length && (
                    <button
                      className="import-button"
                      onClick={importToken}
                    >
                      Import Token
                    </button>
                  )}
                </div>
                <div className="token-tabs">
                  <div
                    className="token-tab"
                    data-active={activeList === "Default"}
                    onClick={() => setActiveList("Default")}
                  >
                    <p className="token-tab-text">Default</p>
                  </div>
                  <div
                    className="token-tab"
                    data-active={activeList === "Imported"}
                    onClick={() => setActiveList("Imported")}
                  >
                    <p className="token-tab-text">Imported</p>
                  </div>
                </div>
                <div className="token-list">
                  {filteredTokens.length ? (
                    filteredTokens.map((token) => (
                      <div
                        className="token-list-item"
                        key={token.address}
                        onClick={() => selectToken(token, showTokenModal)}
                      >
                        <img
                          src={token.icon}
                          alt={token.symbol}
                          className="token-list-icon"
                        />
                        <div className="token-info">
                          <div className="token-name-group">
                            <p className="token-name">{token.description}</p>
                            <img
                              src="https://app.mmt.finance/_next/image?url=%2Fassets%2Fimages%2Fverified.svg&w=32&q=75&dpl=dpl_4pNPYKwjBgiR5G9S61Tmqw59B2bA"
                              alt="Verified"
                              className="verified-icon"
                            />
                          </div>
                          <p className="token-symbol">{token.symbol}</p>
                        </div>
                        <div className="token-details">
                          <p className="token-balance">{balances[token.address] || "0.0"}</p>
                          <div className="token-address-group">
                            <p className="token-address">{token.address.slice(0, 6)}...{token.address.slice(-4)}</p>
                            <a
                              href={`https://suivision.xyz/coin/${token.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="token-link"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-tokens">No tokens found</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePool;