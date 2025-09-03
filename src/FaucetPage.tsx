import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import './FaucetPage.css';
import { CustomConnectButton } from './App'; // Assuming CustomConnectButton is exported from App.tsx

const PACKAGE_ID = "0x16c59472305767de5d4ff834240c46ee537ab6be4503477abfaaf33ecb26e668";
const FAUCET_MODULE = "faucet";
const CLOCK_ID = "0x6";

// Assume faucet object ID - this needs to be the actual shared object ID from deployment
const FAUCET_ID = "0xebb5610cad43cde4cc5bb967c57148ef99819180ff2d278c7c800f9b4a86161a"; // REPLACE WITH ACTUAL FAUCET OBJECT ID

const tokens = [
  { symbol: 'DEEP', type: `${PACKAGE_ID}::deep::DEEP`, decimals: 6, image: 'https://bafybeiebvgjrlqfo72kxcbkxfq5vrjsx6572k3fuxtbjbbk7onnlncxh5m.ipfs.w3s.link/deep.png' },
  { symbol: 'WAL', type: `${PACKAGE_ID}::wal::WAL`, decimals: 6, image: 'https://bafybeibsuufzmsxxyhu37yy7mdi4rkpr2bzdz2ierq6mevvuxkfphykxlu.ipfs.w3s.link/WAL.webp' },
  { symbol: 'USDC', type: `${PACKAGE_ID}::usdc::USDC`, decimals: 6, image: 'https://bafybeidzrdgq3vllhxcza6uvkvecxdumgsgkrq22pm3sqdviujttridkku.ipfs.w3s.link/usd-coin-usdc-logo.png' },
  { symbol: 'IKA', type: `${PACKAGE_ID}::ika::IKA`, decimals: 6, image: 'https://bafybeidnqru6n6hjm5she3m53jsd6ytphy6lofdvsjqlhlbpvx73nbxr3i.ipfs.w3s.link/ika.png' },
  { symbol: 'BLUE', type: `${PACKAGE_ID}::blue::BLUE`, decimals: 6, image: 'https://bafybeih2dka7qas7k6uyw2upo7xrlhxg4b7djvcg24nriov2glb7tygqc4.ipfs.w3s.link/blue.png' },
  { symbol: 'SuiFlow', type: `${PACKAGE_ID}::SuiFlow::SuiFlow`, decimals: 6, image: 'https://i.meee.com.tw/SdliTGK.png' },
];

function formatBalance(balance: string) {
  const num = parseFloat(balance);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  return num.toFixed(6);
}

function base64ToBytes(base64: string): number[] {
  const binString = atob(base64);
  const bytes = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return Array.from(bytes);
}

function bytesToBigInt(bytes: number[]): bigint {
  let value = 0n;
  for (let i = 0; i < bytes.length; i++) {
    value += BigInt(bytes[i]) << BigInt(i * 8);
  }
  return value;
}

