import { SuiClient } from "@mysten/sui/client";

export const tokens = [
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
    icon: "https://s2.coinmarketcap.com/static/img/coins/200x200/32942.png",
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
    icon: "https://s2.coinmarketcap.com/static/img/coins/200x200/25114.png",
    description: "CETUS Token",
    decimals: 6,
  },
  {
    symbol: "DEEP",
    address: "0x16c59472305767de5d4ff834240c46ee537ab6be4503477abfaaf33ecb26e668::deep::DEEP",
    icon: "https://images.deepbook.tech/icon.svg",
    description: "DeepBook Token",
    decimals: 6,
  },
  {
    symbol: "WAL",
    address: "0x16c59472305767de5d4ff834240c46ee537ab6be4503477abfaaf33ecb26e668::wal::WAL",
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
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkPpvd1akVvyP8sgi3PMYAwbCnWuuIS37OKg&s",
    description: "Scallop Token",
    decimals: 6,
  },
  {
    symbol: "HASUI",
    address: "0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::HASUI::HASUI",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvd9yv6JWLikNWB-MxU2OyErJiqffAcLi8mw&s",
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
    address: "0x8993129d72e733985f7f1a00396cbd055bad6f817fee36576ce483c8bbb8b87b::sudeng::SUDENG",
    icon: "https://i.imgur.com/j2EuFh5.png",
    description: "HIPPO",
    decimals: 6,
  },
  {
    symbol: "wBTC",
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
    address: "0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN",
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

interface Token {
  symbol: string;
  address: string;
  icon: string;
  description: string;
  decimals: number;
}

interface TokenModalProps {
  showTokenModal: string | null;
  setShowTokenModal: React.Dispatch<React.SetStateAction<string | null>>;
  tokens: Token[];
  importedTokens: Token[];
  activeList: string;
  setActiveList: React.Dispatch<React.SetStateAction<string>>;
  importAddress: string;
  setImportAddress: React.Dispatch<React.SetStateAction<string>>;
  importError: string;
  setImportError: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  selectToken: (token: Token, type: string) => void;
  balances: { [key: string]: string };
  importToken: () => Promise<void>;
}

const TokenModal: React.FC<TokenModalProps> = ({
  showTokenModal,
  setShowTokenModal,
  tokens,
  importedTokens,
  activeList,
  setActiveList,
  importAddress,
  setImportAddress,
  importError,
  setImportError,
  searchQuery,
  setSearchQuery,
  selectToken,
  balances,
  importToken,
}) => {
  const filteredTokens = (activeList === "Imported" ? importedTokens : tokens).filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickTokens = [
    { symbol: "SUI", icon: "https://archive.cetus.zone/assets/image/sui/sui.png" },
    { symbol: "USDC", icon: "https://gateway.irys.xyz/EGpc2cG886CrWwLMneF2RyVpZ7D33a6znz6XE8n8nU7h" },
    { symbol: "suiUSDT", icon: "https://gateway.irys.xyz/H6RiSi7PDvKaKCzgsLybW1Pdaq4pvakBHnTvghWD5Kad" },
    { symbol: "CETUS", icon: "https://archive.cetus.zone/assets/image/sui/cetus.png" },
    { symbol: "haSUI", icon: "https://archive.cetus.zone/assets/image/sui/hasui.png" },
    { symbol: "vSUI", icon: "https://archive.cetus.zone/assets/image/sui/vsui.png" },
    { symbol: "sSUI", icon: "https://gateway.irys.xyz/5iJkTTWnZnTF5vpZA31F5vZZSqGPHuTMNCQSBTqkYGMV" },
    { symbol: "DEEP", icon: "https://gateway.irys.xyz/5LqWyWG5EU9wPknvW5rY6qSQPtnNAfP27X1PnAiesyFG" },
    { symbol: "WAL", icon: "https://gateway.irys.xyz/7dgjqChkGXxmhFvqR5AWP4vWUs8hNiJpe9Cw7K4x7GP2" },
    { symbol: "BUCK", icon: "https://archive.cetus.zone/assets/image/sui/buck.png" },
    { symbol: "ETH", icon: "https://gateway.irys.xyz/435auUGaKQ3FAT7CZnegmvNNJnbuRc7aSkwTTDJ5JmNw" },
    { symbol: "wBTC", icon: "https://bridge-assets.sui.io/suiWBTC.png" },
  ];

  const handleQuickSelect = (symbol: string) => {
    const allTokens = [...tokens, ...importedTokens];
    const selectedToken = allTokens.find(
      (t) => t.symbol.toUpperCase() === symbol.toUpperCase() || t.description.toUpperCase() === symbol.toUpperCase()
    );
    if (selectedToken && showTokenModal) {
      selectToken(selectedToken, showTokenModal);
      setShowTokenModal(null);
    }
  };

  return (
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
              <button className="import-button" onClick={importToken}>
                Import Token
              </button>
            )}
          </div>
          <div className="quick-tokens">
            {quickTokens.map((qt) => (
              <button
                key={qt.symbol}
                className="quick-token-button"
                onClick={() => handleQuickSelect(qt.symbol)}
              >
                <img src={qt.icon} alt={qt.symbol} className="quick-token-icon" />
                <span className="quick-token-text">{qt.symbol}</span>
              </button>
            ))}
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
                  onClick={() => selectToken(token, showTokenModal!)}
                >
                  <img src={token.icon} alt={token.symbol} className="token-list-icon" />
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
                          width="12"
                          height="12"
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
  );
};

export default TokenModal;