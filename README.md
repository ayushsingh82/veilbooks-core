# Veilbooks Core

> Shared building blocks for private business payments on QoreChain.

Veilbooks Core is a small TypeScript library with the cryptographic building blocks shared by the other Veilbooks projects: sealed invoices with an optional auditor recipient, public commitments, run commitments, and builders for registering post-quantum keys.

## Features

- **Sealed invoices**: `sealInvoice` and `openInvoice` encrypt an invoice to several recipients (ML-KEM-1024 with X25519) and verify its commitment when opened.
- **Commitments**: `commitInvoice` and `commitManifest` produce hashes that reveal nothing about amounts.
- **Key registration**: builders for the ML-DSA-87 key registration message with proof of possession, and for the ML-KEM-1024 encryption key registration message.
- **Payment manifest**: `parseManifest` checks the run file Desk exports and Rail reads (unique ids, valid payees, positive whole amounts, extra fields such as names dropped), and `manifestTotalUqor` sums it.
- **Browser safe**: hashing uses `@noble/hashes`, with no Node-only modules.

## Quick start

Requires Node.js 20 or newer.

```sh
npm install
npm test
```

```ts
import { generateSealKeys, recipientOf, sealInvoice, openInvoice } from "./src/index.js";

const payee = generateSealKeys();
const sealed = sealInvoice(invoice, [recipientOf(payee)]);
const opened = openInvoice(sealed, payee, invoice.id);
```

## Behaviour

| Case | Result |
| --- | --- |
| Recipient opens the envelope | Invoice returned, commitment verified |
| Non-recipient opens it | Refused |
| Wrong invoice id | Refused (id is authenticated data) |
| Tampered envelope or swapped commitment | Refused |
| Manifest with a duplicate id, bad payee or bad amount | Refused with the line number |

## Repository layout

| Path | Contents |
| --- | --- |
| `src/invoice.ts` | Sealing, opening, commitments |
| `src/manifest.ts` | Payment manifest type, parser and total |
| `src/register.ts` | Key registration message builders |
| `test/` | Unit tests |

## Status and limits

- Registration builders produce messages only. Broadcasting them needs a funded, signed transaction.
- Veilbooks Desk currently keeps its own copy of the sealing code; moving it onto this package is planned.

## The Veilbooks suite

| Repository | Role |
| --- | --- |
| [veilbooks-rail](https://github.com/ayushsingh82/veilbooks-rail) | Settlement rollup for private business payments |
| [veilbooks-desk](https://github.com/ayushsingh82/veilbooks-desk) | Sealed invoices and payroll for people and auditors |
| [veilbooks-steward](https://github.com/ayushsingh82/veilbooks-steward) | Agent that pays invoices within limits the owner signed |
| [veilbooks-core](https://github.com/ayushsingh82/veilbooks-core) | Shared library: sealing, commitments, key registration |

Veilbooks keeps business payment amounts private, with signatures and encryption designed to remain secure against quantum attacks. It runs on the QoreChain testnet (`qorechain-diana`).

## Licence and AI use

Apache-2.0. See [AI_USAGE.md](AI_USAGE.md) for how AI tools were used.
