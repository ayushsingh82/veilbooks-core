import { createHash } from "node:crypto";
import { open, seal, recipientOf, type SealKeyPair, type SealRecipient } from "@qorechain/qoreseal";

export const CHAIN_ID = "qorechain-diana";
const PURPOSE = "veilbooks-invoice";

/** One payment line. Amount is in uqor, kept as a decimal string to avoid float errors. */
export interface Invoice {
  id: string;
  payer: string; // qor1...
  payee: string; // qor1...
  amountUqor: string;
  memo?: string;
  dueUnix: number;
}

export interface SealedInvoice {
  envelope: Uint8Array;
  /** SHA-256 of the canonical invoice JSON. Safe to post publicly: it reveals nothing about the amount. */
  commitment: string;
}

function canonical(inv: Invoice): Uint8Array {
  const o = { id: inv.id, payer: inv.payer, payee: inv.payee, amountUqor: inv.amountUqor, memo: inv.memo ?? "", dueUnix: inv.dueUnix };
  return new TextEncoder().encode(JSON.stringify(o));
}

export function commitInvoice(inv: Invoice): string {
  return createHash("sha256").update(canonical(inv)).digest("hex");
}

/**
 * Seal an invoice to the payee, the payer and (optionally) an auditor.
 * Every listed recipient can open it; nobody else can.
 */
export function sealInvoice(inv: Invoice, recipients: SealRecipient[]): SealedInvoice {
  if (recipients.length === 0) throw new Error("sealInvoice: at least one recipient is required");
  const aad = new TextEncoder().encode(inv.id);
  const envelope = seal({ chainId: CHAIN_ID, purpose: PURPOSE, recipients, plaintext: canonical(inv), aad });
  return { envelope, commitment: commitInvoice(inv) };
}

/** Open a sealed invoice; verifies the commitment so a tampered envelope is refused. */
export function openInvoice(sealed: SealedInvoice, keys: SealKeyPair, invoiceId: string): Invoice {
  const aad = new TextEncoder().encode(invoiceId);
  const bytes = open({ chainId: CHAIN_ID, purpose: PURPOSE, envelope: sealed.envelope, keys, aad });
  const inv = JSON.parse(new TextDecoder().decode(bytes)) as Invoice;
  if (commitInvoice(inv) !== sealed.commitment) throw new Error("openInvoice: commitment mismatch");
  return inv;
}

/** Commitment over a whole payroll or payment run: hash of the sorted invoice commitments. */
export function commitManifest(commitments: string[]): string {
  const h = createHash("sha256");
  for (const c of [...commitments].sort()) h.update(c);
  return h.digest("hex");
}

export { recipientOf };
