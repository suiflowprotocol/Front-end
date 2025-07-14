export interface Token {
  symbol: string;
  address: string;
  decimals: number;
  image: string;
}

export const tokens: Token[] = [
  {
    symbol: "SUI",
    address: "0x2::sui::SUI",
    decimals: 9,
    image: "https://archive.cetus.zone/assets/image/sui/sui.png",
  },
  {
    symbol: "USDC",
    address: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93af::coin::COIN",
    decimals: 6,
    image: "https://momentum-statics.s3.us-west-1.amazonaws.com/token-usdc.jpg",
  },
  {
    symbol: "WAL",
    address: "0xe76d0a9c03e7e8e1ff3b8f70412b0e1e7b3a8f30b0f3f7d0b5b6f2e0a0c2b1f7::wal::WAL",
    decimals: 8,
    image: "https://file.coinexstatic.com/2025-03-26/43F8485DCB687E365E3187192861D19E.webp",
  },
  {
    symbol: "DEEP",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::deep::DEEP",
    decimals: 6,
    image: "https://images.deepbook.tech/icon.svg",
  },
  {
    symbol: "Tether (Sui Bridge)",
    address: "0xc060006111016b8a020ad5b15c1e32d4d9f8b7c1b8b3590b1a5f1c0e67a46e3b::coin::COIN",
    decimals: 6,
    image: "https://momentum-statics.s3.us-west-1.amazonaws.com/suiUSDT.png",
  },
  {
    symbol: "haSUI",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::hasui::HASUI",
    decimals: 9,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvd9yv6JWLikNWB-MxU2OyErJiqffAcLi8mw&s",
  },
  {
    symbol: "Lombard Staked BTC",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::lbtc::LBTC",
    decimals: 8,
    image: "https://www.lombard.finance/lbtc/LBTC.png",
  },
  {
    symbol: "Wrapped Bitcoin(Sui Bridge)",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::wbtc::WBTC",
    decimals: 8,
    image: "https://bridge-assets.sui.io/suiWBTC.png",
  },
  {
    symbol: "OKX Wrapped BTC",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::xbtc::XBTC",
    decimals: 8,
    image: "https://static.coinall.ltd/cdn/oksupport/common/20250512-095503.72e1f41d9b9a06.png",
  },
  {
    symbol: "haWAL",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::hawal::HAWAL",
    decimals: 8,
    image: "https://assets.haedal.xyz/logos/hawal.svg",
  },
  {
    symbol: "Wrapped Ether(Wormhole)",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::eth::ETH",
    decimals: 18,
    image: "https://momentum-statics.s3.us-west-1.amazonaws.com/WETH.png",
  },
  {
    symbol: "NS",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::ns::NS",
    decimals: 6,
    image: "https://token-image.suins.io/icon.svg",
  },
  {
    symbol: "BUCK",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::buck::BUCK",
    decimals: 6,
    image: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/buck.svg/public",
  },
  {
    symbol: "wUSDT",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::wusdt::WUSDT",
    decimals: 6,
    image: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/images.png/public",
  },
  {
    symbol: "AUSD",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::ausd::AUSD",
    decimals: 6,
    image: "https://static.agora.finance/ausd-token-icon.svg",
  },
  {
    symbol: "Ondo US Dollar Yield",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::usdy::USDY",
    decimals: 6,
    image: "https://ondo.finance/images/tokens/usdy.svg",
  },
  {
    symbol: "SCA",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::sca::SCA",
    decimals: 9,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkPpvd1akVvyP8sgi3PMYAwbCnWuuIS37OKg&s",
  },
  {
    symbol: "LOFI",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::lofi::LOFI",
    decimals: 9,
    image: "https://cdn.tusky.io/5ab323c3-19e1-48b1-a5e2-f01b2fb3a097",
  },
  {
    symbol: "Volo Staked SUI",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::vsui::VSUI",
    decimals: 9,
    image: "https://strapi-dev.scand.app/uploads/volo_SUI_Logo_f28ed9c6a1.png",
  },
  {
    symbol: "AlphaFi Staked SUI",
    address: "0x5e339e0e9a0c3b3f0a7383510a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f0a0c3b3f::stsui::STSUI",
    decimals: 9,
    image: "https://images.alphafi.xyz/stSUI.png",
  },
];