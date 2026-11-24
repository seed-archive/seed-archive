"use client";

import { QRCodeSVG } from "qrcode.react";
import { type KeyboardEvent, useRef, useState } from "react";

// The archive's deposit addresses, one a network (the EVM networks share one).
// The only place they are written: every site links to /<lang>/support. Each
// network keeps its own tab (the owner, 2026-11-24), with the token standard
// a wallet or an exchange names it by, and the coins the receiving exchange
// credits on that network: the owner's list from the account's deposit
// screens, 2026-11-24 (docs/support.md).
const EVM = "0xef1a0245510825273bf345400b577e1d440b8f0e";
const WALLETS = [
  {
    name: "Tron",
    standard: "TRC-20",
    coins: ["USDT"],
    address: "TBaTLFMm44PUqAyNpYaVdrtxDjxkFTb6it",
  },
  {
    name: "Ethereum",
    standard: "ERC-20",
    coins: ["USDT", "USDC", "ETH"],
    address: EVM,
  },
  {
    name: "BNB Chain",
    standard: "BEP-20",
    coins: ["USDT", "USDC", "ETH"],
    address: EVM,
  },
  {
    name: "Base",
    standard: "Base",
    coins: ["USDC", "ETH"],
    address: EVM,
  },
  {
    name: "Arbitrum",
    standard: "Arbitrum One",
    coins: ["USDT", "USDC", "ETH"],
    address: EVM,
  },
  {
    name: "Optimism",
    standard: "OP Mainnet",
    coins: ["USDT", "USDC", "ETH"],
    address: EVM,
  },
  {
    name: "Polygon",
    standard: "Polygon PoS",
    coins: ["USDT", "USDC"],
    address: EVM,
  },
  {
    name: "Solana",
    standard: "SPL",
    coins: ["USDT", "USDC", "SOL"],
    address: "2k16ESS4mTX6bTZKEexo3PSCU7Wuh8NHWCoyxmYL6EF3",
  },
  {
    name: "TON",
    standard: "Jetton",
    coins: ["USDT"],
    address: "UQAxmqQKT4BYUXEowEgG_j1jlK-y9rffWLy9Ttm4Jv7ckRyu",
  },
  {
    name: "Bitcoin",
    standard: "BTC",
    coins: ["BTC"],
    address: "16Lp4rmAq8xbVQrDFJExaWuHiVRupgm6iY",
  },
];

// How long "Copied" stays on the button, in milliseconds (our own choice).
const COPIED_FOR = 2000;

// The size of the QR code, in CSS pixels (our own choice: a phone camera reads
// it from a laptop screen at arm's length).
const QR_SIZE = 168;

// Step 1 picks the network the reader's wallet sends on; step 2 shows that
// network's address as a QR code and as text, with a button that copies it.
export function Wallets() {
  const [chosen, setChosen] = useState(0);
  const [copied, setCopied] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const wallet = WALLETS[chosen];

  const choose = (index: number) => {
    setChosen(index);
    setCopied(false);
  };

  // Arrow keys move between the networks, as in any tab list.
  const onKeyDown = (event: KeyboardEvent) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    const next = (chosen + step + WALLETS.length) % WALLETS.length;
    choose(next);
    tabs.current[next]?.focus();
  };

  const copy = () => {
    void navigator.clipboard.writeText(wallet.address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_FOR);
    });
  };

  return (
    <div className="wallets">
      <h2 className="step">
        <span aria-hidden="true">1</span> Pick the network your wallet sends on
      </h2>
      <div
        className="networks"
        role="tablist"
        aria-label="Network"
        onKeyDown={onKeyDown}
      >
        {WALLETS.map((one, index) => (
          <button
            key={one.name}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`network-${index}`}
            aria-selected={index === chosen}
            aria-controls="wallet"
            tabIndex={index === chosen ? 0 : -1}
            onClick={() => choose(index)}
          >
            <span className="network">{one.name}</span>
            <span className="standards">{one.standard}</span>
          </button>
        ))}
      </div>

      <h2 className="step">
        <span aria-hidden="true">2</span> Scan or copy the address
      </h2>
      <div
        className="wallet"
        id="wallet"
        role="tabpanel"
        aria-labelledby={`network-${chosen}`}
      >
        <div className="qr">
          <QRCodeSVG value={wallet.address} size={QR_SIZE} />
        </div>
        <div className="address">
          <p className="for">
            Accepted on {wallet.name} ({wallet.standard})
          </p>
          <ul className="coins">
            {wallet.coins.map((coin) => (
              <li key={coin}>{coin}</li>
            ))}
          </ul>
          <code>{wallet.address}</code>
          <button type="button" onClick={copy} aria-live="polite">
            {copied ? "Copied ✓" : "Copy address"}
          </button>
        </div>
      </div>
      <p className="warning" role="note">
        Send only a coin listed for the network you picked, and only on that
        network. Another coin or network may never arrive. Bridged USDC (USDC.e)
        is a different token from USDC.
      </p>
    </div>
  );
}
