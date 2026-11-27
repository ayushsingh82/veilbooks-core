# Veilbooks Core

Shared library for Veilbooks: key registration, sealing, signing, receipt verification.

Entry in the QoreChain "Build Before Q-Day" developer fest, category: none (shared library). Apache-2.0.

_Work in progress._

## Status
Work in progress for the QoreChain "Build Before Q-Day" developer fest (deadline 2 December 2026). Network: QoreChain testnet `qorechain-diana`.

## The Veilbooks suite
| Repo | Role | Category |
|---|---|---|
| [veilbooks-rail](https://github.com/ayushsingh82/veilbooks-rail) | Settlement rollup | Protocol Builders |
| [veilbooks-desk](https://github.com/ayushsingh82/veilbooks-desk) | Sealed invoices and payroll app | Encrypted Apps |
| [veilbooks-steward](https://github.com/ayushsingh82/veilbooks-steward) | Agent that pays within signed limits | Post-Quantum AI Agents |
| [veilbooks-core](https://github.com/ayushsingh82/veilbooks-core) | Shared library | not entered |

## What is in it
Sealed invoices (`sealInvoice`, `openInvoice`) with an auditor recipient and a manifest commitment. Key registration and receipt helpers are next. Run `npm test`.

## Licence
Apache-2.0. AI use is documented in [AI_USAGE.md](AI_USAGE.md).
