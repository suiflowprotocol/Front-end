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
    icon: "data:image/jpeg;base64,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",
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
    icon: "data:image/png;base64,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",
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
    symbol: "HEADAL",
    address: "0x3a304c7feba2d819ea57c3542d68439ca2c386ba02159c740f7b406e592c62ea::haedal::HAEDAL",
    icon: "https://s2.coinmarketcap.com/static/img/coins/200x200/36369.png",
    description: "HEADAL Token",
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
    symbol: "haSUI",
    address: "0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvd9yv6JWLikNWB-MxU2OyErJiqffAcLi8mw&s",
    description: "haSUI Token",
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
    symbol: "OKX Wrapped BTC",
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
    symbol: "Wrapped Bitcoin(Sui Bridge)",
    address: "0xaafb102dd0902f5055cadecd687fb5b71ca82ef0e0285d90afde828ec58ca96b::btc::BTC",
    icon: "https://bridge-assets.sui.io/suiWBTC.png",
    description: "wBTC",
    decimals: 6,
  },
  {
    symbol: "haWAL",
    address: "0x8b4d553839b219c3fd47608a0cc3d5fcc572cb25d41b7df3833208586a8d2470::hawal::HAWAL",
    icon: "https://assets.haedal.xyz/logos/hawal.svg",
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
              src="/assets/images/search.svg"
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
                  onClick={() => selectToken(token, showTokenModal!)}
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