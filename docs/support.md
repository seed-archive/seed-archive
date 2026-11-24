# Support page: what each address accepts

The page `/<lang>/support` (the owner, 2026-11-24: one page for the whole archive) lists the archive's deposit
addresses, one tab a network (`components/Wallets.tsx`, the only place they are written). The addresses are deposit
addresses of a Binance account. Which coins each network accepts follows Binance's rules below, read 2026-11-24.

## What the page offers (the owner, 2026-11-24)

The owner read each coin's deposit screen in the account and chose:

| Coin | Networks                                                            |
| ---- | ------------------------------------------------------------------- |
| BTC  | Bitcoin                                                             |
| SOL  | Solana (added by the owner later the same day)                      |
| ETH  | BNB Chain, Ethereum, Base, Arbitrum, Optimism                       |
| USDT | BNB Chain, Tron, Ethereum, Polygon, Solana, Arbitrum, TON, Optimism |
| USDC | BNB Chain, Ethereum, Solana, Base, Polygon, Arbitrum, Optimism      |

The page turns this round into one tab a network with its coins. The new addresses were read from his screenshots
of the deposit screens: one EVM address for every EVM network, and one each for Tron, Solana, TON and Bitcoin. No
deposit screen showed a memo. Minimum deposits shown: 0.001 USDT on most networks, 0.01 on Tron and BNB Chain, 0.02
on Polygon, 0.000005 BTC. Polygon and Arbitrum warn that USDT must be the token whose contract ends in `58e8f` and
`fcbb9`.

## Binance's general rules, per network (read before the owner's list)

Read from Binance's announcements and FAQ pages; its live table (binance.com/en/network) loads by JavaScript and
could not be read, so "accepted" means opened by an announcement and not closed by a later one found. **To be
confirmed by the owner on the account's own deposit screen**, coin by coin.

| Network            | Accepted                                           | Not accepted                                            | Source                                                                                                                                                                                                                                                                               |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tron (TRC-20)      | USDT, TRX                                          | USDC: deposits stopped 2024-04-05                       | [announcement](https://www.binance.com/es/support/announcement/detail/33df0ff0e2e94259950b5c4b1f4952f7)                                                                                                                                                                              |
| Ethereum (ERC-20)  | USDT, USDC, ETH                                    | —                                                       | no closing notice found                                                                                                                                                                                                                                                              |
| BNB Chain (BEP-20) | USDT, USDC, BNB                                    | —                                                       | [USDC opened](https://www.binance.com/en/support/announcement/binance-opens-bep2-bep20-deposits-and-withdrawals-for-inj-pax-sxp-usdc-9b2dc1d114ee462aaedebf73041f5807)                                                                                                               |
| Polygon PoS        | USDT, USDC (native), POL                           | bridged USDC.e is credited as another token, MATICUSDCE | [native USDC](https://www.binance.com/en/support/announcement/187a6f299a4944ab95440c0106a7a8d7), [POL](https://www.binance.com/en/support/articles/6a6de383727f4659a3050f7982e1620f)                                                                                                 |
| Arbitrum One       | USDT, USDC (native), ETH                           | bridged USDC.e is credited as ARBUSDCE                  | [USDT](https://www.binance.com/en/support/announcement/binance-completes-integration-of-tether-usdt-on-arbitrum-one-and-optimism-networks-opens-deposits-3fbdc22451844f8488e8f7f8570a3c88), [USDC](https://www.binance.com/en/support/announcement/b1aebabb714c4217816d382448e5f42e) |
| Solana (SPL)       | USDT, USDC, SOL                                    | —                                                       | [announcement](https://www.binance.com/en/support/announcement/binance-completes-usdc-spl-and-usdt-spl-token-integration-eb0f1820694f46f28b85424971014e87)                                                                                                                           |
| TON                | USDT, GRAM (Toncoin was renamed GRAM in July 2026) | —                                                       | [USDT on TON](https://www.binance.com/en/support/announcement/binance-completes-integration-of-tether-usdt-on-toncoin-network-opens-deposits-and-withdrawals-f6c4867f5cab47e39864130804eff106)                                                                                       |

## TON needs a memo at Binance

Binance's FAQ ([incorrect deposits](https://www.binance.com/en/support/faq/detail/115003798632), updated
2025-12-05; [self-service recovery](https://www.binance.com/en/support/faq/4d1347b4d6d44564ba44ea785703a4fd),
updated 2026-05-29) says a TON deposit needs the account's memo; one without it is not credited and is returned only
through a recovery request, for a fee, to the sender's address. The page shows no memo today. **Open**: whether the
account's TON deposit screen shows a memo. Until it is known, the TON tab warns nothing and may lose a donation.

## The addresses changed (2026-11-24)

The account's deposit screen shows addresses other than the ones the page held (taken from No Man's Sky's home page):
for USDT on TON, `UQAxmq…7ckRyu` instead of `UQDLjI…zTU8`, and the owner reports the others changed too. The TON
screen shows no memo; its minimum deposit is 0.001 USDT.

What was checked: Binance was hacked on 2026-10-29 (about $6.3B from its own hot and reserve wallets;
[Wikipedia](https://en.wikipedia.org/wiki/2026_Binance_hack),
[CoinDesk](https://www.coindesk.com/business/2026/10/30/binance-hack-drained-wallets-backing-customer-assets-reserve-data-shows)),
and afterwards moved its own withdrawal wallets
([Cryptobriefing](https://cryptobriefing.com/binance-updates-proof-of-reserves-addresses/)). No source found says
it rotated users' deposit addresses. Binance has retired deposit addresses before (2022, 2023), each time by email
to the user. A deposit to a retired address is not lost but not credited by itself: the user claims it with "One
Click Arrival" in the deposit history ([FAQ](https://www.binance.com/en/support/faq/detail/853aaedc7f45430283abc7a25713c428)).
**Open**: why this account's addresses changed. The page takes the addresses from the deposit screen, copied as
text, never from a picture.

## Other rules a sender should know

- Binance credits a deposit only for a coin and network it lists. An unlisted token is recovered, if at all, in up
  to 30 working days for 20 USDT (recovery FAQ above).
- Binance's own FAQ says each network has its own deposit address; the four EVM networks show the same address on
  this account, which the owner reads from the account itself.
- Minimum deposits could not be read.