function FaucetPage() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [faucetBalances, setFaucetBalances] = useState<{ [key: string]: string }>({});
  const [depositAmounts, setDepositAmounts] = useState<{ [key: string]: string }>({});
  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    fetchFaucetBalances();
    if (account) {
      fetchUserBalances();
      checkCanClaim();
    } else {
      setCanClaim(false);
    }
  }, [account]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const width = window.innerWidth;
      const height = window.innerHeight;
      setGlowPosition({
        x: (clientX / width) * 100,
        y: (clientY / height) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchFaucetBalances = async () => {
    try {
      const DUMMY_SENDER = "0x0000000000000000000000000000000000000000";
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${FAUCET_MODULE}::get_balances`,
        arguments: [tx.object(FAUCET_ID)],
      });
      const inspectResult = await client.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: DUMMY_SENDER,
      });
      const returnValues = inspectResult.results![0].returnValues!;
      const balances = returnValues.map(([valueBase64, _type]) => bytesToBigInt(base64ToBytes(valueBase64 as unknown as string)));
      const formattedBalances: { [key: string]: string } = {};
      tokens.forEach((token, index) => {
        const rawBalance = balances[index];
        const formatted = (Number(rawBalance) / 10 ** token.decimals).toFixed(6);
        formattedBalances[token.symbol] = formatted;
      });
      setFaucetBalances(formattedBalances);
    } catch (err) {
      console.error("Failed to fetch faucet balances:", err);
    }
  };

  const fetchUserBalances = async () => {
    try {
      const balances: { [key: string]: string } = {};
      for (const token of tokens) {
        const balance = await client.getBalance({
          owner: account!.address,
          coinType: token.type,
        });
        const formatted = (Number(balance.totalBalance) / 10 ** token.decimals).toFixed(6);
        balances[token.symbol] = formatted;
      }
      setUserBalances(balances);
    } catch (err) {
      console.error("Failed to fetch user balances:", err);
    }
  };

  const checkCanClaim = async () => {
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${FAUCET_MODULE}::claim`,
        arguments: [
          tx.object(FAUCET_ID),
          tx.object(CLOCK_ID),
        ],
      });
      const result = await client.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: account!.address,
      });
      if (result.effects.status.status === 'success') {
        setCanClaim(true);
        setError(null);
      } else {
        setCanClaim(false);
        setError('You have already claimed within the last 24 hours.');
      }
    } catch (err: any) {
      setCanClaim(false);
      if (err.message.includes('EClaimTooSoon')) {
        setError('You have already claimed within the last 24 hours.');
      } else {
        setError(`Error checking claim eligibility: ${err.message}`);
      }
    }
  };

  const handleClaimAll = async () => {
    if (!account || !canClaim) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${FAUCET_MODULE}::claim`,
        arguments: [
          tx.object(FAUCET_ID),
          tx.object(CLOCK_ID),
        ],
      });
      await signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setSuccess(`Claim of all tokens successful!`);
            fetchFaucetBalances();
            fetchUserBalances();
            setCanClaim(false);
          },
          onError: (err: any) => {
            setError(`Claim failed: ${err.message}`);
          },
        }
      );
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (symbol: string) => {
    if (!account) {
      setError("Please connect wallet");
      return;
    }
    const amount = depositAmounts[symbol];
    if (!amount || parseFloat(amount) <= 0) {
      setError("Enter valid amount");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = tokens.find(t => t.symbol === symbol)!;
      const decimals = token.decimals;
      const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 10 ** decimals));

      const coinsResponse = await client.getCoins({
        owner: account.address,
        coinType: token.type,
      });
      const coins = coinsResponse.data;

      if (coins.length === 0) {
        throw new Error("No coins found for this token.");
      }

      const tx = new Transaction();
      const primaryCoin = tx.object(coins[0].coinObjectId);
      const mergeCoins = coins.slice(1).map(coin => tx.object(coin.coinObjectId));

      if (mergeCoins.length > 0) {
        tx.mergeCoins(primaryCoin, mergeCoins);
      }

      const [splitCoin] = tx.splitCoins(primaryCoin, [amountBigInt]);

      tx.moveCall({
        target: `${PACKAGE_ID}::${FAUCET_MODULE}::deposit_${symbol.toLowerCase()}`,
        arguments: [tx.object(FAUCET_ID), splitCoin],
      });

      await signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setSuccess(`Deposit of ${amount} ${symbol} successful!`);
            setDepositAmounts(prev => ({ ...prev, [symbol]: '' }));
            fetchFaucetBalances();
            fetchUserBalances();
          },
          onError: (err: any) => {
            setError(`Deposit failed: ${err.message}`);
          },
        }
      );
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (symbol: string, value: string) => {
    setDepositAmounts(prev => ({ ...prev, [symbol]: value }));
  };

  const logos = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqYyygKaispLzlgNY95kc5HBQd3qW7ugzAkg&s",
    "https://s2.coinmarketcap.com/static/img/coins/200x200/34187.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:4f9e3e4b3f3e4f7a9c1b5f8e9d2c3a4f",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:7b9f3e8a4b2d4f7a9c1b5f8e9d2c3a4f",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:a4c2b7e95d3e4f8b9a2c6f9d0e3b4c5a",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:6f9d0e3b4c5a4f8b9a2c7b9f3e8a4b2d",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:5f8e9d2c3a4f4f7a9c1b7b9f3e8a4b2d",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:3e8a4b2d4f7a9c1b5f8e9d2c3a4f4f7a",
    "https://encrypted-tbn0.gstatic.com/images?q:3e4b3f3e4f7a9c1b5f8e9d2c3a4f4f7a",
    "https://encrypted-tbn0.gstatic.com/images?q:4f7a9c1b5f8e9d2c3a4f4f7a3e8a4b2d",
    "https://encrypted-tbn0.gstatic.com/images?q:9c1b5f8e9d2c3a4f4f7a3e8a4b2d4f7a",
    "https://encrypted-tbn0.gstatic.com/images?q:5f8e9d2c3a4f4f7a9c1b3e8a4b2d4f7a",
    "https://encrypted-tbn0.gstatic.com/images?q:7b9f3e8a4b2d4f7a9c1b5f8e9d2c3a4f",
    "https://play-lh.googleusercontent.com/ladsNim2g-g_Yc8NUcF2fo3qdxDsg91ZmJZmgQe-GKrwlvm1Mpaalt8y4dlWe4TuaD8",
    "https://encrypted-tbn0.gstatic.com/images?q:4f7a9c1b5f8e9d2c3a4f4f7a3e8a4b2d",
    "https://encrypted-tbn0.gstatic.com/images?q:3e8a4b2d4f7a9c1b5f8e9d2c3a4f4f7a",
    "https://encrypted-tbn0.gstatic.com/images?q:9c1b5f8e9d2c3a4f4f7a3e8a4b2d4f7a",
    "https://avatars.githubusercontent.com/u/194261944?s=200&v=4",
    "https://encrypted-tbn0.gstatic.com/images?q:5f8e9d2c3a4f4f7a9c1b3e8a4b2d4f7a",
    "https://encrypted-tbn0.gstatic.com/images?q:7b9f3e8a4b2d4f7a9c1b5f8e9d2c3a4f",
    "https://pbs.twimg.com/profile_images/1946262175850373120/s26duOOP_400x400.png",
    "https://static.chainbroker.io/mediafiles/projects/flowx-finance/flowx-finance.jpeg",
    "https://encrypted-tbn0.gstatic.com/images?q:4f7a9c1b5f8e9d2c3a4f4f7a3e8a4b2d",
    "https://encrypted-tbn0.gstatic.com/images?q:3e8a4b2d4f7a9c1b5f8e9d2c3a4f4f7a",
    "https://encrypted-tbn0.gstatic.com/images?q:9c1b5f8e9d2c3a4f4f7a3e8a4b2d4f7a",
    "https://s2.coinmarketcap.com/static/img/coins/200x200/25114.png",
    "https://encrypted-tbn0.gstatic.com/images?q:5f8e9d2c3a4f4f7a9c1b3e8a4b2d4f7a",
    "https://encrypted-tbn0.gstatic.com/images?q:7b9f3e8a4b2d4f7a9c1b5f8e9d2c3a4f",
    "https://encrypted-tbn0.gstatic.com/images?q:4f7a9c1b5f8e9d2c3a4f4f7a3e8a4b2d",
    "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
    "https://encrypted-tbn0.gstatic.com/images?q:3e8a4b2d4f7a9c1b5f8e9d2c3a4f4f7a",
    "https://encrypted-tbn0.gstatic.com/images?q:9c1b5f8e9d2c3a4f4f7a3e8a4b2d4f7a",
    "https://s2.coinmarketcap.com/static/img/coins/200x200/32864.png",
    "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/buck.svg/public"
  ];

  return (
    <div className="cover-container30101">
      <div className="mosaic-background30101">
        {Array.from({ length: 400 }).map((_, i) => (
          <img
            key={i}
            src={logos[i % logos.length]}
            alt={`logo-${i}`}
            className="mosaic-tile30101"
          />
        ))}
      </div>
      <div className="background-overlay30101"></div>
      <div className="background-glow30101" style={{
        left: `${glowPosition.x}%`,
        top: `${glowPosition.y}%`,
      }}></div>
      <div className="logo-container30101">
        <img src="https://i.meee.com.tw/SdliTGK.png" alt="SuiFlow Logo" className="logo-image30101" />
        <span className="logo-text30101">SuiFlow</span>
      </div>
      <div className="right-header101">
        <div className="social-buttons30101">
          <a href="https://github.com/SuiFlowprotocol?tab=repositories" target="_blank" rel="noopener noreferrer" className="social-link30101">
            <img src="https://img.icons8.com/ios/50/ffffff/github" alt="Github" className="social-icon30101" />
          </a>
          <a href="https://telegram.me/SuiFlowprotocol" target="_blank" rel="noopener noreferrer" className="social-link30101">
            <img src="https://img.icons8.com/ios/50/ffffff/telegram" alt="Telegram" className="social-icon30101" />
          </a>
          <a href="https://x.com/SuiFlowprotocol_" target="_blank" rel="noopener noreferrer" className="social-link30101">
            <img src="https://img.icons8.com/ios/50/ffffff/twitterx.png" alt="X" className="social-icon30101" />
          </a>
          <a href="https://discord.gg/SuiFlowprotocol" target="_blank" rel="noopener noreferrer" className="social-link30101">
            <img src="https://img.icons8.com/ios/50/ffffff/discord-logo.png" alt="Discord" className="social-icon30101" />
          </a>
        </div>
        <CustomConnectButton />
      </div>
      <div className="content-wrapper101">
        <div className="faucet-form101">
          <h1 className="title101">Testnet Faucet</h1>
          <p className="description101">Send testnet tokens to your wallet to experiment with SuiFlow protocol AMM for free.</p>
          <p className="note101">You can only claim once within 24 hours.</p>
          <p className="note101">Test tokens are only for use in interacting with the SuiFlow protocol AMM.</p>
          {error && <div className="error-message101">{error}</div>}
          {success && <div className="success-message101">{success}</div>}
          <button className="claim-all-button101" onClick={handleClaimAll} disabled={loading || !account || !canClaim}>
            {loading ? 'Processing...' : 'Claim All'}
          </button>
          <div className="tokens-table-wrapper101">
            <div className="tokens-table101">
              <div className="token-row101 header-row101">
                <div>Image</div>
                <div>Symbol</div>
                <div>Faucet Balance</div>
                <div>Your Balance</div>
                <div>Deposit Amount</div>
                <div>Deposit</div>
              </div>
              {tokens.map(token => (
                <div key={token.symbol} className="token-row101">
                  <img src={token.image} alt={token.symbol} className="token-image101" />
                  <div className="token-symbol101">{token.symbol}</div>
                  <div className="token-balance101">{formatBalance(faucetBalances[token.symbol] || '0')}</div>
                  <div className="token-balance101">{formatBalance(userBalances[token.symbol] || '0')}</div>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={depositAmounts[token.symbol] || ''}
                    onChange={(e) => handleAmountChange(token.symbol, e.target.value)}
                    className="deposit-input101"
                  />
                  <button className="deposit-button101" onClick={() => handleDeposit(token.symbol)} disabled={loading || !account}>
                    Deposit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="faq101">
          <h2 className="faq-title101">Frequently Asked Questions</h2>
          <details className="faq-item101">
            <summary>What is a testnet?</summary>
            <p>A testnet is a testing environment for blockchain applications where developers can experiment without using real assets.</p>
          </details>
          <details className="faq-item101">
            <summary>How can I get native SUI on testnet?</summary>
            <p>You can use the official Sui faucet at https://faucet.sui.io/ to get testnet SUI tokens.</p>
          </details>
          <details className="faq-item101">
            <summary>What's the difference between this Faucet and others?</summary>
            <p>This faucet provides specific tokens for interacting with the SuiFlow protocol AMM on Sui testnet.</p>
          </details>
          <details className="faq-item101">
            <summary>Which tokens does this Faucet support?</summary>
            <p>DEEP, WAL, USDC, IKA, BLUE, SuiFlow.</p>
          </details>
          <details className="faq-item101">
            <summary>How much can I get from this Faucet?</summary>
            <p>You can claim 100 of each token once every 24 hours.</p>
          </details>
          <details className="faq-item101">
            <summary>Why am I seeing "Limit Exceeded"?</summary>
            <p>You have already claimed within the last 24 hours. Please wait before claiming again.</p>
          </details>
        </div>
      </div>
    </div>
  );
}

export default FaucetPage;